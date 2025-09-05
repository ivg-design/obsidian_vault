I'll analyze the project at /Users/ivg/github/docuMentor to generate a comprehensive overview. Let me start by exploring the project structure and key files.# DocuMentor Project Overview

## 1. Project Purpose and Goals

**DocuMentor** is an intelligent documentation generator designed to automate and enhance the documentation process for software projects. Its primary goals are:

- **Automated Documentation Generation**: Analyzes codebases to create comprehensive, structured documentation
- **Code Verification**: Validates that documented functionality actually works before documenting it
- **Obsidian Integration**: Generates documentation fully compatible with Obsidian's knowledge management features (backlinks, tags, metadata)
- **Intelligent Analysis**: Automatically detects project types (monorepo, library, CLI tool, web app) and adapts documentation accordingly
- **Continuous Monitoring**: Tracks GitHub repositories for changes and maintains up-to-date documentation

## 2. Key Features and Functionality

### Core Features
- **Smart Project Analysis**: Detects project structure, dependencies, and architecture patterns
- **Multi-Format Support**: Handles various project types and programming languages
- **Tag Management**: Intelligent tag hierarchy with reuse of existing Obsidian vault tags
- **Safety Validation**: Protects against file corruption with automatic backups
- **Progress Monitoring**: Real-time progress tracking with interrupt capability (Ctrl+C/ESC)
- **GitHub Integration**: Monitors repositories for commits and pull requests

### Advanced Capabilities
- **Full Monty Mode**: Comprehensive documentation with quality scoring (code quality, test coverage, security)
- **Code Verification**: Validates entry points, imports/exports, test suites, and API endpoints
- **Self-Documentation**: Can document itself recursively
- **Configuration Management**: Auto-generated config with sensible defaults
- **Exclusion Intelligence**: Automatically excludes itself and output directories from analysis

## 3. Technology Stack

### Core Technologies
- **Language**: TypeScript (v5.0+)
- **Runtime**: Node.js (v16+)
- **AI Integration**: Claude Code SDK (@anthropic-ai/claude-code)
- **CLI Framework**: Commander.js (v11.0.0)

### Build & Development
- **Compiler**: TypeScript Compiler (tsc)
- **Development Runner**: ts-node
- **Target**: ES2020
- **Module System**: CommonJS

### Key Design Patterns
- **Modular Architecture**: Separate components for each major functionality
- **Event-Driven**: Progress monitoring with event emitters
- **Async/Await**: Modern asynchronous control flow
- **Configuration-First**: Extensive configuration options with defaults

## 4. Project Structure

```
docuMentor/
├── src/                          # Source code
│   ├── index.ts                 # CLI entry point and command definitions
│   ├── DocumentationAgent.ts    # Core documentation orchestrator
│   ├── ProjectAnalyzer.ts       # Project type detection and analysis
│   ├── CodeVerifier.ts          # Code functionality validation
│   ├── ObsidianFormatter.ts     # Obsidian-compatible markdown generation
│   ├── TagManager.ts            # Tag hierarchy and management
│   ├── ConfigManager.ts         # Configuration handling
│   ├── SafetyValidator.ts       # File safety and backup management
│   ├── ProgressMonitor.ts       # Real-time progress tracking
│   ├── GitHubMonitor.ts         # GitHub repository monitoring
│   ├── FullMontyGenerator.ts    # Comprehensive documentation mode
│   └── claudeCodeClient.ts      # Claude AI SDK client wrapper
├── config/                       # Configuration directory (auto-generated)
├── dist/                        # Compiled JavaScript output
├── package.json                 # Project metadata and dependencies
├── tsconfig.json               # TypeScript configuration
├── README.md                   # User documentation
└── GITHUB_SETUP.md            # GitHub integration guide
```

## 5. Getting Started Guide

### Installation
```bash
# Clone the repository
git clone ~/github/docuMentor
cd ~/github/docuMentor

# Install dependencies
npm install

# Build the project
npm run build

# Link globally for CLI access
npm link
```

### Basic Usage
```bash
# Document current directory
documentor generate

# Document specific project
documentor generate ~/projects/my-app

# Skip verification for faster generation
documentor generate ~/projects/my-app --no-verify

# Comprehensive documentation
documentor full-monty ~/projects/my-app
```

### Configuration
```bash
# View current configuration
documentor config --show

# Set default target path
documentor config --set-path ~/projects

# Set Obsidian vault location
documentor config --set-vault ~/obsidian/docs
```

### GitHub Monitoring
```bash
# Add repository to monitor
documentor monitor --add owner/repo

# Start monitoring
documentor monitor --start --interval 5
```

## 6. Key Contributors

Since this is not a git repository, contributor information is not available from git history. The project appears to be a standalone development tool without version control tracking at this location.

## 7. License Information

**License**: MIT

The project is distributed under the MIT License, as specified in package.json:22. This allows for:
- Commercial use
- Modification
- Distribution
- Private use

## 8. Current Status and Roadmap

### Current Version
**v2.0.0** - Major release with significant enhancements

### Current Capabilities
✅ Automatic project type detection  
✅ Code functionality verification  
✅ Obsidian-compatible formatting  
✅ GitHub repository monitoring  
✅ Progress tracking with interrupts  
✅ Safety validation and backups  
✅ Comprehensive "Full Monty" mode  
✅ Self-documentation capability  

### Future Enhancements (from README)
- [ ] Watch mode for continuous documentation updates
- [ ] Integration with GitHub Actions
- [ ] Custom documentation templates
- [ ] Multi-language documentation
- [ ] Documentation quality scoring
- [ ] Visual dependency graphs
- [ ] API testing integration

### Project Maturity
The project appears to be in active development with a well-structured codebase, comprehensive feature set, and clear documentation. The v2.0.0 version indicates a mature, production-ready tool with significant real-world usage considerations built in (safety features, progress monitoring, configuration management).