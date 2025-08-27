# ClaudeCast - Raycast Extension for Claude

#raycast #claude #ai-assistant #typescript #react #extension #claude-code-cli

## Overview

ClaudeCast is a sophisticated Raycast extension that provides seamless integration with Claude through the Claude Code CLI. It enables users to interact with Claude directly from Raycast's command palette while leveraging their Claude Pro subscription (no API keys required).

## Features

### Core Functionality
- **Chat Interface** - Full conversation mode with Claude
- **Quick Ask** - Fast single-question interactions
- **History Management** - Browse and resume past conversations
- **Debug Tools** - Built-in logging and diagnostics

### Technical Features
- **Process Management** - Robust Claude Code CLI process handling
- **Streaming Responses** - Real-time message streaming
- **Session Persistence** - Save and restore conversation states
- **Error Recovery** - Automatic crash recovery and retry logic
- **Performance Logging** - Comprehensive timing and metrics

## Architecture

### Module Structure
```
claudecast/
├── src/
│   ├── core/                 # Core business logic
│   │   ├── claude-cli/       # CLI wrapper modules
│   │   ├── logger/           # Logging system ✅
│   │   └── config/           # Configuration
│   ├── services/             # Service layer
│   ├── ui/                   # React components
│   ├── commands/             # Raycast commands
│   └── types/                # TypeScript definitions
├── tests/                    # Test suites
└── docs/                     # Documentation
```

### Key Components

#### 1. Logger System (Completed ✅)
- Multi-transport logging (Console, File, Raycast Toast)
- Structured JSON format
- Correlation IDs for tracking
- Performance timers
- Circular buffer for debugging
- Automatic log rotation
- Privacy filtering

#### 2. Process Manager
- Spawns and manages Claude Code CLI processes
- Handles crashes with automatic restarts
- Monitors process health
- Stream management (stdin/stdout/stderr)

#### 3. Message Parser
- Parses streaming CLI output
- Handles ANSI escape codes
- Extracts structured data
- Manages partial messages

#### 4. Session Manager
- Creates and destroys sessions
- Persists conversation state
- Implements recovery mechanisms
- Manages timeouts

## Installation

### Prerequisites
- **Raycast** 1.26.0+
- **Node.js** 22.14+
- **npm** 7+
- **Claude Code CLI** installed and configured
- **Claude Pro** subscription

### Setup Steps
```bash
# Clone repository
cd ~/github/claudecast

# Install dependencies
npm install

# Run tests
npm test

# Start development
npm run dev
```

## Configuration

### Raycast Preferences
- **Claude Code CLI Path** - Path to claude executable (default: `claude`)
- **Log Level** - Logging verbosity (debug/info/warn/error)
- **Max History Items** - Number of conversations to retain
- **Enable Debug Mode** - Detailed diagnostics toggle

### File Locations
- **Logs**: `~/.claudecast/logs/`
- **Sessions**: `~/.claudecast/sessions/`
- **Config**: `~/.claudecast/config.json`

## Usage

### Basic Commands

#### Chat with Claude
- Open Raycast → "Chat with Claude"
- Type your message
- Press Enter to send
- View streaming response

#### Quick Ask
- Open Raycast → "Quick Ask Claude"
- Type your question
- Get immediate response

#### View History
- Open Raycast → "View Chat History"
- Browse past conversations
- Resume any session

#### Debug Logs
- Open Raycast → "Debug Logs"
- View recent log entries
- Export logs for troubleshooting

## Development

### Scripts
```bash
# Development
npm run dev           # Start Raycast dev mode
npm run build        # Production build
npm run lint         # Run ESLint
npm run fix-lint     # Fix linting issues
npm run typecheck    # TypeScript checking

# Testing
npm test             # Run all tests
npm test:ui          # Test with UI
npm test:coverage    # Coverage report
npm test:watch       # Watch mode
```

### Testing Strategy
- **Unit Tests** - 90% coverage target
- **Integration Tests** - Module interaction testing
- **E2E Tests** - Full workflow validation
- **Framework** - Vitest with React Testing Library

### Logging
```typescript
import { createLogger } from '@core/logger';

const logger = createLogger('module-name');
logger.info('Operation started', { userId: 123 });
logger.error('Operation failed', error);
```

## Project Status

### Completed ✅
- Project structure and setup
- Package configuration
- Vite and Vitest configuration
- TypeScript configuration
- ESLint configuration
- Comprehensive logging system
- Unit tests for logger
- Raycast documentation

### In Progress 🚧
- Process Manager implementation
- Message Parser development
- Session Manager creation

### Planned 📋
- Service layer implementation
- UI components
- Integration testing
- Performance optimization
- Store submission

## Metrics

- **Lines of Code**: ~1,500
- **Test Coverage**: Logger at 100%
- **Documentation**: Complete
- **Implementation**: 15% complete

## Known Issues

- CLI integration pending completion
- UI components not yet implemented
- Session persistence to be added

## Troubleshooting

### Common Issues

#### Claude Code CLI not found
```bash
# Verify installation
which claude

# Set path in Raycast preferences
# Or create symlink
ln -s /path/to/claude /usr/local/bin/claude
```

#### Permission errors
```bash
# Grant execution permission
chmod +x /path/to/claude
```

#### Logs not appearing
```bash
# Check log directory
ls -la ~/.claudecast/logs/

# Verify permissions
chmod 755 ~/.claudecast
```

## Contributing

1. Follow established architecture
2. Write tests for all code
3. Use the logger extensively
4. Follow TypeScript best practices
5. Run tests before committing

## License

MIT

## Related Documents

- [[CHANGELOG]] - Version history and updates
- [[IMPLEMENTATION_GUIDE]] - Detailed implementation documentation
- [[ARCHITECTURE]] - Technical architecture details