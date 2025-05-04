# 🧼 repo-diff-logger

Custom GitHub Action in TypeScript + ESM that logs changed files in a monorepo, checks `.gitignore`, flags modified/new files, and outputs useful diagnostics for release automation.

---

## ✨ Features

- ✅ Outputs list of changed, new, and ignored files
- 📂 Filters via `.gitignore` and custom paths
- 🕒 Tracks time since file modification
- 🧼 Detects clean vs dirty repository state
- ✨ Written in **ESM TypeScript** with full Vitest test suite
- 🧪 Code coverage reporting enabled

---

## 📁 Project Structure

```
repo-diff-logger/
├── src/
│   ├── index.ts
│   └── utils.ts
├── tests/
│   ├── index.test.ts
│   └── utils.test.ts
├── .github/workflows/test.yml
├── dist/              # output dir
├── action.yml         # GitHub Action metadata
├── tsconfig.json
├── vitest.config.ts
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Setup & Usage

### Install

```bash
pnpm install
pnpm run build
```

### Test

```bash
pnpm test
pnpm test -- --coverage
```

### Use in Workflow

```yaml
- uses: your-org/repo-diff-logger@v1
  with:
    LOGGING_REPO: true
    LOGGING_ALL: true
    LOGGING_REPO_IGNORED: true
    CHANGED_INCLUDES: 'dist,docs,storybook-static,types'
```

### Inputs

| Name                  | Type     | Default                                 | Description                                 |
|-----------------------|----------|-----------------------------------------|---------------------------------------------|
| `LOGGING_REPO`        | `bool`   | `"true"`                                | Log non-ignored changed files               |
| `LOGGING_ALL`         | `bool`   | `"false"`                               | Log all changed files (ignored + tracked)   |
| `LOGGING_REPO_IGNORED`| `bool`   | `"false"`                               | Log `.gitignore`-ignored changed files      |
| `CHANGED_INCLUDES`    | `string` | `"dist,docs,storybook-static,types"`    | Optional overrides for filtering focus      |

---

## 🧪 Testing & Coverage

### Run tests

```bash
pnpm test
```

### View coverage

```bash
pnpm test -- --coverage
open coverage/index.html
```

---

## 🛠️ Publishing

```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## License

MIT — your-org
