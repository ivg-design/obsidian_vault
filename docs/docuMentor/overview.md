I'll analyze the docuMentor project and generate a comprehensive overview. Let me start by exploring the project structure and understanding its purpose.Now I'll compile the comprehensive project overview:# DocuMentor Project Overview

## 1. Project Purpose and Goals

**DocuMentor** is an intelligent documentation generator designed to automatically analyze codebases and create comprehensive, Obsidian-compatible documentation. The tool aims to:

- **Automate documentation generation** for various project types
- **Verify code functionality** to ensure documented features actually work
- **Integrate seamlessly with Obsidian** for knowledge management
- **Monitor GitHub repositories** for continuous documentation updates
- **Provide safety mechanisms** to prevent file corruption during documentation

## 2. Key Features and Functionality

### Core Features
- **🔍 Intelligent Project Analysis**: Automatically detects project types (monorepo, single-project, multi-tool, library)
- **✅ Code Verification**: Validates that documented functionality actually works
- **🏷️ Smart Tag Management**: Reuses existing Obsidian tags and creates cohesive tag hierarchies
- **🔗 Obsidian Integration**: Generates documentation with backlinks, tags, and metadata
- **📊 Multi-Format Support**: Handles various project structures and languages
- **🚫 Smart Exclusions**: Automatically excludes docuMentor itself and obsidian_vault

### Advanced Features (v2.0)
- **Full Monty Mode**: Comprehensive documentation with quality scores
- **Progress Monitoring**: Real-time progress tracking with interrupt capability
- **Safety Validator**: File integrity checks and automatic backups
- **GitHub Monitor**: Continuous monitoring and documentation of repository changes
- **Configuration Management**: Auto-generated configuration with templates

## 3. Technology Stack

- **Runtime**: Node.js 16+
- **Language**: TypeScript 5.0+
- **AI Integration**: Claude Code SDK (`@anthropic-ai/claude-code`)
- **CLI Framework**: Commander.js
- **Build System**: TypeScript Compiler (tsc)
- **Package Manager**: npm

## 4. Project Structure

```
docuMentor/
├── src/                          # Source code
│   ├── index.ts                  # CLI interface and command definitions
│   ├── DocumentationAgent.ts     # Main documentation orchestrator
│   ├── ProjectAnalyzer.ts        # Project type detection and analysis
│   ├── ObsidianFormatter.ts      # Obsidian-compatible markdown formatting
│   ├── CodeVerifier.ts           # Code functionality verification
│   ├── TagManager.ts             # Intelligent tag management
│   ├── ConfigManager.ts          # Configuration handling
│   ├── ProgressMonitor.ts        # Real-time progress tracking
│   ├── SafetyValidator.ts        # File safety and backup management
│   ├── GitHubMonitor.ts          # GitHub repository monitoring
│   ├── FullMontyGenerator.ts     # Comprehensive documentation generator
│   └── claudeCodeClient.ts       # Claude AI SDK integration
├── dist/                         # Compiled JavaScript output
├── config/                       # Configuration files
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
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

# Link globally (optional)
npm link
```

### Basic Usage

```bash
# Document current directory
documentor generate

# Document specific project
documentor generate ~/projects/my-app

# Skip code verification for faster generation
documentor generate ~/projects/my-app --no-verify

# Generate comprehensive documentation
documentor full-monty ~/projects/my-app
```

### Advanced Commands

```bash
# Monitor GitHub repository
documentor monitor --add owner/repo --start

# Verify code without generating docs
documentor verify ~/projects/my-app

# Manage configuration
documentor config --show
documentor config --validate

# Safety checks
documentor safety --check ~/projects/sensitive
```

## 6. Key Contributors

*Note: Since this is not a git repository, contributor information from git history is not available. The project appears to be a single-author tool based on the package.json configuration.*

## 7. License Information

**License**: MIT

The project is released under the MIT License, allowing for free use, modification, and distribution with attribution.

## 8. Current Status and Roadmap

### Current Version
**v2.0.0** - Major release with comprehensive features

### Current Capabilities
- ✅ Automatic project type detection
- ✅ Code functionality verification
- ✅ Obsidian-compatible formatting
- ✅ GitHub repository monitoring
- ✅ Progress tracking with interrupts
- ✅ Safety validation and backups
- ✅ Comprehensive "Full Monty" mode
- ✅ Self-documentation capability

### Future Enhancements (from README)
- [ ] Watch mode for continuous documentation updates
- [ ] Integration with GitHub Actions
- [ ] Custom documentation templates
- [ ] Multi-language documentation
- [ ] Documentation quality scoring
- [ ] Visual dependency graphs
- [ ] API testing integration

### Output Structure
Documentation is saved to `~/github/obsidian_vault/docs/` by default, creating structured markdown files with:
- Main documentation (README.md)
- Architecture documentation
- API references
- Setup guides
- Contributing guidelines
- Tag indices for cross-referencing

### Configuration
The tool uses a configuration file at `~/.documentor/config.json` with customizable settings for:
- Obsidian vault path
- Excluded paths
- Code verification settings
- Backlink generation
- Tag limits

---

*DocuMentor represents a sophisticated approach to automated documentation, leveraging AI capabilities through the Claude Code SDK to provide intelligent analysis and comprehensive documentation generation for software projects.*