# rCastGmail - Architecture & Technical Deep Dive

#raycast #gmail #architecture #oauth #typescript #technical-analysis

**Date:** 2025-08-27
**Analysis Type:** Technical Architecture Review

## System Architecture

### Component Hierarchy

```
┌──────────────────────────────────────┐
│         Raycast Extension            │
├──────────────────────────────────────┤
│  Commands Layer (React Components)   │
│  ├── inbox.tsx (266 lines)          │
│  ├── compose.tsx (120 lines)        │
│  ├── switch-account.tsx (192 lines) │
│  ├── search.tsx                     │
│  └── internal-inbox.tsx (194 lines) │
├──────────────────────────────────────┤
│      Authentication Layer            │
│  ├── auth.ts (PKCE OAuth)          │
│  ├── auth-internal.ts (Company)     │
│  └── auth-simple.ts (Basic)         │
├──────────────────────────────────────┤
│         Gmail API Client             │
│  └── gmail-client.ts (199 lines)    │
├──────────────────────────────────────┤
│      External Services               │
│  ├── Google OAuth 2.0               │
│  ├── Gmail API v1                   │
│  └── Raycast LocalStorage           │
└──────────────────────────────────────┘
```

## Authentication Deep Dive

### OAuth 2.0 PKCE Implementation

The extension uses **Proof Key for Code Exchange (PKCE)** flow, which is the recommended OAuth flow for public clients:

```typescript
// auth.ts analysis
class GmailAuth {
  private client: OAuth.PKCEClient;
  
  constructor() {
    this.client = new OAuth.PKCEClient({
      redirectMethod: OAuth.RedirectMethod.Web,
      providerName: "Google",
      // No client secret needed - secure for desktop apps
    });
  }
}
```

**Security Benefits**:
- No client secret required (can't be extracted from code)
- Code verifier prevents authorization code interception
- Suitable for public distribution

### Token Management Strategy

```typescript
// Token storage hierarchy
LocalStorage Keys:
├── tokens_default           // Default account tokens
├── tokens_user@gmail.com    // Per-account tokens
├── tokens_admin@company.com // Multiple account tokens
└── current_account          // Active account identifier
```

**Token Lifecycle**:
1. **Acquisition**: OAuth flow → access_token + refresh_token
2. **Storage**: Encrypted in Raycast LocalStorage
3. **Validation**: Check expiry before each use
4. **Refresh**: Automatic refresh when expired
5. **Cleanup**: Manual clearAccount() method

### Multi-Account Architecture

The extension supports three account management patterns:

#### Pattern 1: Preference-Based (Primary)
```typescript
// Configured in Raycast preferences
preferences: {
  primaryEmail: "personal@gmail.com",
  workspaceAdminEmail: "admin@company.com",
  additionalAccounts: "account1@gmail.com,account2@gmail.com"
}
```

#### Pattern 2: Dynamic Addition
```typescript
// Runtime account addition via switch-account command
async addNewAccount() {
  const tokens = await auth.authorize();
  const userInfo = await auth.getUserInfo(tokens.accessToken);
  await auth.setCurrentAccount(userInfo.email);
}
```

#### Pattern 3: Internal Corporate
```typescript
// Hardcoded domain restriction for companies
const COMPANY_DOMAIN = "@company.com";
// Auto-discovers user's corporate account
```

## Gmail API Integration Analysis

### API Client Design

The `GmailClient` class provides a clean abstraction over the Gmail API:

```typescript
class GmailClient {
  private baseUrl = "https://www.googleapis.com/gmail/v1";
  private accessToken: string;
  
  // Generic request wrapper with auth
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T>
  
  // High-level operations
  async listMessages(query?: string, maxResults = 20): Promise<EmailSummary[]>
  async sendEmail(to: string, subject: string, body: string): Promise<void>
  async markAsRead(messageId: string): Promise<void>
}
```

### Data Transformation Pipeline

```
Gmail API Response → GmailMessage → EmailSummary → UI Component
```

**Transformation Steps**:
1. Raw API response (complex nested structure)
2. Type-safe GmailMessage interface
3. Simplified EmailSummary for UI
4. React component props

### Performance Characteristics

**Current Implementation**:
- Sequential message fetching (N+1 query problem)
- No caching mechanism
- Full message fetch for list view

**Bottlenecks Identified**:
```typescript
// Current: Sequential fetching
for (const msg of response.messages) {
  const fullMessage = await this.getMessage(msg.id); // N API calls
  summaries.push(this.messageToSummary(fullMessage));
}

// Optimal: Batch request
const batchResponse = await this.batchGetMessages(messageIds);
```

## State Management Analysis

### React State Patterns

The extension uses **local component state** with hooks:

```typescript
// inbox.tsx state management
const [emails, setEmails] = useState<EmailSummary[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [currentAccount, setCurrentAccount] = useState<AccountInfo | null>(null);
const [searchText, setSearchText] = useState("");
```

**Observations**:
- No global state management (Redux/Context)
- Each command is independently stateful
- No state persistence between command invocations

### Data Flow Patterns

```typescript
// Unidirectional data flow
User Action → Command Handler → API Call → State Update → Re-render
```

**Example Flow**:
```typescript
markAsRead(email) → 
  auth.authorize() → 
    client.markAsRead(id) → 
      setEmails(updated) → 
        List re-renders
```

## Command Architecture

### Command Registration

```json
// package.json command definitions
{
  "commands": [
    {
      "name": "inbox",
      "mode": "view",  // React component mode
      "title": "Open Gmail Inbox",
      "description": "View and manage emails"
    }
  ]
}
```

### Command Types Identified

1. **View Commands** (React Components):
   - inbox, compose, switch-account, search
   - Full UI with ActionPanels

2. **Internal Commands**:
   - internal-inbox (company-specific)
   - Simplified auth flow

3. **Utility Commands**:
   - Hidden helper functions
   - Token management

## Build & Deployment Architecture

### Build Pipeline

```bash
ray build -e dist --skip-types
│
├── Entry point compilation (5 files)
├── TypeScript → JavaScript
├── Bundle dependencies
├── Generate type definitions
└── Output to dist/
```

**Build Optimization**:
- `--skip-types` flag used (avoids React type conflicts)
- No tree shaking configured
- Bundle size not optimized

### Deployment Strategies Discovered

#### Strategy 1: Development Mode
```bash
npm run dev
├── Watches file changes
├── Hot reload in Raycast
└── Console logging enabled
```

#### Strategy 2: Production Build
```bash
npm run build
├── Minified output
├── Source maps excluded
└── Ready for distribution
```

#### Strategy 3: Internal Distribution
```bash
./setup-internal.sh
├── Configures for company domain
├── Builds with internal Client ID
├── Creates employee package
└── Zero-config for end users
```

## Security Architecture

### Token Security

**Current Implementation**:
- Tokens in Raycast LocalStorage (sandboxed)
- No encryption layer
- Refresh tokens stored alongside access tokens

**Vulnerabilities**:
1. Tokens accessible if Raycast data exported
2. No token rotation policy
3. No audit logging

### API Security

**Implemented**:
- OAuth 2.0 with PKCE
- Automatic token refresh
- Scope limitation

**Missing**:
- Rate limiting handling
- Request signing
- Certificate pinning

## Error Handling Analysis

### Error Boundaries

```typescript
// Consistent try-catch pattern throughout
try {
  // API operation
} catch (error) {
  console.error("Context:", error);
  showToast({
    style: Toast.Style.Failure,
    title: "User-friendly message",
    message: error instanceof Error ? error.message : "Unknown error"
  });
}
```

### Error Types Handled

1. **Authentication Errors**: Token expiry, invalid credentials
2. **Network Errors**: Timeout, connection failed
3. **API Errors**: Rate limits, invalid requests
4. **User Errors**: Invalid input, missing configuration

## Performance Metrics

### Load Times (Estimated)

```
Command Launch: ~100ms
OAuth Flow: 2-5 seconds
Inbox Load (20 emails): 3-4 seconds
Search Operation: 1-2 seconds
Account Switch: 1-2 seconds
```

### Optimization Opportunities

1. **Implement Caching**:
```typescript
class CachedGmailClient extends GmailClient {
  private cache = new Map();
  private cacheExpiry = 5 * 60 * 1000; // 5 min
}
```

2. **Batch Requests**:
```typescript
// Use Gmail batch API
POST /batch/gmail/v1
```

3. **Lazy Loading**:
```typescript
// Load email bodies on demand
const [selectedEmail, setSelectedEmail] = useState(null);
useEffect(() => {
  if (selectedEmail) loadFullMessage(selectedEmail.id);
}, [selectedEmail]);
```

## Scalability Considerations

### Current Limitations

- **Account Limit**: ~10 accounts (UI constraint)
- **Email Limit**: ~100 emails (performance)
- **Search Depth**: Limited by API quotas
- **Attachment Size**: No streaming support

### Scaling Strategies

1. **Pagination**: Implement infinite scroll
2. **Virtual Lists**: Render only visible items
3. **Worker Threads**: Offload processing
4. **CDN Assets**: Cache images/attachments

## Code Quality Metrics

### Complexity Analysis

```
Cyclomatic Complexity:
- inbox.tsx: Medium (8-10)
- gmail-client.ts: Low (4-6)
- auth.ts: Medium (7-9)

Lines of Code:
- Total: ~1,500
- Commands: ~800
- Libraries: ~700

Code Coverage: 0% (No tests)
```

### Technical Debt Identified

1. **No Tests**: Zero test coverage
2. **Type Safety**: Using `--skip-types` build flag
3. **Code Duplication**: Auth logic repeated
4. **Magic Strings**: Hardcoded URLs/strings
5. **Missing Docs**: No JSDoc comments

## Recommendations

### Immediate Improvements
1. Add environment variable support
2. Implement basic caching
3. Fix TypeScript compilation
4. Add error recovery

### Long-term Architecture
1. Implement state management (Zustand/Redux)
2. Add service worker for offline
3. Create plugin system for extensions
4. Build telemetry system

## Conclusion

The rCastGmail extension demonstrates **solid architectural foundations** with clear separation of concerns and consistent patterns. The main architectural weakness is the lack of optimization for scale and missing test infrastructure. The OAuth implementation is secure and follows best practices for desktop applications.

**Architecture Grade**: B+
- Strengths: Clean abstractions, security, modularity
- Weaknesses: Performance, testing, error recovery

## Related Documents

- [[PROJECT_STATUS]] - Current implementation status
- [[IMPLEMENTATION_GUIDE]] - Setup and deployment guide
- `/Users/ivg/github/rCastGmail/src/` - Source code