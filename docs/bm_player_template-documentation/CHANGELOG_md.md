---
title: CHANGELOG
type: changelog
project: bm_player_template
source: /Users/ivg/github/bm_player_template/CHANGELOG.md
created: 08-30-2025 22:24:44
modified: 08-30-2025 22:24:44
tags:
  - #bm_player_template
  - #type/changelog
---

I'll analyze the project structure and recent commits to generate a comprehensive changelog.# Changelog

All notable changes to the Bodymovin Player Template Builder project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-13

### Added
#### Subframe Rendering Toggle (2025-08-13)
- Toggle button in playback controls panel to enable/disable subframe rendering
- Visual feedback with active/inactive button states (purple gradient when active)
- Auto-reset animation to frame 0 when toggled for immediate effect preview
- Comprehensive documentation for the feature in `docs/subframe-rendering.md`
- Improved error handling in build script
- Workaround for rounded corner flickering issues in Lottie animations, particularly those with animated paths exported from After Effects

#### Project Reorganization (2025-08-13)
- MIT License file for open-source distribution
- Organized folder structure:
  - `src/` for source templates
  - `lib/` for minified player library  
  - `scripts/` for build scripts
  - `docs/` for documentation
  - `dist/` for output files
- Comprehensive documentation suite:
  - `CHANGELOG.md` with semantic versioning
  - `docs/TOC.md` for documentation index
  - `docs/build-process.md` for build details
  - `docs/player-controls.md` for feature guide
- Enhanced README with features showcase and project structure
- Updated package.json with correct paths and author information
- GitHub issues tracking for project progress

#### Initial Release (2025-08-13)
- Play/pause/stop/restart controls for animation playback
- Mini mode and collapse functionality for space-efficient embedding
- Progress bar with drag support for frame-accurate scrubbing
- Multiple unit displays (percentage, time, frames)
- Speed control (0.25x to 2x) and zoom controls
- Background color picker for customization
- Jump to position functionality
- Loop modes (none, loop, pingpong)
- Responsive design with blur effects
- Automated build system for Bodymovin integration
- Self-contained HTML template with embedded Lottie player

### Changed
- Build script paths updated to work with new folder structure
- Replaced old `index.html` with `demo_template.html` naming convention

### Fixed
- Animation flickering issues with rounded corners through subframe rendering toggle

## Links
- [Project Repository](https://github.com/ivg-design/bm_player_template)
- [Documentation Index](docs/TOC.md)
- [Build Process Guide](docs/build-process.md)
- [Player Controls Reference](docs/player-controls.md)
- [Subframe Rendering Guide](docs/subframe-rendering.md)