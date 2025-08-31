---
title: DOCUMENTATION
type: documentation
project: bm_player_template
source: /Users/ivg/github/bm_player_template/DOCUMENTATION.md
created: 08-30-2025 22:25:16
modified: 08-30-2025 22:25:16
tags:
  - #bm_player_template
  - #type/documentation
---

I'll analyze the project structure to generate comprehensive documentation.## Bodymovin Player Template Builder

A professional Lottie animation player with advanced controls and automated build system for seamless integration with Adobe After Effects Bodymovin plugin.

## Overview

The Bodymovin Player Template Builder provides a complete solution for creating professional Lottie animation players with advanced controls. The system automatically processes HTML templates, injects minified Lottie player code, and deploys to the Adobe After Effects Bodymovin extension directory.

## Key Components

### Template System
The template (`src/demo_template.html`) provides a fully-featured animation player interface with:
- Responsive layout with auto-centering
- Draggable animation viewport
- Professional dark-themed controls
- Smooth CSS animations and transitions
- Frosted glass effect on control elements

### Build Script
The automated build system (`scripts/build.js`) performs critical template processing:
- Removes external CDN script dependencies
- Injects minified Lottie player directly into HTML
- Replaces mock animation data with Bodymovin placeholder
- Creates timestamped backups before deployment
- Validates all replacements for integrity

### Player Controls

#### Playback Controls
- **Play/Pause Button**: Animated SVG icons with smooth transitions
- **Progress Bar**: Frame-accurate scrubbing with visual feedback
- **Speed Control**: Variable playback from 0.25x to 2x
- **Frame Display**: Real-time frame counter and time tracking

#### Display Options
- **Loop Toggle**: Enable continuous playback
- **Reverse Mode**: Play animations backward
- **Mini Mode**: Compact interface for space-constrained layouts
- **Subframe Rendering**: Toggle to fix rounded corner flickering issues

## Technical Architecture

### Build Process Flow
1. **Verification Phase**: Confirms source files exist
2. **Processing Phase**: 
   - Removes CDN script tags
   - Injects minified player between build markers
   - Replaces animation data with placeholder
3. **Validation Phase**: Verifies all replacements succeeded
4. **Deployment Phase**: Copies to Bodymovin directory with backup

### Configuration
The build script uses configurable paths:
```javascript
{
  sourceTemplate: 'src/demo_template.html',
  minifiedPlayer: 'lib/minified_bm_player.min.js',
  targetDir: '/Library/Application Support/Adobe/CEP/extensions/bodymovin/assets/player/',
  targetFile: 'demo.html',
  animationPlaceholder: '__[[ANIMATIONDATA]]__'
}
```

### Player Integration
The template integrates with Lottie Web 5.12.2, providing:
- Canvas and SVG rendering support
- Hardware acceleration
- Optimized performance for complex animations
- Cross-browser compatibility

## Installation

### Prerequisites
- Node.js 14.0 or higher
- Yarn or npm package manager
- Adobe After Effects with Bodymovin extension
- Write permissions to Adobe CEP directory

### Setup
```bash
# Clone repository
git clone https://github.com/ivg-design/bm_player_template.git
cd bm_player_template

# Install dependencies
yarn install

# Run build process
yarn build
```

## Usage

### Basic Build
```bash
yarn build
```

### Build Process
The build script will:
1. Check for required source files
2. Process the template automatically
3. Create backup of existing files
4. Deploy to Bodymovin directory
5. Verify successful deployment

### Player Controls Reference

| Control | Function | Description |
|---------|----------|-------------|
| Play/Pause | Toggle playback | Space key or button click |
| Progress Bar | Scrub animation | Click and drag to navigate |
| Speed Slider | Adjust playback rate | 0.25x to 2x speed |
| Loop Toggle | Continuous playback | Restart on completion |
| Reverse Toggle | Backward playback | Play in reverse direction |
| Mini Mode | Compact interface | Reduces control panel size |
| Subframe Toggle | Fix flickering | Addresses rendering issues |

## File Structure

```
bm_player_template/
├── src/
│   └── demo_template.html       # Source template with CDN player
├── lib/
│   └── minified_bm_player.min.js # Minified Lottie player
├── scripts/
│   └── build.js                  # Automated build script
├── docs/
│   ├── TOC.md                    # Documentation index
│   ├── build-process.md          # Build system details
│   ├── player-controls.md        # Controls documentation
│   └── subframe-rendering.md     # Flickering fix guide
└── package.json                  # Node.js configuration
```

## Dependencies

### Runtime Dependencies
- **chalk** (4.1.2): Terminal string styling
- **inquirer** (8.2.6): Interactive command line prompts
- **loglevel** (1.9.1): Configurable logging utility

### Player Dependencies
- **Lottie Web** (5.12.2): Animation rendering engine (bundled)

## Troubleshooting

### Common Issues

**Build script fails**
- Verify Node.js version (14+)
- Check file permissions
- Ensure all source files exist

**Player doesn't appear**
- Confirm Lottie library loaded correctly
- Check browser console for errors
- Verify HTML structure integrity

**Animation not loading**
- Validate JSON format
- Check placeholder replacement
- Ensure animation data properly formatted

**Controls not responsive**
- Verify JavaScript enabled
- Check for console errors
- Confirm event listeners attached

## Advanced Configuration

### Debug Mode
Enable verbose logging:
```javascript
log.setLevel('debug');
```

### Custom Paths
Modify `CONFIG` object in `scripts/build.js` for custom deployment locations.

### Template Customization
Edit `src/demo_template.html` to modify player interface, styling, or controls.

## License

MIT License - Commercial use, modification, and distribution permitted with attribution.