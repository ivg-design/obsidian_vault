# CEP AI Assistant for After Effects — Architecture & Delivery Plan (Revised)

## 1. Project Synopsis
- **Goal**: Ship a CEP extension for Adobe After Effects that presents a two-way chat interface for artists to request scripted automation (“create a composition with 20 sequentially named layers”, “apply this expression to selected property”, etc.).
- **Key Constraint**: The extension must not embed any API-key or OAuth flow. Instead, it connects to locally authenticated Anthropic Claude Code CLI or Codex CLI sessions that the user has already logged into.
- **Scope**: Chat UI, property inspector, Node.js bridge, CLI adapters, structured command protocol, ExtendScript execution engine, safety controls, logging, packaging.

## 2. Research & Verification Tasks
Before implementation, verify the following in the target environment:

1. **Claude Code CLI capabilities**
   - Run `claude code --help` and review Anthropic docs for:
     - `--print` (structured output mode)
     - `--command-hook` / custom command configuration (`.claude-code/config.toml`)
     - Support for `/command` style invocations inside chat.
   - Confirm how hooks receive requests (stdin/stdout, env vars) and determine JSON schema for hook payloads.

2. **Codex CLI capabilities**
   - Execute `codex --help` (or vendor equivalent) to check:
     - Structured/JSON output flags (`--json`, `--pretty`)
     - Support for custom commands or scripted responses.

3. **Formatting Enforcement**
   - Prototype prompts directing the CLI to wrap response sections in predefined delimiters:
     - `///` — human-readable response.
     - `{{{ … }}}` — ExtendScript instructions.
     - `>>> … <<<` — expressions to inject.
   - Confirm both CLIs respect these delimiters under various conversation lengths.

4. **After Effects Scripting**
   - Reconfirm the ExtendScript DOM for compositions, layers, properties, expressions.
   - Validate undo-group usage and JSON serialization (ExtendScript JSON polyfill if needed).

Document screenshots or transcripts of each CLI capability check to ensure future maintainers can reproduce the setups.

## 3. High-Level Architecture

```
+------------------------------------------------------------+
| CEP Panel (HTML/JS/React)                                  |
|  - Chat UI (/// output)                                    |
|  - Script & Expression Inspectors ({{{ }}} and >>> >>>)    |
|  - Property Context Viewer                                 |
+-------------------------+----------------------------------+
                          |
              CSInterface messages / evalScript calls
+-------------------------v----------------------------------+
| Node.js Host Bridge                                        |
|  - CLI Session Manager (Claude, Codex)                     |
|  - Formatting Contract Enforcer                            |
|  - Command Validator & Queue                               |
|  - Logging & Audit Writer                                  |
+-------------------------+----------------------------------+
                          |
                 spawn & pipe stdin/stdout
+-------------------------v----------------------------------+
| CLI Adapter Layer                                          |
|  - Claude Code Adapter (uses --print, command hooks)       |
|  - Codex Adapter (JSON output)                             |
|  - /command Routing                                        |
+-------------------------+----------------------------------+
                          |
             Structured actions / ExtendScript payloads
+-------------------------v----------------------------------+
| ExtendScript Execution Layer                               |
|  - Action Handlers (createComp, renameLayers, etc.)        |
|  - Property/Expression Serializers                         |
|  - Context Collector                                       |
+------------------------------------------------------------+
```

### Data Flow Summary
1. User submits prompt; panel injects current AE selection context.
2. Host bridge forwards message to CLI, prepending system prompt that enforces delimiter contract.
3. CLI returns structured response; bridge splits by delimiters:
   - `///` → chat display
   - `{{{ }}}` → JSON commands awaiting approval
   - `>>> <<<` → expressions or snippets
4. Upon user approval, sanitized commands execute via ExtendScript; results feed back to the CLI (for conversational memory) and UI.
5. All interactions logged locally.

## 4. Claude/Codex CLI Integration

### 4.1 Capability Discovery & Configuration
- **Config files**: Inspect `~/.claude-code/config.toml` (or CLI equivalent) for `command_hooks`, `pre_prompt`, and `/commands` sections. Document syntax so pipeline engineers can adjust without touching extension code.
- **Command Hooks**:
  - Define dedicated hook (e.g., `cep_after_effects`) that receives command payloads from the CLI.
  - Hook script can simply print JSON to stdout; Node host consumes it as if returned from CLI.
  - Ensure hook scripts do not require authentication (they run locally).

### 4.2 Formatting Contract
- Inject system prompt (for both CLIs) at conversation start:
  ```
  SYSTEM: Respond using the contract below for every message.
  - Wrap chat narrative in lines starting with /// (triple slash).
  - Wrap actionable ExtendScript commands in {{{ triple braces }}} as JSON.
  - Wrap expressions or snippets in >>> triple chevrons <<<.
  - If no content for a section, omit it entirely.
  - Do not include other text outside these delimiters.
  ```
- Validate by running canned prompts (“Create a 1920x1080 comp”) and verifying outputs follow contract. Adjust prompt or use CLI config `response_format` if available.

### 4.3 Custom `/commands`
- For Claude Code, define `/ae.preview`, `/ae.run`, `/ae.context` commands via CLI configuration or initial conversation instructions.
- Example instruction:
  ```
  SYSTEM: When you want to produce automation steps, issue a /ae.run command with the {{{ }}} payload.
  ```
- Ensure Node host parses `/ae.*` commands when emitted via CLI output or command hooks.

### 4.4 CLI Session Handling
- Start CLI in interactive mode with persistent history:
  - `claude code --print --no-color`
  - `codex chat --json --session <file>`
- Use newline-delimited JSON for `--print` data. Parse robustly: accumulate chunks until valid JSON closes.
- Detect CLI prompts for user login (e.g., “Please run `claude login`”). Relay to UI with actionable instructions.

### 4.5 Error & Timeout Handling
- Set watchdog timers (e.g., 30s) per request.
- On timeout, kill CLI child process (SIGTERM, fallback SIGKILL), restart session, notify user.
- Maintain exponential backoff to avoid rapid respawns.
- Sanitize CLI outputs (strip ANSI color codes even if `--no-color` fails).

## 5. Application Components (Detailed)

### 5.1 CEP Frontend
- **ChatView**
  - Parses `///` sections for display.
  - Shows pending state while CLI responds.
  - Highlights `/ae.preview` results differently (e.g., italic).
- **ActionReview**
  - Converts `{{{ }}}` payload to human-readable summary (table/list).
  - Offer “Approve”, “Edit Prompt”, “Discard”.
  - On approve, dispatch command to Node host.
- **ExpressionPanel**
  - Display `>>> <<<` expression blocks in code editor (monospace, syntax highlight).
  - Allow copy/paste or auto-apply (with explicit user confirmation).
- **SelectionContext**
  - Poll ExtendScript for selection metadata; update when `app.project.activeItem` changes.
  - Provide “Send Context to Agent” button.

### 5.2 Node Host Modules
- `cliManager.ts`: spawn/terminate CLI processes, handle login detection.
- `formatter.ts`: enforce delimiter parsing, detect missing sections (error if action lacks braces).
- `commandRouter.ts`: map `/ae.*` commands to action queue.
- `validator.ts`: JSON schema validation for commands.
- `logger.ts`: append sanitized transcripts to `~/Library/Application Support/AE-AI/logs/yyyymmdd.log`.
- `configStore.ts`: load/save user settings (CLI binary paths, working directory, default provider).

### 5.3 ExtendScript Layer
- `bridge.jsx` exports functions:
  - `ae_createComposition(params)`
  - `ae_createLayers(params)`
  - `ae_renameLayersSequential(params)`
  - `ae_applyExpression(params)`
  - `ae_readExpression(params)`
  - `ae_readSelectionContext()`
- Use `app.beginUndoGroup/app.endUndoGroup`.
- For expressions, check `property.canSetExpression` before applying.
- Return JSON via `returnValue` (string) to Node host.

### 5.4 Context Collection
- ExtendScript polls selection:
  ```javascript
  function getSelectionContext() {
    var ctx = { items: [] };
    // populate with layer/effect/property data (limit depth)
    return JSON.stringify(ctx);
  }
  ```
- Node host caches context (with timestamp) and includes trimmed version (<5 KB) in next prompt (prefixed by `CONTEXT:` inside system message).
- Provide toggle to disable context sharing.

### 5.5 Safety Controls
- **Action Whitelist**: Only accept `action` values recognized by validator.
- **Dry Run Mode**: Option to run CLI conversation without executing commands (just preview).
- **Approval Gate**: No automatic execution; require explicit user click.
- **Error Recovery**: If ExtendScript throws, capture message, send back in `///` section + feed to CLI as feedback.

## 6. Development Roadmap (Updated)

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| 0. Discovery | 1 week | Document CLI capabilities with screenshots/logs; finalize delimiter contract. |
| 1. Foundations | 2 weeks | CEP scaffold, Node host handshake, ExtendScript stub, bundler setup. |
| 2. CLI Integration | 2 weeks | Claude & Codex adapters, delimiter enforcement, login detection. |
| 3. Command Engine | 3 weeks | Command schema, validation, ExtendScript action handlers, context collector. |
| 4. UI/UX & Safety | 2 weeks | Chat UX polish, action review workflow, dry-run mode, enhanced logging. |
| 5. Testing & Hardening | 2 weeks | Unit & integration tests, AE manual QA, cross-platform validation. |
| 6. Packaging & Docs | 1 week | ZXP package, install guide, CLI setup instructions, security notes. |

Weekly demos should highlight:
- Phase 2: CLI output obeying delimiter contract.
- Phase 3: Approved command executing in AE.
- Phase 4: Full round-trip with context updates and logging.

## 7. Testing Strategy

| Level | Focus | Tooling |
|-------|-------|---------|
| Unit (Node) | Formatter, validator, CLI parser | Jest/Mocha, snapshots for delimiter parsing |
| ExtendScript | Command handlers | ExtendScript Toolkit/VSCode ExtendScript Debugger |
| CLI Integration | Contract compliance | Integration harness spawning fake CLI returning malformed/well-formed outputs |
| UI | Chat workflows, approval gating | Cypress (via Spectron or headless CEP harness), manual |
| Performance | Long chat sessions, multiple commands | Node profiler & AE logs |

Create regression scenarios:
- CLI returns malformed delimiters (missing closing braces).
- CLI outputs `/ae.run` without payload.
- ExtendScript error (e.g., property locked).
- CLI loses authentication mid-session.

## 8. Deployment & Configuration

1. **Prerequisites Documentation**:
   - Install Node.js (version range).
   - Install CLAUDE CLI: `pip install anthropic` or official installer.
   - Run `claude login` (outside extension).
   - For Codex CLI: `npm install -g codex-cli` (example). Run `codex login`.

2. **Extension Config Panel**:
   - Fields: provider (Claude/Codex), CLI binary path, working directory, default project instructions, “send context automatically” toggle.
   - Save to `~/Library/Application Support/AE-AI/config.json`.

3. **Packaging**:
   - Sign with `ZXPSignCmd`.
   - Deliver `.zxp` + instructions for ZXPInstaller/ExMan.
   - Provide fallback script for developer mode (unpacked extension).

4. **Updates**:
   - Manual: prompt user when new release is available.
   - Optional auto-check (if allowed) to GitHub release RSS (requires network; highlight compliance considerations).

## 9. Security & Privacy

- **No Credential Storage**: Extension never prompts for API keys; only stores CLI path configuration.
- **Local Execution**: All commands run locally; no network calls to third parties from the extension.
- **Approval Flow**: Enforce manual approval before executing `{{{ }}}` payloads.
- **Sanitization**: Strip potentially sensitive data from logs (e.g., expression contents if flagged).
- **CLI Lifecycle**: Provide “Stop Session” button to terminate CLI process; ensure clean shutdown when AE exits.
- **Audit Trail**: Log entries include timestamp, action, params (hashed if sensitive), results, CLI provider.

## 10. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| CLI updates break delimiter compliance | Encapsulate prompt template; add automated contract tests; provide quick patch path. |
| Command hooks unsupported on target platform | Fall back to system prompt instructions and parsing of `/ae.*` tokens. |
| Long responses exceed CLI buffer | Stream parsing line-by-line; enforce max size; ask agent to summarize. |
| Malicious commands | Whitelist actions; require approvals; optionally display diff preview before execution. |
| ExtendScript limitations (e.g., expressions failing) | Wrap in try/catch; relay errors to agent; suggest manual fix. |

## 11. Future Enhancements
- Additional command sets (render queue, project sanitization).
- Support for other local agents (LM Studio, Ollama) via adapter interface.
- Project-aware prompts (auto load style guides or project templates).
- Optional integration with DevMirror for unified logging.

## 12. Ready-to-Start Checklist
- [ ] Completed CLI capability validation logs.  
- [ ] Manifest updated with required privileges (`<CEFCommandLine>` spawn permissions).  
- [ ] ExtendScript JSON polyfill chosen and tested.  
- [ ] Developer certificates ready for ZXP signing.  
- [ ] Repository scaffolding with CEP sample and Node host baseline.

---

This document integrates CLI-specific tooling (hooks, custom `/commands`, structured output enforcement) into the overall architecture, ensuring the extension can reliably parse and execute agent recommendations while remaining compliant with user-controlled authentication. Let me know if you’d like deeper detail on any subsystem or a proof-of-concept script for the delimiter contract.
