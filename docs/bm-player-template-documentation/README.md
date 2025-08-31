---
project: "bm_player_template"
project_tag: "#project/bm_player_template"
title: "R E A D M E"
type: "readme"
status: "warning"
created: 08-30-2025 20:45:49
modified: 08-30-2025 20:48:21
source_files:
  - "/Users/ivg/github/bm_player_template/README.md"
related: []
description: "---
project: "bm_player_template"
project_tag: "#project/bm_player_template"
title: "R E A D M E"
type: "readme"
status: "complete"
created: 08-30-2025 20:45:49
modified: 08-30-2025 20:45:49
source_fi. Related to 3 other documents."
---

---
project: "bm_player_template"
project_tag: "#project/bm_player_template"
title: "R E A D M E"
type: "readme"
status: "complete"
created: 08-30-2025 20:45:49
modified: 08-30-2025 20:45:49
source_files:
  - "/Users/ivg/github/bm_player_template/README.md"
related:
  - "Package"
description: "Bodymovin Player Template Builder

A professional Lottie animation player featuring advanced controls and an automated build system that seamlessly integrates with Adobe After Effects Bodymovin plugin."
---

# Bodymovin Player Template Builder

A professional Lottie animation player featuring advanced controls and an automated build system that seamlessly integrates with Adobe After Effects Bodymovin plugin. This solution bridges the gap between animation creation and web deployment, providing designers with a polished player interface and developers with an efficient build pipeline.

## Core Capabilities

### Player Interface

The player delivers a comprehensive set of controls for professional animation playback:

**Playback Management**
- Play/pause functionality with animated SVG icons providing visual feedback
- Frame-accurate scrubbing through a smooth progress bar
- Variable speed control ranging from 0.25x to 2x for detailed animation review
- Real-time frame counter and time display

**Display Modes**
- Standard and mini mode interfaces for flexible embedding
- Loop and reverse playback options
- Subframe rendering toggle to address rounded corner flickering issues
- Responsive design that adapts to any screen size

### Visual Design

The interface implements a modern dark theme with carefully selected colors and visual effects:

- Frosted glass effect using backdrop-filter on control elements
- Smooth CSS transitions and animations throughout the interface
- Touch-optimized controls for mobile devices
- Keyboard navigation support with dedicated shortcuts
- High contrast ratios meeting accessibility standards

### Build Automation

The automated build system streamlines the deployment process:

**Template Processing**
- Removes CDN script dependencies automatically
- Injects minified Lottie player directly into HTML
- Replaces mock animation data with standardized placeholders
- Reduces file size by approximately 60% through minification

**Deployment Features**
- Single-command deployment to Adobe CEP extensions
- Automatic backup creation with timestamped filenames
- Built-in verification to ensure successful processing
- Rollback capability for failed deployments

## System Requirements

- Node.js version 14.0 or higher
- Yarn package manager (npm supported as alternative)
- Adobe After Effects with Bodymovin extension installed
- Write permissions for Adobe CEP extensions directory

## Installation Process

Clone the repository and install dependencies:

```bash
git clone https://github.com/ivg-design/bm_player_template.git
cd bm_player_template
yarn install
```

Verify the installation by checking required directories:

```bash
ls -la src/ lib/ scripts/
```

## Build and Deployment

Execute the build process with a single command:

```bash
yarn build
```

The build script performs these operations sequentially:

1. **Verification** - Confirms presence of all required source files
2. **Processing** - Removes external dependencies and injects minified code
3. **Validation** - Verifies successful placeholder replacement
4. **Deployment** - Copies processed files to Bodymovin directory with backup

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

## Player Controls Reference

| Control | Function | Keyboard Shortcut |
|---------|----------|------------------|
| Play/Pause | Toggle animation playback | Space |
| Progress Bar | Scrub through animation | Click/Drag |
| Speed Slider | Adjust playback rate | - |
| Loop Toggle | Enable continuous playback | L |
| Reverse Toggle | Play animation backwards | R |
| Mini Mode | Compact interface | M |
| Subframe Toggle | Fix rendering artifacts | S |

## Project Structure

```
bm_player_template/
├── src/
│   └── demo_template.html        # Template with CDN references
├── lib/
│   └── minified_bm_player.min.js # Minified Lottie player
├── scripts/
│   └── build.js                  # Build automation script
├── docs/
│   ├── TOC.md                    # Documentation index
│   ├── build-process.md          # Build system details
│   ├── player-controls.md        # Control reference
│   └── subframe-rendering.md     # Technical specifications
├── package.json                  # Project configuration
└── README.md                     # Primary documentation
```

## Technical Architecture

### Component Hierarchy

The player implements a structured component system:

```
HTML Template
├── Lottie Container
│   └── Animation Canvas
├── Control Panel
│   ├── Playback Controls
│   ├── Settings Controls
│   └── Display Controls
└── Info Panel
    └── Animation Metrics
```

### Processing Pipeline

The system follows this data flow:

```
After Effects → Bodymovin Export → Template Processing → Player Deployment
```

## Troubleshooting Guide

### Common Issues and Solutions

| Issue | Resolution |
|-------|------------|
| Build script failure | Verify Node.js version 14+ and file permissions |
| Player not displaying | Check Lottie library loading and console errors |
| Animation loading error | Validate JSON format and placeholder insertion |
| Control unresponsiveness | Ensure JavaScript execution and check for errors |
| Deployment failure | Confirm write access to Adobe CEP directory |

### Debug Mode

Enable verbose logging for troubleshooting:

```javascript
log.setLevel('debug');
```

## Development Guidelines

### Code Standards

- Maintain consistent indentation (tabs for HTML/CSS, 2 spaces for JavaScript)
- Use descriptive variable and function names
- Include JSDoc comments for all functions
- Test all player controls after modifications
- Update documentation for new features

### Contribution Areas

Priority areas for enhancement include:

- Additional player controls (zoom, rotation, filters)
- Theme customization system
- Performance optimizations
- Cross-browser compatibility improvements
- Accessibility enhancements
- Automated testing framework

## License

Released under the MIT License, permitting:

- Commercial and private use
- Modification and distribution
- Limited liability and warranty
- Required license and copyright notice retention

## Support Resources

- [GitHub Issues](https://github.com/ivg-design/bm_player_template/issues) for bug reports
- [GitHub Discussions](https://github.com/ivg-design/bm_player_template/discussions) for community support
- [Project Documentation](docs/TOC.md) for comprehensive guides
- Email support at support@ivg-design.com

## Version Information

Current version: 1.0.0

Recent enhancements:
- Subframe rendering toggle for artifact correction
- Reorganized project structure for clarity
- Comprehensive documentation system
- Professional UI improvements

Detailed version history available in [CHANGELOG.md](CHANGELOG.md).

---
## Tags
#project/bm_player_template
#type/readme
#auto/generated

---
Source: `/Users/ivg/github/bm_player_template/README.md`
Generated: 2025-08-31 by DocuMentor v3.1

## Related Documents

[[build]]
[[build]]
[[CHANGELOG]]
[[CHANGELOG]]