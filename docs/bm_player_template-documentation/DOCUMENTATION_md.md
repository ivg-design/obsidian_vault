---
title: DOCUMENTATION
type: documentation
project: bm_player_template
source: /Users/ivg/github/bm_player_template/DOCUMENTATION.md
created: 08-30-2025 22:13:32
modified: 08-30-2025 22:13:32
tags:
  - #bm_player_template
  - #type/documentation
---

# DOCUMENTATION.md

> ⚠️ **Warning**: Documentation generated without Claude AI. This is basic content extraction only.
> To enable intelligent documentation, set ANTHROPIC_API_KEY environment variable.

Type: documentation
Size: 4365 bytes
Path: /Users/ivg/github/bm_player_template/DOCUMENTATION.md

## Content Preview

# Bodymovin Player Template Documentation

## Overview

The Bodymovin Player Template is a specialized HTML player for Lottie animations exported from Adobe After Effects using the Bodymovin extension. It provides a professional, feature-rich interface for displaying and controlling animations with an automated build system for seamless integration.

## Key Components

### Template System
The project uses a template-based approach where a source HTML file (`src/demo_template.html`) contains the player interface with CDN-linked dependencies. During the build process, these external dependencies are replaced with embedded code to create a self-contained player.

### Build Pipeline
The automated build script (`scripts/build.js`) performs critical transformations:
- Removes external CDN script references
- Embeds the minified Lottie player directly into the HTML
- Replaces mock animation data with a placeholder for Bodymovin integration
- Deploys the processed template to the Adobe CEP extensions directory

### Minified Player
The `lib/minified_bm_player.min.js` contains a pre-minified version of Lottie Web 5.12.2, optimized for direct embedding into HTML templates to eliminate external dependencies.

## Technical Architecture

### Build Process Flow

1. **Verification Phase**
   - Confirms source files exist
   - Checks target directory permissions
   - Validates Adobe CEP extension path

2. **Processing Phase**
   - Strips CDN script tags from template
   - Injects minified player between build markers
   - Replaces animation data with `__[[ANIMATIONDATA]]__` placeholder

3. **Deployment Phase**
   - Creates timestamped backup of existing files
   - Writes processed template to target location
   - Verifies successful replacement

### Configuration

The build system uses a centralized configuration in `scripts/build.js`:

```javascript
const CONFIG = {
  sourceTemplate: 'src/demo_template.html',
  minifiedPlayer: 'lib/minified_bm_player.min.js',
  targetDir: '/Library/Application Support/Adobe/CEP/extensions/bodymovin/assets/player/',
  targetFile: 'demo.html',