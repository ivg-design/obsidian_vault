---
project: "bm_player_template"
project_tag: "#project/bm_player_template"
title: "C H A N G E L O G"
type: "docs"
status: "warning"
created: 08-30-2025 20:46:42
modified: 08-30-2025 20:49:20
source_files:
  - "/Users/ivg/github/bm_player_template/CHANGELOG.md"
related: []
description: "---
project: "bm_player_template"
project_tag: "#project/bm_player_template"
title: "C H A N G E L O G"
type: "docs"
status: "complete"
created: 08-30-2025 20:46:42
modified: 08-30-2025 20:46:42
sourc. Related to 3 other documents."
---

---
project: "bm_player_template"
project_tag: "#project/bm_player_template"
title: "C H A N G E L O G"
type: "docs"
status: "complete"
created: 08-30-2025 20:46:42
modified: 08-30-2025 20:46:42
source_files:
  - "/Users/ivg/github/bm_player_template/CHANGELOG.md"
related:
  - "R E A D M E"
  - "Package"
description: "Bodymovin Player Template Builder Changelog

Overview

The Bodymovin Player Template Builder maintains a comprehensive changelog documenting all notable changes, improvements, and fixes."
---

# Bodymovin Player Template Builder Changelog

## Overview

The Bodymovin Player Template Builder maintains a comprehensive changelog documenting all notable changes, improvements, and fixes. This project follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Latest Updates (Unreleased)

### New Features

The project now includes proper licensing with an MIT License file and features a reorganized structure with dedicated folders for better maintainability. A significant enhancement addresses the rounded corner flickering issue in Lottie animations through a new subframe rendering toggle button. This feature provides visual feedback for toggle state (active/inactive) and automatically resets the animation when toggled to immediately demonstrate the effect.

### Structural Improvements

The project structure has been reorganized for clarity:
- Source templates moved to `src/` directory
- Minified player relocated to `lib/` directory  
- Build scripts placed in `scripts/` directory
- Output files now generated in `dist/` directory
- All paths and documentation updated to reflect the new structure

### Bug Fixes

The flickering issue with rounded corners in Lottie animations has been resolved through a workaround that allows users to disable subframe rendering when needed.

## Version 0.2.0 (2025-08-13)

### Enhanced Player Controls

This release introduced a comprehensive suite of advanced Lottie animation player controls:

- **Playback Controls**: Play/pause functionality with animated SVG icons
- **Progress Management**: Custom-styled progress bar with slider controls
- **Speed Control**: Adjustable playback speed from 0.25x to 2x
- **Display Options**: Frame counter display and loop toggle functionality
- **Reverse Playback**: Option to play animations in reverse
- **UI Modes**: Mini mode for compact display when space is limited

### Visual Enhancements

The interface received significant styling improvements:
- Frosted glass effect on slider thumbs for modern aesthetic
- Color-coded unit selector buttons for better usability
- Styled info panel displaying animation metrics
- Dark theme with consistent color scheme throughout
- Smooth 0.5s ease transitions across all UI elements

### Technical Fixes

Several rendering issues were addressed:
- Removed all currentColor references that caused color inheritance problems
- Fixed nested SVG structure in unit selector
- Corrected progress bar height display in mini mode
- Ensured consistent icon colors across the entire UI

## Version 0.1.0 (2025-08-13)

### Initial Release

The first release established the foundation of the Bodymovin Player Template Builder:

**Core Features**:
- Build script for template processing
- Demo template HTML with CDN-linked Lottie player
- Minified Lottie player for injection
- Automated deployment to Adobe CEP extensions directory
- Backup creation for existing files

**Project Setup**:
- Package.json configuration with yarn support
- Comprehensive README documentation
- .gitignore configuration
- Node.js 14+ compatibility

**Technical Implementation**:
- Build script automatically removes CDN script tags and injects minified player
- Replaces mock animation data with `__[[ANIMATIONDATA]]__` placeholder for dynamic content
- Full support for yarn package manager

## Version History

The project maintains version comparisons at:
- [Unreleased changes](https://github.com/ivg-design/bm_player_template/compare/v0.2.0...HEAD)
- [Version 0.2.0](https://github.com/ivg-design/bm_player_template/compare/v0.1.0...v0.2.0)
- [Version 0.1.0](https://github.com/ivg-design/bm_player_template/releases/tag/v0.1.0)

---
## Tags
#project/bm_player_template
#type/documentation
#auto/generated

---
Source: `/Users/ivg/github/bm_player_template/CHANGELOG.md`
Generated: 2025-08-31 by DocuMentor v3.1

## Related Documents

[[README]]
[[build]]