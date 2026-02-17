---
name: canvai-undo
description: Revert the last design change commit
---

# /canvai-undo

Revert the last commit to undo a design change.

## Steps

1. **Show recent history.** Run `git log --oneline -5` to display the last 5 commits.

2. **Show what the last commit changed.** Run `git diff HEAD~1 --stat` to show which files were modified.

3. **Confirm with the designer.** Show the last commit message and ask: "Revert this commit?"

4. **Revert.** Run `git revert HEAD --no-edit` to create a new commit that undoes the last change.

5. **Report.** Tell the designer what was undone and that they can run `/canvai-undo` again to undo further.

## Notes

- This creates a revert commit (safe, preserves history) — it does NOT use `git reset`
- If the last commit is a merge or revert, warn the designer and ask if they want to proceed
- The designer can chain multiple `/canvai-undo` calls to step back through history
- Only reverts commits in the current branch
