---
title: DocuMentor TUI Overhaul TODO
date: 2025-08-29
tags: [docuMentor, todo, TUI, refactoring, development, broken, urgent]
status: broken-needs-fix
priority: critical
---

# 🚨 DocuMentor TUI Overhaul - CRITICAL STATUS

## ⚠️ CURRENT STATE: PROJECT BROKEN
**The DocuMentor project cannot currently compile or run.**

### Build Errors
```
src/ClaudeStreamClient.ts: Cannot find module './CleanTerminalUI'
src/EnhancedClaudeClient.ts: Cannot find module './CleanTerminalUI'  
src/EnhancedClaudeClientV2.ts: Cannot find module './StableTerminalUI'
src/FullMontyGeneratorV3.ts: Cannot find module './StableTerminalUI'
src/MultiProjectAnalyzer.ts: Cannot find module './StableTerminalUI'
src/SmartTagManager.ts: Cannot find module './StableTerminalUI'
```

## 📊 Actual Current Status

### ✅ Successfully Completed
1. **Removed structure size truncation limit**
   - Fixed in `MultiProjectAnalyzer.ts` 
   - Removed 1000 char limit
   - Full structure now sent to Claude

### ⚠️ Partially Completed
2. **Message formatting improvements**
   - ✅ Fixed token processing message: "Claude is generating comprehensive analysis (X tokens processed)"
   - ✅ Fixed file processing: "Claude has examined X files in the project structure"
   - ❌ Need to audit ALL other messages throughout codebase for clarity

3. **Old TUI removal**
   - ✅ Deleted all UI files with `rm -f src/*TerminalUI.ts src/*UI.ts`
   - ❌ Did NOT update imports in 6+ files that reference them
   - ❌ Project now fails to compile

4. **Package.json cleanup**
   - ✅ Removed UI packages from package.json dependencies
   - ❌ Packages still physically exist in node_modules
   - ❌ Need to run `npm install` to actually remove them

### ❌ Not Started
5. Create new TUI with readline and ANSI codes
6. Implement alternate screen buffer
7. Add scrollable output with arrow keys
8. Create actionable header with phase and status
9. Add debug mode toggle
10. Test the new implementation

## 🔥 Immediate Actions Required

### Step 1: Create Minimal Stub UI (To Unbreak Build)
Create a temporary minimal UI interface that satisfies all imports:

```typescript
// src/MinimalUI.ts - Temporary stub to fix build
export class StableTerminalUI {
  log(level: string, message: string) { console.log(`[${level}] ${message}`); }
  updatePhase(phase: string) { console.log(`Phase: ${phase}`); }
  updateStatus(category: string, message: string) { console.log(`[${category}] ${message}`); }
  streamFile(action: string, file: string) { console.log(`${action}: ${file}`); }
  streamAnalysis(source: string, message: string) { console.log(`[${source}] ${message}`); }
  stream(message: string) { console.log(message); }
  logError(title: string, error: any) { console.error(`${title}:`, error); }
  debugEvent(event: any) { /* noop */ }
  displayTitle(projectName: string) { console.log(`\n=== ${projectName} ===\n`); }
  showSummary(report: any) { console.log('Summary:', report); }
  createTask(id: string, name: string, total: number) { console.log(`Task: ${name}`); }
  updateTask(id: string, progress: number, status?: string) { if (status) console.log(status); }
  completeTask(id: string, success: boolean) { /* noop */ }
  destroy() { /* noop */ }
}

export class CleanTerminalUI extends StableTerminalUI {}
export class BlessedTerminalUI extends StableTerminalUI {}
```

### Step 2: Fix All Imports
Update all files to use the minimal UI temporarily:
- ClaudeStreamClient.ts
- EnhancedClaudeClient.ts
- EnhancedClaudeClientV2.ts
- FullMontyGeneratorV3.ts
- MultiProjectAnalyzer.ts
- SmartTagManager.ts

### Step 3: Clean Node Modules
```bash
npm install  # This will remove packages not in package.json
```

### Step 4: Create Proper New TUI
Then implement the real TUI with the requested features.

## 📝 Complete TODO List

### Critical (Unbreak the build)
- [ ] Create MinimalUI.ts stub to satisfy imports
- [ ] Update all imports to use MinimalUI
- [ ] Verify project compiles
- [ ] Run `npm install` to clean node_modules

### High Priority (New TUI Implementation)
- [ ] Create CleanTerminalUI.ts with:
  - [ ] readline for keyboard input
  - [ ] ANSI escape codes for display
  - [ ] chalk for colors only
  - [ ] No external UI libraries

### Features to Implement
- [ ] **Alternate screen buffer**
  - Enter: `\x1b[?1049h`
  - Exit: `\x1b[?1049l`
  - Hide cursor: `\x1b[?25l`
  - Show cursor: `\x1b[?25h`

- [ ] **Scrollable output**
  - Internal message buffer (unlimited)
  - Viewport tracking
  - Arrow keys for line scroll
  - Page Up/Down for page scroll
  - Home/End for jump to start/end

- [ ] **Header Section**
  - Line 1: Title bar
  - Line 2: Phase | Files | Time | Memory
  - Line 3: Keyboard shortcuts
  - Line 4: Separator

- [ ] **Debug Mode**
  - Ctrl+D toggle
  - Separate debug log buffer
  - Show raw API events
  - Full error traces

- [ ] **Message Formatting**
  - Review ALL log messages
  - Make them informative but concise
  - No truncation unless in summary mode

### Testing
- [ ] Test keyboard input handling
- [ ] Test with self-document command
- [ ] Verify clean exit
- [ ] Test interrupt handling (Ctrl+C)
- [ ] Test debug mode toggle
- [ ] Test scrolling functionality

## 🎯 Success Criteria

1. Project compiles and runs
2. No terminal capability errors
3. Keyboard shortcuts work properly
4. Messages are informative
5. Can scroll through history
6. Debug mode shows raw output
7. Clean exit without terminal corruption
8. Minimal dependencies (only chalk)

## 📦 Dependency Status

### To Keep
- chalk (for colors)
- commander (for CLI)
- @anthropic-ai/claude-code (core SDK)

### To Remove (still in node_modules)
- blessed, blessed-contrib
- terminal-kit
- ink, react
- ora, figlet
- cli-progress, cli-table3
- All their @types packages

### Removed from package.json
✅ All UI packages removed from package.json
❌ But still need `npm install` to clean node_modules

## 🐛 Known Issues

1. **API Timeouts**: Implementation attempts causing timeouts - need smaller, focused changes
2. **Import errors**: 6 files importing non-existent UI modules
3. **Package mismatch**: package.json updated but node_modules not cleaned
4. **Message formatting**: Only partially updated, need comprehensive review
5. **No working UI**: All UI implementations deleted, no replacement yet

## 📅 Timeline

1. **Immediate** (5 min): Create stub UI to unbreak build
2. **Next** (10 min): Fix imports and verify compilation
3. **Then** (20 min): Implement basic CleanTerminalUI
4. **Finally** (30 min): Add all features (scrolling, debug, etc.)

---
*Last updated: 2025-08-29 21:45 PST*
*Status: CRITICAL - Project non-functional*