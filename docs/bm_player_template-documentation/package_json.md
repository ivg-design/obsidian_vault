---
title: Package
type: config
project: bm_player_template
source: /Users/ivg/github/bm_player_template/package.json
created: 08-31-2025 06:02:48
modified: 08-31-2025 06:02:48
tags:
  - #bm_player_template
  - #type/config
---

I need to analyze the project to generate appropriate documentation. Let me examine the codebase structure and recent changes.# DocuMentor Configuration Guide

## Overview

DocuMentor uses a JSON-based configuration system that allows customization of documentation generation behavior, output formats, and integration features. The configuration file `.documentor.config.json` provides fine-grained control over all aspects of the documentation pipeline.

## Configuration File Location

The configuration file is automatically created in the project root directory when running `documentor config init`. The default location is:

```
.documentor.config.json
```

## Configuration Structure

### Basic Configuration

```json
{
  "version": "3.1.0",
  "project": {
    "name": "auto-detect",
    "type": "auto"
  },
  "output": {
    "path": "~/Documents/documentation",
    "format": "obsidian"
  }
}
```

### Complete Configuration

```json
{
  "version": "3.1.0",
  "project": {
    "name": "auto-detect",
    "type": "auto"
  },
  "output": {
    "path": "~/github/obsidian_vault/docs",
    "format": "obsidian",
    "features": {
      "frontmatter": true,
      "backlinks": true,
      "tags": {
        "optimize": true,
        "hierarchy": true,
        "minPerDoc": 3
      },
      "moc": true,
      "dataview": true
    }
  },
  "permissions": {
    "requestPassword": false,
    "skipOnDenial": true,
    "importantPaths": ["src", "lib", "config", "docs", "scripts"]
  },
  "claude": {
    "model": "claude-opus-4-1-20250805",
    "maxTokens": 200000,
    "temperature": 0.3
  },
  "github": {
    "enabled": false,
    "accessToken": "",
    "username": "",
    "repositories": [],
    "pollInterval": 5,
    "documentOnCommit": true,
    "documentOnPR": true,
    "ignorePatterns": ["*.min.js", "*.min.css", "package-lock.json"]
  },
  "watch": {
    "enabled": false,
    "paths": [],
    "interval": 5000,
    "debounce": 1000,
    "ignorePatterns": ["**/node_modules/**", "**/.git/**"]
  },
  "phases": [
    "analysis",
    "security",
    "generation",
    "enhancement",
    "obsidian-integration",
    "tag-optimization",
    "backlink-generation",
    "verification",
    "save"
  ]
}
```

## Configuration Sections

### Project Settings

Controls project identification and type detection.

```json
"project": {
  "name": "auto-detect",
  "type": "auto"
}
```

**Options:**
- `name`: Project name (`"auto-detect"` uses directory name)
- `type`: Project type detection mode (`"auto"` | `"manual"`)

### Output Settings

Defines where and how documentation is generated.

```json
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
    },
    "moc": true,
    "dataview": true
  }
}
```

**Options:**
- `path`: Output directory path (supports `~` for home directory)
- `format`: Output format (`"obsidian"` | `"markdown"`)
- `features.frontmatter`: Enable YAML frontmatter generation
- `features.backlinks`: Generate cross-references between documents
- `features.tags.optimize`: Enable intelligent tag optimization
- `features.tags.hierarchy`: Create hierarchical tag structures
- `features.tags.minPerDoc`: Minimum tags per document
- `features.moc`: Generate Map of Contents
- `features.dataview`: Add Dataview plugin metadata

### Permissions Settings

Controls file access and security prompts.

```json
"permissions": {
  "requestPassword": false,
  "skipOnDenial": true,
  "importantPaths": ["src", "lib", "config", "docs", "scripts"]
}
```

**Options:**
- `requestPassword`: Prompt for password for sensitive operations
- `skipOnDenial`: Skip files when access is denied
- `importantPaths`: Priority paths for documentation

### Claude AI Settings

Configures the AI model parameters.

```json
"claude": {
  "model": "claude-opus-4-1-20250805",
  "maxTokens": 200000,
  "temperature": 0.3
}
```

**Options:**
- `model`: Claude model identifier
- `maxTokens`: Maximum tokens for generation (up to 200,000)
- `temperature`: Creativity level (0.0 = deterministic, 1.0 = creative)

### GitHub Integration

Enables repository monitoring and automatic documentation.

```json
"github": {
  "enabled": false,
  "accessToken": "ghp_...",
  "username": "yourusername",
  "repositories": ["repo1", "repo2"],
  "pollInterval": 5,
  "documentOnCommit": true,
  "documentOnPR": true,
  "ignorePatterns": ["*.min.js", "*.min.css"]
}
```

**Options:**
- `enabled`: Enable GitHub monitoring
- `accessToken`: GitHub personal access token
- `username`: GitHub username
- `repositories`: List of repositories to monitor
- `pollInterval`: Check interval in minutes
- `documentOnCommit`: Generate docs on new commits
- `documentOnPR`: Generate docs on pull requests
- `ignorePatterns`: Files to exclude from documentation

### Watch Mode Settings

Configures file system monitoring.

```json
"watch": {
  "enabled": false,
  "paths": ["./src", "./lib"],
  "interval": 5000,
  "debounce": 1000,
  "ignorePatterns": ["**/node_modules/**", "**/.git/**"]
}
```

**Options:**
- `enabled`: Enable watch mode
- `paths`: Directories to monitor (empty = current directory)
- `interval`: Check interval in milliseconds
- `debounce`: Wait time before regenerating
- `ignorePatterns`: Patterns to exclude from watching

### Phase Configuration

Customize the documentation pipeline phases.

```json
"phases": [
  "analysis",
  "security",
  "generation",
  "enhancement",
  "obsidian-integration",
  "tag-optimization",
  "backlink-generation",
  "verification",
  "save"
]
```

**Available Phases:**
1. `analysis` - Project structure analysis
2. `security` - Security vulnerability scanning
3. `generation` - Core documentation generation
4. `enhancement` - Content refinement
5. `obsidian-integration` - Obsidian-specific formatting
6. `tag-optimization` - Tag hierarchy creation
7. `backlink-generation` - Cross-reference creation
8. `verification` - Quality validation
9. `save` - Final output generation

## Configuration Commands

### Initialize Configuration

Creates a new configuration file with defaults:

```bash
documentor config init
```

### View Configuration

Display current configuration:

```bash
documentor config show
```

### Edit Configuration

Open configuration in default editor:

```bash
documentor config edit
```

### Validate Configuration

Check configuration for errors:

```bash
documentor config validate
```

## Environment Variables

Override configuration via environment variables:

```bash
# Override output path
DOCUMENTOR_OUTPUT_PATH=/custom/path documentor generate .

# Override format
DOCUMENTOR_FORMAT=markdown documentor generate .

# Enable efficient mode
DOCUMENTOR_EFFICIENT=true documentor generate .

# Set Claude API key
CLAUDE_API_KEY=your-key documentor generate .
```

## Configuration Precedence

Configuration values are resolved in this order:
1. Command-line arguments (highest priority)
2. Environment variables
3. Configuration file
4. Default values (lowest priority)

## Format-Specific Settings

### Obsidian Format

When `format` is set to `"obsidian"`, additional features become available:

- **Frontmatter**: YAML metadata for each document
- **Tags**: Hierarchical tag system compatible with Obsidian
- **Backlinks**: `[[wiki-style]]` links between documents
- **MOC**: Map of Contents for navigation
- **Dataview**: Metadata for Dataview plugin queries

### Markdown Format

When `format` is set to `"markdown"`, generates:

- Standard markdown files
- Table of contents
- Cross-references using standard markdown links
- No Obsidian-specific features

## Advanced Configuration

### Custom Templates

Place custom templates in the `templates/` directory:

```
templates/
├── component.md
├── api.md
└── architecture.md
```

### Ignore Files

Create `.documentorignore` file to exclude patterns:

```
node_modules/
dist/
*.test.js
*.spec.ts
```

### Per-Directory Configuration

Place `.documentor.json` in subdirectories for local overrides:

```json
{
  "output": {
    "features": {
      "tags": {
        "minPerDoc": 5
      }
    }
  }
}
```

## Best Practices

1. **Start Simple**: Begin with minimal configuration and add features as needed
2. **Version Control**: Commit `.documentor.config.json` to track changes
3. **Secure Tokens**: Never commit GitHub tokens; use environment variables
4. **Optimize Phases**: Remove unnecessary phases for faster generation
5. **Test Settings**: Use `--dry-run` flag to test configuration changes
6. **Monitor Performance**: Adjust `maxTokens` and `temperature` for optimal results

## Troubleshooting

### Common Issues

**Documentation not generating:**
- Verify Claude API key is set
- Check output path permissions
- Validate configuration syntax

**GitHub integration not working:**
- Confirm access token has required permissions
- Verify repository names are correct
- Check network connectivity

**Watch mode missing changes:**
- Adjust `debounce` value
- Check `ignorePatterns` aren't too broad
- Verify file system permissions

### Debug Mode

Enable verbose logging:

```bash
DOCUMENTOR_DEBUG=true documentor generate .
```

View configuration resolution:

```bash
documentor config debug
```