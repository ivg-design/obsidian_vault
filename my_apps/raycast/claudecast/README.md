# ClaudeCast - Raycast AI Integration for Claude Pro

**Date: 2024-12-27**

#raycast #claude #ai-integration #claude-pro #launchd #auto-start

## What This Actually Is

ClaudeCast is a **fully automated** Raycast AI integration that uses your Claude Pro subscription. It consists of:
1. A Python FastAPI server that auto-starts on login
2. A Raycast AI provider configuration
3. A shell helper script for Claude CLI execution

## How It Actually Works

### Automated System

1. **LaunchAgent** (`com.claudecast.provider.plist`)
   - Auto-starts Python server on login
   - Keeps service running (restarts if crashes)
   - Logs to `/tmp/claudecast.log`

2. **Python Provider Server** (`claude_cli_provider.py`)
   - Runs persistently on port 19385
   - Started by launchd (PID 28733 currently)
   - Provides OpenAI-compatible API for Raycast

3. **Raycast Configuration** (`~/.config/raycast/ai/providers.yaml`)
   - Defines "Claude Pro" provider
   - Two models: Opus 4.1 and Sonnet 4
   - Points to localhost:19385

4. **Shell Helper** (`/Users/ivg/.claude/raycast-helper.sh`)
   - Executes Claude Code CLI
   - Sources environment for authentication

## Current Status

✅ **Fully Working**:
- Provider server running continuously (since boot)
- Raycast AI using Claude Pro models
- Automatic startup via launchd
- Logging to `/tmp/claudecast.log`
- Both Opus and Sonnet models available

## Installation (Already Done)

The system is already installed and running:

### Verify Installation
```bash
# Check if service is running
launchctl list | grep claudecast
# Output: 28733	0	com.claudecast.provider

# Check server status
curl http://localhost:19385/health
# Output: {"status":"healthy","provider":"claude-cli"}

# View logs
tail -f /tmp/claudecast.log
```

### Manual Control (if needed)
```bash
# Stop service
launchctl unload ~/Library/LaunchAgents/com.claudecast.provider.plist

# Start service
launchctl load ~/Library/LaunchAgents/com.claudecast.provider.plist

# Restart service
launchctl kickstart -k gui/$(id -u)/com.claudecast.provider
```

## Configuration Files

### 1. LaunchAgent
**Location**: `~/Library/LaunchAgents/com.claudecast.provider.plist`
- Runs at login
- Keeps alive
- Logs output

### 2. Raycast Provider
**Location**: `~/.config/raycast/ai/providers.yaml`
```yaml
providers:
  - id: claude-pro
    name: Claude Pro
    base_url: http://localhost:19385/v1
    models:
      - id: opus
        name: "Opus 4.1"
      - id: sonnet
        name: "Sonnet 4"
```

### 3. Python Server
**Location**: `/Users/ivg/github/ClaudeCast/claude_cli_provider.py`
- FastAPI server
- Port 19385
- Handles OpenAI API translation

### 4. Shell Helper
**Location**: `/Users/ivg/.claude/raycast-helper.sh`
- Executes Claude CLI
- Handles authentication

## Usage in Raycast

1. Open any Raycast command that uses AI
2. Select "Claude Pro" as provider
3. Choose "Opus 4.1" or "Sonnet 4" as model
4. Use normally - it's your Claude Pro subscription!

## Monitoring

### Check Status
```bash
# Is it running?
lsof -i :19385

# View live logs
tail -f /tmp/claudecast.log

# Check errors
tail -f /tmp/claudecast.error.log
```

### Log Analysis
The server logs show:
- Each request received
- Model selection (opus/sonnet)
- Response times (typically 5-15 seconds)
- Any errors

## Technical Details

### Request Flow
1. Raycast sends OpenAI-format request to port 19385
2. Python server receives and logs request
3. Converts to Claude CLI format
4. Executes via shell helper
5. Cleans response (removes SDK artifacts)
6. Returns OpenAI-format response
7. Logs completion time

### Performance
From logs:
- Typical response time: 6-11 seconds
- Server overhead: minimal
- Memory usage: ~50MB Python process

## Troubleshooting

### Service not running
```bash
# Check if loaded
launchctl list | grep claudecast

# If not, load it
launchctl load ~/Library/LaunchAgents/com.claudecast.provider.plist
```

### Port conflict
```bash
# Check what's using port
lsof -i :19385

# Kill if needed (will auto-restart)
kill $(lsof -t -i:19385)
```

### Raycast not connecting
- Check Raycast Settings → Extensions → AI
- Ensure "Claude Pro" provider is listed
- Select Opus 4.1 or Sonnet 4 model

## Notes

- The TypeScript files in the project are unused experiments
- The service has been running stably since August 23, 2024
- Logs show active usage with Raycast AI features
- No API costs - uses Claude Pro subscription

## License

MIT