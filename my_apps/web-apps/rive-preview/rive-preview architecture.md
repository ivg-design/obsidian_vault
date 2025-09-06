Rive Preview Platform - Comprehensive Architecture Document

  Table of Contents

  1. #executive-summary
  2. #system-architecture
  3. #technology-stack
  4. #repository-structure
  5. #authentication--user-management
  6. #animation-management-system
  7. #deployment-pipeline
  8. #data-persistence-layer
  9. #environment-strategy
  10. #security-model
  11. #development-workflow
  12. #implementation-roadmap

  ---
  Executive Summary

  Purpose

  Rive Preview is a professional animation preview platform that enables designers and developers to:
  - Preview and test Rive animations in a controlled environment
  - Customize CSS styling with persistence across sessions
  - Share animations within teams (work mode) or manage personal collections
  - Deploy animations with consistent metadata and organization

  Core Philosophy

  Separation of Concerns with Unified Experience: Development happens in isolation (rive-preview repo), deployment serves users (forge platform), but the experience remains
   seamless.

  ---
  System Architecture

  High-Level Architecture

  %%{init: {'theme':'dark', 'themeVariables': { 'primaryColor':'#1f2937', 'primaryTextColor':'#f3f4f6', 'primaryBorderColor':'#60a5fa', 'lineColor':'#60a5fa',
  'secondaryColor':'#374151', 'tertiaryColor':'#1f2937', 'background':'#111827', 'mainBkg':'#1f2937', 'secondBkg':'#374151', 'fontFamily':'monospace'}}}%%
  graph TB
      Users["👥 USERS"]:::userNode
      Forge["🌐 forge.mograph.life<br/>(Vercel Deployment)"]:::deployNode

      Prod["📦 Production<br/>forge.mograph.life"]:::envNode
      Stage["🧪 Staging<br/>staging.forge.mograph.life"]:::envNode

      RivePreview["📁 rive-preview<br/>(Private Source Repo)"]:::sourceNode

      Clerk["🔐 Clerk<br/>(Authentication)"]:::serviceNode
      Supabase["💾 Supabase<br/>(Database)"]:::serviceNode
      CDN["⚡ CDN<br/>(Static Assets)"]:::serviceNode

      Users -->|"HTTPS"| Forge
      Forge --> Prod
      Forge --> Stage

      Prod --> RivePreview
      Stage --> RivePreview

      RivePreview --> Clerk
      RivePreview --> Supabase
      RivePreview --> CDN

      classDef userNode fill:#10b981,stroke:#34d399,stroke-width:2px,color:#000
      classDef deployNode fill:#3b82f6,stroke:#60a5fa,stroke-width:2px,color:#fff
      classDef envNode fill:#8b5cf6,stroke:#a78bfa,stroke-width:2px,color:#fff
      classDef sourceNode fill:#f59e0b,stroke:#fbbf24,stroke-width:2px,color:#000
      classDef serviceNode fill:#6366f1,stroke:#818cf8,stroke-width:2px,color:#fff

  Component Interaction Flow

  %%{init: {'theme':'dark', 'themeVariables': { 'primaryColor':'#1f2937', 'primaryTextColor':'#f3f4f6', 'primaryBorderColor':'#60a5fa', 'lineColor':'#60a5fa',
  'secondaryColor':'#374151', 'background':'#111827', 'mainBkg':'#1f2937', 'secondBkg':'#374151'}}}%%
  sequenceDiagram
      participant U as User
      participant A as App
      participant C as Clerk
      participant S as Supabase
      participant R as Rive Runtime

      U->>A: Visit Site
      A->>C: Check Session
      C-->>A: JWT Token
      A->>S: Init with JWT
      S-->>A: Authenticated
      U->>A: Select Animation
      A->>R: Load Animation
      R-->>U: Render
      U->>A: Edit CSS
      A->>S: Save Settings
      S-->>A: Confirmed
      A-->>U: UI Updated

  ---
  Technology Stack

  Core Technologies

  | Component       | Technology       | Purpose             | Why This Choice                                                |
  |-----------------|------------------|---------------------|----------------------------------------------------------------|
  | Frontend        | Vanilla JS + CSS | Interactive UI      | No build step, instant updates, maximum compatibility          |
  | Animation       | Rive Runtime     | Animation rendering | Industry-standard, performant, feature-rich                    |
  | Authentication  | Clerk            | User management     | Seamless JWT integration, excellent DX, multi-provider support |
  | Database        | Supabase         | Data persistence    | PostgreSQL power, real-time capabilities, Row Level Security   |
  | Deployment      | Vercel           | Static hosting      | Edge network, instant deployments, excellent Git integration   |
  | Version Control | GitHub           | Source management   | Actions for CI/CD, secrets management, collaboration           |

  Integration Points

  %%{init: {'theme':'dark', 'themeVariables': { 'primaryColor':'#1f2937', 'primaryTextColor':'#f3f4f6', 'primaryBorderColor':'#60a5fa', 'lineColor':'#60a5fa',
  'secondaryColor':'#374151', 'background':'#111827'}}}%%
  graph LR
      Clerk["🔐 Clerk"]:::authNode
      Supabase["💾 Supabase"]:::dbNode
      App["📱 App Logic"]:::appNode
      GitHub["🐙 GitHub"]:::gitNode
      Vercel["▲ Vercel"]:::deployNode
      Forge["🌐 Forge Repo"]:::forgeNode

      Clerk -->|"JWT Token"| Supabase
      Clerk -->|"User ID"| App
      GitHub -->|"Webhook"| Vercel
      GitHub -->|"Action"| Forge

      classDef authNode fill:#10b981,stroke:#34d399,stroke-width:2px,color:#000
      classDef dbNode fill:#3b82f6,stroke:#60a5fa,stroke-width:2px,color:#fff
      classDef appNode fill:#f59e0b,stroke:#fbbf24,stroke-width:2px,color:#000
      classDef gitNode fill:#6366f1,stroke:#818cf8,stroke-width:2px,color:#fff
      classDef deployNode fill:#8b5cf6,stroke:#a78bfa,stroke-width:2px,color:#fff
      classDef forgeNode fill:#ec4899,stroke:#f472b6,stroke-width:2px,color:#fff

  ---
  Repository Structure

  Rive-Preview Repository (Source of Truth)

  %%{init: {'theme':'dark', 'themeVariables': { 'primaryColor':'#1f2937', 'primaryTextColor':'#f3f4f6', 'primaryBorderColor':'#60a5fa', 'lineColor':'#60a5fa'}}}%%
  graph TB
      Root["📁 rive-preview/"]:::rootNode

      GH["📁 .github/"]:::folderNode
      Workflows["📁 workflows/"]:::folderNode
      DeployYml["📄 deploy-to-forge.yml"]:::fileNode
      TestYml["📄 test.yml"]:::fileNode

      Hooks["📁 .githooks/"]:::folderNode
      PreCommit["🔧 pre-commit"]:::scriptNode

      Animations["📁 animations/"]:::animNode
      RivFiles["🎬 *.riv"]:::fileNode
      Metadata["📄 metadata.json"]:::jsonNode

      Public["📁 public/"]:::folderNode
      IndexHtml["📄 index.html"]:::fileNode

      Src["📁 src/"]:::folderNode
      JS["📁 js/"]:::folderNode
      CSS["📁 css/"]:::folderNode

      Scripts["📁 scripts/"]:::folderNode
      UpdateMeta["🔧 update-metadata.js"]:::scriptNode

      Root --> GH
      GH --> Workflows
      Workflows --> DeployYml
      Workflows --> TestYml

      Root --> Hooks
      Hooks --> PreCommit

      Root --> Animations
      Animations --> RivFiles
      Animations --> Metadata

      Root --> Public
      Public --> IndexHtml

      Root --> Src
      Src --> JS
      Src --> CSS

      Root --> Scripts
      Scripts --> UpdateMeta

      classDef rootNode fill:#f59e0b,stroke:#fbbf24,stroke-width:3px,color:#000
      classDef folderNode fill:#3b82f6,stroke:#60a5fa,stroke-width:2px,color:#fff
      classDef fileNode fill:#10b981,stroke:#34d399,stroke-width:1px,color:#000
      classDef scriptNode fill:#8b5cf6,stroke:#a78bfa,stroke-width:2px,color:#fff
      classDef animNode fill:#ec4899,stroke:#f472b6,stroke-width:2px,color:#fff
      classDef jsonNode fill:#6366f1,stroke:#818cf8,stroke-width:1px,color:#fff

  ---
  Authentication & User Management

  Authentication Flow

  %%{init: {'theme':'dark', 'themeVariables': { 'primaryColor':'#1f2937', 'primaryTextColor':'#f3f4f6', 'primaryBorderColor':'#60a5fa', 'lineColor':'#60a5fa'}}}%%
  flowchart TD
      Start([User Visits App]):::startNode
      LoadClerk[Load Clerk SDK]:::processNode
      CheckSession{Session Exists?}:::decisionNode
      ShowSignIn[Show Sign In UI]:::actionNode
      GetJWT[Get JWT Token]:::processNode
      InitSupabase[Initialize Supabase<br/>with JWT]:::processNode
      LoadUserData[Load User Data]:::processNode
      AppReady([App Ready]):::endNode

      Start --> LoadClerk
      LoadClerk --> CheckSession
      CheckSession -->|No| ShowSignIn
      CheckSession -->|Yes| GetJWT
      ShowSignIn --> GetJWT
      GetJWT --> InitSupabase
      InitSupabase --> LoadUserData
      LoadUserData --> AppReady

      classDef startNode fill:#10b981,stroke:#34d399,stroke-width:2px,color:#000
      classDef processNode fill:#3b82f6,stroke:#60a5fa,stroke-width:2px,color:#fff
      classDef decisionNode fill:#f59e0b,stroke:#fbbf24,stroke-width:2px,color:#000
      classDef actionNode fill:#8b5cf6,stroke:#a78bfa,stroke-width:2px,color:#fff
      classDef endNode fill:#ec4899,stroke:#f472b6,stroke-width:2px,color:#fff

  User Modes

  %%{init: {'theme':'dark', 'themeVariables': { 'primaryColor':'#1f2937', 'primaryTextColor':'#f3f4f6', 'primaryBorderColor':'#60a5fa', 'lineColor':'#60a5fa'}}}%%
  graph LR
      Toggle[Toggle Switch]:::toggleNode
      Work[Work Mode]:::workNode
      Personal[Personal Mode]:::personalNode

      WorkFeatures[["• Shared animations<br/>• Repo storage<br/>• Team metadata<br/>• Nested folders"]]:::featureNode
      PersonalFeatures[["• Private uploads<br/>• Supabase storage<br/>• Personal library<br/>• CRUD operations"]]:::featureNode

      Toggle --> Work
      Toggle --> Personal
      Work --> WorkFeatures
      Personal --> PersonalFeatures

      classDef toggleNode fill:#f59e0b,stroke:#fbbf24,stroke-width:2px,color:#000
      classDef workNode fill:#3b82f6,stroke:#60a5fa,stroke-width:2px,color:#fff
      classDef personalNode fill:#10b981,stroke:#34d399,stroke-width:2px,color:#000
      classDef featureNode fill:#374151,stroke:#6b7280,stroke-width:1px,color:#f3f4f6

  ---
  Animation Management System

  Animation Lifecycle

  %%{init: {'theme':'dark', 'themeVariables': { 'primaryColor':'#1f2937', 'primaryTextColor':'#f3f4f6', 'primaryBorderColor':'#60a5fa', 'lineColor':'#60a5fa'}}}%%
  stateDiagram-v2
      [*] --> Addition
      Addition --> Storage
      Storage --> Discovery
      Discovery --> Loading
      Loading --> Customization
      Customization --> [*]

      state Addition {
          [*] --> WorkAdd: Git Commit
          [*] --> PersonalAdd: UI Upload
      }

      state Storage {
          [*] --> RepoStore: /animations folder
          [*] --> SupabaseStore: Storage Bucket
      }

      state Discovery {
          [*] --> NestedDropdown: Folder Structure
          [*] --> SimpleList: Flat List
      }

      state Loading {
          [*] --> RelativePath: From /animations
          [*] --> SignedURL: From Supabase
      }

      state Customization {
          [*] --> EditCSS
          EditCSS --> SaveToSupabase
          SaveToSupabase --> [*]
      }

  Metadata Enforcement Flow

  %%{init: {'theme':'dark', 'themeVariables': { 'primaryColor':'#1f2937', 'primaryTextColor':'#f3f4f6', 'primaryBorderColor':'#60a5fa', 'lineColor':'#60a5fa'}}}%%
  flowchart TD
      GitCommit([Git Commit]):::startNode
      PreHook[Pre-commit Hook]:::processNode
      CheckAnim{Animation<br/>Changed?}:::decisionNode
      Continue([Continue Commit]):::endNode
      CheckMeta{Metadata<br/>Exists?}:::decisionNode
      PromptUpdate{Update<br/>Metadata?}:::decisionNode
      RequireMeta[Require Metadata Entry]:::actionNode
      UpdateMeta[Update Metadata]:::actionNode
      StageMeta[Stage metadata.json]:::processNode
      BlockCommit([Block Commit]):::errorNode

      GitCommit --> PreHook
      PreHook --> CheckAnim
      CheckAnim -->|No| Continue
      CheckAnim -->|Yes| CheckMeta
      CheckMeta -->|Yes| PromptUpdate
      CheckMeta -->|No| RequireMeta
      PromptUpdate -->|Yes| UpdateMeta
      PromptUpdate -->|No| StageMeta
      RequireMeta --> UpdateMeta
      UpdateMeta --> StageMeta
      StageMeta --> Continue
      RequireMeta -->|Cancel| BlockCommit

      classDef startNode fill:#10b981,stroke:#34d399,stroke-width:2px,color:#000
      classDef processNode fill:#3b82f6,stroke:#60a5fa,stroke-width:2px,color:#fff
      classDef decisionNode fill:#f59e0b,stroke:#fbbf24,stroke-width:2px,color:#000
      classDef actionNode fill:#8b5cf6,stroke:#a78bfa,stroke-width:2px,color:#fff
      classDef endNode fill:#10b981,stroke:#34d399,stroke-width:2px,color:#000
      classDef errorNode fill:#ef4444,stroke:#f87171,stroke-width:2px,color:#fff

  ---
  Deployment Pipeline

  Branch Strategy

  %%{init: {'theme':'dark', 'themeVariables': { 'primaryColor':'#1f2937', 'primaryTextColor':'#f3f4f6', 'primaryBorderColor':'#60a5fa', 'lineColor':'#60a5fa'}}}%%
  gitGraph
      commit id: "Initial"
      branch staging
      branch feature/new-animation

      checkout feature/new-animation
      commit id: "Add animation"
      commit id: "Add metadata"

      checkout staging
      merge feature/new-animation
      commit id: "Test in staging"

      checkout main
      merge staging
      commit id: "Deploy to production"

  Deployment Flow

  %%{init: {'theme':'dark', 'themeVariables': { 'primaryColor':'#1f2937', 'primaryTextColor':'#f3f4f6', 'primaryBorderColor':'#60a5fa', 'lineColor':'#60a5fa'}}}%%
  flowchart TD
      Push([Developer Push]):::startNode
      Action[GitHub Action Triggers]:::processNode
      DetectBranch{Which Branch?}:::decisionNode

      PrepStaging[Target: staging/]:::prepNode
      PrepProd[Target: production/]:::prepNode

      CopyFiles[Copy Files to Forge]:::processNode
      BuildManifest[Build Animation Manifest]:::processNode
      CommitForge[Commit to Forge Repo]:::processNode
      PushForge[Push to Forge]:::processNode
      VercelDeploy[Vercel Auto-Deploy]:::deployNode

      LiveStaging([Live on Staging]):::endNode
      LiveProd([Live on Production]):::endNode

      Push --> Action
      Action --> DetectBranch
      DetectBranch -->|staging| PrepStaging
      DetectBranch -->|main| PrepProd
      PrepStaging --> CopyFiles
      PrepProd --> CopyFiles
      CopyFiles --> BuildManifest
      BuildManifest --> CommitForge
      CommitForge --> PushForge
      PushForge --> VercelDeploy
      VercelDeploy --> LiveStaging
      VercelDeploy --> LiveProd

      classDef startNode fill:#10b981,stroke:#34d399,stroke-width:2px,color:#000
      classDef processNode fill:#3b82f6,stroke:#60a5fa,stroke-width:2px,color:#fff
      classDef decisionNode fill:#f59e0b,stroke:#fbbf24,stroke-width:2px,color:#000
      classDef prepNode fill:#6366f1,stroke:#818cf8,stroke-width:2px,color:#fff
      classDef deployNode fill:#8b5cf6,stroke:#a78bfa,stroke-width:2px,color:#fff
      classDef endNode fill:#ec4899,stroke:#f472b6,stroke-width:2px,color:#fff

  ---
  Data Persistence Layer

  Database Schema

  %%{init: {'theme':'dark', 'themeVariables': { 'primaryColor':'#1f2937', 'primaryTextColor':'#f3f4f6', 'primaryBorderColor':'#60a5fa', 'lineColor':'#60a5fa'}}}%%
  erDiagram
      USER_CSS_SETTINGS {
          uuid id PK
          text user_id FK
          text animation_name
          text css_content
          text wrapper_color
          text canvas_color
          timestamp created_at
          timestamp updated_at
      }

      USER_ANIMATIONS {
          uuid id PK
          text user_id FK
          text file_name
          text file_path
          jsonb metadata
          timestamp created_at
      }

      PUBLIC_CSS_SETTINGS {
          uuid id PK
          text animation_name UK
          text css_content
          text created_by
          timestamp created_at
      }

      CLERK_USER ||--o{ USER_CSS_SETTINGS : owns
      CLERK_USER ||--o{ USER_ANIMATIONS : uploads
      PUBLIC_CSS_SETTINGS ||--o{ USER_CSS_SETTINGS : templates

  Row Level Security (RLS) Policies

  %%{init: {'theme':'dark', 'themeVariables': { 'primaryColor':'#1f2937', 'primaryTextColor':'#f3f4f6', 'primaryBorderColor':'#60a5fa', 'lineColor':'#60a5fa'}}}%%
  graph TB
      Request[Database Request]:::requestNode
      CheckJWT{Valid JWT?}:::decisionNode
      CheckUser{User ID Match?}:::decisionNode
      CheckAdmin{Is Admin?}:::decisionNode
      Allow[✅ Allow]:::allowNode
      Deny[❌ Deny]:::denyNode

      Request --> CheckJWT
      CheckJWT -->|No| Deny
      CheckJWT -->|Yes| CheckUser
      CheckUser -->|Yes| Allow
      CheckUser -->|No| CheckAdmin
      CheckAdmin -->|Yes| Allow
      CheckAdmin -->|No| Deny

      classDef requestNode fill:#3b82f6,stroke:#60a5fa,stroke-width:2px,color:#fff
      classDef decisionNode fill:#f59e0b,stroke:#fbbf24,stroke-width:2px,color:#000
      classDef allowNode fill:#10b981,stroke:#34d399,stroke-width:2px,color:#000
      classDef denyNode fill:#ef4444,stroke:#f87171,stroke-width:2px,color:#fff

  ---
  Environment Strategy

  Environment Configuration Flow

  %%{init: {'theme':'dark', 'themeVariables': { 'primaryColor':'#1f2937', 'primaryTextColor':'#f3f4f6', 'primaryBorderColor':'#60a5fa', 'lineColor':'#60a5fa'}}}%%
  graph LR
      Local[Local Dev]:::localNode
      Staging[Staging]:::stageNode
      Production[Production]:::prodNode

      LocalConfig[["localhost:3000<br/>Local Supabase<br/>Dev Clerk Keys"]]:::configNode
      StagingConfig[["staging.forge.mograph.life<br/>Staging Supabase<br/>Test Clerk Keys"]]:::configNode
      ProdConfig[["forge.mograph.life<br/>Prod Supabase<br/>Prod Clerk Keys"]]:::configNode

      Local --> LocalConfig
      Staging --> StagingConfig
      Production --> ProdConfig

      classDef localNode fill:#10b981,stroke:#34d399,stroke-width:2px,color:#000
      classDef stageNode fill:#f59e0b,stroke:#fbbf24,stroke-width:2px,color:#000
      classDef prodNode fill:#ef4444,stroke:#f87171,stroke-width:2px,color:#fff
      classDef configNode fill:#374151,stroke:#6b7280,stroke-width:1px,color:#f3f4f6

  ---
  Security Model

  Security Layers

  %%{init: {'theme':'dark', 'themeVariables': { 'primaryColor':'#1f2937', 'primaryTextColor':'#f3f4f6', 'primaryBorderColor':'#60a5fa', 'lineColor':'#60a5fa'}}}%%
  graph TD
      User[User Request]:::userNode

      Layer1[Layer 1: Clerk Authentication]:::layer1Node
      Layer2[Layer 2: JWT Verification]:::layer2Node
      Layer3[Layer 3: Supabase RLS]:::layer3Node
      Layer4[Layer 4: Storage Security]:::layer4Node

      Protected[Protected Resource]:::protectedNode

      User --> Layer1
      Layer1 --> Layer2
      Layer2 --> Layer3
      Layer3 --> Layer4
      Layer4 --> Protected

      classDef userNode fill:#3b82f6,stroke:#60a5fa,stroke-width:2px,color:#fff
      classDef layer1Node fill:#10b981,stroke:#34d399,stroke-width:2px,color:#000
      classDef layer2Node fill:#f59e0b,stroke:#fbbf24,stroke-width:2px,color:#000
      classDef layer3Node fill:#8b5cf6,stroke:#a78bfa,stroke-width:2px,color:#fff
      classDef layer4Node fill:#ec4899,stroke:#f472b6,stroke-width:2px,color:#fff
      classDef protectedNode fill:#6366f1,stroke:#818cf8,stroke-width:2px,color:#fff

  Token Refresh Strategy

  %%{init: {'theme':'dark', 'themeVariables': { 'primaryColor':'#1f2937', 'primaryTextColor':'#f3f4f6', 'primaryBorderColor':'#60a5fa', 'lineColor':'#60a5fa'}}}%%
  stateDiagram-v2
      [*] --> Active: JWT Issued (60 min)
      Active --> CheckExpiry: Every Request

      state CheckExpiry {
          [*] --> TimeCheck
          TimeCheck --> Valid: < 45 min
          TimeCheck --> NearExpiry: > 45 min
      }

      Valid --> Active: Continue
      NearExpiry --> RefreshToken: Trigger Refresh

      RefreshToken --> Success: New Token
      RefreshToken --> Failure: Error

      Success --> Active: Update Client
      Failure --> ReAuth: Force Re-login
      ReAuth --> [*]

  ---
  Development Workflow

  Local Development Flow

  %%{init: {'theme':'dark', 'themeVariables': { 'primaryColor':'#1f2937', 'primaryTextColor':'#f3f4f6', 'primaryBorderColor':'#60a5fa', 'lineColor':'#60a5fa'}}}%%
  flowchart LR
      Setup[npm install]:::setupNode
      Hooks[Setup Hooks]:::setupNode
      Supabase[Start Supabase]:::dbNode
      Dev[npm run dev]:::devNode
      Code[Write Code]:::codeNode
      Test[Run Tests]:::testNode
      Commit[Git Commit]:::gitNode

      Setup --> Hooks
      Hooks --> Supabase
      Supabase --> Dev
      Dev --> Code
      Code --> Test
      Test --> Commit

      classDef setupNode fill:#10b981,stroke:#34d399,stroke-width:2px,color:#000
      classDef dbNode fill:#3b82f6,stroke:#60a5fa,stroke-width:2px,color:#fff
      classDef devNode fill:#f59e0b,stroke:#fbbf24,stroke-width:2px,color:#000
      classDef codeNode fill:#8b5cf6,stroke:#a78bfa,stroke-width:2px,color:#fff
      classDef testNode fill:#ec4899,stroke:#f472b6,stroke-width:2px,color:#fff
      classDef gitNode fill:#6366f1,stroke:#818cf8,stroke-width:2px,color:#fff

  CSS Development Workflow

  %%{init: {'theme':'dark', 'themeVariables': { 'primaryColor':'#1f2937', 'primaryTextColor':'#f3f4f6', 'primaryBorderColor':'#60a5fa', 'lineColor':'#60a5fa'}}}%%
  sequenceDiagram
      participant Dev as Developer
      participant UI as UI Panel
      participant App as App Logic
      participant DB as Supabase

      Dev->>UI: Edit CSS
      UI->>App: onChange Event
      App->>App: Debounce 1s
      App->>DB: Save CSS
      DB-->>App: Confirmed
      App-->>UI: Status Update

      Note over Dev,DB: On Page Reload

      Dev->>App: Load Page
      App->>DB: Fetch CSS
      DB-->>App: Return CSS
      App->>UI: Apply CSS
      UI-->>Dev: Restored State

  ---
  Implementation Roadmap

  %%{init: {'theme':'dark', 'themeVariables': { 'primaryColor':'#1f2937', 'primaryTextColor':'#f3f4f6', 'primaryBorderColor':'#60a5fa', 'lineColor':'#60a5fa'}}}%%
  gantt
      title Implementation Roadmap
      dateFormat YYYY-MM-DD
      section Phase 1 - Foundation
      Basic Structure           :done,    p1a, 2024-01-01, 30d
      Clerk Auth               :done,    p1b, after p1a, 20d
      Supabase Integration     :done,    p1c, after p1b, 20d
      CSS Persistence          :done,    p1d, after p1c, 15d

      section Phase 2 - Deployment
      Forge Workflow           :active,  p2a, 2024-03-15, 10d
      Staging Environment      :         p2b, after p2a, 7d
      Environment Configs      :         p2c, after p2b, 5d

      section Phase 3 - Metadata
      Pre-commit Hooks         :         p3a, after p2c, 10d
      Metadata Prompter        :         p3b, after p3a, 7d
      UI Display               :         p3c, after p3b, 5d

      section Phase 4 - Features
      Categories/Folders       :         p4a, after p3c, 15d
      Shared Templates         :         p4b, after p4a, 10d
      Export Configs           :         p4c, after p4b, 10d

      section Phase 5 - Production
      CDN Setup                :         p5a, after p4c, 10d
      Monitoring               :         p5b, after p5a, 10d
      Analytics                :         p5c, after p5b, 10d

  ---
  Conclusion

  This architecture provides a robust, scalable platform for Rive animation preview and customization. The separation between development (rive-preview) and deployment
  (forge) ensures clean boundaries while maintaining a seamless user experience. The metadata enforcement system ensures all animations have context, while the
  multi-environment strategy enables safe testing before production deployment.

  The stack choices (Clerk + Supabase + Vercel) provide enterprise-grade capabilities without the complexity of managing infrastructure, allowing focus on feature
  development and user experience.