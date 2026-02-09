---
name: canvai-init
description: Create a new design project and start designing
---

# /canvai-init <project-name>

Create a new design project inside Canvai and launch the dev environment.

## Steps

1. **Parse the project name** from the user's command (e.g. `/canvai-init team-permissions`). If no name is provided, ask for one.

2. **Create the project folder:**
   ```
   src/projects/<project-name>/
   ```

3. **Create a placeholder component** in the project folder — a simple React component the designer will replace:
   ```tsx
   // src/projects/<project-name>/Placeholder.tsx
   export function Placeholder() {
     return (
       <div style={{ padding: 24, background: '#fff', borderRadius: 8, fontFamily: 'system-ui' }}>
         <h2 style={{ margin: 0, fontSize: 18, color: '#1e1e1e' }}><project-name></h2>
         <p style={{ margin: '8px 0 0', fontSize: 14, color: '#666' }}>Describe your design to get started.</p>
       </div>
     )
   }
   ```

4. **Wire it into App.tsx** — import the placeholder and add it to the frames array:
   ```tsx
   import { Placeholder } from './projects/<project-name>/Placeholder'
   ```
   Add a frame entry:
   ```tsx
   {
     id: '<project-name>-start',
     title: '<Project Name> / Start',
     x: 100, y: 100, width: 400, height: 200,
     component: Placeholder,
   }
   ```

5. **Launch the dev server** in the background:
   ```bash
   npm run dev -- --open
   ```

6. **Confirm:** "Project `<project-name>` is ready. Describe your design or attach a sketch."
