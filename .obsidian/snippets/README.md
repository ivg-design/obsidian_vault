# Obsidian CSS Snippets

## Hide Sync Error Icon

**File:** `hide-sync-error-icon.css`
**Created:** 2025-08-27
**Purpose:** Permanently hide the sync error icon in the Obsidian status bar

### How It Works

This CSS snippet targets the sync status icon specifically when it's in error state (`mod-error` class) and hides it from view using `display: none`.

### Activation

The snippet has been automatically enabled by adding it to `.obsidian/appearance.json`:

```json
{
  "enabledCssSnippets": ["hide-sync-error-icon"]
}
```

### Manual Activation (if needed)

1. Open Obsidian Settings (⌘,)
2. Navigate to **Appearance** 
3. Scroll to **CSS Snippets** section
4. Click the refresh button if needed
5. Toggle on **hide-sync-error-icon**

### Customization Options

The CSS file includes several commented-out alternatives:

1. **Hide all sync icons** (not just errors)
2. **Make transparent** instead of hiding
3. **Change color** to be less noticeable (dimmed)

To use an alternative, edit the CSS file and uncomment the desired section.

### Verification

After enabling, the sync error icon should no longer appear in the status bar at the bottom of the Obsidian window, even when sync errors occur.

### Reverting

To restore the sync error icon:
1. Go to Settings → Appearance → CSS Snippets
2. Toggle off **hide-sync-error-icon**
3. Or delete the CSS file from this folder

### Notes

- This change persists across Obsidian updates
- The snippet only affects visual display, not sync functionality
- Sync will continue to work (or fail) as before, just without the visual indicator