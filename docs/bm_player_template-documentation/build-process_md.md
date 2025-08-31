---
title: Build process
type: documentation
project: bm_player_template
source: /Users/ivg/github/bm_player_template/docs/build-process.md
created: 08-30-2025 22:25:56
modified: 08-30-2025 22:25:56
tags:
  - #bm_player_template
  - #type/documentation
---

I'll analyze the project to generate comprehensive documentation.## Bodymovin Player Template Builder

The Bodymovin Player Template Builder is a comprehensive solution for creating professional Lottie animation players with advanced controls. This tool provides an automated build system that seamlessly integrates with the Adobe After Effects Bodymovin extension, enabling designers and developers to export animations with a fully-featured, customizable player interface.

## System Architecture

### Core Components

The project consists of three main components working together to create a seamless animation workflow:

**Template System**: The HTML template (`src/demo_template.html`) contains a feature-rich Lottie animation player with professional UI controls. This template serves as the foundation for all exported animations.

**Build Pipeline**: An automated Node.js build script (`scripts/build.js`) processes the template by removing external dependencies, injecting minified player code, and preparing it for integration with the Bodymovin extension.

**Player Library**: A minified version of the Lottie Web library (v5.12.2) is embedded directly into the final output, eliminating external CDN dependencies and ensuring consistent performance.

### Technical Implementation

The system follows a multi-stage processing workflow:

1. **Template Verification**: Validates the presence of all required source files and checks target directory permissions
2. **Code Transformation**: Removes CDN script references and injects the minified player directly into the HTML
3. **Data Placeholder Insertion**: Replaces mock animation data with Bodymovin-compatible placeholders
4. **Deployment & Backup**: Creates timestamped backups and deploys to the Adobe CEP extensions directory

## Player Features

### Playback Controls

The player provides comprehensive animation control through an intuitive interface:

- **Play/Pause Button**: Animated SVG icons provide visual feedback for playback state
- **Progress Bar**: Frame-accurate scrubbing with smooth transitions and hover effects
- **Speed Control**: Variable playback speed from 0.25x to 2x for detailed animation review
- **Frame Counter**: Real-time display of current frame and total duration

### Display Modes

Multiple viewing options accommodate different use cases:

- **Standard Mode**: Full control panel with all features visible
- **Mini Mode**: Compact interface showing only essential controls
- **Collapsed Mode**: Minimized to a single toggle button for maximum content visibility

### Advanced Options

Professional features for animation fine-tuning:

- **Loop Toggle**: Enable continuous playback for seamless presentations
- **Reverse Playback**: Play animations backward for effect analysis
- **Subframe Rendering**: Toggle to address flickering issues with rounded corners and masks

## Build System

### Configuration

The build system uses a centralized configuration in `scripts/build.js`:

```javascript
const CONFIG = {
  sourceTemplate: 'src/demo_template.html',
  minifiedPlayer: 'lib/minified_bm_player.min.js',
  targetDir: '/Library/Application Support/Adobe/CEP/extensions/bodymovin/assets/player/',
  targetFile: 'demo.html',
  animationPlaceholder: '__[[ANIMATIONDATA]]__'
};
```

### Processing Pipeline

The build script performs intelligent template processing:

1. **CDN Script Removal**: Identifies and removes all external Lottie library references
2. **Player Injection**: Embeds the minified player code between build markers
3. **Data Transformation**: Converts mock animation data to Bodymovin placeholders
4. **Verification**: Validates all transformations before deployment

### Deployment Strategy

The deployment process ensures safe file management:

- Creates timestamped backups (format: `demo.old.YYMMDD-HHMM.html`)
- Verifies write permissions before proceeding
- Provides rollback capability on failure
- Offers alternative local directory output if target is unavailable

## User Interface Design

### Visual Styling

The player interface employs modern design principles:

- **Dark Theme**: Professional appearance with carefully selected color palette
- **Frosted Glass Effect**: Backdrop filters create depth and visual hierarchy
- **Smooth Animations**: CSS transitions enhance user experience
- **Responsive Layout**: Adapts seamlessly to any screen size

### Control Elements

Each control is designed for optimal usability:

- **Touch-Optimized**: Large hit areas for mobile interaction
- **Keyboard Support**: Accessible via keyboard navigation
- **Visual Feedback**: Hover states and active indicators
- **Consistent Iconography**: SVG icons maintain clarity at any size

## Performance Optimization

### File Size Reduction

The build process optimizes for minimal file size:

- Minified player reduces JavaScript payload by ~60%
- Self-contained HTML eliminates network requests
- Inline styles avoid external CSS dependencies

### Rendering Efficiency

Performance features ensure smooth playback:

- Configurable subframe rendering for complex animations
- Efficient DOM manipulation minimizes reflows
- Hardware acceleration via CSS transforms
- Optimized event handling with debouncing

## Integration Workflow

### Setup Process

1. **Install Dependencies**: Run `yarn install` to set up the Node.js environment
2. **Verify Files**: Ensure template and player files are present
3. **Configure Paths**: Adjust target directory if needed

### Build Execution

Execute the build with a single command:

```bash
yarn build
```

The script provides real-time feedback:
- File verification status
- Processing steps completed
- Deployment confirmation
- Backup file location

### After Effects Integration

Once deployed, the template integrates seamlessly with Bodymovin:

1. Export animation from After Effects using Bodymovin
2. Select "Demo" as the export template
3. Animation data automatically replaces placeholders
4. Player controls are immediately functional

## Troubleshooting Guide

### Common Issues and Solutions

**Build Script Fails**: Verify Node.js version 14+ and check file permissions

**Player Not Visible**: Ensure JavaScript is enabled and check browser console for errors

**Animation Not Loading**: Validate JSON format and placeholder replacement

**Controls Unresponsive**: Clear browser cache and verify no JavaScript conflicts

**Deployment Permission Denied**: Run with elevated privileges or choose alternative directory

### Debug Mode

Enable verbose logging for detailed diagnostics:

```javascript
log.setLevel('debug');
```

## Browser Compatibility

The player supports modern browsers:

- Chrome 90+ (recommended)
- Safari 14+
- Firefox 88+
- Edge 90+

Features requiring specific support:
- Backdrop filters: Safari 9+, Chrome 76+
- CSS Grid: All modern browsers
- SVG animations: Universal support

## Security Considerations

The build system implements security best practices:

- No external script dependencies in production
- Sanitized file paths prevent directory traversal
- Backup creation prevents data loss
- User confirmation required for file replacement

## Future Enhancements

Planned improvements for future versions:

- Additional export formats (GIF, MP4)
- Theme customization interface
- Analytics integration
- Batch processing support
- Cloud deployment options