# Documentation for build.js

## Overview

A Node.js build script for the Bodymovin/Lottie template builder that processes HTML templates for use with the Adobe After Effects Bodymovin plugin. The script performs template processing by injecting a minified Lottie player, removing CDN dependencies, and preparing animation data placeholders for the Bodymovin extension.

## Configuration

The script uses a central configuration object with the following paths:

```javascript
CONFIG = {
  sourceTemplate: '../src/demo_template.html',        // Source HTML template
  minifiedPlayer: '../lib/minified_bm_player.min.js', // Minified Lottie player
  targetDir: '/Library/Application Support/Adobe/CEP/extensions/bodymovin/assets/player/',
  targetFile: 'demo.html',                            // Output filename
  animationPlaceholder: '__[[ANIMATIONDATA]]__'       // Animation data placeholder
}
```

## Functions

### fileExists(filePath)
Checks if a file exists at the specified path.
- **Parameters:** `filePath` (string) - Path to check
- **Returns:** boolean - True if file exists
- **Example:** `fileExists('/path/to/file.html')`

### readFile(filePath)
Reads file content as UTF-8 text.
- **Parameters:** `filePath` (string) - File path to read
- **Returns:** string | null - File content or null on error
- **Example:** `const content = readFile('./template.html')`

### writeFile(filePath, content)
Writes content to a file.
- **Parameters:** 
  - `filePath` (string) - Target file path
  - `content` (string) - Content to write
- **Returns:** boolean - Success status
- **Example:** `writeFile('./output.html', processedContent)`

### getBackupName()
Generates timestamped backup filename.
- **Returns:** string - Backup filename format: `demo.old.YYMMDD-HHMM.html`
- **Example:** `demo.old.241231-1430.html`

### checkFiles()
Verifies existence of required source files and directories.
- **Returns:** Object with status flags:
  - `templateExists` (boolean)
  - `playerExists` (boolean)
  - `targetDirExists` (boolean)
  - `targetFileExists` (boolean)

### processTemplate()
Main template processing function that:
1. Removes CDN script tags for Lottie player
2. Injects minified player between build markers or after `<body>` tag
3. Replaces animation data with placeholder
4. Verifies all replacements

- **Returns:** Object | null
  - `content` (string) - Processed template
  - `replacements` (Array) - List of performed replacements

### main()
Orchestrates the build process:
1. Checks source files existence
2. Processes the template
3. Handles missing target directory
4. Creates backup of existing files
5. Writes processed output

## Processing Steps

### 1. CDN Script Removal
Removes external Lottie player script tags:
```html
<!-- Before -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.9.6/lottie.js"></script>

<!-- After -->
<!-- CDN script removed -->
```

### 2. Player Injection
Injects minified player between build markers:
```html
<!-- build:scripto -->
<script>
  // Minified player code here
</script>
<!-- endbuild -->
```

### 3. Animation Data Replacement
Replaces mock animation data with placeholder:
```javascript
// Before
var animationData = { /* JSON animation data */ };

// After  
var animationData = "__[[ANIMATIONDATA]]__";
```

## Usage Examples

### Basic Usage
```bash
# Run the build script
node scripts/build.js
```

### Interactive Prompts
The script will prompt for:
- Directory creation if target doesn't exist
- Confirmation before replacing existing files

### Backup Creation
Existing files are automatically backed up with timestamp:
```
demo.html → demo.old.241231-1430.html
```

## Dependencies

### NPM Packages
- `inquirer` - Interactive command line prompts
- `chalk` - Terminal string styling
- `loglevel` - Logging utility

### Node.js Built-in Modules
- `fs` - File system operations
- `path` - Path utilities

### System Requirements
- Node.js runtime
- Write permissions to Adobe CEP extensions directory
- Source template and minified player files

## Error Handling

The script includes comprehensive error handling:
- File read/write errors are logged with context
- Missing required files halt execution
- User cancellation exits gracefully
- Backup creation failures prevent file replacement

## Exit Codes
- `0` - Success or user cancellation
- `1` - Error (missing files, write failures, unexpected errors)