---
title: Build process
type: documentation
project: bm_player_template
source: /Users/ivg/github/bm_player_template/docs/build-process.md
created: 08-30-2025 22:13:47
modified: 08-30-2025 22:13:47
tags:
  - #bm_player_template
  - #type/documentation
---

# build-process.md

> ⚠️ **Warning**: Documentation generated without Claude AI. This is basic content extraction only.
> To enable intelligent documentation, set ANTHROPIC_API_KEY environment variable.

Type: documentation
Size: 1987 bytes
Path: /Users/ivg/github/bm_player_template/docs/build-process.md

## Content Preview

# Build Process Documentation

## Overview

The build process transforms the demo template into a production-ready file for the Bodymovin extension.

## Build Steps

### 1. File Verification
The build script first verifies that all required files exist:
- `src/demo_template.html` - Source template
- `lib/minified_bm_player.min.js` - Minified Lottie player

### 2. Template Processing

#### Remove CDN Scripts
The script removes external CDN references:
```html
<!-- Before -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>

<!-- After -->
<!-- CDN script removed -->
```

#### Inject Minified Player
The minified player is injected after the `<body>` tag:
```html
<body>
<!-- build:scripto -->
<script>
  // Minified Lottie player code
</script>
<!-- endbuild -->
```

#### Replace Animation Data
Mock data is replaced with a placeholder:
```javascript
// Before
var animationData = { /* mock JSON data */ };

// After
var animationData = "__[[ANIMATIONDATA]]__";
```

### 3. Deployment

The processed file is deployed to:
```