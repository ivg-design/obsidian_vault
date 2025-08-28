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
created: 2025-08-28T16:57:15.062Z
updated: 2025-08-28T16:57:15.062Z
project: jsx
backlinks: 0
forwardLinks: 0
---

I'll analyze the /Users/ivg/github/jsx directory to document all APIs. Let me start by exploring the structure to identify API endpoints, schemas, and interfaces.Let me explore the packages directory and look for API definitions:Let me look for API definitions in the cep-extensions directory and check for REST/GraphQL endpoints:Let me check for JavaScript/TypeScript API definitions in the CEP extensions:Let me check specific API files and interfaces:Let me explore the CSInterface and CEP APIs:Let me continue reading the CSInterface to understand the main API:Let me continue reading the CSInterface class methods:Let me check the frame navigator specific APIs:Let me check for ExtendScript/JSX APIs:Now let me check AEGP APIs:Let me check for scripting module APIs:Let me check the bundler APIs:Now let me compile all the APIs into a comprehensive documentation:I've documented all the APIs found in the JSX repository at `/Users/ivg/github/jsx`. The documentation covers:

1. **CEP Extension APIs** - CSInterface and related classes for Adobe Creative Cloud extensions
2. **ExtendScript/JSX APIs** - Frame navigation functions for After Effects
3. **AEGP Plugin APIs** - Native plugin interfaces for fNav+
4. **Scripting Module APIs** - Utility modules like Ae.js for After Effects scripting
5. **Bundler APIs** - Module bundling tools for JavaScript

Key findings:
- **No REST endpoints** - This is a desktop application plugin repository, not a web service
- **No GraphQL schemas** - Uses ExtendScript and CEP APIs instead
- **No WebSocket events** - Communication uses CSInterface.evalScript() and AEGP callbacks
- **Authentication** - Handled by Adobe Creative Cloud, not the extensions

The APIs are primarily focused on:
- Frame navigation and timecode conversion
- Property manipulation in After Effects
- CEP panel extension functionality
- Native AEGP plugin development
- JavaScript module bundling for ExtendScript

The documentation includes example usage, parameter descriptions, and return types for all major functions and interfaces found in the codebase.


## Related Documents

Documents with similar tags:

- [[jsx/overview|Project Overview]] #overview #documentation #jsx #project-structure
- [[jsx/architecture|System Architecture]] #architecture #design #components #system-design #jsx

