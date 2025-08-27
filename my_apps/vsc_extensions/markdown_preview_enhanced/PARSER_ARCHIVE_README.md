# Crossnote Parser Configuration Archive

#vscode #markdown-preview-enhanced #parser #grid-tables #backup #configuration

## Archive Contents

The file [[crossnote-parser-config.tar.gz]] contains the complete Grid Table Parser v5.0 configuration for Markdown Preview Enhanced.

### Files Included
- **parser.js** (13KB) - Grid table parser implementation
- **style.less** (2.7KB) - Custom styling for enhanced tables
- **config.js** (158B) - Parser configuration
- **head.html** (209B) - HTML head additions

## Installation Instructions

### Extract and Install
```bash
# Extract to crossnote config directory
tar -xzf crossnote-parser-config.tar.gz -C ~/.local/state/crossnote/

# Verify files
ls -la ~/.local/state/crossnote/
```

### File Locations
The files should be placed in:
```
~/.local/state/crossnote/
├── config.js
├── head.html
├── parser.js
└── style.less
```

## Purpose

This archive serves as a backup of the custom parser configuration that:
- Adds grid table support to Markdown Preview Enhanced
- Survives VSCode extension updates
- Can be quickly restored after system changes

## Usage

After extracting the files to the correct location:
1. Restart VSCode
2. Open a markdown file with grid tables
3. The parser will automatically load and render tables correctly

## Grid Table Example

```markdown
+------------------------+------------+----------+----------+
| Header row, column 1   | Header 2   | Header 3 | Header 4 |
| (header rows optional) |            |          |          |
+========================+============+==========+==========+
| body row 1, column 1   | column 2   | column 3 | column 4 |
+------------------------+------------+----------+----------+
| body row 2             | Cells may span columns.          |
+------------------------+------------+---------------------+
```

## Recovery Instructions

If the parser stops working after an MPE update:
1. Extract this archive to `~/.local/state/crossnote/`
2. Reload VSCode
3. The parser should resume working

## Notes

- Archive created: 2025-08-27
- Archive size: 5.1KB (compressed)
- Original source: ~/.local/state/crossnote/
- Compatible with MPE v0.8.19+

## Related Documents

- [[SEARCH_WIDGET_FIX]] - Custom search widget implementation
- [[my_apps/vsc_extensions/markdown_preview_enhanced/CHANGELOG]] - Complete modification history
- [[PARSER_INTEGRATION_ANALYSIS]] - Detailed analysis of parser integration options