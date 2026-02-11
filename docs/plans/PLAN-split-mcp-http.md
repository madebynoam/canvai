# Split MCP and HTTP annotation servers

## Why

The annotation system has two interfaces:
- **HTTP server (port 4748)** — receives annotations from the browser via POST
- **MCP server (stdio)** — provides `watch_annotations` tool to Claude Code

Previously both lived in one process (`src/mcp/server.js`) with a shared in-memory store. Problem: `canvai dev` starts this process and owns its stdin/stdout, so Claude Code can't connect to the MCP tools. The agent falls back to a bash curl polling loop, which burns tokens continuously.

## Fix

Split into two processes:
- **`src/mcp/http-server.js`** — HTTP-only server started by `canvai dev`. Stores annotations in memory, serves them via REST endpoints.
- **`src/mcp/mcp-server.js`** — MCP-only server started by Claude Code (via `.mcp.json`). Provides tools that call the HTTP server to get/resolve annotations.

## How it works after the split

```
canvai dev                          Claude Code (.mcp.json)
  ↓                                       ↓
Vite + http-server.js               mcp-server.js (stdio)
  (port 4748)                             │
  stores annotations                      │ watch_annotations blocks,
  serves REST API                         │ polls GET /annotations/next
       ↑                                  │
       │                                  ↓
  Browser POSTs              MCP tool returns annotation
  annotations here           Agent edits code, resolves,
                             calls watch_annotations again
```

## Changed files

### 1. `src/mcp/http-server.js` (rename from server.js)

Keep only the HTTP server parts:
- `POST /annotations` — receive from browser, add to store
- `GET /annotations` — list all
- `GET /annotations/next` — **NEW**: long-poll endpoint, blocks until a pending annotation exists, returns it
- `POST /annotations/:id/resolve` — mark resolved
- CORS headers

Remove all MCP/stdio code.

### 2. `src/mcp/mcp-server.js` (new)

MCP-only server (stdio). Tools call the HTTP server:
- `watch_annotations` — calls `GET http://localhost:4748/annotations/next` (long-poll, blocks until annotation arrives)
- `resolve_annotation { id }` — calls `POST http://localhost:4748/annotations/:id/resolve`
- `get_pending_annotations` — calls `GET http://localhost:4748/annotations?status=pending`
- `list_annotations` — calls `GET http://localhost:4748/annotations`

### 3. `src/cli/index.js`

Update `startDev()`: spawn `http-server.js` instead of `server.js`. No stdio piping needed — just inherit stdio for logs.

### 4. `.mcp.json` (project root, for dev)

Point to `mcp-server.js`:
```json
{ "mcpServers": { "canvai-annotations": { "command": "node", "args": ["src/mcp/mcp-server.js"] } } }
```

### 5. `plugin/plugins/canvai/.mcp.json`

Point to consumer's installed package:
```json
{ "mcpServers": { "canvai-annotations": { "command": "node", "args": ["node_modules/canvai/src/mcp/mcp-server.js"] } } }
```

### 6. Version bumps

- `plugin/plugins/canvai/.claude-plugin/plugin.json`
- `plugin/.claude-plugin/marketplace.json`
- `.claude-plugin/marketplace.json`

## Implementation order

1. Create `http-server.js` (extract HTTP parts from server.js, add `/annotations/next` long-poll)
2. Create `mcp-server.js` (MCP tools that call HTTP server)
3. Delete old `server.js`
4. Update `cli/index.js` (spawn http-server.js)
5. Update `.mcp.json` files (all three)
6. Version bumps
7. Test: `canvai dev` + MCP tools work, no token burn while waiting

## Verification

1. `npx canvai dev` — starts Vite + HTTP server on 4748
2. `curl -s http://localhost:4748/annotations` — returns `[]`
3. MCP server connects via Claude Code — `watch_annotations` blocks without consuming tokens
4. POST an annotation from browser — `watch_annotations` returns it
5. `resolve_annotation` works
6. Agent loops back to `watch_annotations` — idle, no tokens
