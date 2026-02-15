---
name: canvai-iterate
description: Create a new design iteration for the current project
---

# /canvai-iterate [description]

Freeze the current iteration and create a new one with its own folder, tokens, and variations.

## Steps

1. **Identify the active project.** Look at which project the designer has been working on (check recent file edits in `src/projects/`).

2. **Read the current manifest** — `src/projects/<project-name>/manifest.ts`

3. **Find the active iteration.** The last iteration with `frozen: false` (or the last iteration if none are marked).

4. **Freeze the active iteration.** Set `frozen: true` in the manifest. Pin the current accent value into the iteration's `tokens.css`:
   ```css
   .iter-v1 {
     --accent: oklch(0.68 0.18 235);  /* pinned */
   }
   ```

5. **Create the new iteration folder** — `iterations/v<N>/` with:
   - `tokens.css` — empty scope class (inherits base tokens), or ask which tokens to override
   - `index.ts` — empty variation index
   - Copy specified variation files from the previous iteration (or ask which to carry forward)

6. **Add the new iteration to manifest:**
   - Add `import './iterations/v<N>/tokens.css'`
   - Add new iteration entry with `frozen: false`
   - Import and register any carried-forward variations

7. **Confirm:** "Created V<N>. Previous iteration V<N-1> is now frozen."

## Rules

- **NEVER modify files in a frozen iteration folder** (`iterations/v<N>/` where `frozen: true` in manifest)
- Always add a new iteration for design versions
- Primitives in `primitives/` are shared across all iterations — changes propagate everywhere
- If a primitive needs to diverge, create a local component in the iteration folder instead
- Keep iteration names short (e.g. "V1", "V2")
- Token overrides in iteration `tokens.css` are scoped via `.iter-<name>` CSS class
