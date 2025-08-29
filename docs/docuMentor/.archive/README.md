---
title: DocuMentor Documentation
version: 2.0.0
tags: [docuMentor, documentation, tool, self]
---

# DocuMentor - Intelligent Documentation Generator

## 🎯 Overview
DocuMentor is a comprehensive documentation generator that analyzes codebases, verifies functionality, and creates Obsidian-compatible documentation with intelligent tagging and cross-referencing.

## ✨ Features

### Core Features
- **Intelligent Project Analysis**: Automatically detects project types
- **Code Verification**: Validates documented functionality
- **Obsidian Integration**: Full compatibility with backlinks and tags
- **Safety Validation**: Prevents file corruption with backups
- **GitHub Monitoring**: Continuous documentation of commits

### New in v2.0
- **Full Monty Mode**: Comprehensive documentation with quality scores
- **Progress Monitoring**: Real-time progress with interrupt capability
- **Configuration Management**: Auto-generated config with templates
- **Safety Validator**: Protects against file corruption
- **GitHub Monitor**: Tracks and documents repository changes

## 🏗️ Architecture

### Components
- **DocumentationAgent**: Core documentation engine
- **ConfigManager**: Configuration handling with auto-generation
- **AdvancedTerminalUI**: Real-time progress tracking with dashboard
- **SafetyValidator**: File integrity and safety checks
- **GitHubMonitor**: Repository change tracking
- **FullMontyGenerator**: Comprehensive analysis generator
- **ProjectAnalyzer**: Project type detection
- **CodeVerifier**: Functionality validation
- **ObsidianFormatter**: Obsidian-compatible formatting
- **TagManager**: Intelligent tag management

## 📁 Project Structure
```
docuMentor/
├── src/
│   ├── index.ts              # CLI interface
│   ├── DocumentationAgent.ts  # Core agent
│   ├── ConfigManager.ts      # Configuration
│   ├── AdvancedTerminalUI.ts # Terminal dashboard
│   ├── SafetyValidator.ts    # Safety checks
│   ├── GitHubMonitor.ts      # GitHub integration
│   ├── FullMontyGenerator.ts # Comprehensive docs
│   ├── ProjectAnalyzer.ts    # Project analysis
│   ├── CodeVerifier.ts       # Code verification
│   ├── ObsidianFormatter.ts  # Obsidian formatting
│   ├── TagManager.ts         # Tag management
│   └── claudeCodeClient.ts   # Claude SDK client
├── config/
│   └── (auto-generated)
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Commands

### Basic Documentation
```bash
documentor generate [path]      # Generate documentation
documentor verify [path]        # Verify code functionality
documentor analyze [path]       # Analyze project structure
```

### Advanced Features
```bash
documentor full-monty [path]    # Comprehensive documentation
documentor monitor --add owner/repo  # Monitor GitHub repo
documentor config --show        # View configuration
documentor safety --check [path] # Safety validation
documentor self-document        # Document DocuMentor itself
```

## ⚙️ Configuration

Configuration file: `~/.documentor/config.json`

### Key Settings
- **obsidianVaultPath**: Output location for documentation
- **excludePaths**: Paths to exclude from documentation
- **safetyMode**: Backup and validation settings
- **github**: GitHub integration settings
- **monitoring**: Progress and interrupt settings
- **fullMonty**: Comprehensive documentation options

## 🔒 Safety Features

### File Protection
- Automatic backups before writes
- Checksum verification
- Protected path detection
- Sensitive data scanning

### Validation
- JSON/YAML syntax validation
- File size limits
- Directory permission checks
- Content integrity verification

## 📊 Full Monty Mode

Generates comprehensive documentation including:
- Project overview
- Architecture analysis
- API documentation
- Security analysis
- Performance analysis
- Dependency analysis
- Test coverage
- Code metrics
- Changelog generation
- Architecture diagrams

Quality scores provided for:
- Code quality (0-100)
- Documentation coverage (0-100)
- Test coverage (0-100)
- Security score (0-100)

## 🔍 GitHub Monitoring

Continuous monitoring features:
- Automatic commit detection
- Commit analysis and documentation
- File change tracking
- Impact assessment
- Daily summaries

## 🏷️ Tag System

Intelligent tagging with:
- Automatic tag detection
- Tag hierarchy management
- Existing tag reuse
- Tag statistics tracking
- Cross-reference generation

## 📈 Progress Monitoring

Real-time progress with:
- Task tracking
- Interrupt handling (Ctrl+C, ESC)
- Progress persistence
- Auto-save functionality
- Detailed logging

## 🛠️ Development

### Requirements
- Node.js 16+
- Claude Code SDK subscription
- TypeScript 5.0+

### Installation
```bash
git clone ~/github/docuMentor
cd ~/github/docuMentor
npm install
npm run build
npm link
```

### Testing
```bash
documentor generate ./test-project
documentor full-monty ./test-project
```

## 📄 License
MIT

## 🤝 Contributing
Contributions welcome! The project uses:
- TypeScript for type safety
- Claude Code SDK for AI analysis
- Commander for CLI
- Async/await for control flow

---
*Generated by DocuMentor v2.0.0*
