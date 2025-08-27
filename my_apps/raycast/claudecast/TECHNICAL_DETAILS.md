# ClaudeCast Technical Implementation

**Date: 2024-12-27**

#raycast #claude #technical #launchd #fastapi #automation

## Complete Architecture

```
System Boot
     │
     ▼
launchd (macOS)
     │
     ▼
com.claudecast.provider.plist
     │
     ▼
Python Server (Port 19385)
     │
     ▲
     │ HTTP/OpenAI API
     │
Raycast AI ← providers.yaml config
```

## Component Details

### 1. LaunchAgent Configuration

**File**: `~/Library/LaunchAgents/com.claudecast.provider.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.claudecast.provider</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/python3</string>
        <string>/Users/ivg/github/ClaudeCast/claude_cli_provider.py</string>
        <string>--dangerously-skip-permissions</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/claudecast.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/claudecast.error.log</string>
</dict>
</plist>
```

**Key Features**:
- `RunAtLoad`: Starts on system login
- `KeepAlive`: Restarts if crashes
- Logs to `/tmp/claudecast.log`

### 2. Raycast Provider Configuration

**File**: `~/.config/raycast/ai/providers.yaml`

```yaml
providers:
  - id: claude-pro
    name: Claude Pro
    base_url: http://localhost:19385/v1
    api_keys:
      openai: sk-dummy
    models:
      - id: opus
        name: "Opus 4.1"
        provider: openai
        context: 200000
        max_output: 8192
      - id: sonnet
        name: "Sonnet 4"
        provider: openai
        context: 200000
        max_output: 8192
```

**Integration Points**:
- Raycast loads this on startup
- Makes provider available in all AI features
- Uses OpenAI protocol with custom endpoint

### 3. Python Provider Server

**File**: `/Users/ivg/github/ClaudeCast/claude_cli_provider.py`

**Key Components**:

```python
# Model mapping
model_mapping = {
    "opus": "opus",
    "sonnet": "sonnet",
    "claude-opus-4.1": "opus",
    "claude-3-5-sonnet": "sonnet"
}

# Subprocess execution
result = subprocess.run(
    [self.helper_path, "--model", cli_model],
    input=prompt,
    capture_output=True,
    text=True,
    timeout=60
)

# Response cleaning
def _clean_content(self, content: str) -> str:
    # Remove [claude_code_sdk]: {...} blocks
    content = re.sub(r'\[claude_code_sdk\]:\s*\{[^}]*\}', '', content)
    return content.strip()
```

### 4. Shell Helper

**File**: `/Users/ivg/.claude/raycast-helper.sh`

```bash
#!/bin/zsh
source ~/.zshrc
if [[ $1 == "--model" ]]; then
    MODEL=$2
    shift 2
    claude --model "$MODEL" --print --dangerously-skip-permissions "$@"
else
    claude --print --dangerously-skip-permissions "$@"
fi
```

## Request Flow Analysis

### 1. Raycast Initiates Request
```
Raycast AI Feature
    ↓
providers.yaml lookup
    ↓
POST http://localhost:19385/v1/chat/completions
```

### 2. Server Processing
```python
# Receive request
body = await request.json()
# Example: {"model": "sonnet", "messages": [...]}

# Convert messages
prompt = self._format_messages(messages)
# Output: "User: How do I..."

# Execute Claude
subprocess.run([helper_path, "--model", "sonnet"], input=prompt)

# Clean and return
response = self._clean_content(claude_output)
```

### 3. Log Output
```
Received request with keys: dict_keys(['messages', 'model', 'stream'])
Executing Claude CLI with model: sonnet, prompt: User: ...
Claude CLI responded in 6.65 seconds
Got response: [actual response text]
```

## System Integration

### Process Hierarchy
```
launchd (PID 1)
    └── Python (PID 28733) - claude_cli_provider.py
            └── subprocess: zsh → claude CLI (per request)
```

### Resource Usage
- **Memory**: ~50MB for Python server
- **CPU**: Minimal when idle, spikes during requests
- **Network**: Localhost only (127.0.0.1:19385)
- **Disk**: Logs to `/tmp/` (rotated by system)

## Security Considerations

### Current Implementation
- **No Authentication**: Relies on localhost-only binding
- **--dangerously-skip-permissions**: Bypasses Claude safety checks
- **sk-dummy**: Placeholder API key (not validated)

### Potential Improvements
1. Add token validation
2. Implement rate limiting
3. Remove dangerous flags
4. Add request logging with sanitization

## Performance Metrics

### From Production Logs
```
Claude CLI responded in 11.04 seconds  # Longer response
Claude CLI responded in 6.65 seconds   # Typical response
```

### Breakdown
- Server overhead: ~10ms
- Subprocess spawn: ~50ms
- Claude CLI execution: 5-15 seconds
- Response cleaning: ~1ms
- Total: 5-15 seconds per request

## Debugging

### Check Service Status
```bash
# Is it registered?
launchctl list com.claudecast.provider

# Output shows:
{
    "PID" = 28733;
    "LastExitStatus" = 0;
    "Label" = "com.claudecast.provider";
}
```

### View Live Logs
```bash
# Watch requests in real-time
tail -f /tmp/claudecast.log

# Check errors
tail -f /tmp/claudecast.error.log
```

### Test Endpoints
```bash
# Health check
curl http://localhost:19385/health

# Test chat
curl -X POST http://localhost:19385/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"sonnet","messages":[{"role":"user","content":"Hi"}]}'
```

## File System Layout

```
/Users/ivg/
├── github/ClaudeCast/
│   └── claude_cli_provider.py     # Main server
├── .claude/
│   └── raycast-helper.sh          # Shell helper
├── Library/LaunchAgents/
│   └── com.claudecast.provider.plist  # Auto-start
└── .config/raycast/ai/
    └── providers.yaml              # Raycast config

/tmp/
├── claudecast.log                 # Server logs
└── claudecast.error.log          # Error logs
```

## Maintenance

### Update Server Code
1. Edit `/Users/ivg/github/ClaudeCast/claude_cli_provider.py`
2. Restart: `launchctl kickstart -k gui/$(id -u)/com.claudecast.provider`

### Change Models
1. Edit `~/.config/raycast/ai/providers.yaml`
2. Restart Raycast

### Disable Service
```bash
launchctl unload ~/Library/LaunchAgents/com.claudecast.provider.plist
```

### Re-enable Service
```bash
launchctl load ~/Library/LaunchAgents/com.claudecast.provider.plist
```

## Production Statistics

- **Running Since**: August 23, 2024
- **Current PID**: 28733
- **Uptime**: Continuous (auto-restarts)
- **Request Volume**: Active daily usage per logs
- **Stability**: No crashes in logs