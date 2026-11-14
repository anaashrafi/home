#!/usr/bin/env bash
#
# Portfolio local runner
#
#   ./run-local.sh            start the dev server (default)
#   ./run-local.sh build      production build into ./build
#   ./run-local.sh preview    build, then serve ./build like production
#   ./run-local.sh test       run the test suite
#   ./run-local.sh lint       run ESLint
#   ./run-local.sh --fresh    reinstall dependencies first (combine with any command)
#
# Always switches to the Node version in .nvmrc, so it works even when an
# older Node (e.g. 16) is your shell default.

set -euo pipefail

cd "$(dirname "$0")"

NVM_VERSION="v0.41.0"
PORT=3000
COMMAND="dev"
FRESH=false

for arg in "$@"; do
  case "$arg" in
    dev|start) COMMAND="dev" ;;
    build|preview|test|lint) COMMAND="$arg" ;;
    --fresh) FRESH=true ;;
    -h|--help) sed -n '3,13p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "❌ Unknown option: $arg (try --help)"; exit 1 ;;
  esac
done

REQUIRED_NODE="$(tr -d '[:space:]' < .nvmrc)"
REQUIRED_MAJOR="${REQUIRED_NODE%%.*}"

echo "🚀 Portfolio — $COMMAND"
echo ""

# ---------- nvm ----------
load_nvm() {
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  # nvm.sh is not written for `set -u`
  set +u
  # shellcheck disable=SC1091
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  set -u
  command -v nvm >/dev/null 2>&1
}

if ! load_nvm; then
  echo "⚠️  nvm (Node Version Manager) is not installed."
  read -r -p "   Install nvm $NVM_VERSION now? (y/n) " reply
  if [[ "$reply" =~ ^[Yy]$ ]]; then
    curl -fsSL "https://raw.githubusercontent.com/nvm-sh/nvm/$NVM_VERSION/install.sh" | bash
    load_nvm || { echo "❌ nvm installed but could not be loaded. Open a new terminal and re-run."; exit 1; }
    echo "✅ nvm installed"
  else
    echo "   Continuing without nvm — your current Node must be $REQUIRED_MAJOR or newer."
  fi
fi

# ---------- Node ----------
if command -v nvm >/dev/null 2>&1; then
  set +u
  if ! nvm ls "$REQUIRED_NODE" >/dev/null 2>&1; then
    echo "📦 Installing Node $REQUIRED_NODE (from .nvmrc)..."
    nvm install "$REQUIRED_NODE"
  fi
  nvm use "$REQUIRED_NODE" >/dev/null
  set -u
fi

if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js is not installed. Install Node $REQUIRED_NODE from https://nodejs.org/ or via nvm."
  exit 1
fi

CURRENT_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$CURRENT_MAJOR" -lt "$REQUIRED_MAJOR" ]; then
  echo "❌ Node $(node --version) is too old — this project needs Node $REQUIRED_NODE."
  echo "   Run: nvm install $REQUIRED_NODE && nvm alias default $REQUIRED_MAJOR"
  exit 1
fi

echo "✅ Node $(node --version) · npm $(npm --version)"

if command -v nvm >/dev/null 2>&1; then
  DEFAULT_NODE="$(set +u; nvm version default 2>/dev/null || true)"
  DEFAULT_MAJOR="${DEFAULT_NODE#v}"; DEFAULT_MAJOR="${DEFAULT_MAJOR%%.*}"
  if [[ "$DEFAULT_MAJOR" =~ ^[0-9]+$ ]] && [ "$DEFAULT_MAJOR" -lt "$REQUIRED_MAJOR" ]; then
    echo "   Tip: your default Node is $DEFAULT_NODE — new terminals will use it."
    echo "        Make $REQUIRED_MAJOR the default with: nvm alias default $REQUIRED_MAJOR"
  fi
fi
echo ""

# ---------- dependencies ----------
# Reinstall when node_modules is missing, --fresh was passed, or package-lock.json
# changed since the last install (npm writes node_modules/.package-lock.json).
needs_install=false
if $FRESH || [ ! -d node_modules ] || [ ! -f node_modules/.package-lock.json ] \
   || [ package-lock.json -nt node_modules/.package-lock.json ]; then
  needs_install=true
fi

if $needs_install; then
  echo "📦 Installing dependencies (npm ci)..."
  rm -rf node_modules
  npm ci
  echo ""
else
  echo "✅ Dependencies up to date"
  echo ""
fi

# ---------- run ----------
case "$COMMAND" in
  dev)
    echo "🌐 Dev server: http://localhost:$PORT  (Ctrl+C to stop)"
    echo ""
    exec npm run dev -- --port "$PORT"
    ;;
  build)
    npm run build
    echo ""
    echo "✅ Built into ./build"
    ;;
  preview)
    npm run build
    echo ""
    echo "🌐 Production preview: http://localhost:$PORT  (Ctrl+C to stop)"
    exec npm run preview -- --port "$PORT"
    ;;
  test)
    exec npm test
    ;;
  lint)
    exec npm run lint
    ;;
esac
