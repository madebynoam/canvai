# GitHub Comments — Implementation Plan

## What this is

Threaded comments on the canvas, backed by GitHub Issues. Designers and collaborators can pin conversations to specific elements, reply in threads, react, and promote comments to annotations (agent instructions). Comments are for human-to-human discussion on shared builds; annotations are for human-to-agent instructions during dev.

**Key distinction:**
- **Comment** (purple `#6366F1`) — conversation between people, persisted as GitHub Issues
- **Annotation** (orange `#E8590C`) — direct instruction to the agent, lives in-memory on the MCP server

The UI prototypes already exist in the V5 canvai-ui showcase (`src/projects/canvai-ui/CommentThread.tsx` and `CommentThreadV2.tsx`). This plan turns those mockups into a working feature.

---

## Architecture

```
Browser (CommentOverlay)                 Node (canvai HTTP server :4748)          GitHub API
                                                                                     │
  click element → compose card              POST /comments ─────────────────────► gh issue create
  post reply                                POST /comments/:id/replies ──────────► gh issue comment
  react to message                          POST /comments/:id/reactions ────────► gh reaction add
  resolve thread                            POST /comments/:id/resolve ──────────► gh issue close
  promote to annotation                     POST /comments/:id/annotate ─────────► existing annotation flow
                                                                                     │
  SSE ◄──────────────────────────────────── /comments/events                         │
  (new comment, new reply, resolved)        GET /comments ◄──────────────────────── gh issue list
                                            GET /comments/:id ◄──────────────────── gh issue + comments
```

**Why GitHub Issues:**
- No database needed — the repo IS the database
- Identity comes free (GitHub users)
- Works offline (issues persist when server stops)
- Collaborators already have repo access
- Labels + milestones for organization
- Search, filtering, and API are battle-tested

**Issue format:**
- Title: `[canvai] {componentName} · {elementTag} — {first line of comment}`
- Body: structured metadata (frameId, selector, computedStyles) + comment text
- Labels: `canvai-comment`, `canvai-resolved` (when closed)
- Each reply = a GitHub Issue comment

---

## Data model

### Comment thread (maps to a GitHub Issue)

```ts
interface CommentThread {
  id: string                    // GitHub Issue number as string
  ghIssueNumber: number
  ghIssueUrl: string
  frameId: string
  componentName: string
  selector: string
  elementTag: string
  elementText: string
  computedStyles: Record<string, string>
  author: CommentAuthor
  messages: CommentMessage[]
  status: 'open' | 'resolved'
  annotationId?: string         // if promoted to annotation
  createdAt: string             // ISO 8601
  updatedAt: string
}

interface CommentMessage {
  id: string                    // GitHub comment ID
  author: CommentAuthor
  body: string
  reactions: CommentReaction[]
  createdAt: string
  isOriginal: boolean           // true for the issue body (first message)
}

interface CommentAuthor {
  login: string
  avatarUrl: string
  name?: string
}

interface CommentReaction {
  emoji: string                 // 👍 🤔 🔥 etc
  count: number
  viewerHasReacted: boolean
}
```

### Comment pin (browser-side, derived from thread data)

```ts
interface CommentPin {
  threadId: string
  frameId: string
  selector: string
  author: CommentAuthor         // first message author (avatar color)
  replyCount: number
  hasAnnotation: boolean
  status: 'open' | 'resolved'
}
```

---

## Authentication

### GitHub OAuth Device Flow

The device flow is ideal for canvai because:
- No redirect URI needed (canvas runs on localhost)
- No server-side OAuth callback required
- Works in any environment (no port conflicts)
- User authenticates in their browser, token arrives via polling

**Flow:**

```
1. User clicks "Sign in with GitHub" in the comment card
2. Browser → POST /auth/device-code → server → POST https://github.com/login/device/code
3. Server returns { user_code, verification_uri, device_code, interval }
4. Browser shows: "Enter code XXXX-YYYY at github.com/login/device"
5. Browser polls POST /auth/poll { device_code } every {interval} seconds
6. Server polls GitHub's token endpoint until success/expiry
7. On success: server stores token, returns { token, user }
8. Browser stores user info, shows avatar in comment FAB and compose cards
```

**Token storage:**
- Server-side: `~/.canvai/auth.json` — `{ github_token, user: { login, avatar_url, name } }`
- Browser-side: receives user info via `GET /auth/user` (token never sent to browser)
- All GitHub API calls go through the canvai server (proxy pattern)

**GitHub App vs Personal OAuth:**
- Start with an OAuth App (simpler, no installation step)
- Client ID hardcoded in canvai (public)
- Scopes needed: `repo` (read/write issues on private repos), `read:user`
- Future: migrate to GitHub App for fine-grained permissions

### Endpoints

```
POST /auth/device-code        → initiate device flow, return user_code + verification_uri
POST /auth/poll               → poll for token completion, return { status, user? }
GET  /auth/user               → return current authenticated user (or 401)
POST /auth/logout             → clear stored token
```

---

## HTTP server extensions (`src/mcp/http-server.js`)

New routes added alongside existing annotation routes. Same server, same port (4748).

### Comment CRUD

```
GET    /comments                         → list all comment threads for this project
GET    /comments/:id                     → get thread with all messages
POST   /comments                         → create new thread (creates GitHub Issue)
POST   /comments/:id/replies             → add reply (creates GitHub Issue comment)
POST   /comments/:id/resolve             → resolve thread (closes GitHub Issue)
POST   /comments/:id/reopen              → reopen thread
DELETE /comments/:id                     → delete thread (close + lock issue)
```

### Reactions

```
POST   /comments/:id/messages/:msgId/reactions    → toggle reaction on a message
```

### Annotation promotion

```
POST   /comments/:id/annotate            → promote comment to annotation
```

This creates an annotation via the existing `addAnnotation()` flow, then updates the comment thread with the annotation ID. The thread shows an "Annotation #N — Queued" banner.

### SSE extensions

Extend the existing `/annotations/events` SSE stream OR create a separate `/comments/events` stream:

```
{ type: 'comment-created', thread: CommentThread }
{ type: 'reply-added', threadId: string, message: CommentMessage }
{ type: 'comment-resolved', threadId: string }
{ type: 'comment-reopened', threadId: string }
{ type: 'reaction-toggled', threadId: string, messageId: string, reactions: CommentReaction[] }
```

**Recommendation:** Separate stream (`/comments/events`). Keeps annotation SSE clean and avoids coupling.

---

## GitHub API integration (`src/mcp/github.js`)

New module. All GitHub API calls go through here. Uses `@octokit/rest` or plain `fetch` with the stored token.

### Required operations

```js
// Issues
createIssue(repo, { title, body, labels })           → Issue
closeIssue(repo, issueNumber)                         → Issue
reopenIssue(repo, issueNumber)                        → Issue
listIssues(repo, { labels: ['canvai-comment'] })      → Issue[]
getIssue(repo, issueNumber)                           → Issue

// Comments
createComment(repo, issueNumber, body)                → Comment
listComments(repo, issueNumber)                       → Comment[]

// Reactions
addReaction(repo, commentId, content)                 → Reaction
removeReaction(repo, commentId, reactionId)            → void
listReactions(repo, commentId)                        → Reaction[]

// Auth
getAuthenticatedUser(token)                           → User
```

### Issue body format

The first message body doubles as structured metadata (parseable by canvai, readable by humans on GitHub):

```markdown
<!-- canvai:meta
{
  "frameId": "pricing-card-1",
  "componentName": "PricingCard",
  "selector": "div > h2:nth-of-type(1)",
  "elementTag": "h2",
  "elementText": "Pro Plan",
  "computedStyles": { "fontSize": "24px", "fontWeight": "700" }
}
-->

The heading font size feels too large for this card. Should be 20px to match the design system.

---
*Posted from [canvai](https://github.com/madebynoam/canvai) canvas*
```

### Repo detection

The server needs to know which GitHub repo to use. Options:
1. Read from `package.json` → `repository` field
2. Parse `git remote get-url origin`
3. Config in `.canvai/config.json`

**Recommendation:** Parse git remote (most reliable, no config needed). Fall back to config file.

---

## Browser UI

### New component: `CommentOverlay.tsx`

Separate from `AnnotationOverlay.tsx`. Both render as siblings in `App.tsx`. They share the canvas but have independent UIs.

**Structure:**

```tsx
<App>
  <Canvas>
    <Frame ... />
    <Frame ... />
  </Canvas>
  <AnnotationOverlay endpoint="..." frames={...} />
  <CommentOverlay endpoint="..." frames={...} />
</App>
```

### Comment overlay states

```
idle
  └─ comment pins visible on canvas
  └─ purple comment FAB (bottom-right, stacked above annotation FAB)
  └─ click pin → open thread card

targeting
  └─ transparent overlay captures pointer events
  └─ highlight box follows cursor (purple border, not orange)
  └─ click element → open compose card

composing
  └─ "New comment" card near target element
  └─ avatar + textarea + Cancel/Post buttons
  └─ Post creates GitHub Issue

viewing
  └─ thread card showing all messages
  └─ reply input at bottom
  └─ per-message hover: quick reactions (👍 🤔 🔥) + ··· menu
  └─ ··· menu: "Add as annotation", "Delete"
  └─ header: thread menu (copy link → shared canvai URL with ?comment={id}, delete thread), resolve (✓), close (✕)
```

### Pin rendering

Pins are rendered as fixed-position elements (like annotation markers) but use the commenter's avatar instead of numbers:

```tsx
<AvatarPin
  author={thread.author}
  replyCount={thread.messages.length - 1}
  hasAnnotation={!!thread.annotationId}
  status={thread.status}
/>
```

- **Active pin:** Avatar circle (28px) + reply count badge (top-right, 14px)
- **Annotated pin:** Avatar + orange dot (bottom-right, 10px)
- **Resolved pin:** Faded checkmark circle (opacity 0.5)

Pins track element positions via rAF (same pattern as annotation markers).

### FAB placement

Two round FABs (40px, `borderRadius: 50%`) stack vertically in the bottom-right corner:

```
                      ╭───╮
  Comment (purple)    │ 💬│  ← top
                      ╰───╯
                      ╭───╮
  Annotate (orange)   │ ✏️ │  ← bottom (existing)
                      ╰───╯
```

The comment FAB only appears on shared builds (when `mode === 'shared'`). In dev mode, only the annotation FAB shows.

**Detection:** `GET /mode` returns `{ mode: 'dev' | 'shared' }`. The server knows based on how it was started (`canvai dev` vs `canvai share --serve`).

### Annotation promotion flow

When a user clicks "Add as annotation" on a message:

1. `POST /comments/:id/annotate` sends the comment text + targeting info to the annotation system
2. The thread card shows an "Annotation #N — Queued" banner (orange accent)
3. The thread stays open for further discussion
4. When the agent resolves the annotation, the banner disappears (no "Applied" card — keep it minimal)

### Spring animations

All animations follow the existing motion language:

| Element | Animation | Preset |
|---------|-----------|--------|
| Comment card | scale(0.96→1) + translateY(8→0) + opacity | snappy (tension 233, friction 19) |
| Thread card | same as comment card | snappy |
| Pin mount | scale(0.5→1) | snappy (tension 233, friction 19) |
| Pin resolved | opacity fade to 0.5 | soft (tension 89, friction 12) |
| Toast | translateY(16→0) + opacity | snappy |
| FAB | scale(0.8→1) + opacity | snappy |

---

## Build mode detection

Comments are a shared-build feature. They should not appear during local dev (where annotations are the primary tool).

### How it works

- `canvai dev` → dev mode → annotation FAB only
- `canvai share --serve` → shared mode → comment FAB + annotation FAB
- GitHub Pages deploy → static build → comments only (no annotation server)

For the static build case (GitHub Pages), the comment system talks directly to GitHub API from the browser (no proxy server). This requires the GitHub token to be stored in localStorage after OAuth.

**Decision point:** Do we support comments on static builds (GitHub Pages) or only on served builds? Static builds mean no canvai server, so either:
- (a) Browser talks directly to GitHub API (token in localStorage — security tradeoff)
- (b) Comments only work on served builds (simpler, more secure)

**Recommendation:** Start with (b) — served builds only. Add (a) later if needed.

---

## Implementation phases

### Phase 1: Auth + basic threading (MVP)

**Goal:** Sign in with GitHub, create a comment thread pinned to an element, reply.

Files to create:
- `src/mcp/github.js` — GitHub API wrapper
- `src/mcp/auth.js` — device flow + token storage
- `src/runtime/CommentOverlay.tsx` — browser UI (compose + view)
- `src/runtime/comment-types.ts` — TypeScript interfaces

Files to modify:
- `src/mcp/http-server.js` — add auth + comment routes
- `src/App.tsx` — render `<CommentOverlay />`
- `src/runtime/index.ts` — export CommentOverlay

**Scope:**
- [x] GitHub OAuth device flow
- [x] Create comment thread (GitHub Issue)
- [x] View thread with messages
- [x] Reply to thread
- [x] Comment pins on canvas (avatar-based)
- [x] Purple comment FAB
- [x] Targeting flow (reuse pattern from AnnotationOverlay)
- [x] Resolve thread (close issue)

### Phase 2: Reactions + menus + annotation promotion

**Goal:** Full interactivity — reactions, per-message menus, promote to annotation.

Files to modify:
- `src/runtime/CommentOverlay.tsx` — add reaction UI, menus, promotion flow
- `src/mcp/http-server.js` — add reaction + promotion routes
- `src/mcp/github.js` — add reaction API calls

**Scope:**
- [ ] Quick reactions (👍 🤔 🔥) on hover
- [ ] Per-message ··· menu (Add as annotation, Delete)
- [ ] Thread-level ··· menu (Copy link → shared canvai URL with `?comment={id}` deep link, Delete thread)
- [ ] Deep link: on page load, if `?comment={id}` is present, auto-open that thread card
- [ ] Annotation promotion flow (queued banner only, disappears on resolve)
- [ ] SSE events for real-time updates

### Phase 3: Polish + static builds

**Goal:** Edge cases, loading states, error handling, static build support.

**Scope:**
- [ ] Loading skeletons for threads
- [ ] Error states (auth expired, network failure, rate limiting)
- [ ] Optimistic updates (show message immediately, sync in background)
- [ ] Comment count badge in TopBar
- [ ] Keyboard shortcuts (Cmd+Enter to post, Escape to dismiss)
- [ ] Static build support (direct GitHub API from browser)
- [ ] `prefers-reduced-motion` respect for all new animations

---

## Dependencies

### New npm packages

```
@octokit/rest           — GitHub API client (or use plain fetch)
```

That's it. The existing stack (React, Vite, MCP SDK) handles everything else.

### GitHub OAuth App

Need to register an OAuth App at `github.com/settings/applications/new`:
- Application name: `canvai`
- Homepage URL: `https://github.com/madebynoam/canvai`
- Authorization callback URL: not needed (device flow)
- Client ID goes in `src/mcp/auth.js` (public, safe to commit)

---

## Open questions

1. **Repo scope:** Should comments be per-project (filtered by label `canvai-comment:project-name`) or per-repo? Per-project is cleaner but means more labels.

2. **Offline / rate limits:** GitHub API has rate limits (5000/hr authenticated). For a typical design session this is plenty, but should we cache aggressively?

3. **Permissions:** What if a collaborator has read-only access? They can view comments but not post. Should we show a "read-only" state?

4. **Thread position drift:** If the component code changes (agent edit or manual), the CSS selector may no longer match. Should we store a fallback (e.g., element text + approximate position)?

5. **Notification:** Should resolving a comment thread notify the original author? (GitHub already does this via issue close notifications.)

---

## Risk assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| GitHub API rate limiting | Low | Medium | Cache threads locally, batch reads |
| OAuth token expiry | Medium | Low | Auto-refresh or re-auth prompt |
| Selector drift after code changes | High | Medium | Store element text as fallback, fuzzy match |
| Two overlay systems conflicting | Medium | Medium | Separate z-index ranges, clear mode ownership |
| GitHub App migration later | Low | Low | Abstract API calls behind github.js module |

---

## Non-goals (explicitly out of scope)

- Real-time collaboration (multiple cursors, presence)
- Markdown rendering in comments (plain text for now)
- File attachments / screenshots in comments
- Email notifications beyond GitHub's built-in
- Comment search/filter UI
- Dark mode for comment UI
