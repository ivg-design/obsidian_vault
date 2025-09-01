---
title: build.js
type: documentation
generated: 2025-09-01
generator: DocuMentor
tags: [javascript]
---

# Documentation for build.js

## Overview

### Purpose and Functionality
The `build.js` script is a Node.js CLI tool designed to prepare and deploy HTML templates for the Bodymovin/Lottie animation plugin. It automates the process of creating production-ready demo files by:
- Embedding minified Lottie player code directly into HTML templates
- Removing external CDN dependencies
- Replacing animation data with placeholders for dynamic content injection
- Managing backups of existing files before replacement

### Problem Solved
This script addresses the need to create standalone HTML demo files that:
- Don't require internet connectivity (no CDN dependencies)
- Have the Lottie player code embedded directly
- Can accept dynamic animation data through placeholders
- Are ready for deployment in the Adobe CEP extension environment

### System Integration
The script integrates with the Bodymovin Adobe After Effects extension by deploying processed templates to the CEP extensions directory, specifically targeting the animation preview functionality.

## Core Components

### Configuration Object
```javascript
const CONFIG = {
  sourceTemplate: path.join(__dirname, '..', 'src', 'demo_template.html'),
  minifiedPlayer: path.join(__dirname, '..', 'lib', 'minified_bm_player.min.js'),
  targetDir: '/Library/Application Support/Adobe/CEP/extensions/bodymovin/assets/player/',
  targetFile: 'demo.html',
  animationPlaceholder: '__[[ANIMATIONDATA]]__'
}
```

**Properties:**
- `sourceTemplate`: Path to the source HTML template file
- `minifiedPlayer`: Path to the minified Lottie player JavaScript
- `targetDir`: Adobe CEP extension directory for deployment
- `targetFile`: Name of the output file
- `animationPlaceholder`: Token used to mark where animation data will be injected

### Utility Functions

#### fileExists(filePath)
Safely checks if a file exists at the given path.
- **Parameters:** `filePath` (string) - Path to check
- **Returns:** `boolean` - True if file exists, false otherwise
- **Error Handling:** Returns false on any filesystem error

#### readFile(filePath)
Reads file content as UTF-8 text.
- **Parameters:** `filePath` (string) - Path to read
- **Returns:** `string|null` - File content or null on error
- **Side Effects:** Logs error messages on failure

#### writeFile(filePath, content)
Writes content to a file.
- **Parameters:** 
  - `filePath` (string) - Target file path
  - `content` (string) - Content to write
- **Returns:** `boolean` - Success status
- **Side Effects:** Logs error messages on failure

#### getBackupName()
Generates timestamp-based backup filename.
- **Returns:** `string` - Formatted filename like `demo.old.241201-1430.html`
- **Format:** `demo.old.YYMMDD-HHMM.html`

### Main Processing Functions

#### checkFiles()
Performs pre-flight checks on all required files and directories.
- **Returns:** `Object` with properties:
  - `templateExists`: Boolean
  - `playerExists`: Boolean
  - `targetDirExists`: Boolean
  - `targetFileExists`: Boolean
- **Side Effects:** Logs status of each check with colored output

#### processTemplate()
Core template processing logic that:
1. Removes CDN script tags for Lottie player
2. Injects minified player between build markers or after `<body>` tag
3. Replaces animation data with placeholder
4. Verifies all transformations

**Returns:** `Object|null`
- On success: `{ content: string, replacements: Array }`
- On failure: `null`

**Processing Steps:**
1. **CDN Removal**: Removes all script tags loading Lottie from CDN
2. **Player Injection**: 
   - If build markers exist: Replaces content between markers
   - If no markers: Injects after `<body>` tag with markers
3. **Animation Data Replacement**: Converts mock data to placeholder
4. **Verification**: Confirms all transformations succeeded

## API Documentation

### Main Entry Point

#### main()
Orchestrates the entire build process with user interaction.

**Process Flow:**
1. Display welcome message
2. Check file existence
3. Process template
4. Handle missing target directory
5. Confirm with user
6. Create backup if needed
7. Write processed file

**Error Handling:**
- Exits with code 1 on critical errors
- Exits with code 0 on user cancellation
- Provides detailed error messages via chalk colored output

## Usage Examples

### Running the Script
```bash
# Execute directly (requires execute permissions)
./scripts/build.js

# Or via Node
node scripts/build.js
```

### Expected Console Output
```
🚀 Bodymovin Template Builder

📁 Checking source files...
  Template file: ✓ Found
  Minified player: ✓ Found
  Target directory: ✓ Found
  Existing demo.html: ⚠ Will be backed up

🔧 Processing template...
  ✓ Removed 1 CDN script tag(s)
  ✓ Replaced content between build markers
  ✓ Replaced animationData with placeholder

✅ Verification:
  Player injection: ✓ Verified
  Animation placeholder: ✓ Verified
  CDN scripts removed: ✓ Verified

📋 Summary:
  Source template: demo_template.html
  Output location: /Library/Application Support/Adobe/CEP/extensions/bodymovin/assets/player/
  Output file: demo.html
  Backup file: demo.old.241201-1430.html

? Do you want to proceed with replacing the file? (y/N)
```

## Dependencies

### External Libraries
- `fs`: Node.js filesystem module (built-in)
- `path`: Node.js path utilities (built-in)
- `inquirer`: Interactive command line prompts (^8.x recommended)
- `chalk`: Terminal string styling (^4.x recommended)
- `loglevel`: Configurable logging utility (^1.x recommended)

### Internal Dependencies
- `../src/demo_template.html`: Source template file
- `../lib/minified_bm_player.min.js`: Minified Lottie player code

### System Requirements
- Node.js 12.x or higher
- Write permissions to Adobe CEP extensions directory
- macOS (for default target directory path)

## Implementation Notes

### Important Algorithms

#### Template Processing Algorithm
1. Uses regex patterns to identify and remove CDN scripts
2. Employs marker-based content injection for maintainability
3. Implements dollar sign escaping (`$$`) to prevent replacement issues

#### Backup Strategy
- Creates timestamped backups before overwriting
- Format ensures chronological sorting
- Preserves file history for rollback capability

### Performance Considerations
- Synchronous file operations used for simplicity and reliability
- Template processing done in-memory for speed
- Single-pass regex replacements where possible

### Known Limitations
1. **Platform Specific**: Default target directory is macOS-specific
2. **Animation Data**: Only replaces first occurrence of `animationData` variable
3. **Error Recovery**: No automatic rollback on partial failure
4. **Template Structure**: Requires specific HTML structure (body tag, variable naming)

### Edge Cases Handled
- Missing target directory prompts for alternative location
- Existing files are backed up automatically
- CDN scripts with various formatting are detected
- Build markers can be missing (will be added)
- Multiple CDN script tags are removed in single operation

### Security Considerations
- User confirmation required before file operations
- Backup created before any destructive operations
- File permissions checked before operations
- No arbitrary code execution from template content


---

[[README|← Back to Index]]