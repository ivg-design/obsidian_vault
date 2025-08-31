---
title: Subframe rendering
type: documentation
project: bm_player_template
source: /Users/ivg/github/bm_player_template/docs/subframe-rendering.md
created: 08-31-2025 06:03:15
modified: 08-31-2025 06:03:15
tags:
  - #bm_player_template
  - #type/documentation
---

I need to analyze the codebase to generate documentation. Let me explore the project structure first.# DocuMentor Documentation

## Overview

DocuMentor is an intelligent documentation generator that creates comprehensive, well-structured documentation for software projects with seamless Obsidian integration. The system employs a sophisticated 9-phase process powered by Claude AI to analyze, validate, and document codebases across multiple programming languages.

## Architecture

### Core System Design

DocuMentor implements a modular architecture with three primary modes of operation:

1. **Standard Mode** - Traditional 9-phase sequential processing
2. **Efficient Mode** - Parallel processing with optimized resource usage
3. **Interactive Mode** - Real-time monitoring with Terminal UI (TUI)

### Processing Pipeline

The documentation generation follows a 9-phase pipeline:

1. **Analysis Phase** - Deep project structure analysis and file discovery
2. **Security Validation Phase** - Vulnerability scanning and dependency validation  
3. **Generation Phase** - AI-powered documentation creation using Claude
4. **Enhancement Phase** - Content refinement and formatting
5. **Obsidian Integration Phase** - Vault structure and frontmatter generation
6. **Tag Optimization Phase** - Hierarchical tag creation and organization
7. **Backlink Generation Phase** - Cross-reference and relationship mapping
8. **Verification Phase** - Quality checks and validation
9. **Save Phase** - Final assembly and output generation

### Component Architecture

#### Core Components

- **DocumentEngine** (`src/core/DocumentEngine.ts`) - Main orchestrator for the 9-phase pipeline
- **ClaudeClient** (`src/core/ClaudeClient.ts`) - Integration with Claude AI API for documentation generation
- **DocGenerator** (`src/core/DocGenerator.ts`) - Documentation generation logic and content processing
- **ObsidianIntegration** (`src/core/ObsidianIntegration.ts`) - Obsidian-specific formatting and features
- **FileScanner** (`src/core/FileScanner.ts`) - Project file discovery and analysis
- **ProjectAnalyzer** (`src/core/ProjectAnalyzer.ts`) - Code structure and dependency analysis
- **PhaseManager** (`src/core/PhaseManager.ts`) - Pipeline phase orchestration and progress tracking
- **TUIAdapter** (`src/core/TUIAdapter.ts`) - Terminal UI interface for progress display

#### Efficient Processing Components

- **DocumentPipeline** (`src/core/efficient/DocumentPipeline.ts`) - Streamlined single-document processor
- **DocumentProcessor** (`src/core/efficient/DocumentProcessor.ts`) - Batch processing coordinator
- **DocumentQueue** (`src/core/efficient/DocumentQueue.ts`) - Concurrent processing queue manager
- **OutputManager** (`src/core/efficient/OutputManager.ts`) - File writing and output coordination
- **ProgressReporter** (`src/core/efficient/ProgressReporter.ts`) - Real-time progress tracking

### Data Flow

1. **Input** - Project directory path and configuration
2. **Analysis** - File discovery, project type detection, dependency mapping
3. **Processing** - Content extraction, AI enhancement, formatting
4. **Enhancement** - Obsidian features, tags, backlinks, frontmatter
5. **Output** - Structured markdown files with metadata

## Key Features

### Multi-Language Support

DocuMentor analyzes and documents projects written in:
- TypeScript/JavaScript (`.ts`, `.tsx`, `.js`, `.jsx`)
- Python (`.py`)
- Go (`.go`)
- Rust (`.rs`)
- Java (`.java`)

### Obsidian Integration

The system generates Obsidian-optimized documentation with:
- YAML frontmatter with comprehensive metadata
- Hierarchical tag structures
- Automatic backlink generation
- Cross-document references
- Tag optimization for knowledge graph visualization

### AI-Enhanced Documentation

Claude AI integration provides:
- Intelligent content generation
- Code explanation and analysis
- Usage example creation
- API documentation extraction
- Architecture overview generation

### Real-Time Monitoring

Watch mode capabilities include:
- File change detection
- Automatic regeneration
- GitHub repository monitoring
- Commit and pull request triggers
- Continuous documentation updates

## Configuration System

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

### Configuration Management

- **Initialization** - `documentor config init` creates default configuration
- **Validation** - Schema validation ensures configuration integrity
- **Auto-detection** - Intelligent project type and structure detection
- **Environment Variables** - Support for API keys and runtime overrides

## CLI Commands

### Primary Commands

- **generate** - Generate documentation for a project
- **config** - Manage configuration settings
- **watch** - Monitor project for changes
- **github-watch** - Monitor GitHub repositories
- **self-document** - Generate DocuMentor's own documentation
- **analyze** - Analyze project structure
- **verify** - Verify documentation quality

### Command Options

- `--output` - Specify output directory
- `--format` - Choose output format (obsidian/markdown)
- `--verbose` - Enable detailed logging
- `--quiet` - Suppress non-error output
- `--interval` - Set monitoring interval for watch modes

## Processing Modes

### Standard Mode

Sequential processing through all 9 phases with comprehensive validation and error handling. Best for complete documentation generation with full quality assurance.

### Efficient Mode

Parallel processing architecture that:
- Processes multiple files concurrently
- Batches API calls for efficiency
- Implements smart caching strategies
- Reduces memory footprint
- Maintains documentation quality

Enable with: `DOCUMENTOR_EFFICIENT=true documentor generate .`

### Interactive Mode

Terminal UI provides:
- Real-time progress tracking
- Phase status visualization
- File processing indicators
- Error reporting
- Performance metrics

## Security Features

### Validation Systems

- Dependency vulnerability scanning
- License compliance checking
- Sensitive information detection
- Code security analysis
- Permission validation

### Safe Operations

- Secure file operations with permission checks
- Password bridge for encrypted content
- Lock file management for concurrent access
- Error recovery mechanisms
- Transaction-like operations with rollback

## Output Structure

### Directory Organization

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

### Document Format

Each generated document includes:
- YAML frontmatter with metadata
- Hierarchical headings
- Code examples with syntax highlighting
- Cross-references and backlinks
- Tags for categorization
- Source file references

## Performance Optimization

### Caching Strategies

- Template caching for repeated operations
- AI response caching with TTL
- File content caching during processing
- Configuration caching

### Resource Management

- Concurrent file processing limits
- Memory usage optimization
- API rate limiting
- Batch processing for large projects

## Error Handling

### Error Recovery

- Automatic retry with exponential backoff
- Partial completion support
- Error document generation for failures
- Lock file cleanup on errors

### Logging System

- Structured logging with severity levels
- File-based log persistence
- Real-time console output
- Debug mode for troubleshooting

## Extensibility

### Plugin Architecture

- Template customization support
- Custom processor integration
- Output format extensions
- Language-specific analyzers

### API Integration

- Claude AI API for content generation
- GitHub API for repository monitoring
- Custom API endpoint support
- Webhook integration capabilities

## Development

### Build System

- TypeScript compilation with strict mode
- Binary generation for cross-platform distribution
- Development mode with hot reload
- Linting and code quality checks

### Testing Infrastructure

- Unit test framework integration
- Integration test suites
- Performance benchmarking
- Documentation verification

## System Requirements

### Minimum Requirements

- Node.js 18.0.0 or higher
- 4GB RAM
- 1GB free disk space
- Internet connection for AI features

### Recommended Setup

- Node.js 20.x
- 8GB RAM
- SSD storage
- Claude API access with appropriate limits
- Git for version control integration