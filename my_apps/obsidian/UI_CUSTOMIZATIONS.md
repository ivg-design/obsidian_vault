# Obsidian UI Customizations

#obsidian #css #ui-customization #status-bar #sync-error

**Date:** 2025-08-27
**Type:** CSS Snippet Patch

## Hide Sync Error Icon - Implementation

### Problem
The Obsidian status bar displays a sync error icon with class `.sync-status-icon.mod-error` that needed to be permanently hidden.

### Solution
Created a CSS snippet that uses `display: none` to hide the specific element.

### Files Created

1. **CSS Snippet**: `/.obsidian/snippets/hide-sync-error-icon.css`
   - Main rule: `.status-bar-item .sync-status-icon.mod-error { display: none !important; }`
   - Alternative with `:has()` selector for broader compatibility
   - Includes commented alternatives for different approaches

2. **Configuration Update**: `/.obsidian/appearance.json`
   - Added `"enabledCssSnippets": ["hide-sync-error-icon"]`
   - Automatically enables the snippet

3. **Documentation**: `/.obsidian/snippets/README.md`
   - Usage instructions
   - Customization options
   - Reversion guide

### Technical Details

#### CSS Selectors Used
```css
/* Primary selector - targets error state specifically */
.status-bar-item .sync-status-icon.mod-error

/* Alternative using :has() pseudo-class */
.status-bar-item:has(.sync-status-icon.mod-error)
```

#### Why This Approach?

1. **Persistence**: CSS snippets survive Obsidian updates
2. **Reversibility**: Easy to disable without modifying app
3. **Flexibility**: Multiple customization options provided
4. **Safety**: Doesn't modify application files

### Alternative Approaches Considered

1. **Modifying app.asar**: 
   - ❌ Would be overwritten on update
   - ❌ Requires unpacking/repacking
   - ❌ Could break app signature

2. **Plugin Development**:
   - ❌ Overkill for simple CSS change
   - ❌ Requires maintenance
   - ❌ More complex deployment

3. **Theme Modification**:
   - ❌ Would affect theme choice
   - ❌ Theme updates could revert change

### Verification Steps

1. Check if snippet folder exists:
   ```bash
   ls ~/.obsidian/snippets/
   ```

2. Verify snippet is enabled:
   ```bash
   grep "hide-sync-error-icon" ~/.obsidian/appearance.json
   ```

3. Restart Obsidian and check status bar

### Additional Customization Options

The CSS file includes commented alternatives:

```css
/* Make transparent instead of hiding */
.status-bar-item .sync-status-icon.mod-error {
    opacity: 0 !important;
    pointer-events: none !important;
}

/* Dim the icon instead */
.status-bar-item .sync-status-icon.mod-error {
    color: var(--text-muted) !important;
    opacity: 0.3 !important;
}

/* Hide ALL sync icons */
.status-bar-item .sync-status-icon {
    display: none !important;
}
```

### Troubleshooting

**Icon still visible after applying patch:**
1. Ensure Obsidian is fully restarted
2. Check Settings → Appearance → CSS Snippets
3. Toggle snippet off and on
4. Click refresh button in CSS Snippets section

**Snippet not appearing in settings:**
1. Verify file extension is `.css` not `.css.txt`
2. Check file is in correct directory
3. No syntax errors in CSS

**Want to revert:**
1. Settings → Appearance → CSS Snippets → Toggle off
2. Or delete the CSS file
3. Or comment out all rules in CSS file

### CSS Snippet System Overview

Obsidian's CSS snippet system:
- Located in `vault/.obsidian/snippets/`
- Automatically detected by Obsidian
- Can be toggled in Settings → Appearance
- Loaded after theme CSS (higher priority)
- Support standard CSS including CSS3 features
- Can use Obsidian's CSS variables

### Future Enhancements

1. **Conditional Display**: Show icon only for certain error types
2. **Custom Icon**: Replace error icon with custom indicator
3. **Notification Alternative**: Show toast instead of status icon
4. **Hover Details**: Show error on hover only

### Related Files

- CSS Snippet: `~/.obsidian/snippets/hide-sync-error-icon.css`
- Configuration: `~/.obsidian/appearance.json`
- Documentation: `~/.obsidian/snippets/README.md`

### Notes

- The `:has()` selector is used as a fallback for better element targeting
- `!important` is necessary to override Obsidian's inline styles
- The snippet affects only visual display, not sync functionality
- Sync continues to operate normally in the background

## Summary

Successfully implemented a persistent, reversible patch to hide the Obsidian sync error icon using the built-in CSS snippets feature. The solution is update-proof and easily customizable.