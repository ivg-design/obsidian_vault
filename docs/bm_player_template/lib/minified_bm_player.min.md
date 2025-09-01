# Documentation for minified_bm_player.min.js

## Overview

This is a minified version of the Lottie animation player (version 5.12.0), a powerful JavaScript library that renders After Effects animations in real-time on web browsers. The library supports rendering animations exported from Adobe After Effects via the Bodymovin plugin in multiple formats including SVG, Canvas, and HTML.

## Core Components

### Animation Manager

The animation manager is the central controller for all Lottie animations on a page.

#### Key Methods

##### `lottie.loadAnimation(params)`
Loads and initializes a new animation instance.

**Parameters:**
- `params` (Object): Configuration object
  - `container` (Element): DOM element to render animation
  - `renderer` (String): 'svg', 'canvas', or 'html'
  - `loop` (Boolean): Whether animation should loop
  - `autoplay` (Boolean): Start playing immediately
  - `path` (String): Path to JSON animation data
  - `animationData` (Object): Inline animation data
  - `name` (String): Animation name for reference

**Returns:** AnimationItem instance

**Example:**
```javascript
const animation = lottie.loadAnimation({
  container: document.getElementById('animation-container'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'data/animation.json'
});
```

### Class: AnimationItem

Represents a single animation instance.

#### Methods

##### `play(name)`
Plays the animation.
- `name` (String, optional): Target specific animation by name

##### `pause(name)`
Pauses the animation.
- `name` (String, optional): Target specific animation by name

##### `stop(name)`
Stops and resets the animation.
- `name` (String, optional): Target specific animation by name

##### `setSpeed(speed)`
Sets playback speed.
- `speed` (Number): Speed multiplier (1 = normal, 2 = double speed)

##### `setDirection(direction)`
Sets playback direction.
- `direction` (Number): 1 for forward, -1 for reverse

##### `goToAndPlay(value, isFrame)`
Jumps to specific time/frame and plays.
- `value` (Number): Time in seconds or frame number
- `isFrame` (Boolean): True if value is frame number

##### `goToAndStop(value, isFrame)`
Jumps to specific time/frame and stops.
- `value` (Number): Time in seconds or frame number
- `isFrame` (Boolean): True if value is frame number

##### `destroy()`
Destroys the animation and cleans up resources.

##### `resize()`
Updates animation size when container dimensions change.

### Renderer Types

#### SVGRenderer
Renders animations using SVG elements. Best for:
- Scalable animations
- Complex vector graphics
- Small to medium file sizes

#### CanvasRenderer
Renders animations using HTML5 Canvas. Best for:
- Better performance with many animated elements
- Pixel-perfect rendering
- Mobile devices

#### HybridRenderer
Combines SVG and HTML rendering. Best for:
- Mixed content types
- Optimal performance across different elements

## Event System

The library provides comprehensive event handling:

### Available Events

- `complete`: Animation completes one full cycle
- `loopComplete`: Loop iteration completes
- `enterFrame`: New frame is entered
- `segmentStart`: Segment playback starts
- `data_ready`: Animation data loaded successfully
- `DOMLoaded`: Animation added to DOM
- `destroy`: Animation instance destroyed
- `error`: Error occurred during loading/playback

**Example:**
```javascript
animation.addEventListener('complete', () => {
  console.log('Animation completed');
});

animation.addEventListener('loopComplete', (e) => {
  console.log('Loop', e.currentLoop, 'of', e.totalLoops);
});
```

## Shape Modifiers

Built-in shape modifiers for dynamic effects:

- **TrimModifier** (`tm`): Trim paths
- **RoundCornersModifier** (`rd`): Round sharp corners
- **RepeaterModifier** (`rp`): Repeat shapes
- **ZigZagModifier** (`zz`): Create zigzag effects
- **OffsetPathModifier** (`op`): Offset path positions
- **PuckerAndBloatModifier** (`pb`): Pucker/bloat shapes

## Expression Engine

Supports After Effects expressions for dynamic animations:

```javascript
// Expression functions available:
- loopIn(type, duration)
- loopOut(type, duration)
- wiggle(frequency, amplitude)
- random(min, max)
- linear(t, tMin, tMax, value1, value2)
- ease(t, t1, t2, value1, value2)
- nearestKey(time)
- velocityAtTime(time)
```

## Usage Examples

### Basic Animation Loading
```javascript
// Load from external JSON
const animation = lottie.loadAnimation({
  container: document.getElementById('lottie-container'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'animations/data.json'
});
```

### Inline Animation Data
```javascript
// Load with inline data
const animation = lottie.loadAnimation({
  container: document.getElementById('container'),
  renderer: 'canvas',
  loop: false,
  autoplay: false,
  animationData: animationJSON // Your animation data object
});
```

### Playback Control
```javascript
// Control playback
animation.play();
animation.pause();
animation.stop();

// Speed control
animation.setSpeed(2); // 2x speed
animation.setDirection(-1); // Reverse

// Seek to specific point
animation.goToAndStop(30, true); // Go to frame 30
animation.goToAndStop(2.5, false); // Go to 2.5 seconds
```

### Responsive Animation
```javascript
// Handle resize
window.addEventListener('resize', () => {
  animation.resize();
});

// Update on container change
const observer = new ResizeObserver(() => {
  animation.resize();
});
observer.observe(container);
```

### Advanced Event Handling
```javascript
// Track playback progress
animation.addEventListener('enterFrame', (e) => {
  const progress = (e.currentTime / e.totalTime) * 100;
  console.log(`Progress: ${progress.toFixed(2)}%`);
});

// Segment playback
animation.playSegments([0, 30], true); // Play frames 0-30
animation.playSegments([[0, 30], [60, 90]], true); // Play multiple segments
```

## Global Configuration

### Setting Defaults
```javascript
// Set global settings
lottie.setQuality('high'); // 'high', 'medium', 'low'
lottie.setLocationHref(location.href); // Set base URL
lottie.freeze(); // Pause all animations
lottie.unfreeze(); // Resume all animations
```

### Search and Auto-load
```javascript
// Auto-load animations with specific attributes
lottie.searchAnimations(); // Searches for elements with class 'lottie'
```

## Performance Optimization

### Best Practices
1. Use appropriate renderer for content type
2. Limit simultaneous animations
3. Destroy animations when not needed
4. Use segments for partial playback
5. Optimize JSON file size

### Memory Management
```javascript
// Proper cleanup
animation.destroy();
animation = null;

// Destroy all animations
lottie.destroy();
```

## Dependencies

### Browser Requirements
- Modern browsers with ES5+ support
- SVG rendering capability (for SVG renderer)
- Canvas API support (for Canvas renderer)
- RequestAnimationFrame API

### Optional Dependencies
- **Howler.js**: For audio support in animations
- **Web Workers**: For background processing (when enabled)

## Browser Compatibility

- Chrome 49+
- Firefox 52+
- Safari 10+
- Edge 16+
- iOS Safari 10+
- Android Browser 5+

## Common Use Cases

### Loader Animation
```javascript
const loader = lottie.loadAnimation({
  container: document.querySelector('.loader'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'loader.json'
});

// Hide when content loads
window.addEventListener('load', () => {
  loader.destroy();
  document.querySelector('.loader').remove();
});
```

### Interactive Animation
```javascript
const interactive = lottie.loadAnimation({
  container: document.getElementById('interactive'),
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: 'interactive.json'
});

// Play on hover
container.addEventListener('mouseenter', () => {
  interactive.play();
});

container.addEventListener('mouseleave', () => {
  interactive.pause();
});
```

### Scroll-based Animation
```javascript
const scrollAnimation = lottie.loadAnimation({
  container: document.getElementById('scroll-animation'),
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: 'scroll.json'
});

window.addEventListener('scroll', () => {
  const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  const frame = Math.floor(scrollPercent * scrollAnimation.totalFrames);
  scrollAnimation.goToAndStop(frame, true);
});
```

## Error Handling

```javascript
animation.addEventListener('error', (e) => {
  console.error('Animation error:', e);
  // Fallback behavior
});

animation.addEventListener('data_failed', () => {
  console.error('Failed to load animation data');
  // Show fallback content
});
```

## Notes

- This is a production-ready minified build
- For development, use the unminified version for better debugging
- The library automatically handles retina displays
- Supports text animations with font loading
- Includes mask and matte support
- Provides expression evaluation for dynamic animations