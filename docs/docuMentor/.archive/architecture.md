I'll analyze the architecture of the docuMentor project comprehensively. Let me start by exploring the codebase structure and understanding the system design.Now let me explore the main components to understand the architecture better:Now let me read some of the key component files to understand the architecture better:Now I'll create a comprehensive architecture documentation file for the DocuMentor project:I need permission to write the architecture documentation file. Let me save it to the project:I've created comprehensive architecture documentation for the DocuMentor project. The documentation includes:## Architecture Analysis Complete

I've analyzed the DocuMentor architecture and prepared comprehensive documentation covering:

### 1. **System Design Patterns**
- Command Pattern (CLI command handlers)
- Observer Pattern (EventEmitter for monitoring)
- Strategy Pattern (project type strategies)
- Factory Pattern (component creation)
- Singleton Pattern (ConfigManager)

### 2. **Component Relationships**
- 12 core components identified with clear responsibilities
- Layered architecture: UI → Services → Analysis → Infrastructure
- Event-driven communication between components

### 3. **Data Flow Diagrams**
- Documentation generation flow (User → CLI → DocAgent → Analysis → Formatting → Storage)
- GitHub monitoring flow (continuous polling and updates)
- Mermaid diagrams included for visual representation

### 4. **Module Dependencies**
- Clear dependency hierarchy
- External: Node.js, Commander.js, Claude Code SDK
- Internal: Modular design with single responsibilities
- Client module wraps Claude SDK interactions

### 5. **Architectural Decisions (ADRs)**
- TypeScript for type safety
- Claude Code SDK as core AI engine
- Event-driven architecture for flexibility
- Obsidian as primary output format
- Configuration-first design approach

### 6. **Scalability Considerations**
- Streaming processing for large responses
- Lazy loading and caching strategies
- Horizontal scaling via multiple instances
- Performance metrics and optimization strategies

### 7. **Integration Points**
- Claude Code SDK (AI analysis)
- GitHub API (repository monitoring)
- Obsidian Vault (file system)
- Extension points for plugins

### 8. **Technology Choices Rationale**
- **TypeScript**: Type safety and maintainability
- **Node.js**: Async I/O for file operations
- **Commander.js**: Industry-standard CLI framework
- **EventEmitter**: Native Node.js event handling
- **Claude Code SDK**: Advanced AI-powered analysis

The architecture follows modern software design principles with clear separation of concerns, extensibility, and safety-first approach. The system is designed to scale both vertically and horizontally while maintaining code quality and performance.