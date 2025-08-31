---
title: TOC
type: documentation
project: bm_player_template
source: /Users/ivg/github/bm_player_template/docs/TOC.md
created: 08-31-2025 06:03:44
modified: 08-31-2025 06:03:44
tags:
  - #bm_player_template
  - #type/documentation
---

I need to analyze the codebase to generate comprehensive documentation. Let me examine the project structure and key files.# DocuMentor Documentation

## Overview

DocuMentor is an intelligent documentation generator powered by Claude AI that creates comprehensive, well-structured documentation for software projects with seamless Obsidian integration. The system employs a sophisticated 9-phase documentation pipeline to ensure thorough analysis and high-quality output.

## Architecture

### Core System Design

The system follows a modular architecture with clear separation of concerns:

- **Command Layer** - CLI commands for user interaction
- **Core Engine** - DocumentEngine orchestrates the 9-phase pipeline
- **Processing Components** - Individual modules for specific tasks
- **Output Management** - File writing and formatting systems
- **Integration Layer** - Obsidian and external tool integrations

### 9-Phase Documentation Pipeline

The documentation generation process follows nine distinct phases:

1. **Analysis Phase** - Deep project structure analysis and file discovery
2. **Security Validation** - Vulnerability scanning and dependency validation  
3. **Generation Phase** - AI-powered documentation creation using Claude
4. **Enhancement Phase** - Content refinement and formatting
5. **Obsidian Integration** - Vault structure and frontmatter generation
6. **Tag Optimization** - Hierarchical tag creation and organization
7. **Backlink Generation** - Cross-reference and relationship mapping
8. **Verification Phase** - Quality checks and validation
9. **Save Phase** - Final assembly and output generation

### Core Components

#### DocumentEngine (`src/core/DocumentEngine.ts`)

The main orchestrator that manages the entire documentation generation process. Coordinates all phases, manages state, and handles error recovery.

Key responsibilities:
- Phase execution management
- Project analysis coordination
- Document generation orchestration
- Error handling and recovery
- Lock file management

#### ClaudeClient (`src/core/ClaudeClient.ts`)

Integrates with Claude AI API for intelligent documentation generation. Handles API communication, rate limiting, and response processing.

#### DocGenerator (`src/core/DocGenerator.ts`)

Generates documentation content using Claude AI. Processes source files and creates comprehensive documentation with proper formatting.

#### ObsidianIntegration (`src/core/ObsidianIntegration.ts`)

Manages Obsidian-specific features including:
- Frontmatter generation with YAML formatting
- Tag hierarchy creation
- Backlink relationship mapping
- Vault structure organization

#### FileScanner (`src/core/FileScanner.ts`)

Discovers and categorizes project files. Respects gitignore patterns and filters non-documentable files.

#### ProjectAnalyzer (`src/core/ProjectAnalyzer.ts`)

Analyzes project structure, dependencies, and architecture. Detects project type and extracts metadata.

#### PhaseManager (`src/core/PhaseManager.ts`)

Manages the 9-phase pipeline execution. Tracks progress, handles phase transitions, and reports status.

#### TUIAdapter (`src/core/TUIAdapter.ts`)

Provides terminal user interface for real-time progress display. Integrates with the Go-based TUI for enhanced visualization.

### Efficient Processing Mode

DocuMentor includes an experimental efficient processing mode that provides significant performance improvements:

#### DocumentProcessor (`src/core/efficient/DocumentProcessor.ts`)

Orchestrates parallel document processing with sequential output. Uses worker threads for concurrent processing while maintaining output order.

Features:
- Parallel processing with 4 concurrent workers
- Queue-based task distribution
- Real-time progress reporting
- Error isolation and recovery

#### Supporting Components

- **DocumentQueue** - Thread-safe queue for document processing
- **DocumentPipeline** - Processes individual documents through all phases
- **OutputManager** - Manages sequential writing of processed documents
- **ProgressReporter** - Real-time progress tracking and reporting
- **SimpleFileScanner** - Fast, lightweight file discovery

## CLI Commands

### generate

Generates comprehensive documentation for a project.

```bash
documentor generate <project-path> [options]
```

Options:
- `-o, --output <path>` - Output directory (overrides config)
- `-f, --format <format>` - Output format: obsidian|markdown
- `-v, --verbose` - Verbose output
- `--no-permission` - Skip password prompts

### config

Manages DocuMentor configuration.

```bash
documentor config init    # Initialize configuration
documentor config show    # Display current configuration
documentor config edit    # Edit configuration file
```

### watch

Monitors project for changes and auto-generates documentation.

```bash
documentor watch <project-path> [options]
```

Options:
- `--interval <seconds>` - Check interval (default: 5)

### github-watch

Monitors GitHub repositories for changes.

```bash
documentor github-watch --repo <username/repository> [options]
```

Options:
- `--interval <seconds>` - Poll interval (default: 60)

### verify

Verifies existing documentation quality.

```bash
documentor verify <docs-path>
```

### self-document

Generates documentation for DocuMentor itself.

```bash
documentor self-document
```

## Configuration

DocuMentor uses a JSON configuration file (`.documentor.config.json`) with extensive customization options.

### Configuration Structure

```json
{
  "version": "3.1.0",
  "project": {
    "name": "auto-detect",
    "type": "auto"
  },
  "output": {
    "path": "~/Documents/documentation",
    "format": "obsidian",
    "features": {
      "frontmatter": true,
      "backlinks": true,
      "tags": {
        "optimize": true,
        "hierarchy": true,
        "minPerDoc": 3
      }
    }
  },
  "claude": {
    "model": "claude-opus-4-1-20250805",
    "maxTokens": 200000,
    "temperature": 0.3
  }
}
```

### Key Configuration Options

- **project.name** - Project identifier (auto-detect uses directory name)
- **project.type** - Detection mode (auto|manual)
- **output.path** - Documentation output directory
- **output.format** - Output format (obsidian|markdown)
- **output.features** - Enable/disable specific features
- **claude.model** - Claude AI model selection
- **claude.maxTokens** - Maximum token limit for generation
- **claude.temperature** - AI creativity level (0.0-1.0)

## File Support

### Source Code
- TypeScript/JavaScript (`.ts`, `.tsx`, `.js`, `.jsx`)
- Python (`.py`)
- Go (`.go`)
- Rust (`.rs`)
- Java (`.java`)

### Documentation
- Markdown (`.md`)
- README files
- CHANGELOG files
- Configuration files

### Project Files
- `package.json` (Node.js)
- `Cargo.toml` (Rust)
- `go.mod` (Go)
- `requirements.txt` (Python)
- `pom.xml` (Java)

## Output Structure

Generated documentation follows a hierarchical structure:

```
output-directory/
├── project-name-documentation/
│   ├── INDEX.md                 # Main documentation index
│   ├── README.md                 # Project overview
│   ├── API-Documentation.md     # API reference
│   ├── Architecture.md          # System architecture
│   └── Components/              # Component documentation
│       ├── Component1.md
│       └── Component2.md
```

## Security Features

- **Permission System** - Password-protected operations
- **Path Validation** - Secure file access verification
- **Dependency Scanning** - Vulnerability detection
- **Safe File Operations** - Protected read/write operations
- **Lock File Management** - Prevents concurrent modifications

## Performance Optimization

### Standard Mode
- Sequential processing through 9 phases
- Comprehensive analysis and validation
- Full Obsidian integration

### Efficient Mode
- Parallel document processing
- Queue-based task distribution
- Optimized memory usage
- Smart caching strategies

Enable efficient mode:
```bash
DOCUMENTOR_EFFICIENT=true documentor generate .
```

## Error Handling

The system implements comprehensive error handling:

- **Phase-level Recovery** - Isolated phase failures
- **File-level Isolation** - Individual file errors don't stop processing
- **Lock File Protection** - Prevents data corruption
- **Detailed Logging** - Comprehensive error tracking
- **Graceful Degradation** - Continues with partial results

## Integration Points

### Obsidian Integration
- YAML frontmatter generation
- Hierarchical tag structures
- Bidirectional backlinks
- Vault-compatible formatting

### GitHub Integration
- Repository monitoring
- Commit-triggered generation
- Pull request documentation
- Git metadata extraction

### Claude AI Integration
- Intelligent content generation
- Code understanding
- Architecture analysis
- API documentation creation

## Development

### Building from Source

```bash
# Clone repository
git clone https://github.com/yourusername/docuMentor.git
cd docuMentor

# Install dependencies
npm install

# Build TypeScript
npm run build

# Build binaries
npm run build:binary
```

### Project Structure

```
docuMentor/
├── src/
│   ├── cli/           # CLI command implementations
│   ├── core/          # Core engine and processors
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   └── tui/           # Terminal UI (Go)
├── templates/         # Documentation templates
├── dist/             # Compiled JavaScript
└── bin/              # Binary executables
```

### Testing

```bash
npm run lint          # Run ESLint
npm run lint:fix      # Fix linting issues
npm test             # Run tests (when available)
```

## System Requirements

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Claude API access (for AI features)
- 4GB RAM minimum (8GB recommended for large projects)
- 500MB free disk space

## Troubleshooting

### Common Issues

**Lock file conflicts**: Remove `.documentor.lock` if generation fails
**API timeouts**: Increase timeout in configuration
**Memory issues**: Use efficient mode for large projects
**Permission errors**: Check file system permissions

### Debug Mode

Enable verbose logging:
```bash
documentor generate . --verbose
```

## Future Enhancements

- Real-time collaboration features
- Multi-language documentation generation
- Custom template support
- Plugin architecture
- Cloud synchronization
- IDE integrations