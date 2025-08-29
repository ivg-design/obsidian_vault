---
title: DocuMentor TUI Overhaul TODO
date: 2024-08-29
tags: [docuMentor, todo, TUI, refactoring, development]
status: in-progress
---

# DocuMentor TUI Overhaul - Current Status & TODO

## 🎯 Objective
Complete overhaul of the DocuMentor Terminal User Interface (TUI) to fix stability issues, improve usability, and implement proper keyboard handling.

## 📊 Current Status

### ✅ Completed Tasks
1. **Removed structure size truncation limit**
   - Fixed in `MultiProjectAnalyzer.ts`
   - Structure is no longer truncated at 1000 chars
   - Full project structure now sent to Claude for analysis

2. **Fixed message formatting**
   - Updated uninformative messages like "Processing (4 files)..."
   - Changed to: "Claude is analyzing project structure (X files examined)"
   - Made token processing messages more descriptive

3. **Audited current TUI implementation**
   - Identified multiple redundant TUI files:
     - AdvancedTerminalUI.ts
     - BlessedTerminalUI.ts
     - CleanTerminalUI.ts
     - ProperTerminalUI.ts
     - PulseTerminalUI.ts
     - SimpleTerminalUI.ts
     - StableTerminalUI.ts
   - All old TUI files have been removed

4. **Cleaned package.json**
   - Removed unused dependencies:
     - blessed, blessed-contrib
     - terminal-kit
     - ink and related packages
     - ora, inquirer, figlet
     - cli-progress, cli-table3
   - Kept only essential: chalk, commander

## 🔧 Current Issues

### Problems Identified
1. **Terminal capability errors**: xterm-256color.Setulc parsing errors
2. **Keyboard shortcuts not working**: Ctrl+C, Ctrl+D show as ^C, ^D literal text
3. **Phase updates not visible**: Though they are updating in the code
4. **Debug logs truncated**: Can't see full output when debugging
5. **No scrolling capability**: Can't review previous output
6. **API timeout errors**: Implementation attempts causing timeouts

## 📝 TODO Tasks

### High Priority
- [ ] **Create new TUI with readline and ANSI codes**
  - Use native readline for keyboard input
  - Implement raw ANSI escape codes for display
  - Use chalk only for text coloring
  - Manual screen rendering with console.log

- [ ] **Implement alternate screen buffer**
  - Switch to alternate buffer: `\x1b[?1049h`
  - Return to main buffer on exit: `\x1b[?1049l`
  - Preserve terminal history

- [ ] **Add scrollable output with arrow keys**
  - Maintain internal buffer of all messages
  - Track viewport position
  - Arrow up/down to scroll through history
  - Page up/down for faster scrolling

- [ ] **Create actionable header**
  - Show current phase
  - Display running time (elapsed)
  - Show lock file status
  - Display file count processed
  - Memory usage indicator

- [ ] **Add debug mode toggle**
  - Ctrl+D to toggle debug view
  - Show raw Claude API events when enabled
  - Maintain separate debug log buffer
  - Switch between normal and debug views

### Implementation Approach

```typescript
// Core structure for new TUI
class CleanTerminalUI {
  private logs: LogEntry[] = [];
  private debugLogs: DebugEntry[] = [];
  private viewportOffset: number = 0;
  private debugMode: boolean = false;
  private phase: string = 'Initializing';
  private startTime: number = Date.now();
  
  // Use readline for input
  private rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  // ANSI escape codes
  private readonly CLEAR = '\x1b[2J';
  private readonly HOME = '\x1b[H';
  private readonly HIDE_CURSOR = '\x1b[?25l';
  private readonly SHOW_CURSOR = '\x1b[?25h';
  private readonly ALT_BUFFER_ON = '\x1b[?1049h';
  private readonly ALT_BUFFER_OFF = '\x1b[?1049l';
}
```

### Features to Implement
1. **Header Section** (3 lines)
   - Title bar with project name
   - Status line with phase, files, time, memory
   - Control hints line

2. **Log Area** (scrollable)
   - Show latest messages by default
   - Full message text (no truncation)
   - Timestamp and level indicators
   - Color coding by log level

3. **Debug Panel** (toggleable)
   - Raw API events
   - Full error stack traces
   - Performance metrics
   - Claude token usage

4. **Keyboard Controls**
   - Ctrl+C: Clean exit
   - Ctrl+D: Toggle debug mode
   - ↑/↓: Scroll log
   - Page Up/Down: Fast scroll
   - Home/End: Jump to start/end
   - 'q': Quit
   - 'r': Refresh display

## 🚀 Next Steps

1. Create `CleanTerminalUI.ts` with minimal dependencies
2. Test keyboard input handling with readline
3. Implement ANSI-based rendering
4. Update all references in codebase
5. Test with self-document command
6. Ensure proper cleanup on exit

## 📦 Dependencies

### Keep
- chalk: For text coloring
- commander: For CLI interface

### Add (if needed)
- None - use Node.js built-in readline

### Removed
- All blessed-based libraries
- All terminal-kit libraries
- React-based ink components
- Heavy UI libraries

## 🐛 Known Issues to Address

1. Lock file conflicts when multiple instances run
2. Message formatting needs to be informative but concise
3. Claude API streaming events need better handling
4. Progress tracking needs to be more accurate
5. Error recovery needs improvement

## 📌 References

- Original issue: TUI crashes with xterm-256color.Setulc error
- User requirements: Scrollable output, debug toggle, clean keyboard handling
- Target: Stable, responsive TUI with minimal dependencies

---
*Last updated: 2024-08-29 21:40 PST*