---
title: demo_template.html
type: documentation
generated: 2025-09-01
generator: DocuMentor
tags: []
---

# Lottie Animation Player - Technical Documentation

## Overview

### Purpose and Functionality
This HTML file implements a comprehensive, standalone Lottie animation player with an advanced control interface. It provides professional-grade playback controls, visual customization options, and detailed animation metrics display for viewing and analyzing Lottie (Bodymovin) animations.

### Problem It Solves
- Provides a feature-rich preview environment for Lottie animations
- Enables precise frame-by-frame control and analysis
- Offers customization options for presentation and testing
- Delivers real-time animation metrics and performance data

### System Integration
This template serves as a demo/preview component that can be embedded into larger animation workflows, likely used for:
- Animation preview during development
- Client presentation and review
- Quality assurance testing
- Animation debugging and optimization

## Core Components

### 1. Animation Container
```html
<div id="lottie-container">
  <div id="lottie"></div>
</div>
```
- **Purpose**: Houses the Lottie animation SVG/Canvas renderer
- **Features**: Supports zoom and position transformations
- **Styling**: Centered display with transform-origin for scaling

### 2. Control Panel System

#### Main Control Panel
```javascript
class ControlPanel {
  // States
  - collapsed: boolean    // Panel minimized to button only
  - mini: boolean        // Compact mode with reduced controls
  
  // Sections
  - Position Display     // Real-time position tracking
  - Animation Info       // Duration, frames, FPS, dimensions
  - Playback Controls    // Play, pause, stop, restart
  - Progress Bar         // Seekable timeline
  - Settings Panel       // Speed, zoom, background, position
}
```

#### Control Panel Modes
1. **Full Mode**: All controls visible and expanded
2. **Mini Mode**: Compact layout with hidden secondary controls
3. **Collapsed Mode**: Single expand button only

### 3. Animation Control Functions

#### Playback Control
```javascript
function togglePlay()
// Toggles between play and pause states
// Updates: isPlaying flag, button appearance
// Side effects: Triggers animation play/pause

function stop()
// Stops animation and resets to frame 0
// Updates: isPlaying, isStopped flags
// Side effects: Resets progress bar

function restart()
// Resets to frame 0 and starts playing
// Updates: isPlaying, isStopped flags
// Side effects: Immediate playback from start
```

#### Progress Management
```javascript
function updateProgress()
// Called on each animation frame
// Updates: Progress bar, position displays, time counters
// Handles: Pingpong mode direction changes
// Returns: void

function seekToPosition(event)
// Seeks to specific frame based on mouse position
// Parameters: MouseEvent with clientX position
// Calculates: Frame from percentage of progress bar
```

### 4. Display Modes

#### Progress Display Modes
```javascript
progressMode: 'percent' | 'time' | 'frame'

// Percent Mode
- Main: "XX.X%" (padded to 6 chars)
- Sub1: Time format (mm:ss:ff)
- Sub2: Frame number (6-digit)

// Time Mode  
- Main: "mm:ss:ff" format
- Sub1: Percentage
- Sub2: Frame number

// Frame Mode
- Main: 6-digit frame counter
- Sub1: Percentage  
- Sub2: Time format
```

### 5. Loop Modes

```javascript
loopMode: 'loop' | 'none' | 'pingpong'

// Loop: Standard infinite loop
// None: Play once and stop
// Pingpong: Alternate forward/backward playback
```

## API Documentation

### Public Functions

#### Animation Control

```javascript
togglePlay()
// Toggles playback state
// No parameters
// Returns: void
// Updates global: isPlaying, updatePlayPauseButton()

stop()
// Stops animation completely
// No parameters
// Returns: void
// Updates global: isPlaying, isStopped

restart()
// Restarts from beginning
// No parameters
// Returns: void
// Side effect: Immediate playback

toggleSubframe()
// Toggles subframe rendering for smoother animation
// No parameters
// Returns: void
// Updates: Lottie subframe setting
```

#### Navigation

```javascript
jumpTo()
// Jump to specific position
// Input formats:
//   - "50%" - Percentage
//   - "01:30" - Time (mm:ss)
//   - "01:30:15" - Time with frames (mm:ss:ff)
//   - "120" - Frame number
// Returns: void

seekToPosition(event: MouseEvent)
// Seek based on mouse position
// Parameters: MouseEvent from progress bar
// Returns: void
```

#### Settings

```javascript
updateSpeed(value: number)
// Parameters: value (0.25 - 2.0, step 0.25)
// Returns: void
// Updates: Animation playback speed

updateZoom(value: number)
// Parameters: value (0 - 300, percentage)
// Returns: void
// Updates: Container scale transform

updateBackground(color: string)
// Parameters: color (hex color value)
// Returns: void
// Updates: Body background color
```

#### UI Controls

```javascript
togglePanel()
// Toggle control panel collapsed state
// No parameters
// Returns: void

toggleMiniMode()
// Toggle between full and mini control layouts
// No parameters
// Returns: void

toggleLoopMode()
// Cycle through loop modes: loop → none → pingpong
// No parameters
// Returns: void
```

## Usage Examples

### Basic Implementation
```html
<!-- Include Lottie library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"></script>

<!-- Animation will be injected here -->
<script>
var animationData = {
  // Your Lottie JSON data
};
</script>
```

### Keyboard Shortcuts
```javascript
// Space - Play/Pause
// R - Restart
// S - Stop
// L - Toggle loop mode
// Escape - Toggle panel visibility
```

### Jump Navigation Examples
```javascript
// Jump to 50% progress
document.getElementById('jumpInput').value = '50%';
jumpTo();

// Jump to 1 minute 30 seconds
document.getElementById('jumpInput').value = '01:30';
jumpTo();

// Jump to frame 120
document.getElementById('jumpInput').value = '120';
jumpTo();
```

## Dependencies

### External Libraries
- **Lottie Web** (v5.12.2): Core animation rendering engine
  - CDN: `https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js`
  - Required for all animation functionality

### Browser Requirements
- Modern browser with ES6 support
- CSS Grid and Flexbox support
- RequestAnimationFrame API
- Backdrop-filter support (optional, for blur effects)

### Internal Dependencies
- Requires valid Lottie JSON animation data in `animationData` variable
- No other internal file dependencies

## Implementation Notes

### Performance Considerations
1. **Frame Updates**: Uses `requestAnimationFrame` for smooth progress updates
2. **Subframe Rendering**: Optional toggle for smoother animations at cost of performance
3. **Transform Caching**: CSS transforms used for zoom/position for GPU acceleration
4. **Event Throttling**: Mouse events use `requestAnimationFrame` to prevent excessive updates

### Known Limitations
1. **Mock Data**: Currently includes placeholder animation data that should be replaced
2. **Single Animation**: Designed for one animation at a time
3. **Browser Compatibility**: Backdrop-filter may not work in all browsers
4. **Mobile Support**: Optimized for desktop, limited touch support

### Edge Cases
1. **Zero Duration**: Handles animations with single frame gracefully
2. **High Frame Rate**: Supports variable frame rates up to 60fps+
3. **Large Animations**: May experience performance issues with complex animations
4. **Rapid Seeking**: Prevents animation tearing during fast scrubbing

### Architecture Decisions
1. **Vanilla JavaScript**: No framework dependencies for maximum portability
2. **Inline Styles**: All CSS contained within file for single-file distribution
3. **Global State**: Uses module-level variables for simplicity over class structure
4. **Event-Driven**: Updates triggered by animation frames and user events


---

[[README|← Back to Index]]