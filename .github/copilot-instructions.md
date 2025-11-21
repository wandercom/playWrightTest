## Purpose

This file provides concise, actionable context for AI coding assistants working in this repository. Focus on Playwright-based end-to-end tests placed under `tests/` and the minimal TypeScript test configuration.

## Big picture (what this repo is)

- E2E test suite powered by Playwright Test (`@playwright/test`).
- Tests live in `./tests` (see `playwright.config.ts` → `testDir: './tests'`).
- The project uses TypeScript test files (e.g. `tests/example.spec.ts`).

Why: The repo is structured as a lightweight Playwright test harness. The config defines three browser projects (chromium, firefox, webkit), html reporting, and traces on first retry.

## Key files to inspect

- `playwright.config.ts` — test runner settings: `testDir`, `fullyParallel`, `retries`, `reporter: 'html'`, `trace: 'on-first-retry'`, multiple browser projects, and commented `webServer`/`baseURL` hints.
- `tests/example.spec.ts` — example tests using `page.goto`, `getByRole`, and `expect` assertions.
- `package.json` — currently contains devDependencies for `@playwright/test` and `@types/node` but no npm scripts defined. Use `npx` to run Playwright commands until scripts are added.

## How to run & common commands

Use the Playwright CLI via npx (this repo doesn't define npm scripts):

```bash
# install deps
npm install

# run all tests
npx playwright test

# run a single file
npx playwright test tests/example.spec.ts

# open the HTML report after a run
npx playwright show-report
```

Notes: The config sets `workers` to `1` on CI and forbids `test.only` when `process.env.CI` is truthy.

## Project-specific conventions & patterns

- Tests are TypeScript files that import from `@playwright/test` (no custom test fixtures visible here).
- Prefer role-based selectors (example: `page.getByRole('link', { name: 'Get started' })`) and `expect` matchers as in `tests/example.spec.ts`.
- The config enables `trace: 'on-first-retry'` — when adding flaky tests, rely on this trace to debug failures.

## Integration points & extension hints

- Local dev server: `webServer` in `playwright.config.ts` is commented out. If you add a web app, enable `webServer` with `command` and `url` so Playwright can start the app automatically.
- `baseURL` is commented — define it if tests should use relative URLs (then use `page.goto('/')`).

## Examples to copy/paste

- Add a convenient npm script for maintainers (optional):

```json
// package.json snippet
"scripts": {
  "test": "playwright test",
  "test:report": "playwright show-report"
}
```

## Gotchas / observable constraints

- There are no npm scripts or tsconfig in the repository root—assume `npm install` + `npx playwright` is the expected workflow until the project adds scripts.
- Playwright will run TypeScript configs via its built-in TypeScript support. If adding custom build steps, update `package.json` and document them here.

## If you're an AI assistant editing tests or config

- Do not change the global test parallelism without checking `playwright.config.ts` — CI-specific settings are expressed there.
- When adding tests, follow the pattern in `tests/example.spec.ts`: import `{ test, expect }` from `@playwright/test`, avoid brittle CSS selectors, prefer `getByRole`.
- If you change reporter/trace settings, add a one-line justification in the PR so maintainers understand the reason.

---

If any of this is out-of-date or you want more detailed run/debug steps (e.g., GitHub Actions, Playwright trace analysis), tell me what to inspect next and I will update this file.
