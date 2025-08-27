# Stream-JSON Implementation Plan for ClaudeCast

**Date: 2024-12-27**  
**Status: PLANNED FEATURE**

#raycast #claude #stream-json #planned-feature #architecture 

## Executive Summary

Upgrade ClaudeCast to use Claude CLI's `--output-format stream-json` and `--input-format stream-json` options for real-time streaming communication, replacing the current single-response `--print` mode.

## Current Implementation Analysis

### Current Approach
```python
# Current: Single JSON response
result = subprocess.run(
    [helper_path, "--model", cli_model],
    input=prompt,
    capture_output=True,
    text=True,
    timeout=60
)
response_data = json.loads(result.stdout)
```

**Characteristics:**
- Blocks until complete response
- Single JSON object output
- All-or-nothing response
- 5-15 second wait time
- Memory efficient (single buffer)

## Stream-JSON Format Research

### CLI Options Available

```bash
# Output formats
--output-format text        # Plain text (default)
--output-format json        # Single JSON result
--output-format stream-json # Newline-delimited JSON events

# Input formats  
--input-format text         # Plain text (default)
--input-format stream-json  # Newline-delimited JSON messages

# Additional options
--replay-user-messages      # Echo user messages back (stream-json only)
--verbose                   # Required for stream-json output
```

### Stream-JSON Event Types

Based on empirical testing:

#### 1. System Events
```json
{
  "type": "system",
  "subtype": "init",
  "session_id": "uuid",
  "tools": ["Task", "Bash", ...],
  "model": "claude-opus-4-1-20250805",
  "cwd": "/current/directory",
  "uuid": "event-uuid"
}
```

#### 2. Assistant Messages
```json
{
  "type": "assistant",
  "message": {
    "id": "msg_id",
    "role": "assistant",
    "model": "claude-opus-4-1-20250805",
    "content": [{"type": "text", "text": "Response text"}],
    "usage": {...}
  },
  "session_id": "uuid",
  "uuid": "event-uuid"
}
```

#### 3. Tool Use Events
```json
{
  "type": "assistant",
  "message": {
    "content": [{
      "type": "tool_use",
      "id": "tool_id",
      "name": "Write",
      "input": {...}
    }]
  }
}
```

#### 4. User Messages (with --replay-user-messages)
```json
{
  "type": "user",
  "message": {
    "role": "user",
    "content": "User input"
  },
  "session_id": "uuid"
}
```

#### 5. Result Event
```json
{
  "type": "result",
  "subtype": "success",
  "is_error": false,
  "duration_ms": 4277,
  "result": "Final response text",
  "usage": {...},
  "total_cost_usd": 0.079,
  "permission_denials": [],
  "uuid": "result-uuid"
}
```

### Input Format for Stream-JSON

```json
{"type": "user", "message": {"role": "user", "content": "User prompt"}}
```

## Implementation Plan

### Phase 1: Basic Streaming Output

#### 1.1 Update Shell Helper
```bash
#!/bin/zsh
source ~/.zshrc
if [[ $1 == "--model" ]]; then
    MODEL=$2
    shift 2
    claude --model "$MODEL" --print --output-format stream-json --verbose "$@"
else
    claude --print --output-format stream-json --verbose "$@"
fi
```

#### 1.2 Update Python Provider
```python
import asyncio
import json
from typing import AsyncIterator

class ClaudeCLIProvider:
    async def stream_completion(self, **kwargs) -> AsyncIterator[dict]:
        """Stream responses from Claude CLI"""
        messages = kwargs.get("messages", [])
        prompt = self._format_messages(messages)
        
        # Start subprocess with async
        process = await asyncio.create_subprocess_exec(
            self.helper_path, "--model", cli_model,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        # Send input
        process.stdin.write(prompt.encode())
        await process.stdin.drain()
        process.stdin.close()
        
        # Stream output line by line
        accumulated_response = []
        async for line in process.stdout:
            if line:
                try:
                    event = json.loads(line)
                    
                    # Process different event types
                    if event["type"] == "assistant":
                        # Extract text content
                        if "message" in event and "content" in event["message"]:
                            for content_item in event["message"]["content"]:
                                if content_item["type"] == "text":
                                    text = content_item["text"]
                                    accumulated_response.append(text)
                                    
                                    # Yield SSE chunk
                                    yield {
                                        "type": "chunk",
                                        "content": text
                                    }
                    
                    elif event["type"] == "result":
                        # Final result
                        yield {
                            "type": "complete",
                            "content": "".join(accumulated_response),
                            "usage": event.get("usage", {}),
                            "cost": event.get("total_cost_usd", 0)
                        }
                        
                except json.JSONDecodeError:
                    continue
        
        await process.wait()
```

#### 1.3 Update FastAPI Endpoint
```python
@app.post("/v1/chat/completions")
async def chat_completions(request: Request):
    body = await request.json()
    
    if body.get("stream", False):
        async def generate():
            # Stream response
            async for chunk in provider.stream_completion(**body):
                if chunk["type"] == "chunk":
                    # Format as OpenAI streaming chunk
                    sse_data = {
                        "id": "chatcmpl-xxx",
                        "object": "chat.completion.chunk",
                        "choices": [{
                            "delta": {"content": chunk["content"]},
                            "index": 0
                        }]
                    }
                    yield f"data: {json.dumps(sse_data)}\n\n"
                
                elif chunk["type"] == "complete":
                    # Send final chunk
                    final_chunk = {
                        "choices": [{
                            "delta": {},
                            "finish_reason": "stop"
                        }]
                    }
                    yield f"data: {json.dumps(final_chunk)}\n\n"
                    yield "data: [DONE]\n\n"
        
        return StreamingResponse(generate(), media_type="text/event-stream")
    
    else:
        # Non-streaming (existing implementation)
        return await existing_implementation()
```

### Phase 2: Bidirectional Streaming (Advanced)

#### 2.1 Implement Stream-JSON Input
```python
async def bidirectional_stream(self, input_stream: AsyncIterator[str]) -> AsyncIterator[dict]:
    """Handle bidirectional streaming"""
    
    process = await asyncio.create_subprocess_exec(
        self.helper_path,
        "--input-format", "stream-json",
        "--output-format", "stream-json",
        "--replay-user-messages",
        "--verbose",
        stdin=asyncio.subprocess.PIPE,
        stdout=asyncio.subprocess.PIPE
    )
    
    # Input writer task
    async def write_input():
        async for user_input in input_stream:
            message = {
                "type": "user",
                "message": {
                    "role": "user",
                    "content": user_input
                }
            }
            line = json.dumps(message) + "\n"
            process.stdin.write(line.encode())
            await process.stdin.drain()
    
    # Start input writer
    asyncio.create_task(write_input())
    
    # Stream output
    async for line in process.stdout:
        if line:
            yield json.loads(line)
```

#### 2.2 WebSocket Support (Future)
```python
@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    
    # Create input stream from websocket
    async def input_stream():
        while True:
            data = await websocket.receive_text()
            yield data
    
    # Process with bidirectional streaming
    async for event in provider.bidirectional_stream(input_stream()):
        await websocket.send_json(event)
```

## Comparison: Current vs Stream-JSON

### Performance Comparison

| Metric | Current (`--print`) | Stream-JSON |
|--------|-------------------|-------------|
| **First Token Latency** | 5-15 seconds | 1-3 seconds |
| **User Experience** | Waiting spinner | Progressive text |
| **Memory Usage** | Single buffer | Stream processing |
| **Error Recovery** | All or nothing | Partial responses |
| **Token Usage Visibility** | End only | Real-time |
| **Cost Tracking** | End only | Progressive |

### Technical Comparison

| Aspect | Current | Stream-JSON |
|--------|---------|-------------|
| **Implementation Complexity** | Simple | Moderate |
| **Error Handling** | Simple try/catch | Stream error handling |
| **Testing** | Straightforward | More complex |
| **Debugging** | Easy | Requires stream tools |
| **Network Efficiency** | Single response | Progressive chunks |
| **Client Compatibility** | Universal | Requires SSE support |

## Pros and Cons Analysis

### Pros of Stream-JSON Implementation

1. **Better User Experience**
   - Users see response immediately
   - No long wait times
   - Progressive rendering
   - Feels more responsive

2. **Resource Efficiency**
   - Lower memory footprint
   - No large buffer accumulation
   - Can handle longer responses

3. **Enhanced Monitoring**
   - Real-time token usage
   - Progressive cost calculation
   - Better debugging with event stream
   - Session tracking

4. **Flexibility**
   - Can interrupt mid-stream
   - Partial responses usable
   - Supports bidirectional communication
   - Tool use transparency

5. **Production Benefits**
   - Better timeout handling
   - Progressive error recovery
   - Detailed event logging
   - Session management

### Cons of Stream-JSON Implementation

1. **Increased Complexity**
   - Async programming required
   - Stream processing logic
   - Event type handling
   - Buffer management

2. **Dependencies**
   - Requires `--verbose` flag
   - More complex error states
   - SSE client support needed

3. **Testing Challenges**
   - Stream testing harder
   - Mock complexity increases
   - Race conditions possible

4. **Debugging Difficulty**
   - Multiple event types
   - Async debugging
   - Stream state management

5. **Compatibility Issues**
   - Some clients expect full responses
   - Raycast SSE support uncertain
   - Error aggregation complex

## Implementation Recommendations

### Recommended Approach: Hybrid Mode

Implement both modes with automatic selection:

```python
class ClaudeCLIProvider:
    def __init__(self):
        self.streaming_enabled = True  # Config option
    
    async def completion(self, **kwargs):
        if kwargs.get("stream") and self.streaming_enabled:
            return await self.stream_completion(**kwargs)
        else:
            return await self.batch_completion(**kwargs)
```

### Implementation Priority

1. **Phase 1** (Week 1)
   - Basic streaming output
   - Maintain backward compatibility
   - Test with Raycast

2. **Phase 2** (Week 2)
   - Performance optimization
   - Error handling improvements
   - Monitoring additions

3. **Phase 3** (Optional)
   - Bidirectional streaming
   - WebSocket support
   - Advanced session management

## Testing Strategy

### Unit Tests
```python
async def test_stream_json_parsing():
    """Test parsing of stream-json events"""
    events = [
        '{"type":"system","subtype":"init"}',
        '{"type":"assistant","message":{"content":[{"type":"text","text":"Hello"}]}}',
        '{"type":"result","result":"Hello"}'
    ]
    
    results = []
    for event in events:
        parsed = parse_stream_event(event)
        results.append(parsed)
    
    assert results[0]["type"] == "system"
    assert results[1]["content"] == "Hello"
    assert results[2]["result"] == "Hello"
```

### Integration Tests
```bash
# Test streaming output
echo "test" | claude --print --output-format stream-json --verbose | \
  while read line; do
    echo "$line" | jq '.type'
  done
```

## Risk Analysis

### Risks
1. **Breaking Changes** - Existing integration might break
2. **Performance Regression** - Streaming overhead
3. **Raycast Compatibility** - SSE support uncertain
4. **Error Propagation** - Stream errors harder to handle

### Mitigations
1. **Feature Flag** - Enable/disable streaming
2. **Fallback Mode** - Automatic fallback to batch
3. **Comprehensive Testing** - Before production
4. **Gradual Rollout** - Test with subset first

## Conclusion

Stream-JSON implementation offers significant UX improvements with manageable complexity increase. The hybrid approach allows gradual migration while maintaining stability.

**Recommendation**: Implement Phase 1 with feature flag, test thoroughly, then evaluate Phase 2 based on results.

## References

- Claude CLI Help: `claude --help`
- Empirical Testing: December 27, 2024
- Current Implementation: `claude_cli_provider.py`
- Anthropic Docs: Limited public documentation on stream-json