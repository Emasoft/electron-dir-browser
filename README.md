# Electron Directory Browser

A cross-platform, portable directory browser built with Electron and TypeScript.

## Features

- Browse directories on your local filesystem
- Navigate up/down directory hierarchies
- View file sizes and modification times
- Cross-platform support (macOS, Windows, Linux)
- Portable executables (no installer required)

## Platform Support

- macOS Intel (x64) - DMG and ZIP
- macOS ARM (arm64) - DMG and ZIP
- Windows (x64) - Portable EXE
- Linux (x64) - AppImage
- Linux (arm64) - AppImage

## Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
pnpm install
```

### Build

```bash
# Build all components
pnpm run build

# Build specific platforms
pnpm run dist:mac
pnpm run dist:win
pnpm run dist:linux
```

### Project Structure

```
src/
├── shared/          # Shared types and constants
│   ├── types/       # TypeScript interfaces
│   └── constants/   # IPC channel names
├── main/            # Electron main process
├── preload/         # Electron preload script
└── renderer/        # Renderer process (UI)
```

## Architecture

- **Main Process**: Node.js-based Electron main process handling filesystem operations
- **Preload Script**: Security bridge exposing safe IPC API to renderer
- **Renderer Process**: TypeScript + vanilla JS UI

## License

MIT
