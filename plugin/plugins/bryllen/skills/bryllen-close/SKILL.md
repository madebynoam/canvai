---
name: bryllen-close
description: Stop all Bryllen dev servers and free ports
---

# /bryllen-close

Stop all running Bryllen processes (Vite dev server, MCP HTTP server).

## Steps

1. **Kill only THIS project's servers** using PIDs from the ports file:
   ```bash
   if [ -f .bryllen-ports.json ]; then
     # Kill by PID (safe) — never by port (could kill another project's server)
     node -e "
       const f = JSON.parse(require('fs').readFileSync('.bryllen-ports.json','utf8'));
       for (const pid of [f.pid, f.vitePid, f.httpPid].filter(Boolean)) {
         try { process.kill(pid, 'SIGTERM'); } catch {}
       }
     "
     rm -f .bryllen-ports.json
   else
     echo "No .bryllen-ports.json found — no servers to stop for this project."
   fi
   ```
   This kills by PID, not port — so other bryllen instances are never affected.

2. **Confirm:** "Bryllen servers stopped for this project."
