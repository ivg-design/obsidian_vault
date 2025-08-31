---
title: Package
type: config
project: bm_player_template
source: /Users/ivg/github/bm_player_template/package.json
created: 08-30-2025 22:25:23
modified: 08-30-2025 22:25:23
tags:
  - #bm_player_template
  - #type/config
---

I'll analyze the project structure and codebase to generate comprehensive documentation.# Configuration System Documentation

## Overview

The Bodymovin Player Template Builder uses a centralized configuration system to manage build settings, deployment paths, and template processing parameters. The configuration is defined in the `scripts/build.js` file and controls all aspects of the build and deployment process.

## Configuration Structure

### Main Configuration Object

The primary configuration object is located at the top of `scripts/build.js`:

```javascript
const CONFIG = {
  sourceTemplate: path.join(__dirname, '..', 'src', 'demo_template.html'),
  minifiedPlayer: path.join(__dirname, '..', 'lib', 'minified_bm_player.min.js'),
  targetDir: '/Library/Application Support/Adobe/CEP/extensions/bodymovin/assets/player/',
  targetFile: 'demo.html',
  animationPlaceholder: '__[[ANIMATIONDATA]]__'
};
```

### Configuration Properties

#### `sourceTemplate`
- **Type**: String (file path)
- **Default**: `src/demo_template.html`
- **Description**: Path to the source HTML template containing the Lottie animation player interface
- **Requirements**: Must be a valid HTML file with proper structure for animation injection

#### `minifiedPlayer`
- **Type**: String (file path)
- **Default**: `lib/minified_bm_player.min.js`
- **Description**: Path to the minified Lottie player JavaScript library
- **Current Version**: 5.12.2
- **Purpose**: Self-contained player code that gets injected into the template

#### `targetDir`
- **Type**: String (directory path)
- **Default**: `/Library/Application Support/Adobe/CEP/extensions/bodymovin/assets/player/`
- **Description**: Destination directory for the processed template file
- **Platform Notes**: 
  - macOS: Default path shown above
  - Windows: Typically `C:\Program Files\Common Files\Adobe\CEP\extensions\bodymovin\assets\player\`
  - Linux: May vary based on Adobe installation

#### `targetFile`
- **Type**: String (filename)
- **Default**: `demo.html`
- **Description**: Name of the output file in the target directory
- **Note**: This file will be used by the Bodymovin extension when exporting animations

#### `animationPlaceholder`
- **Type**: String
- **Default**: `__[[ANIMATIONDATA]]__`
- **Description**: Placeholder string that gets replaced with actual animation data by Bodymovin
- **Format**: Double underscore prefix/suffix with double square brackets for uniqueness

## Logging Configuration

### Log Levels

The build script uses the `loglevel` library for configurable logging output:

```javascript
log.setLevel('info'); // Default level
```

Available log levels:
- `trace`: Most verbose, includes all debug information
- `debug`: Detailed debugging information
- `info`: General informational messages (default)
- `warn`: Warning messages only
- `error`: Error messages only
- `silent`: No output

### Enabling Debug Mode

To enable verbose logging for troubleshooting:

```javascript
log.setLevel('debug');
```

## Build Process Configuration

### File Processing Steps

The build process follows these configurable steps:

1. **File Verification**
   - Checks existence of source template
   - Validates minified player file
   - Confirms target directory accessibility

2. **Template Processing**
   - CDN script removal patterns
   - Build marker detection
   - Animation data replacement

3. **Backup Configuration**
   - Automatic backup creation with timestamp
   - Backup naming format: `demo.old.YYMMDD-HHMM.html`

### Processing Patterns

#### CDN Script Detection
```javascript
const cdnScriptPattern = /<script[^>]*src=["'][^"']*lottie[^"']*\.js["'][^>]*><\/script>/gi;
```

#### Build Markers
```javascript
const buildMarkerPattern = /<!-- build:scripto -->[\s\S]*?<!-- endbuild -->/;
```

#### Animation Data Pattern
```javascript
const animationDataPattern = /var\s+animationData\s*=\s*({[\s\S]*?});/g;
```

## Customization Guide

### Modifying Target Directory

To deploy to a custom location:

```javascript
const CONFIG = {
  // ... other settings
  targetDir: '/path/to/your/custom/directory/',
  targetFile: 'custom-player.html'
};
```

### Using Different Player Version

To use an alternative Lottie player build:

```javascript
const CONFIG = {
  // ... other settings
  minifiedPlayer: path.join(__dirname, '..', 'lib', 'your-custom-player.min.js')
};
```

### Custom Placeholder Format

To change the animation data placeholder:

```javascript
const CONFIG = {
  // ... other settings
  animationPlaceholder: '{{ANIMATION_DATA_HERE}}'
};
```

## Environment-Specific Configuration

### Development Environment

For development and testing:

```javascript
const isDevelopment = process.env.NODE_ENV === 'development';

const CONFIG = {
  sourceTemplate: path.join(__dirname, '..', 'src', 'demo_template.html'),
  minifiedPlayer: path.join(__dirname, '..', 'lib', 'minified_bm_player.min.js'),
  targetDir: isDevelopment 
    ? path.join(__dirname, '..', 'dist') 
    : '/Library/Application Support/Adobe/CEP/extensions/bodymovin/assets/player/',
  targetFile: 'demo.html',
  animationPlaceholder: '__[[ANIMATIONDATA]]__'
};
```

### Platform Detection

For cross-platform compatibility:

```javascript
const os = require('os');

function getTargetDirectory() {
  const platform = os.platform();
  
  switch(platform) {
    case 'darwin': // macOS
      return '/Library/Application Support/Adobe/CEP/extensions/bodymovin/assets/player/';
    case 'win32': // Windows
      return 'C:\\Program Files\\Common Files\\Adobe\\CEP\\extensions\\bodymovin\\assets\\player\\';
    case 'linux':
      return path.join(os.homedir(), '.adobe/CEP/extensions/bodymovin/assets/player/');
    default:
      return './dist/'; // Fallback to local directory
  }
}

const CONFIG = {
  // ... other settings
  targetDir: getTargetDirectory()
};
```

## Command Line Arguments

### Adding CLI Configuration Override

To support command-line configuration overrides:

```javascript
const args = process.argv.slice(2);
const targetIndex = args.indexOf('--target');

if (targetIndex !== -1 && args[targetIndex + 1]) {
  CONFIG.targetDir = args[targetIndex + 1];
}

// Usage: node scripts/build.js --target /custom/path/
```

## Error Handling Configuration

### Validation Rules

The build script validates configuration with these rules:

1. **Source Files Must Exist**
   - Template file must be readable
   - Player file must be accessible

2. **Target Directory Permissions**
   - Write access required for deployment
   - Fallback to current directory if target unavailable

3. **Placeholder Uniqueness**
   - Placeholder string must not conflict with actual code
   - Should be easily identifiable for replacement

## Best Practices

### Configuration Management

1. **Version Control**
   - Keep configuration in version control
   - Document any environment-specific changes

2. **Path Resolution**
   - Always use `path.join()` for cross-platform compatibility
   - Use absolute paths when possible

3. **Validation**
   - Validate all configuration values before processing
   - Provide clear error messages for configuration issues

### Security Considerations

1. **File Permissions**
   - Check read/write permissions before operations
   - Handle permission errors gracefully

2. **Path Sanitization**
   - Validate user-provided paths
   - Prevent directory traversal attacks

3. **Backup Strategy**
   - Always create backups before overwriting files
   - Maintain reasonable backup retention

## Troubleshooting

### Common Configuration Issues

| Issue | Solution |
|-------|----------|
| Target directory not found | Check Adobe CEP installation path |
| Permission denied | Run with appropriate permissions or use sudo (carefully) |
| Player file missing | Ensure `lib/minified_bm_player.min.js` exists |
| Placeholder not replaced | Verify placeholder string matches exactly |

### Debug Configuration

Enable detailed logging to troubleshoot configuration issues:

```javascript
// At the top of build.js
log.setLevel('debug');

// Add debug statements
log.debug('Configuration:', CONFIG);
log.debug('Current directory:', __dirname);
log.debug('Target path:', path.join(CONFIG.targetDir, CONFIG.targetFile));
```

## Integration with Bodymovin

### Extension Requirements

The configuration must align with Bodymovin extension expectations:

1. **File Location**: Must be in the correct assets/player directory
2. **File Name**: Should match what Bodymovin expects (typically `demo.html`)
3. **Placeholder Format**: Must be exactly what Bodymovin will replace

### Verification

After deployment, verify integration:

1. Open After Effects
2. Navigate to Window > Extensions > Bodymovin
3. Export an animation with "Demo" option enabled
4. Confirm the custom player template is used