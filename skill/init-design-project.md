---
name: init-design-project
description: Bootstrap a new Canvai design project from the template
---

# Init Design Project

## Usage
```
/init design project <project-name>
```

## Steps

1. Clone the canvai repo:
   ```bash
   git clone https://github.com/<owner>/canvai.git <project-name>
   ```

2. Reset git history:
   ```bash
   cd <project-name>
   rm -rf .git
   git init
   git add -A
   git commit -m "init: canvai project <project-name>"
   ```

3. Update package.json name:
   ```bash
   # Set "name" field to <project-name>
   ```

4. Configure Agentation MCP in `.claude/settings.json` (already present in template).

5. Install dependencies:
   ```bash
   npm install
   ```

6. Launch dev server:
   ```bash
   npm run dev -- --open
   ```

7. Confirm the canvas loads in the browser. Ready to design.
