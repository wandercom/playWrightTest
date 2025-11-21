# playWrightTest

Small Playwright Test harness containing example TypeScript E2E tests.

Quick start

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers (required for running tests):

```bash
npx playwright install
```

3. Run tests:

```bash
npm test
# or directly with npx
npx playwright test
```

4. Open the HTML report after a run:

```bash
npm run test:report
# or
npx playwright show-report
```

Notes
- Tests are TypeScript files under `tests/` and use `@playwright/test` (see `playwright.config.ts`).
- The Playwright config defines three browser projects (chromium, firefox, webkit) and enables `trace: 'on-first-retry'`.
- If you add a local web app, enable `webServer` or set `baseURL` in `playwright.config.ts`.
