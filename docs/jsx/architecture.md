---
id: 984b395c
title: System Architecture
tags:
  - architecture
  - design
  - components
  - system-design
  - jsx
aliases:
  - Architecture Documentation
  - System Design
created: 2025-08-28T16:51:39.806Z
updated: 2025-08-28T16:51:39.806Z
project: jsx
backlinks: 0
forwardLinks: 0
---

I'll analyze the architecture of the JSX project comprehensively. Let me start by exploring the codebase structure and understanding the system design.Let me explore more of the architecture to understand the system patterns and components better.# JSX Project Architecture Analysis

## 1. System Design Patterns

### **Layered Architecture**
The project follows a clear layered architecture with distinct separation of concerns:

```mermaid
graph TB
    subgraph "Presentation Layer"
        CEP[CEP Extensions<br/>React UI]
        JSX[JSX Scripts<br/>UI Components]
    end
    
    subgraph "Business Logic Layer"
        AEScripts[AE Automation Scripts]
        Modules[Shared Modules]
        Bundlers[Build Tools]
    end
    
    subgraph "Integration Layer"
        CSInterface[CSInterface<br/>Event System]
        AEGP[AEGP SDK<br/>Native Plugins]
    end
    
    subgraph "Adobe After Effects Runtime"
        ExtendScript[ExtendScript Engine<br/>ES3 Runtime]
        AECore[AE Core API]
    end
    
    CEP --> CSInterface
    JSX --> ExtendScript
    AEScripts --> Modules
    Modules --> ExtendScript
    CSInterface --> ExtendScript
    AEGP --> AECore
    ExtendScript --> AECore
```

### **Dual-Context Pattern (CEP Extensions)**
CEP extensions use a sophisticated dual-context architecture:

```mermaid
sequenceDiagram
    participant Browser as CEF Browser<br/>(Panel Context)
    participant CS as CSInterface
    participant Host as ExtendScript<br/>(Host Context)
    participant AE as After Effects
    
    Browser->>CS: User interaction
    CS->>Host: evalScript()
    Host->>AE: Execute operation
    AE-->>Host: Return result
    Host->>CS: Dispatch event
    CS->>Browser: Update UI
```

### **Module Pattern (ES3 Compatible)**
Due to ExtendScript's ES3 limitations, modules use IIFE pattern:

```javascript
// Module pattern used throughout
var ModuleName = (function() {
    var module = {};
    
    module.publicMethod = function() {
        // Implementation
    };
    
    return module;
})();
```

## 2. Component Relationships

### **Core Component Architecture**

```mermaid
graph LR
    subgraph "Workspace Root"
        Package[package.json<br/>Yarn Workspaces]
    end
    
    subgraph "packages/"
        AEScripts[ae-scripts/<br/>Automation Scripts]
        CEPExt[cep-extensions/<br/>UI Extensions]
        Plugins[plugins/<br/>Native AEGP]
    end
    
    subgraph "tools/"
        Bundlers[bundlers/<br/>Module Bundler]
        Modules[scripting-modules/<br/>Shared Libraries]
        Templates[templates/<br/>Project Templates]
    end
    
    Package --> AEScripts
    Package --> CEPExt
    Package --> Plugins
    
    AEScripts --> Modules
    CEPExt --> Modules
    Bundlers --> Modules
```

### **Frame Navigator Extension Architecture**

```mermaid
graph TB
    subgraph "Build Pipeline"
        Vite[Vite<br/>Development Server]
        Rollup[Rollup<br/>ES3 Transpiler]
        TSC[TypeScript<br/>Compiler]
    end
    
    subgraph "Panel Context (React 18)"
        Components[React Components]
        Hooks[Custom Hooks]
        Theme[Theme System]
    end
    
    subgraph "Host Context (ExtendScript)"
        JSXScripts[JSX Scripts]
        WindowMgr[Window Manager]
        PerfLogger[Performance Logger]
    end
    
    subgraph "Communication Layer"
        CSI[CSInterface]
        Events[Event System]
    end
    
    Vite --> Components
    TSC --> Components
    Rollup --> JSXScripts
    
    Components <--> CSI
    CSI <--> JSXScripts
    JSXScripts --> WindowMgr
    JSXScripts --> PerfLogger
```

## 3. Module Dependencies

### **Dependency Graph**

```mermaid
graph TD
    subgraph "Core Libraries"
        Ae[Ae.js<br/>AE API Wrapper]
        RefMgr[RefManager.js<br/>Reference Management]
        ErrorLog[ErrorLogging.js<br/>Error Handling]
    end
    
    subgraph "Utility Libraries"
        ArrayEx[ArrayEx.js<br/>Array Extensions]
        DebugHelper[debugHelper.js<br/>Debug Utilities]
        PropQuery[PropQuery.js<br/>Property Queries]
    end
    
    subgraph "Effect Libraries"
        ApplyFFX[ApplyFFX.js<br/>Effect Application]
        ShapeLayer[ShapeLayerTreeView.js<br/>Shape Management]
    end
    
    subgraph "Scripts"
        Animation[Animation Scripts]
        Composition[Composition Scripts]
        Effects[Effects Scripts]
        Keyframes[Keyframe Scripts]
    end
    
    Animation --> Ae
    Animation --> RefMgr
    Composition --> Ae
    Effects --> ApplyFFX
    Effects --> ErrorLog
    Keyframes --> PropQuery
    
    Ae --> ArrayEx
    RefMgr --> DebugHelper
    ApplyFFX --> Ae
```

### **Build Dependencies**

```mermaid
graph LR
    subgraph "Development"
        TS[TypeScript 5.0]
        React18[React 18.2]
        Vite5[Vite 5.0]
    end
    
    subgraph "Transpilation"
        Babel[Babel 7.19]
        Rollup4[Rollup 4.0]
        CoreJS[Core-JS 3]
    end
    
    subgraph "Adobe SDK"
        TypesAdobe[types-for-adobe]
        ViteCEP[vite-cep-plugin]
        AEGPSDK[AEGP SDK Headers]
    end
    
    TS --> Babel
    React18 --> Vite5
    Vite5 --> ViteCEP
    Babel --> CoreJS
    Rollup4 --> Babel
```

## 4. Architectural Decisions

### **Technology Choices**

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **UI Framework** | React 18 | Modern component-based UI with hooks support |
| **Build Tool** | Vite 5 | Fast HMR, native ES modules, excellent DX |
| **Language** | TypeScript 5 | Type safety, better IDE support, maintainability |
| **Module System** | Yarn Workspaces | Monorepo management, shared dependencies |
| **Transpiler** | Babel + Rollup | ES3 compatibility for ExtendScript |
| **Native Plugin** | AEGP SDK (C++) | Performance-critical operations, deeper AE integration |

### **Design Principles**

1. **Separation of Concerns**
   - Clear boundary between UI (React) and business logic (ExtendScript)
   - Modular script architecture with single-responsibility modules

2. **Progressive Enhancement**
   - Scripts work standalone, CEP extensions add enhanced UI
   - Native plugins for performance-critical features

3. **Backward Compatibility**
   - ES3 transpilation ensures compatibility with all AE versions
   - Version-agnostic CSInterface implementation

4. **Developer Experience**
   - Hot Module Replacement for rapid development
   - TypeScript for better tooling and error prevention
   - Automated build pipeline with Vite

## 5. Scalability Considerations

### **Horizontal Scalability**

```mermaid
graph TB
    subgraph "Current Architecture"
        WS[Workspace Root]
        P1[Package 1]
        P2[Package 2]
        P3[Package N...]
        
        WS --> P1
        WS --> P2
        WS --> P3
    end
    
    subgraph "Scalability Pattern"
        NewScript[New Script Package]
        NewCEP[New CEP Extension]
        NewPlugin[New Native Plugin]
    end
    
    P3 -.-> NewScript
    P3 -.-> NewCEP
    P3 -.-> NewPlugin
```

### **Performance Optimization Strategies**

1. **Lazy Loading**
   - CEP extensions load JSX scripts on-demand
   - Module bundler includes only used functions

2. **Caching**
   - Performance timing cache for diagnostics
   - Module resolution cache in bundler

3. **Batch Operations**
   - Script operations batched with `app.beginUndoGroup()`
   - Event throttling in CEP communication layer

4. **Memory Management**
   - Explicit cleanup in native plugins
   - Reference counting in RefManager module

### **Scalability Limitations**

| Constraint | Impact | Mitigation |
|------------|--------|------------|
| **ES3 Runtime** | No modern JS features | Transpilation pipeline |
| **Single-threaded ExtendScript** | UI blocking on heavy ops | Native plugins for compute |
| **CSInterface overhead** | Communication latency | Event batching, caching |
| **AE API limitations** | Some operations unavailable | AEGP SDK for advanced features |

## 6. Integration Points

### **External Integration Architecture**

```mermaid
graph TB
    subgraph "Adobe Ecosystem"
        AE[After Effects]
        PPro[Premiere Pro]
        PS[Photoshop]
    end
    
    subgraph "JSX Project"
        CEP[CEP Extensions]
        Scripts[JSX Scripts]
        Plugins[AEGP Plugins]
    end
    
    subgraph "External Systems"
        FS[File System]
        Net[Network APIs]
        Node[Node.js Runtime]
        Shell[Shell Commands]
    end
    
    CEP --> AE
    Scripts --> AE
    Plugins --> AE
    
    CEP -.-> PPro
    CEP -.-> PS
    
    CEP --> Node
    Node --> FS
    Node --> Net
    Node --> Shell
```

### **Integration Mechanisms**

1. **Adobe Creative Cloud**
   - CEP extensions run across CC applications
   - Shared manifests for multi-host support

2. **File System**
   - Project templates (.aep files)
   - Effect presets (.ffx files)
   - Configuration files (JSON)

3. **External Tools**
   - Git integration for version control
   - npm/yarn for dependency management
   - ZXP packaging for distribution

4. **Communication Protocols**
   - CSInterface events (internal)
   - JSON-based data exchange
   - Binary protocols for native plugins

### **API Surface**

```mermaid
graph LR
    subgraph "Public APIs"
        ScriptAPI[Script Entry Points]
        CEPAPI[CEP Panel APIs]
        ModuleAPI[Module Exports]
    end
    
    subgraph "Internal APIs"
        AECore[AE Core Functions]
        AEGPAPI[AEGP Suite Functions]
        Utils[Utility Functions]
    end
    
    subgraph "Extension Points"
        Hooks[Event Hooks]
        Callbacks[UI Callbacks]
        Templates[Project Templates]
    end
    
    ScriptAPI --> AECore
    CEPAPI --> Utils
    ModuleAPI --> AECore
    
    Hooks --> ScriptAPI
    Callbacks --> CEPAPI
```

## Summary

The JSX project demonstrates a sophisticated multi-layered architecture designed for Adobe After Effects automation and extension development. Key architectural strengths include:

- **Clean separation** between UI and business logic layers
- **Flexible module system** despite ES3 constraints  
- **Modern tooling** (React, TypeScript, Vite) with backward compatibility
- **Multiple integration patterns** (CEP, AEGP, standalone scripts)
- **Scalable monorepo structure** using Yarn workspaces

The architecture effectively balances modern development practices with the constraints of the Adobe ExtendScript environment, providing a robust foundation for building professional After Effects tools and workflows.


## Related Documents

Documents with similar tags:

- [[jsx/overview|Project Overview]] #overview #documentation #jsx #project-structure

