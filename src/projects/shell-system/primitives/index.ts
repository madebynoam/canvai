// Shared primitives — import from here, not from individual files.
// Button: Primary, outline, ghost variants with spring press | Button.tsx
// Avatar: Circular avatar with letter fallback | Avatar.tsx
// Label: Section label with optional subtitle | Label.tsx
// Swatch: Color preview box with label and OKLCH value | Swatch.tsx
// HoverButton: Icon button with subtle hover background | HoverButton.tsx
// Toggle: Pill toggle switch with spring slide | Toggle.tsx
// Checkbox: Checkbox with spring scale bounce | Checkbox.tsx

export { Button } from './Button'
export { Avatar } from './Avatar'
export { Label } from './Label'
export { Swatch } from './Swatch'
export { HoverButton } from './HoverButton'
export { Toggle } from './Toggle'
export { Checkbox } from './Checkbox'
export { SPRING, useSpring, PHI } from './spring'
export type { SpringConfig } from './spring'
