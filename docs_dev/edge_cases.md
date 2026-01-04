# Edge Cases Log

This file tracks all difficulties, edge cases, and template integration issues encountered during development.

## Format
```markdown
## YYYY-MM-DD: Issue Title
**Template**: template_generator.py / self_healing_runner.py / etc.
**Scenario**: What I was trying to do
**Problem**: What went wrong or was confusing
**Workaround**: How I resolved it (if resolved)
**Suggestion**: How the template could be improved
```

---

## 2026-01-04: Electron Dual TypeScript Configurations
**Template**: template_generator.py (SPEC.md)
**Scenario**: Setting up TypeScript compilation for Electron project with main, preload, and renderer processes
**Problem**: Electron projects require different TypeScript configurations for different processes:
- Main process: Node.js environment, CommonJS modules
- Preload process: Node.js + Electron APIs, CommonJS modules
- Renderer process: Browser environment, ESM modules, handled by Vite

The SPEC.md template doesn't mention this multi-config requirement for TypeScript in Electron projects.

**Workaround**: Created three tsconfig files:
- `tsconfig.json` (base config)
- `tsconfig.main.json` (extends base, targets main process)
- `tsconfig.preload.json` (extends base, targets preload)
- Renderer uses Vite's built-in TypeScript handling

**Suggestion**: The template_generator.py should include an Electron-specific project type that generates SPEC.md with:
- TypeScript dual/triple config requirements section
- Build pipeline explanation (main/preload via tsc, renderer via bundler)
- IPC architecture patterns
- Security best practices (contextIsolation, nodeIntegration: false)

---

