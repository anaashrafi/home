#!/bin/bash

# Complete Portfolio Setup and Run Script
# This script installs all dependencies and runs the portfolio website

echo "🚀 Portfolio Complete Setup Script"
echo "=================================="
echo ""

# Detect OS
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

echo "🖥️  Detected OS: $MACHINE"
echo ""

# Function to install Homebrew (macOS)
install_homebrew() {
    echo "📦 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon Macs
    if [[ $(uname -m) == 'arm64' ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
    
    echo "✅ Homebrew installed successfully"
    echo ""
}

# Function to install nvm
install_nvm() {
    echo "📦 Installing nvm (Node Version Manager)..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    
    # Load nvm into current shell
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    
    # Add to shell profile
    if [ -f ~/.zshrc ]; then
        echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
        echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc
    fi
    
    if [ -f ~/.bashrc ]; then
        echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
        echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
    fi
    
    echo "✅ nvm installed successfully"
    echo ""
}

# Function to install Node.js using nvm
install_node_with_nvm() {
    local node_version="26"
    
    if [ -f ".nvmrc" ]; then
        node_version=$(cat .nvmrc | tr -d '[:space:]')
    elif [ -f ".node-version" ]; then
        node_version=$(cat .node-version | tr -d '[:space:]')
    fi
    
    echo "📦 Installing Node.js version $node_version using nvm..."
    nvm install "$node_version"
    nvm use "$node_version"
    nvm alias default "$node_version"
    echo "✅ Node.js $node_version installed and set as default"
    echo ""
}

# Function to install Node.js using Homebrew (macOS alternative)
install_node_with_brew() {
    echo "📦 Installing Node.js using Homebrew..."
    brew install node@26
    brew link node@26
    echo "✅ Node.js installed via Homebrew"
    echo ""
}

# Main installation logic
echo "🔍 Checking for required tools..."
echo ""

# Check for Homebrew on macOS
if [ "$MACHINE" == "Mac" ]; then
    if ! command -v brew &> /dev/null; then
        echo "⚠️  Homebrew is not installed (recommended for macOS)"
        read -p "Would you like to install Homebrew? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_homebrew
        fi
    else
        echo "✅ Homebrew is installed"
    fi
fi

# Check for nvm
NVM_INSTALLED=false
if command -v nvm &> /dev/null; then
    NVM_INSTALLED=true
    echo "✅ nvm is installed"
else
    # Try to load nvm if it exists but not in PATH
    export NVM_DIR="$HOME/.nvm"
    if [ -s "$NVM_DIR/nvm.sh" ]; then
        echo "📌 Loading nvm..."
        \. "$NVM_DIR/nvm.sh"
        \. "$NVM_DIR/bash_completion" 2>/dev/null || true
        NVM_INSTALLED=true
        echo "✅ nvm loaded successfully"
    else
        echo "⚠️  nvm is not installed"
        read -p "Would you like to install nvm? (recommended) (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_nvm
            NVM_INSTALLED=true
        fi
    fi
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js is not installed"
    echo ""
    
    if [ "$NVM_INSTALLED" == true ]; then
        echo "Installing Node.js using nvm..."
        install_node_with_nvm
    elif [ "$MACHINE" == "Mac" ] && command -v brew &> /dev/null; then
        read -p "Would you like to install Node.js using Homebrew? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_node_with_brew
        else
            echo "❌ Node.js is required. Please install it manually."
            echo "   Visit: https://nodejs.org/"
            exit 1
        fi
    else
        echo "❌ Node.js is required. Please install it manually."
        echo "   Visit: https://nodejs.org/"
        exit 1
    fi
else
    echo "✅ Node.js version: $(node --version)"
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. This is unusual as it comes with Node.js."
    echo "   Please reinstall Node.js."
    exit 1
else
    echo "✅ npm version: $(npm --version)"
fi

echo ""
echo "=================================="
echo "✅ All prerequisites are installed!"
echo "=================================="
echo ""

# Install project dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing project dependencies..."
    npm install
    echo ""
else
    echo "✅ Project dependencies already installed"
    echo ""
fi

echo "🌐 Starting development server..."
echo "   The app will open in your browser at http://localhost:3000"
echo ""
echo "   Press Ctrl+C to stop the server"
echo ""
echo "=================================="
echo ""

# Start the development server
npm start
