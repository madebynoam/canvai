---
name: canvai-share
description: Build the canvas and deploy to GitHub Pages for sharing
---

# /canvai-share [project-name] [--dest subpath]

Build the current canvas project and deploy it to GitHub Pages so you can share a live link with others.

## Arguments

- `project-name` (optional) — only include this project in the build. If omitted and multiple projects exist, ask the designer.
- `--dest subpath` (optional) — deploy to a subdirectory of the GitHub Pages site instead of root. Useful when the root is reserved for something else (e.g. a landing page). Example: `--dest explore` deploys to `/<repo>/explore/`.

## Steps

1. **Check prerequisites:**
   - Confirm the project is a git repo with a GitHub remote
   - Extract the repo name and owner:
     ```bash
     gh repo view --json nameWithOwner -q .nameWithOwner
     ```

2. **Determine which project to share.**
   - If a project name is provided as an argument, use that
   - If there are multiple projects in `src/projects/`, ask: "Share all projects or just one?"
   - If only one project exists, use that

3. **Parse arguments.** Check if `--dest <subpath>` was provided. This determines:
   - The `--base` path for vite
   - The `--dest` flag for gh-pages

4. **Build** with the correct base path:
   ```bash
   # Without --dest (deploys to root):
   CANVAI_PROJECT=<project-name> npx vite build --base=/<repo-name>/

   # With --dest explore (deploys to subpath):
   CANVAI_PROJECT=<project-name> npx vite build --base=/<repo-name>/explore/
   ```
   The `CANVAI_PROJECT` env var tells the vite plugin to only include that project's manifest.

5. **Deploy to GitHub Pages:**
   ```bash
   # Without --dest (replaces root):
   npx gh-pages -d dist

   # With --dest explore (deploys to subpath, preserves everything else):
   npx gh-pages -d dist --dest explore
   ```

6. **Enable GitHub Pages** if not already enabled:
   ```bash
   gh api repos/<owner>/<repo>/pages -X POST -f source.branch=gh-pages -f source.path=/ 2>/dev/null || true
   ```

7. **Save the share URL to the manifest.**
   Open `src/projects/<project-name>/manifest.ts` and set `shareUrl` on the manifest object:
   ```ts
   const manifest: ProjectManifest = {
     project: '<project-name>',
     shareUrl: 'https://<owner>.github.io/<repo>/',  // ← add or update this
     iterations: [ ... ],
   }
   ```
   If `shareUrl` already exists, update it. If it doesn't, add it after the `project` field.

8. **Return the URL:**
   ```
   # Without --dest:
   Deployed! View at: https://<owner>.github.io/<repo>/

   # With --dest:
   Deployed! View at: https://<owner>.github.io/<repo>/explore/
   ```

## Examples

```
/canvai-share                        → all projects, deployed to root
/canvai-share canvai-ui              → single project, deployed to root
/canvai-share canvai-ui --dest explore  → single project at /explore/ subpath
```

## Notes

- The `--base` flag is critical — without it, asset paths break on GitHub Pages
- `CANVAI_PROJECT` filters the build to only include the specified project
- `--dest` uses gh-pages' subdirectory support — it won't overwrite other content on the gh-pages branch
- First deploy may take 1-2 minutes for GitHub to provision the Pages site
- Subsequent deploys update within ~30 seconds
- If the repo is private, only people with repo access can view the page
