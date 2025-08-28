---
id: 2b9ab608
title: Dependency Analysis
tags:
  - dependencies
  - packages
  - vulnerabilities
  - audit
  - jsx
created: 2025-08-28T17:06:22.753Z
updated: 2025-08-28T17:06:22.753Z
project: jsx
backlinks: 0
forwardLinks: 0
---

I'll analyze the dependencies in your JSX project and create a comprehensive dependency audit report. Let me start by examining the project structure and dependency files.# 📊 Dependency Audit Report - JSX Workspace

## 📦 1. Direct Dependencies

### Production Dependencies
- **@modelcontextprotocol/sdk**: v1.7.0 (⚠️ Outdated - Latest: 1.17.4)
- **@smithery/sdk**: v1.0.2 (⚠️ Outdated - Latest: 1.5.6)

### Development Dependencies
- **@typescript-eslint/eslint-plugin**: v5.62.0 (⚠️ Major update available: 8.41.0)
- **@typescript-eslint/parser**: v5.62.0 (⚠️ Major update available: 8.41.0)
- **eslint**: v8.57.1 (⚠️ Major update available: 9.34.0)
- **eslint-config-prettier**: v9.1.2 (⚠️ Major update available: 10.1.8)
- **eslint-plugin-react**: v7.37.5
- **eslint-plugin-react-hooks**: v4.6.2 (⚠️ Major update available: 5.2.0)
- **prettier**: v3.6.2
- **typescript**: v5.9.2

### Workspace Packages
- **@jsx-workspace/ae-scripts**: Local package (./packages/ae-scripts)
- **bolt-cep** (frame-navigator): Local package with React 18.3.1
- **cep-barebones**: Local package with React 18.3.1

## 🔄 2. Outdated Packages Summary

### Critical Updates Needed
- **@modelcontextprotocol/sdk**: 1.7.0 → 1.17.4 (10 minor versions behind)
- **@smithery/sdk**: 1.0.2 → 1.5.6 (5 minor versions behind)

### Major Version Updates Available
- **ESLint ecosystem**: v5/v8 → v8/v9 (Breaking changes)
- **React**: v18.3.1 → v19.1.1 (Major update)
- **Vite**: v5.4.19 → v7.1.3 (Major updates)
- **Rollup plugins**: Several major versions behind

## 🔒 3. Security Vulnerabilities
- **Status**: Unable to run full security audit (lockfile sync issue)
- **Recommendation**: Run `yarn install` to sync lockfile, then `yarn audit`

## 📜 4. License Compliance
- **Root License**: MIT (permissive)
- **@modelcontextprotocol/sdk**: Check license (not specified in package.json)
- **@smithery/sdk**: Check license (not specified in package.json)
- All other dependencies appear to use MIT or compatible licenses

## 🧹 5. Unused Dependencies
### Potentially Unused Production Dependencies
- **@modelcontextprotocol/sdk**: No usage found in codebase
- **@smithery/sdk**: No usage found in codebase

### Recommendation
These dependencies should be reviewed for removal if not actively used.

## ⬆️ 6. Update Recommendations

### Priority 1 - Security & Compatibility
1. Update **@modelcontextprotocol/sdk** to 1.17.4
2. Update **@smithery/sdk** to 1.5.6

### Priority 2 - Development Tooling
1. Consider migrating to ESLint v9 (requires config changes)
2. Update TypeScript ESLint plugins for better TS 5.9 support

### Priority 3 - Framework Updates
1. Evaluate React 19 compatibility before updating
2. Consider Vite 7 upgrade for better performance

### Immediate Actions
```bash
# Update production dependencies
npm update @modelcontextprotocol/sdk @smithery/sdk

# Sync lockfile
yarn install

# Run security audit
yarn audit

# Remove unused dependencies if confirmed
npm uninstall @modelcontextprotocol/sdk @smithery/sdk
```

## ⚠️ Issues Found
1. **Lockfile out of sync** - Run `yarn install` to fix
2. **Two potentially unused production dependencies**
3. **Multiple major version updates available** - Requires testing
4. **40+ packages outdated** across the monorepo

## ✅ Positive Findings
- TypeScript 5.9.2 (latest stable)
- Prettier 3.6.2 (recent version)
- MIT license (permissive for commercial use)
- Well-structured monorepo with workspaces


## Related Documents

Documents with similar tags:

- [[jsx/security-analysis|Security Analysis]] #security #audit #vulnerabilities #owasp #jsx
- [[jsx/overview|Project Overview]] #overview #documentation #jsx #project-structure
- [[jsx/architecture|System Architecture]] #architecture #design #components #system-design #jsx
- [[jsx/api-reference|API Reference]] #api #endpoints #reference #rest #jsx
- [[jsx/performance-analysis|Performance Analysis]] #performance #optimization #bottlenecks #analysis #jsx

