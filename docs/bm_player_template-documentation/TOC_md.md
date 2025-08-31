---
title: TOC
type: documentation
project: bm_player_template
source: /Users/ivg/github/bm_player_template/docs/TOC.md
created: 08-30-2025 22:27:09
modified: 08-30-2025 22:27:09
tags:
  - #bm_player_template
  - #type/documentation
---

I'll analyze the project structure and codebase to generate comprehensive documentation.## Bodymovin Player Template Builder

The Bodymovin Player Template Builder is a comprehensive solution for creating professional Lottie animation players with advanced controls and automated build integration for Adobe After Effects Bodymovin extension.

## Overview

The project provides a fully-featured animation player with sophisticated controls, automated template processing, and seamless deployment to the Bodymovin extension. It bridges the gap between animation creation in After Effects and web deployment, offering designers a polished interface and developers an automated build pipeline.

## System Architecture

### Core Components

The system consists of three main components:

1. **HTML Template** (`src/demo_template.html`) - The interactive player interface with advanced controls
2. **Build System** (`scripts/build.js`) - Automated template processor and deployment tool  
3. **Minified Player** (`lib/minified_bm_player.min.js`) - Optimized Lottie runtime library

### Build Pipeline

The build process transforms the development template into a production-ready player:

1. **Template Processing**
   - Removes external CDN dependencies
   - Injects minified Lottie player directly into HTML
   - Replaces mock animation data with Bodymovin placeholder

2. **Validation**
   - Verifies successful script injection
   - Confirms placeholder insertion
   - Validates CDN removal

3. **Deployment**
   - Creates timestamped backups
   - Deploys to Adobe CEP extensions directory
   - Provides rollback capability on failure

## Player Features

### Playback Controls

The player provides comprehensive playback management:

- **Play/Pause** - Animated SVG icons with smooth state transitions
- **Progress Bar** - Frame-accurate scrubbing with visual feedback
- **Speed Control** - Variable playback from 0.25x to 2x speed
- **Loop/Reverse** - Toggle continuous playback and direction

### Display Modes

Multiple viewing options optimize for different use cases:

- **Standard Mode** - Full control panel with all features
- **Mini Mode** - Compact 50px interface for embedded contexts
- **Frame Counter** - Real-time frame and time display
- **Animation Info** - FPS, duration, and frame count metrics

### Subframe Rendering

Special toggle addresses rendering artifacts:

- Resolves flickering in rounded corner animations
- Fixes unstable path morphing issues
- Provides immediate visual feedback on toggle
- Maintains animation state during switching

## Technical Implementation

### Animation Control

The player uses Lottie's native API for precise control:

```javascript
// Core animation management
animation.play();
animation.pause();
animation.setSpeed(rate);
animation.goToAndStop(frame, isFrame);
animation.setSubframe(enabled);
```

### Event Handling

Responsive interaction through event listeners:

```javascript
// Progress scrubbing
progressSlider.addEventListener('input', (e) => {
    animation.goToAndStop(e.target.value, true);
});

// Speed adjustment
speedSlider.addEventListener('input', (e) => {
    animation.setSpeed(parseFloat(e.target.value));
});
```

### Visual Design

Modern interface with glassmorphism effects:

```css
.control-panel {
    background: rgba(30, 30, 30, 0.8);
    backdrop-filter: blur(20px);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}
```

## Build Configuration

The build system uses configurable paths:

```javascript
const CONFIG = {
    sourceTemplate: 'src/demo_template.html',
    minifiedPlayer: 'lib/minified_bm_player.min.js',
    targetDir: '/Library/Application Support/Adobe/CEP/extensions/bodymovin/assets/player/',
    targetFile: 'demo.html',
    animationPlaceholder: '__[[ANIMATIONDATA]]__'
};
```

## Usage

### Basic Build

Execute the build process:

```bash
yarn build
# or
npm run build
```

### Manual Testing

Open `src/demo_template.html` directly in a browser to test with mock animation data.

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Play/Pause |
| ← → | Frame navigation |
| ↑ ↓ | Speed adjustment |
| M | Mini mode |
| L | Loop toggle |
| R | Reverse toggle |
| S | Subframe toggle |

## Dependencies

The project requires:

- **Node.js** 14.0+ for build tools
- **Yarn/npm** for package management
- **chalk** 4.1.2 - Terminal styling
- **inquirer** 8.2.6 - Interactive prompts
- **loglevel** 1.9.1 - Logging utilities

## File Structure

```
bm_player_template/
├── src/
│   └── demo_template.html       # Player interface template
├── lib/
│   └── minified_bm_player.min.js # Lottie runtime (5.12.2)
├── scripts/
│   └── build.js                  # Build automation script
├── docs/                         # Technical documentation
├── package.json                  # Project configuration
└── README.md                     # Project overview
```

## Browser Compatibility

- **Full Support**: Chrome, Edge, Firefox
- **Partial Support**: Safari (no backdrop-filter)
- **Mobile**: Touch-optimized controls for iOS/Android

## Performance

- Minified player reduces file size by ~60%
- Self-contained HTML eliminates network dependencies
- Configurable subframe rendering for optimization
- Efficient DOM manipulation minimizes reflows