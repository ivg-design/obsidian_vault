---
id: 6e72298a
title: API Reference
tags:
  - api
  - endpoints
  - reference
  - rest
  - jsx
aliases:
  - API Documentation
  - Endpoints
created: 2025-08-28T16:48:12.007Z
updated: 2025-08-28T16:48:12.007Z
project: jsx
backlinks: 0
forwardLinks: 0
---

I'll analyze the JSX repository to document all APIs, endpoints, and interfaces. Let me start by exploring the codebase structure to identify API-related files.Let me explore the packages directory to find API-related code:Let me explore further to find API-related code in the project. Let me check for server or API implementations:Now let me search for JavaScript/TypeScript API implementations:Let me examine the CEP extension APIs and interfaces:Now let me examine specific API implementations in detail and create comprehensive documentation:Let me continue exploring the CEP API methods:Now let me check ExtendScript/JSX APIs:Now let me check the AEGP plugin APIs:Now let me create the comprehensive API reference documentation:Let me check if there's an existing docs directory where I should place this:I'll save it to the docuMentor repository instead:## Comprehensive API Reference Documentation Complete

I have successfully analyzed the `/Users/ivg/github/jsx` repository and created a comprehensive API reference documentation covering:

### 📚 **Documented APIs**

1. **CEP Extension APIs** - CSInterface v11.0.0 with 35+ methods for extension-to-host communication
2. **AEGP Plugin APIs** - Native C++ plugin structure with hook system and suite handlers  
3. **ExtendScript/JSX APIs** - Ae.js utility module with 40+ functions for After Effects scripting
4. **Internal TypeScript APIs** - Frame navigation utilities, type definitions, and Bolt utilities

### 🔍 **Key Findings**

- **No REST/HTTP APIs found** - This is an Adobe After Effects extension ecosystem, not a web service
- **No GraphQL or WebSocket APIs** - Communication happens through CEP/ExtendScript bridge
- **Authentication** - Handled through Adobe's extension signing and CEP security model
- **Three API layers**:
  - JavaScript (CEP extensions)
  - C++ (AEGP plugins)  
  - ExtendScript (automation scripts)

### 📄 **Documentation Structure**

The API reference includes:
- Complete method signatures with parameters and return types
- Usage examples for each API category
- Security and authentication details
- Error handling patterns
- Response formats for inter-process communication
- Version compatibility information

### 💡 **Notable API Categories**

- **CSInterface**: evalScript(), getHostEnvironment(), dispatchEvent()
- **AEGP Hooks**: CommandHook, UpdateMenuHook, IdleHook, DeathHook
- **ExtendScript Utilities**: Property traversal, layer operations, undo groups
- **Frame Utils**: Timecode conversion, frame parsing, navigation helpers

The documentation is ready for use as a comprehensive reference for developers working with Adobe After Effects extensions, plugins, and scripts.


## Related Documents

Documents with similar tags:

- [[jsx/overview|Project Overview]] #overview #documentation #jsx #project-structure
- [[jsx/architecture|System Architecture]] #architecture #design #components #system-design #jsx

