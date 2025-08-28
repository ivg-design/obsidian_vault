I'll analyze the architecture of the JSX project comprehensively. Let me start by exploring the repository structure and understanding the codebase.Now let me explore the plugin architecture and CEP extensions structure:Now let me analyze the plugin architecture and core components:Let me examine more architectural components and module bundler:Let me explore the frame navigator implementation:Now let me check the documentation structure to understand architectural decisions:Let me explore more architectural patterns and the plugin system:Now let me check the MCP implementation:Let me understand the CEP extension hooks implementation:Now let me examine the TypeScript/React architecture and create the comprehensive architecture documentation:Let me check the existing directory structure first:Let me check the correct path:## Architecture Analysis Complete

I've completed a comprehensive analysis of the JSX project architecture. Here are the key findings:

### 🏗️ **System Design Patterns**
1. **Monorepo Architecture** with Yarn workspaces for package management
2. **Module Pattern (IIFE)** for JSX scripts encapsulation  
3. **React Component-Based** architecture for CEP extensions
4. **Object-Oriented C++** for native AEGP plugins
5. **Layered Architecture** with clear separation between scripting, UI, and native layers

### 🔄 **Component Relationships**
- **33 Production Scripts** organized into 7 categories (animation, composition, effects, keyframes, layers, paths, utilities)
- **CEP Extensions** using React/TypeScript for modern UI
- **Native AEGP Plugins** for performance-critical operations
- **Shared Modules** providing common functionality across scripts

### 📊 **Data Flow Patterns**
1. **JSX Scripts**: User Input → ExtendScript → AE DOM → Layer/Comp Modifications
2. **CEP Extensions**: React UI → CSInterface → ExtendScript → Promise Resolution
3. **AEGP Plugins**: AE Host → Entry Point → Command Hooks → UI Updates

### 📦 **Module Dependencies**
- Core dependencies: React 18.2.0, TypeScript 5.0.0, Vite 5.0.0
- Adobe integrations: types-for-adobe, vite-cep-plugin
- Modern tooling: ESLint, Prettier, custom bundlers

### 🎯 **Architectural Decisions (ADRs)**
1. Monorepo for shared dependencies and atomic commits
2. TypeScript for type safety in complex UI logic
3. IIFE modules to prevent namespace pollution
4. Native AEGP for sub-millisecond response times
5. Custom bundler for ExtendScript optimization

### 📈 **Scalability Considerations**
- **Lazy loading** for on-demand script execution
- **Caching mechanisms** for computed values
- **Batch operations** for bulk processing
- **Horizontal scaling** through modular script architecture
- **Performance optimization** via native plugins

### 🔌 **Integration Points**
1. Adobe After Effects DOM API
2. CEP Communication Bridge (CSInterface)
3. Model Context Protocol (MCP) for AI assistance
4. AEGP Suite handlers for native integration
5. File system for templates and presets

### 🚀 **Technology Rationale**
- **ExtendScript (ES3)**: Required for AE automation
- **React/TypeScript**: Modern development experience for UI
- **C++/Objective-C**: Native performance for critical paths
- **Vite**: Fast build times and HMR support
- **Custom bundlers**: Optimized for ExtendScript requirements

The architecture demonstrates mature design with excellent separation of concerns, enabling independent evolution of components while maintaining system cohesion. The combination of scripting, modern web tech, and native code provides optimal solutions for different performance and functionality requirements.