---
id: a588d031
title: Project Overview
tags:
  - overview
  - documentation
  - jsx
  - project-structure
aliases:
  - README
  - Getting Started
  - Project Documentation
created: 2025-08-28T16:15:11.446Z
updated: 2025-08-28T16:15:11.446Z
project: jsx
backlinks: 0
forwardLinks: 0
---

I'll analyze the JSX project and generate a comprehensive overview. Let me start by exploring the project structure and understanding its purpose.Based on my analysis of the JSX project, here's a comprehensive overview formatted for Obsidian:

```markdown
---
tags: [adobe, after-effects, scripting, jsx, cep, plugin-development, motion-graphics, automation, monorepo]
created: 2025-01-28
project-type: development-tools
status: active
---

# JSX - Adobe After Effects Automation Suite

## Project Purpose and Goals

The JSX project is a comprehensive collection of production-ready automation tools for Adobe After Effects, designed to streamline motion graphics workflows and enhance productivity. It serves as a monorepo containing:

- **31+ standalone ExtendScript (.jsx) automation scripts**
- **Modern CEP extensions** with React-based UI
- **Native AEGP plugins** for deeper After Effects integration
- **Shared utility libraries** for consistent functionality

The primary goal is to provide motion designers and animators with powerful tools that eliminate repetitive tasks, enable complex rigging systems, and improve workflow efficiency in After Effects.

## Key Features and Functionality

### 🎯 Core Capabilities

1. **Animation & Rigging**
   - Advanced IK limb rigging system with curvature control
   - Path-following animations with easing and loop controls
   - Property linking with driver-based interpolation

2. **Composition Management**
   - Guide creation with calculation support
   - Preset compositions for various aspect ratios (16:9, 9:16)
   - Split-screen templates for mobile formats

3. **Visual Effects**
   - Color interpolation across properties
   - Centralized audio control system (Voice/SFX/Music)
   - Audio-to-visual property synchronization
   - Animated stroke burst effects

4. **Keyframe Manipulation**
   - Batch keyframe value modification with math operations
   - Temporal decay and easing duplication
   - Current value recording as keyframes

5. **Layer Management**
   - Text highlighting with animators
   - Advanced multi-parent systems
   - Parametric to bezier path conversion
   - Time remapping controls

6. **Path & Shape Tools**
   - Dynamic vertex control via nulls
   - Layer distribution along paths
   - Shape path origin centering
   - Mask to shape layer conversion

### 🌟 Flagship Tools

- **Rectangulator v2** - Iconic parametric rectangle to bezier converter
- **Frame Navigator** - Modern CEP extension for timeline navigation
- **Parametric IK Limb** - Complete character rigging system
- **sfxMaster** - Professional audio management suite

## Technology Stack

### Core Technologies
- **ExtendScript (ES3)** - Adobe's scripting environment
- **JavaScript/TypeScript** - Modern development
- **React 18** - CEP extension UI framework
- **Vite** - Build tooling and development server
- **Node.js** - Package management and tooling

### Development Tools
- **Yarn Workspaces** - Monorepo management
- **Rollup** - ES3 transpilation for ExtendScript
- **CSInterface** - Adobe CEP communication layer
- **Objective-C++** - Native plugin development

### Adobe Integration
- **After Effects CC 2019+** - Target platform
- **CEP (Common Extensibility Platform)** - Extension framework
- **AEGP SDK** - Native plugin development
- **ScriptUI** - Native UI panels

## Project Structure

```
JSX/
├── packages/
│   ├── ae-scripts/              # 31 ExtendScript automation tools
│   │   └── src/
│   │       ├── animation/       # Motion and rigging (3 scripts)
│   │       ├── composition/     # Comp management (4 scripts)
│   │       ├── effects/         # Visual effects (4 scripts)
│   │       ├── keyframes/       # Keyframe tools (3 scripts)
│   │       ├── layers/          # Layer utilities (7 scripts)
│   │       ├── paths/           # Path tools (6 scripts)
│   │       └── utilities/       # General tools (4 scripts)
│   ├── cep-extensions/
│   │   └── frame-navigator/     # React-based timeline navigator
│   └── plugins/
│       └── frame-nav-plus/      # Native AEGP plugin
├── tools/
│   ├── scripting-modules/       # Shared JS libraries
│   ├── bundlers/                # Custom build tools
│   └── templates/               # Project templates
└── docs/                        # Documentation
```

## Getting Started Guide

### Prerequisites
- Adobe After Effects CC 2019 or later
- Node.js 16+ and Yarn package manager
- macOS or Windows operating system

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd jsx

# Install dependencies (MUST use Yarn)
yarn install

# For CEP extension development
cd packages/cep-extensions/frame-navigator
yarn dev
```

### Using Individual Scripts
1. Copy desired `.jsx` files to After Effects Scripts folder:
   - **Windows**: `C:\Program Files\Adobe\Adobe After Effects [version]\Support Files\Scripts`
   - **macOS**: `/Applications/Adobe After Effects [version]/Scripts`
2. Restart After Effects
3. Access via `File > Scripts > [Script Name]`

### Building for Production
```bash
# Build all packages
yarn build

# Build specific extension
cd packages/cep-extensions/frame-navigator
yarn build
yarn zxp  # Package as installer
```

## Key Contributors

Based on git history analysis:
- **woozygoozy** - Primary developer (47 commits)
- **ivg-design / IVG-Design** - Core contributor (34 commits)

Created and maintained by **IVG Design**.

## License Information

**MIT License** - Open source and free to use

Individual scripts may contain specific attribution in their headers.

## Current Status and Roadmap

### ✅ Active Development
- **Frame Navigator** CEP extension - Primary focus
- **fNav+ Plugin** - Native AEGP implementation (v1.0.3.14)
- **Rectangulator v2** - Recently modernized with modular architecture

### 🚧 Maintenance Needed
- ESLint and Prettier configuration setup
- Testing framework implementation (Vitest/Jest)
- Dependency updates (TypeScript 4→5, Vite 4→5)
- Cleanup of test output directories
- Pre-commit hooks setup

### 🎯 Recent Updates (2025)
- Major input handling fixes for fNav+
- Cursor unification and selector improvements
- Persistent state management implementation
- Smart math operations with intelligent detection
- Panel lifecycle management enhancements
- Accurate time conversion for fractional frame rates

### 🔮 Future Enhancements
- Expanded CEP extension catalog
- Enhanced debugging capabilities
- Cross-version compatibility improvements
- Performance optimizations for large compositions

---

*This repository represents years of After Effects scripting expertise, organized for maximum productivity and reusability in professional motion graphics workflows.*
```I've generated a comprehensive overview of the JSX project with all requested sections formatted as clean, structured markdown with Obsidian tags. The overview includes detailed information about the project's purpose, features, technology stack, structure, installation guide, contributors, license, and current development status based on my analysis of the codebase and git history.


