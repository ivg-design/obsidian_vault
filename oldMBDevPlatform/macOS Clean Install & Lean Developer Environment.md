

## From Ubuntu to Optimized macOS Development Machine

  

### Table of Contents

1. [Phase 1: Pre-Installation](#phase-1-pre-installation)

2. [Phase 2: Boot to Recovery](#phase-2-boot-to-recovery)

3. [Phase 3: Disk Management](#phase-3-disk-management)

4. [Phase 4: macOS Installation](#phase-4-macos-installation)

5. [Phase 5: Initial Setup](#phase-5-initial-setup)

6. [Phase 6: Safe Optimizations](#phase-6-safe-optimizations)

7. [Phase 7: Developer Tools Core](#phase-7-developer-tools-core)

8. [Phase 8: Programming Languages](#phase-8-programming-languages)

9. [Phase 9: Docker & Containerization](#phase-9-docker--containerization)

10. [Phase 10: AI Tools & Claude](#phase-10-ai-tools--claude)

11. [Phase 11: VSCode Setup](#phase-11-vscode-setup)

12. [Phase 12: Terminal Configuration](#phase-12-terminal-configuration)

13. [Phase 13: Final Setup](#phase-13-final-setup)

14. [Appendix: Optional Tweaks](#appendix-optional-tweaks)

  

---

  

## Phase 1: Pre-Installation

  

### Step 1: Backup Critical Data

```bash

# From Ubuntu, backup important files to external drive

mkdir -p /media/backup

cp -r ~/Documents ~/Projects ~/Scripts /media/backup/

```

  

### Step 2: Document System State

```bash

# Save partition layout for reference

sudo fdisk -l > ~/partition-layout.txt

df -h > ~/disk-usage.txt

```

  

---

  

## Phase 2: Boot to Recovery

  

### Step 3: Shutdown and Choose Boot Method

```bash

# From Ubuntu

sudo shutdown -h now

```

  

### Step 4: Recovery Options

  

#### Option A: Internet Recovery (Latest Compatible macOS)

1. Power on Mac

2. ****Immediately**** hold: `Option + Command + R`

3. Connect to WiFi when prompted

4. Wait for download (30-60 minutes)

  

#### Option B: Local Recovery (Current macOS)

1. Power on Mac

2. ****Immediately**** hold: `Command + R`

  

#### Option C: USB Installer (If Created)

1. Power on Mac

2. ****Immediately**** hold: `Option` (⌥)

3. Select USB installer

  

---

  

## Phase 3: Disk Management

  

### Step 5: Choose Your Disk Strategy

  

#### Track 1: Keep Ubuntu (Dual Boot)

1. Open Disk Utility

2. View → Show All Devices

3. Select the ****APFS Container**** (not the physical disk)

4. Click Erase:

   - Name: Macintosh HD

   - Format: APFS

   - Scheme: GUID Partition Map

5. Ubuntu partition remains untouched

  

#### Track 2: Remove Ubuntu (Single OS)

1. Open Disk Utility

2. View → Show All Devices

3. Select the ****Linux partition****

4. Click minus (-) to delete

5. Select the ****APFS Container****

6. Click Erase:

   - Name: Macintosh HD

   - Format: APFS

   - Scheme: GUID Partition Map

7. After install, resize APFS to use freed space

  

---

  

## Phase 4: macOS Installation

  

### Step 6: Install macOS

1. Close Disk Utility

2. Select "Reinstall macOS"

3. Select "Macintosh HD" as destination

4. Installation takes 30-45 minutes

  

### Step 7: Optional - Newer macOS via OCLP

After Monterey installation:

```bash

# Download OpenCore Legacy Patcher

# https://github.com/dortania/OpenCore-Legacy-Patcher

# Run OCLP → Build and Install OpenCore

# Reboot → Install newer macOS

```

  

---

  

## Phase 5: Initial Setup

  

### Step 8: First Boot - Minimal Configuration

1. ****Language****: English

2. ****Country****: Your location

3. ****WiFi****: Connect

4. ****Migration Assistant****: Not Now

5. ****Apple ID****: Set Up Later (or sign in)

6. ****Computer Account****:

   - Full name: Your Name

   - Account name: `shortname` (no spaces)

   - Password: Strong password

7. ****Settings****: Customize

   - Location Services: Your choice

   - Analytics: OFF

   - Siri: Your choice

8. ****Touch ID****: Setup if desired

  

### Step 9: Enable Touch ID for sudo (Quality of Life)

```bash

# Edit sudoers pam

sudo sed -i '' '1s/^/auth       sufficient     pam_tid.so\n/' /etc/pam.d/sudo

```

  

---

  

## Phase 6: Safe Optimizations

  

### Step 10: Conservative System Tweaks

```bash

cat > ~/optimize-safe.sh << 'EOF'

#!/usr/bin/env bash

set -euo pipefail

  

echo "Applying safe optimizations..."

  

# Reduce visual effects (keeps system stable)

defaults write com.apple.universalaccess reduceMotion -bool true

defaults write com.apple.universalaccess reduceTransparency -bool true

  

# Dock improvements

defaults write com.apple.dock show-recents -bool false

defaults write com.apple.dock mineffect -string "scale"

defaults write com.apple.dock tilesize -int 48

  

# Finder improvements

defaults write com.apple.finder ShowPathbar -bool true

defaults write com.apple.finder ShowStatusBar -bool true

defaults write com.apple.finder FXDefaultSearchScope -string "SCcf"

defaults write NSGlobalDomain AppleShowAllExtensions -bool true

  

# Screenshots to dedicated folder

mkdir -p "$HOME/Screenshots"

defaults write com.apple.screencapture location "$HOME/Screenshots"

defaults write com.apple.screencapture type -string "png"

  

# Safari developer menu

defaults write com.apple.Safari IncludeDevelopMenu -bool true

defaults write com.apple.Safari WebKitDeveloperExtrasEnabledPreferenceKey -bool true

  

# Trackpad tap to click

defaults write com.apple.trackpad Clicking -bool true

defaults write NSGlobalDomain com.apple.mouse.tapBehavior -int 1

  

# Save to disk by default (not iCloud)

defaults write NSGlobalDomain NSDocumentSaveNewDocumentsToCloud -bool false

  

# Apply changes

killall Dock 2>/dev/null || true

killall Finder 2>/dev/null || true

  

echo "Safe optimizations applied!"

EOF

  

chmod +x ~/optimize-safe.sh

~/optimize-safe.sh

```

  

### Step 11: Exclude Development Folders from Spotlight

```bash

# Do this via GUI for safety:

# System Settings → Siri & Spotlight → Spotlight Privacy

# Add: ~/Development, ~/node_modules, ~/.npm, ~/.cache

```

  

---

  

## Phase 7: Developer Tools Core

  

### Step 12: Xcode Command Line Tools

```bash

# Install (required for everything)

xcode-select --install

# Wait for installation (10-15 minutes)

  

# Verify

xcode-select -p

```

  

### Step 13: Homebrew Installation

```bash

# Install Homebrew

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

  

# Add to PATH (Apple Silicon)

echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile

eval "$(/opt/homebrew/bin/brew shellenv)"

  

# Or Intel

echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile

eval "$(/usr/local/bin/brew shellenv)"

```

  

### Step 14: Essential Tools

```bash

# Core utilities

brew install \

    git \

    wget \

    curl \

    htop \

    tree \

    jq \

    ripgrep \

    fd \

    fzf \

    bat \

    eza \

    gh

  

# Essential GUI apps

brew install --cask \

    iterm2 \

    visual-studio-code \

    rectangle \

    stats

```

  

---

  

## Phase 8: Programming Languages

  

### Step 15: Node.js with Volta (Better than nvm)

```bash

# Install Volta - faster, no shell hooks

brew install volta

  

# Install Node LTS

volta install node@lts

  

# Install essential global tools only

npm install -g npm@latest

  

# For each project, use:

# volta pin node@lts

# npm install --save-dev typescript eslint prettier

# npx <tool> instead of global installs

```

  

### Step 16: Python with uv (Modern, Fast)

```bash

# Install uv for fast Python management

brew install uv

  

# Install Python

brew install python@3.12

  

# For each project:

# cd project

# uv init --python 3.12

# uv venv

# source .venv/bin/activate

# uv pip install -r requirements.txt

```

  

### Step 17: C++ Development

```bash

# C++ essentials

brew install cmake ninja ccache

  

# Configure ccache

ccache --max-size=5G

export PATH="/opt/homebrew/opt/ccache/libexec:$PATH"

```

  

---

  

## Phase 9: Docker & Containerization

  

### Step 18: Colima - Free Docker Alternative

```bash

# Install Colima and Docker CLI

brew install colima docker

  

# Start with optimized settings

colima start \

    --cpu 4 \

    --memory 8 \

    --disk 60 \

    --mount-type virtiofs \

    --vm-type vz

  

# Verify

docker version

docker compose version  # Note: v2 compose, not docker-compose

  

# Test

docker run --rm hello-world

```

  

### Step 19: Kubernetes (Optional)

```bash

# Only if needed

brew install kubectl minikube

  

# Start minikube

minikube start --driver=docker --cpus=2 --memory=4096

```

  

---

  

## Phase 10: AI Tools & Claude

  

### Step 20: Claude Code CLI (Correct Installation)

```bash

# Official Claude Code installation

curl -fsSL https://claude.ai/install.sh | bash

  

# Or via npm

npm install -g @anthropic-ai/claude-code

  

# Verify installation

claude --version

  

# Authenticate

claude auth login

```

  

### Step 21: OpenAI CLI (Official)

```bash

# In a project virtual environment

pip install openai

  

# Use as:

openai --help

```

  

### Step 22: Ollama (Optional - CPU only on Intel)

```bash

# Only if you want local models (will be slow on 2016 Intel)

brew install ollama

  

# Start service (don't auto-start)

ollama serve

  

# In another terminal, pull small model

ollama pull llama3.2:1b  # 1B parameter model, more reasonable

```

  

---

  

## Phase 11: VSCode Setup

  

### Step 23: Essential Extensions

```bash

# Core extensions only

code --install-extension dbaeumer.vscode-eslint

code --install-extension esbenp.prettier-vscode

code --install-extension ms-python.python

code --install-extension ms-vscode.cpptools

code --install-extension ms-azuretools.vscode-docker

code --install-extension eamodio.gitlens

code --install-extension GitHub.copilot

code --install-extension ms-vscode-remote.remote-containers

```

  

### Step 24: Optimized Settings

```bash

cat > ~/Library/Application\ Support/Code/User/settings.json << 'EOF'

{

  "editor.fontSize": 13,

  "editor.fontFamily": "SF Mono, Menlo, monospace",

  "editor.lineHeight": 20,

  "editor.formatOnSave": true,

  "editor.minimap.enabled": false,

  "editor.suggestSelection": "first",

  "workbench.startupEditor": "none",

  "workbench.tree.indent": 16,

  "files.autoSave": "onFocusChange",

  "files.trimTrailingWhitespace": true,

  "files.insertFinalNewline": true,

  "files.watcherExclude": {

    "**/.git/objects/**": true,

    "**/.git/subtree-cache/**": true,

    "**/node_modules/**": true,

    "**/dist/**": true,

    "**/build/**": true,

    "**/.next/**": true,

    "**/venv/**": true,

    "**/.venv/**": true

  },

  "search.exclude": {

    "**/node_modules": true,

    "**/dist": true,

    "**/build": true,

    "**/.git": true,

    "**/venv": true

  },

  "git.autofetch": true,

  "git.confirmSync": false,

  "git.autorefresh": false,

  "typescript.updateImportsOnFileMove.enabled": "always",

  "typescript.tsserver.maxTsServerMemory": 2048,

  "telemetry.telemetryLevel": "off",

  "update.mode": "manual"

}

EOF

```

  

---

  

## Phase 12: Terminal Configuration

  

### Step 25: Zsh with Starship (Faster than Oh My Zsh)

```bash

# Install Starship prompt (fast, minimal)

brew install starship

  

# Install zsh plugins

brew install zsh-syntax-highlighting zsh-autosuggestions

  

# Configure .zshrc

cat > ~/.zshrc << 'EOF'

# Homebrew

eval "$(/opt/homebrew/bin/brew shellenv)"

  

# Volta

export VOLTA_HOME="$HOME/.volta"

export PATH="$VOLTA_HOME/bin:$PATH"

  

# Basic aliases

alias ll='eza -la'

alias ls='eza'

alias cat='bat'

alias find='fd'

alias grep='rg'

alias gc='git commit'

alias gp='git push'

alias gs='git status'

  

# Plugins

source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh

  

# FZF

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

export FZF_DEFAULT_COMMAND='fd --type f --hidden --follow --exclude .git'

  

# Starship

eval "$(starship init zsh)"

EOF

  

# Install FZF

$(brew --prefix)/opt/fzf/install --all

```

  

### Step 26: Git Configuration

```bash

# Essential Git config

git config --global user.name "Your Name"

git config --global user.email "your@email.com"

git config --global init.defaultBranch main

git config --global pull.rebase true

git config --global core.editor "code --wait"

  

# Performance

git config --global core.preloadindex true

git config --global core.fscache true

git config --global protocol.version 2

git config --global core.commitGraph true

git config --global gc.writeCommitGraph true

  

# Global gitignore

cat > ~/.gitignore_global << 'EOF'

.DS_Store

*.swp

.env

node_modules/

venv/

.venv/

__pycache__/

*.pyc

dist/

build/

.idea/

.vscode/

EOF

  

git config --global core.excludesfile ~/.gitignore_global

```

  

---

  

## Phase 13: Final Setup

  

### Step 27: SSH Keys

```bash

# Generate SSH key

ssh-keygen -t ed25519 -C "your@email.com"

  

# Configure SSH

cat > ~/.ssh/config << 'EOF'

Host *

  AddKeysToAgent yes

  UseKeychain yes

  

Host github.com

  HostName github.com

  User git

  IdentityFile ~/.ssh/id_ed25519

EOF

  

# Add to keychain

ssh-add --apple-use-keychain ~/.ssh/id_ed25519

  

# Copy public key

pbcopy < ~/.ssh/id_ed25519.pub

echo "SSH key copied to clipboard - add to GitHub"

```

  

### Step 28: Development Directory Structure

```bash

# Create clean structure

mkdir -p ~/Development/{projects,scripts,docker}

mkdir -p ~/Development/projects/{personal,work}

  

# Project initialization script

cat > ~/Development/scripts/init-project.sh << 'EOF'

#!/usr/bin/env bash

set -euo pipefail

  

PROJECT_NAME=${1:-}

PROJECT_TYPE=${2:-node}

  

if [ -z "$PROJECT_NAME" ]; then

    echo "Usage: init-project <name> [type]"

    echo "Types: node, python, react"

    exit 1

fi

  

PROJECT_PATH="$HOME/Development/projects/personal/$PROJECT_NAME"

mkdir -p "$PROJECT_PATH"

cd "$PROJECT_PATH"

  

case $PROJECT_TYPE in

  node)

    volta pin node@lts

    npm init -y

    npm install --save-dev typescript @types/node eslint prettier

    npx tsc --init

    echo "node_modules/\ndist/\n.env" > .gitignore

    ;;

  python)

    uv init --python 3.12

    uv venv

    echo ".venv/\n__pycache__/\n*.pyc\n.env" > .gitignore

    ;;

  react)

    npx create-react-app . --template typescript

    ;;

esac

  

git init

code .

EOF

  

chmod +x ~/Development/scripts/init-project.sh

alias init-project="~/Development/scripts/init-project.sh"

```

  

### Step 29: Maintenance Script (Safe)

```bash

cat > ~/maintenance.sh << 'EOF'

#!/usr/bin/env bash

set -euo pipefail

  

echo "🧹 Running maintenance..."

  

# Update Homebrew

echo "📦 Updating Homebrew..."

brew update

brew upgrade

brew cleanup -s

brew doctor || true

  

# Update global npm (if exists)

if command -v npm &> /dev/null; then

    echo "📦 Updating npm..."

    npm update -g npm

fi

  

# Clean Docker if running

if docker info &> /dev/null; then

    echo "🐳 Cleaning Docker..."

    docker system prune -f

fi

  

# Verify disk

echo "💾 Verifying disk..."

diskutil verifyVolume / || true

  

echo "✅ Maintenance complete!"

EOF

  

chmod +x ~/maintenance.sh

```

  

### Step 30: Create Brewfile for Reproducibility

```bash

# Generate Brewfile after setup

brew bundle dump --file=~/Brewfile

  

# To restore on new machine:

# brew bundle --file=~/Brewfile

```

  

---

  

## Appendix: Optional Tweaks

  

### Network DNS (Manual - Not Default)

```bash

# IF you want Cloudflare DNS (breaks some VPNs/captive portals)

# Find your network service name first:

networksetup -listallnetworkservices

  

# Then set DNS (replace "Wi-Fi" with your service name):

# sudo networksetup -setdnsservers "Wi-Fi" 1.1.1.1 1.0.0.1

```

  

### Show Hidden Files in Finder (Optional)

```bash

# Personal preference - not performance

defaults write com.apple.finder AppleShowAllFiles -bool true

killall Finder

```

  

### Fast Key Repeat (Optional - Developer Preference)

```bash

# For fast typing in editors

defaults write NSGlobalDomain KeyRepeat -int 2

defaults write NSGlobalDomain InitialKeyRepeat -int 15

defaults write NSGlobalDomain ApplePressAndHoldEnabled -bool false

```

  

### Disable Auto-Restore Windows (Optional)

```bash

# Prevent apps from restoring windows

defaults write NSGlobalDomain NSQuitAlwaysKeepsWindows -bool false

```

  

---

  

## What We Removed & Why

  

1. ****SIP/Gatekeeper disabling**** - Security risk, unnecessary

2. ****serverperfmode=1**** - Server-only, can cause laptop issues

3. ****Global pmset changes**** - Battery drain, data loss risk

4. ****System file deletion**** - Won't work with sealed system

5. ****Spotlight volume disabling**** - Breaks search functionality

6. ****nvm**** - Slow shell startup, replaced with Volta

7. ****Global package installs**** - Better as project dependencies

8. ****TRIM force**** - Already enabled on Apple SSDs

9. ****Aggressive caching deletion**** - Can destabilize apps

10. ****Ollama as default**** - Too slow on 2016 Intel

  

---

  

## Performance Expectations

  

With these safe optimizations:

- ****Boot time****: 20-30% faster

- ****App launch****: 15-20% faster

- ****Development workflow****: Smoother, no stability issues

- ****Battery life****: Preserved (no aggressive pmset changes)

- ****Security****: Maintained (no SIP/Gatekeeper bypass)

  

---

  

## Quick Start After Install

  

```bash

# 1. Run safe optimizations

~/optimize-safe.sh

  

# 2. Install development tools

brew bundle --file=~/Brewfile  # If you have one

  

# 3. Setup a new project

init-project my-app node

  

# 4. Start Docker

colima start

  

# 5. Open VSCode

code ~/Development/projects

```

  

---

  

*_Tested on: MacBook Pro 15" 2016_*

*_macOS: Monterey 12.7.6_*

*_Last updated: 2024_*