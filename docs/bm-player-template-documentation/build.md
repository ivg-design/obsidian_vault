---
project: "bm_player_template"
project_tag: "#project/bm_player_template"
title: "Build"
type: "code"
status: "warning"
created: 08-30-2025 20:46:17
modified: 08-30-2025 20:48:54
source_files:
  - "/Users/ivg/github/bm_player_template/scripts/build.js"
related: []
description: "---
project: "bm_player_template"
project_tag: "#project/bm_player_template"
title: "Build"
type: "code"
status: "complete"
created: 08-30-2025 20:46:17
modified: 08-30-2025 20:46:17
source_files:
  -. Related to 3 other documents."
---

---
project: "bm_player_template"
project_tag: "#project/bm_player_template"
title: "Build"
type: "code"
status: "complete"
created: 08-30-2025 20:46:17
modified: 08-30-2025 20:46:17
source_files:
  - "/Users/ivg/github/bm_player_template/scripts/build.js"
related: []
description: "Bodymovin Template Builder

A Node.js command-line tool that prepares HTML templates for the Bodymovin Adobe After Effects plugin by embedding a minified Lottie player and configuring animation data p."
---

# Bodymovin Template Builder

A Node.js command-line tool that prepares HTML templates for the Bodymovin Adobe After Effects plugin by embedding a minified Lottie player and configuring animation data placeholders.

## Overview

This script automates the process of converting a development HTML template into a production-ready demonstration file for the Bodymovin extension. It handles the replacement of CDN-hosted Lottie scripts with embedded minified versions and prepares animation data placeholders for runtime injection.

## Configuration

The script uses predefined paths and settings:

```javascript
CONFIG = {
  sourceTemplate: '../src/demo_template.html',
  minifiedPlayer: '../lib/minified_bm_player.min.js',
  targetDir: '/Library/Application Support/Adobe/CEP/extensions/bodymovin/assets/player/',
  targetFile: 'demo.html',
  animationPlaceholder: '__[[ANIMATIONDATA]]__'
}
```

## Core Functionality

### File Verification (`checkFiles`)

Validates the existence of required source files and target directories before processing:

- Template file existence
- Minified player file availability
- Target directory accessibility
- Existing demo file detection for backup purposes

### Template Processing (`processTemplate`)

Performs a multi-step transformation of the HTML template:

#### Step 1: CDN Script Removal
Removes external Lottie player script references:
```javascript
// Removes patterns like:
<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.7.0/lottie.js"></script>
```

#### Step 2: Player Injection
Embeds the minified player code between build markers:
```html
<!-- build:scripto -->
<script>
  // Minified player code injected here
</script>
<!-- endbuild -->
```

If build markers don't exist, the script injects them after the `<body>` tag.

#### Step 3: Animation Data Placeholder
Replaces mock animation data with a placeholder token:
```javascript
// Before:
var animationData = { /* complex JSON structure */ };

// After:
var animationData = "__[[ANIMATIONDATA]]__";
```

#### Step 4: Verification
Validates all transformations:
- Player injection success
- Placeholder presence
- CDN script removal confirmation

### Backup Management

Creates timestamped backups of existing files before replacement:
```
demo.old.241230-1430.html
```

Format: `demo.old.YYMMDD-HHMM.html`

## User Interaction

The script provides interactive prompts using Inquirer:

1. **Directory Creation**: If target directory doesn't exist, offers to save in current directory
2. **Confirmation**: Requires explicit user confirmation before file replacement
3. **Progress Feedback**: Color-coded status messages throughout the process

## Error Handling

Comprehensive error management for:
- Missing source files
- Read/write failures
- Template processing errors
- Backup creation failures

Each error includes descriptive messages and appropriate exit codes.

## Utility Functions

### `fileExists(filePath)`
Safe file existence checking with error handling.

### `readFile(filePath)`
UTF-8 file reading with error logging.

### `writeFile(filePath, content)`
File writing with success/failure return values.

### `getBackupName()`
Generates unique backup filenames with timestamps.

## Dependencies

- `fs`: File system operations
- `path`: Path manipulation
- `inquirer`: Interactive command-line prompts
- `chalk`: Terminal output styling
- `loglevel`: Logging management

## Usage

Execute directly as a Node.js script:
```bash
node build-template.js
```

The script guides through the process with visual feedback:
- Blue: Process stages
- Green: Successful operations
- Yellow: Warnings and existing file notifications
- Red: Errors and failures
- Gray: Informational details

## Exit Codes

- `0`: Successful completion or user cancellation
- `1`: Error during processing (missing files, write failures, etc.)

## Integration Points

This tool integrates with the Adobe CEP (Common Extensibility Platform) ecosystem, specifically targeting the Bodymovin extension's player directory structure. The processed template serves as the demonstration HTML file for Lottie animations exported from After Effects.

---
## Tags
#project/bm_player_template
#type/code
#auto/generated

---
Source: `/Users/ivg/github/bm_player_template/scripts/build.js`
Generated: 2025-08-31 by DocuMentor v3.1