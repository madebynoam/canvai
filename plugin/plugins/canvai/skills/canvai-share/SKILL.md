---
name: canvai-share
description: Build the canvas and deploy to GitHub Pages for sharing
---

# /canvai-share [project-name]

Build the current canvas project and deploy it to GitHub Pages so you can share a live link with others.

## Steps

1. **Check prerequisites:**
   - Confirm the project is a git repo with a GitHub remote
   - Extract the repo name and owner from the remote URL:
     ```bash
     gh repo view --json nameWithOwner -q .nameWithOwner
     ```

2. **Determine which project to share.**
   - If a project name is provided as an argument, use that
   - If there are multiple projects in `src/projects/`, ask: "Share all projects or just one?"
   - If only one project exists, use that

3. **Build** with the correct base path for GitHub Pages:
   ```bash
   # Single project (only includes that project's manifest):
   CANVAI_PROJECT=<project-name> npx vite build --base=/<repo-name>/

   # All projects:
   npx vite build --base=/<repo-name>/
   ```
   The `CANVAI_PROJECT` env var tells the vite plugin to only include that project's manifest. Other projects' code is excluded from the bundle.

4. **Deploy to GitHub Pages:**
   ```bash
   npx gh-pages -d dist
   ```
   This pushes `dist/` to the `gh-pages` branch without affecting your working branch.

5. **Enable GitHub Pages** if not already enabled:
   ```bash
   gh api repos/<owner>/<repo>/pages -X POST -f source.branch=gh-pages -f source.path=/ 2>/dev/null || true
   ```

6. **Return the URL:**
   ```
   Deployed! View at: https://<owner>.github.io/<repo>/
   ```

## Notes

- The `--base` flag is critical — without it, asset paths break on GitHub Pages
- `CANVAI_PROJECT` filters the build to only include the specified project
- First deploy may take 1-2 minutes for GitHub to provision the Pages site
- Subsequent deploys update within ~30 seconds
- If the repo is private, only people with repo access can view the page
