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
created: 2025-08-28T16:48:12.567Z
updated: 2025-08-28T16:48:12.567Z
project: jsx
backlinks: 0
forwardLinks: 0
---

I'll analyze the project at /Users/ivg/github/jsx to generate a comprehensive overview. Let me start by exploring the repository structure and key files.Now let me examine the key files to understand the project better:Now let me check the roadmap and project status:Now I'll create the comprehensive overview in markdown format:

---

# JSX Project Overview

**Tags:** #adobe-after-effects #jsx #scripting #cep-extension #motion-graphics #animation-tools #monorepo #react #typescript

## 📋 Project Purpose and Goals

The JSX project is a comprehensive collection of production-ready Adobe After Effects automation tools and extensions designed to streamline motion graphics workflows. The repository serves as a centralized hub for 31+ professional scripts and CEP extensions that enhance After Effects capabilities for animators, motion designers, and video professionals.

### Core Objectives:
- **Automation**: Reduce repetitive tasks in After Effects workflows
- **Efficiency**: Provide one-click solutions for complex animation setups
- **Standardization**: Maintain consistent tooling across motion graphics projects
- **Extensibility**: Enable custom workflow development through modular architecture

## ✨ Key Features and Functionality

### Script Categories (31 Production Scripts)

#### 🎬 **Animation Tools** (3 scripts)
- **PathMaster** (it_follows.jsx): Advanced path-following animations with easing, loops, and marker support
- **Linearizer**: Property linking with sophisticated driver-based interpolation
- **Limb-a-tron**: Complete IK rigging system for character limbs with curvature control

#### 📐 **Composition Management** (4 scripts)
- **Guiderator**: Smart guide creation with built-in calculator support
- **Slidotron**: 4K/vertical slider composition presets for presentations
- **Split-o-matic**: Vertical split-screen templates for mobile content

#### ✨ **Effects & Audio** (4 scripts)
- **ChromaBlenderizer**: Color interpolation across multiple properties
- **sfxMaster**: Centralized audio control with Voice/SFX/Music management
- **StrokeBurst**: Animated stroke effect generator
- **TuneSync**: Audio-to-visual property synchronization

#### 🔑 **Keyframe Manipulation** (3 scripts)
- **KeyDuplicator**: Advanced keyframe duplication with temporal decay
- **keyMate**: Batch keyframe modification with mathematical operations
- **Record_Keyframe_Value**: Value-to-keyframe recording system

#### 📚 **Layer Control** (7 scripts)
- **Rectangulator v2**: The iconic parametric-to-bezier rectangle converter
- **Multi_Parent2**: Advanced multi-parent relationship system
- **TimeRemapController**: Sophisticated time manipulation controls
- **Highlighter**: Text highlighting with animators
- **SubtitlePreset**: Automated subtitle composition generator

#### 🛤️ **Path & Shape Tools** (6 scripts)
- **ControlVertices**: Dynamic vertex control via null objects
- **Distributron**: Layer distribution along shape paths
- **Trace-o-matic**: Mask-to-shape conversion with keyframe preservation
- **Originator**: Shape path origin centering
- **CenterPathGuides**: Guide creation for path bounds and centers

#### 🔧 **Utilities** (4 scripts)
- **celMate**: Onion skinning for shape layers
- **Iterator**: Incremental property changes across layers
- **Randomize_in_Range**: Keyframe randomization within ranges
- **Trimmer**: Automated trim path animation

### CEP Extensions
- **Frame Navigator**: Modern React-based panel for advanced frame navigation and composition management

## 🛠️ Technology Stack

### Core Technologies
- **ExtendScript (ES3)**: Adobe's JavaScript variant for After Effects automation
- **React 18**: Modern UI framework for CEP panel development
- **TypeScript 5**: Type-safe development for panel code
- **Vite 4**: Fast build tooling for modern web development

### Build & Development Tools
- **Yarn Workspaces**: Monorepo package management
- **Rollup**: ES3 transpilation for ExtendScript compatibility
- **Custom Bundler**: Proprietary script optimization system
- **CEF (Chromium Embedded Framework)**: Runtime for CEP extensions

### Supporting Libraries
- **CSInterface**: Adobe's bridge between panel and host contexts
- **loglevel**: Structured logging across environments
- **Model Context Protocol SDK**: AI assistant integration
- **Smithery SDK**: Development tooling integration

## 📁 Project Structure

```
JSX/
├── packages/                      # Monorepo packages
│   ├── ae-scripts/               # After Effects scripts (31 scripts)
│   │   └── src/
│   │       ├── animation/       # Motion and rigging tools
│   │       ├── composition/     # Comp management
│   │       ├── effects/         # Visual effects & audio
│   │       ├── keyframes/       # Keyframe manipulation
│   │       ├── layers/          # Layer utilities
│   │       ├── paths/           # Path and shape tools
│   │       └── utilities/       # General purpose tools
│   └── cep-extensions/
│       └── frame-navigator/      # React-based CEP extension
├── tools/                        # Development tools
│   ├── aegp-test-framework/     # AEGP testing framework
│   ├── bundlers/                # Custom bundling tools
│   ├── scripting-modules/       # Shared JS modules
│   └── templates/               # Project templates
├── docs/                        # Documentation
│   ├── development/             # Development guides
│   ├── housekeeping/           # Project organization
│   └── TOC.md                  # Table of contents
├── dist/                       # Production builds
├── CLAUDE.md                   # AI assistant context
├── README.md                   # Project overview
└── package.json               # Workspace configuration
```

## 🚀 Getting Started Guide

### Prerequisites
- **Adobe After Effects CC 2019+**
- **Node.js 16+**
- **Yarn package manager**
- **macOS or Windows**

### Installation

#### Quick Setup
```bash
# Clone repository
git clone https://github.com/ivg-design/JSX.git
cd JSX

# Install dependencies
yarn install

# For CEP extension development
cd packages/cep-extensions/frame-navigator
yarn dev
```

#### Script Installation
1. Copy desired `.jsx` files to After Effects Scripts folder:
   - **macOS**: `/Applications/Adobe After Effects [version]/Scripts`
   - **Windows**: `C:\Program Files\Adobe\Adobe After Effects [version]\Support Files\Scripts`
2. Restart After Effects
3. Access via `File > Scripts > [Script Name]`

### Development Commands
```bash
# Development
yarn dev              # Start Frame Navigator dev server
yarn build           # Build all packages
yarn clean          # Clean build artifacts

# Code Quality (needs configuration)
yarn lint           # Run linter
yarn format        # Format code
yarn typecheck    # Type checking
```

## 👥 Key Contributors

Based on git history analysis:
- **woozygoozy** (47 commits) - Lead developer
- **ivg-design** (34 commits) - Project maintainer, IVG Design founder
- Active development and maintenance ongoing

## 📄 License Information

**MIT License** - Open source, commercial use permitted

Individual scripts may contain specific attribution in their headers. The project is maintained by IVG Design with contributions from the community.

## 📊 Current Status and Roadmap

### Current Version: 2.0.0 (January 2025)

#### Active Development
- **Frame Navigator**: Primary focus with performance optimizations
- **Rectangulator v2**: Recently modernized with modular architecture
- **Parametric Limb v2**: Production-ready IK rigging system
- **Bug fixes**: Ongoing cursor and input handling improvements

#### Recent Achievements (v2.0.0)
- ✅ Complete monorepo restructuring
- ✅ 31 scripts organized by category
- ✅ Consistent naming convention implementation
- ✅ Comprehensive documentation system
- ✅ GitHub project tracking for all scripts

#### Technical Debt & Improvements Needed
- 🔧 ESLint configuration setup required
- 🔧 Prettier formatting rules needed
- 🔧 Testing framework implementation pending
- 🔧 TypeScript 4→5 migration for some packages
- 🔧 Vite 4→5 upgrade needed
- 🔧 Pre-commit hooks would improve code quality

#### Future Roadmap
- 🎯 Complete test coverage for all scripts
- 🎯 Automated CI/CD pipeline
- 🎯 Enhanced CEP extension capabilities
- 🎯 Cross-platform compatibility improvements
- 🎯 AI-powered script generation tools
- 🎯 Cloud sync for script preferences
- 🎯 Marketplace for community scripts

### Repository Health
- **Branches**: 4 active (main, time-fix-branch, feature branches)
- **Last Commit**: Active development ongoing
- **Issues**: Tracked via GitHub Projects
- **Documentation**: Comprehensive and up-to-date

---

*This repository represents years of After Effects scripting expertise, organized for maximum productivity and reusability. It serves as both a production toolkit and a reference implementation for Adobe ExtendScript development.*


