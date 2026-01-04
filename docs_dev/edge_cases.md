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

## 2026-01-04: electron-builder File Mapping and TypeScript Output Paths
**Template**: N/A (project-specific edge case, affects build automation)
**Scenario**: Packaging Electron app with electron-builder after TypeScript compilation
**Problem**: TypeScript preserves source directory structure when compiling, so `src/main/index.ts` becomes `dist/main/main/index.js`. This caused electron-builder's asar packaging to fail with "entry file not found" error.

Initial attempts to fix:
- Setting `rootDir: "src"` in tsconfig - didn't flatten the structure as expected
- Complex file mappings in electron-builder.yml - overcomplicated the solution

**Workaround**:
- Accepted TypeScript's default output structure (`dist/main/main/index.js`)
- Updated `package.json` main field to point to the nested path: `dist/main/main/index.js`
- Fixed preload path in main process: `../../preload/preload/index.js`
- Used simple `from: dist, to: dist` mapping in electron-builder.yml

**Suggestion**: Build automation templates and verification scripts should:
- Validate that package.json main field points to an existing file after build
- Check that IPC handler paths resolve correctly
- Warn about common electron-builder + TypeScript path mismatches

**Result**: macOS x64 and arm64 builds succeeded, creating 4 portable artifacts:
- DirBrowser-1.0.0.dmg (x64) - 334MB
- DirBrowser-1.0.0-mac.zip (x64) - 323MB
- DirBrowser-1.0.0-arm64.dmg (arm64) - 328MB
- DirBrowser-1.0.0-arm64-mac.zip (arm64) - 317MB

---

## 2026-01-04: self_healing_runner.py Python-Centric Test Runner
**Template**: self_healing_runner.py
**Scenario**: Attempting to use self_healing_runner.py for automated test-fix iteration
**Problem**: The self_healing_runner.py script is designed for Python projects and expects pytest:
```python
SUPPORTED_RUNNERS = {
    "pytest": {"cmd": [sys.executable, "-m", "pytest"], "format": "json"},
    "ruff": {"cmd": ["ruff", "check"], "format": "text"},
    "mypy": {"cmd": [sys.executable, "-m", "mypy"], "format": "text"},
    "script_auditor": {"cmd": [sys.executable], "format": "json"},
}
```

However, this is a TypeScript/JavaScript project using vitest as the test runner.

**Workaround**:
- Ran vitest manually: `pnpm test` (5/5 tests passed)
- Would need to extend self_healing_runner.py to support JavaScript test runners
- Or create a wrapper script that translates vitest output to pytest-compatible format

**Suggestion**: The self_healing_runner.py should:
- Support language-agnostic test runner configuration
- Allow custom runner definitions via config file
- Detect project type (package.json, pyproject.toml, Cargo.toml) and auto-select runner
- Support common JS/TS test runners: vitest, jest, mocha, ava
- Provide clear error message when runner is not supported

**Alternative**: Create language-specific self-healing runners:
- `self_healing_runner_python.py` (pytest, ruff, mypy)
- `self_healing_runner_js.py` (vitest, jest, eslint, tsc)
- `self_healing_runner_go.py` (go test, golangci-lint)
- `self_healing_runner_rust.py` (cargo test, clippy)

**Result**: Skipped self_healing_runner.py integration due to incompatibility. Tests run successfully via pnpm.

---

