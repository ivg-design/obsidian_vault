# MPE Search Widget Fix Documentation

#vscode #markdown-preview-enhanced #extension-fix #search-widget #react #typescript

## Problem Statement
VSCode's native find widget (Cmd+F) was being blocked by the Markdown Preview Enhanced extension, despite `enableFindWidget: true` being set in the webview configuration. VSCode's keybindingService was preventing the default action.

## Solution Overview
Created a custom search widget integrated directly into the MPE source code as a React component.

## Critical Bug Fix (2025-08-27)
**Issue:** Search was only finding the first instance of search terms.
**Root Cause:** The TreeWalker was being disrupted when modifying the DOM during iteration.
**Solution:** First collect all text nodes into an array, then process them separately to avoid interference.

## Files Created

### 1. SearchBar Component
**Path:** `/crossnote-source/src/webview/components/SearchBar.tsx`
**Purpose:** Main search widget with all functionality

```typescript
import React, { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';

interface SearchMatch {
  element: HTMLElement;
  text: string;
  index: number;
}

// Export a global reference for other components to trigger search
let globalOpenSearch: (() => void) | null = null;
export function openSearchWidget() {
  if (globalOpenSearch) {
    globalOpenSearch();
  }
}

export default function SearchBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState<SearchMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const highlightClass = 'mpe-search-highlight';
  const currentHighlightClass = 'mpe-search-highlight-current';

  // Log component mount and set global reference
  useEffect(() => {
    console.log('[MPE SearchBar] Component mounted');
    const openSearch = () => {
      setIsVisible(true);
      setTimeout(() => searchInputRef.current?.focus(), 100);
    };
    
    // Set global reference
    globalOpenSearch = openSearch;
    
    // Also add to window for testing
    (window as any).openSearch = openSearch;
    
    return () => {
      console.log('[MPE SearchBar] Component unmounted');
      globalOpenSearch = null;
    };
  }, []);

  // Clean up highlights
  const clearHighlights = useCallback(() => {
    document.querySelectorAll(`.${highlightClass}`).forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ''), el);
        parent.normalize();
      }
    });
  }, []);

  // Perform search
  const performSearch = useCallback((query: string) => {
    clearHighlights();
    
    if (!query) {
      setMatches([]);
      setCurrentMatchIndex(0);
      return;
    }

    const searchRegex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const foundMatches: SearchMatch[] = [];
    
    // Get all text nodes in the preview
    const preview = document.querySelector('.crossnote.markdown-preview[data-for="preview"]');
    if (!preview) return;

    // First, collect all text nodes to avoid modifying DOM during traversal
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
      preview,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip script and style tags
          const parent = node.parentElement;
          if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
            return NodeFilter.FILTER_REJECT;
          }
          // Only accept nodes with actual text content
          if (node.textContent && node.textContent.trim()) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node as Text);
    }

    // Now process each text node
    console.log(`[MPE SearchBar] Processing ${textNodes.length} text nodes for query: "${query}"`);
    
    textNodes.forEach(textNode => {
      const text = textNode.textContent || '';
      const matches = [...text.matchAll(searchRegex)];
      
      if (matches.length > 0) {
        console.log(`[MPE SearchBar] Found ${matches.length} matches in text: "${text.substring(0, 50)}..."`);
        const parent = textNode.parentElement;
        if (!parent) return;

        // Create a document fragment with highlighted text
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;

        matches.forEach((match, matchIndex) => {
          const matchStart = match.index || 0;
          const matchEnd = matchStart + match[0].length;

          // Add text before match
          if (matchStart > lastIndex) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex, matchStart)));
          }

          // Add highlighted match
          const highlight = document.createElement('mark');
          highlight.className = highlightClass;
          highlight.textContent = match[0];
          fragment.appendChild(highlight);

          foundMatches.push({
            element: highlight,
            text: match[0],
            index: foundMatches.length
          });

          lastIndex = matchEnd;
        });

        // Add remaining text
        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
        }

        // Replace the text node with the fragment
        try {
          parent.replaceChild(fragment, textNode);
        } catch (e) {
          console.error('[MPE SearchBar] Failed to replace text node:', e);
        }
      }
    });

    console.log(`[MPE SearchBar] Total matches found: ${foundMatches.length}`);
    setMatches(foundMatches);
    setCurrentMatchIndex(0);

    // Highlight the first match
    if (foundMatches.length > 0) {
      foundMatches[0].element.classList.add(currentHighlightClass);
      foundMatches[0].element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [clearHighlights]);

  // Navigate to next match
  const nextMatch = useCallback(() => {
    if (matches.length === 0) return;
    
    // Remove current highlight
    matches[currentMatchIndex].element.classList.remove(currentHighlightClass);
    
    // Move to next match
    const nextIndex = (currentMatchIndex + 1) % matches.length;
    setCurrentMatchIndex(nextIndex);
    
    // Highlight and scroll to next match
    matches[nextIndex].element.classList.add(currentHighlightClass);
    matches[nextIndex].element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [matches, currentMatchIndex]);

  // Navigate to previous match
  const prevMatch = useCallback(() => {
    if (matches.length === 0) return;
    
    // Remove current highlight
    matches[currentMatchIndex].element.classList.remove(currentHighlightClass);
    
    // Move to previous match
    const prevIndex = currentMatchIndex === 0 ? matches.length - 1 : currentMatchIndex - 1;
    setCurrentMatchIndex(prevIndex);
    
    // Highlight and scroll to previous match
    matches[prevIndex].element.classList.add(currentHighlightClass);
    matches[prevIndex].element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [matches, currentMatchIndex]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('[MPE SearchBar] Keydown captured:', {
        key: e.key,
        metaKey: e.metaKey,
        ctrlKey: e.ctrlKey,
        isVisible
      });
      
      // Cmd/Ctrl+F to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        console.log('[MPE SearchBar] Cmd+F detected! Opening search...');
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setIsVisible(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
        return false;
      }
      
      // Escape to close - MUST stop propagation to prevent TOC toggle
      if (e.key === 'Escape' && isVisible) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setIsVisible(false);
        clearHighlights();
        setSearchQuery('');
        setMatches([]);
        return false;
      }

      // Enter for next match, Shift+Enter for previous
      if (e.key === 'Enter' && isVisible) {
        e.preventDefault();
        if (e.shiftKey) {
          prevMatch();
        } else {
          nextMatch();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isVisible, nextMatch, prevMatch, clearHighlights]);

  // Perform search when query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      clearHighlights();
    };
  }, [clearHighlights]);

  return (
    <>
      {/* Search bar */}
      {isVisible && (
    <div className="mpe-search-bar" style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 10000,
      background: 'var(--vscode-input-background, #3c3c3c)',
      border: '1px solid var(--vscode-input-border, #007acc)',
      borderRadius: '4px',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      fontFamily: 'var(--vscode-font-family)',
      fontSize: '13px',
    }}>
      <input
        ref={searchInputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Find..."
        style={{
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--vscode-input-foreground, #cccccc)',
          width: '200px',
          padding: '4px',
        }}
      />
      
      <div style={{ 
        color: 'var(--vscode-descriptionForeground, #999)',
        minWidth: '60px',
        textAlign: 'center',
      }}>
        {matches.length > 0 ? `${currentMatchIndex + 1}/${matches.length}` : 'No results'}
      </div>
      
      <button
        onClick={prevMatch}
        disabled={matches.length === 0}
        title="Previous match (Shift+Enter)"
        style={{
          background: 'transparent',
          border: '1px solid var(--vscode-button-border, #464647)',
          borderRadius: '2px',
          color: matches.length === 0 ? 'var(--vscode-disabledForeground, #555)' : 'var(--vscode-button-foreground, #fff)',
          cursor: matches.length === 0 ? 'default' : 'pointer',
          padding: '2px 8px',
        }}
      >
        ↑
      </button>
      
      <button
        onClick={nextMatch}
        disabled={matches.length === 0}
        title="Next match (Enter)"
        style={{
          background: 'transparent',
          border: '1px solid var(--vscode-button-border, #464647)',
          borderRadius: '2px',
          color: matches.length === 0 ? 'var(--vscode-disabledForeground, #555)' : 'var(--vscode-button-foreground, #fff)',
          cursor: matches.length === 0 ? 'default' : 'pointer',
          padding: '2px 8px',
        }}
      >
        ↓
      </button>
      
      <button
        onClick={() => {
          setIsVisible(false);
          clearHighlights();
          setSearchQuery('');
          setMatches([]);
        }}
        title="Close (Escape)"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--vscode-button-foreground, #fff)',
          cursor: 'pointer',
          padding: '2px 4px',
          fontSize: '16px',
        }}
      >
        ×
      </button>
    </div>
      )}
    </>
  );
}
```

## Files Modified

### 2. Preview Component
**Path:** `/crossnote-source/src/webview/components/Preview.tsx`
**Line 12:** Added import
```typescript
import SearchBar from './SearchBar';
```
**Line 51:** Added component after background div
```tsx
{/** Search Bar */}
<SearchBar />
```

### 3. Footer Component  
**Path:** `/crossnote-source/src/webview/components/Footer.tsx`
**Line 1:** Added MagnifyingGlassIcon import
```typescript
import { Bars3Icon, LinkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
```
**Line 7:** Added SearchBar import
```typescript
import { openSearchWidget } from './SearchBar';
```
**Lines 63-71:** Added search button before backlinks button
```tsx
<div
  className="p-1 cursor-pointer hover:text-primary w-5 h-5"
  title="Search (Cmd/Ctrl+F)"
  onClick={() => {
    openSearchWidget();
  }}
>
  <MagnifyingGlassIcon className="w-5 h-5"></MagnifyingGlassIcon>
</div>
```

### 4. CSS Styles
**Path:** `/crossnote-source/src/webview/index.css`
**Lines 9-21:** Added search highlight styles
```css
/* Search highlight styles */
.mpe-search-highlight {
  background-color: yellow;
  color: black;
  border-radius: 2px;
  padding: 0 1px;
}

.mpe-search-highlight-current {
  background-color: orange;
  color: black;
  font-weight: bold;
}
```

## Build & Deployment Process

### Step 1: Navigate to crossnote-source
```bash
cd /Users/ivg/github/vscode-markdown-preview-enhanced/crossnote-source
```

### Step 2: Build the webview
```bash
npx esbuild src/webview/preview.tsx \
  --bundle \
  --minify \
  --outfile=../crossnote/webview/preview.js \
  --format=iife \
  --platform=browser \
  --loader:.css=text \
  --jsx=automatic
```

### Step 3: Copy to installed extension
```bash
cp /Users/ivg/github/vscode-markdown-preview-enhanced/crossnote/webview/preview.js \
   ~/.vscode/extensions/shd101wyy.markdown-preview-enhanced-0.8.19/crossnote/webview/preview.js
```

### Step 4: Reload VSCode
- Press `Cmd+Shift+P`
- Run "Developer: Reload Window"

## Reapplication Guide for Updates

When MPE gets updated, follow these steps:

1. **Check the new version number** in `~/.vscode/extensions/`
2. **Copy the modified source files** from this documentation
3. **Apply the changes** to the new source files
4. **Build** using the esbuild command above
5. **Deploy** to the new extension directory (update version number in path)
6. **Reload** VSCode

## Alternative: Patch Script
Create a script to automate reapplication:

```bash
#!/bin/bash
# save as patch-mpe-search.sh

MPE_VERSION="0.8.19"  # Update this when MPE updates
MPE_SRC="/Users/ivg/github/vscode-markdown-preview-enhanced"
MPE_EXT="$HOME/.vscode/extensions/shd101wyy.markdown-preview-enhanced-$MPE_VERSION"

# Build the webview
cd "$MPE_SRC/crossnote-source"
npx esbuild src/webview/preview.tsx \
  --bundle --minify \
  --outfile=../crossnote/webview/preview.js \
  --format=iife --platform=browser \
  --loader:.css=text --jsx=automatic

# Deploy
cp "$MPE_SRC/crossnote/webview/preview.js" "$MPE_EXT/crossnote/webview/preview.js"

echo "Search widget patched for MPE v$MPE_VERSION"
echo "Please reload VSCode window"
```

## Testing Checklist
- [ ] Cmd+F opens search widget
- [ ] Search icon appears in footer
- [ ] ESC closes search without toggling TOC
- [ ] Enter/Shift+Enter navigate matches
- [ ] Highlights appear and clear properly
- [ ] window.openSearch() works in console
- [ ] **All instances of search terms are found (not just first)**
- [ ] Debug logs show correct number of text nodes and matches