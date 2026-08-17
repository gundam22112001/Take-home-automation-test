# Playwright Automation Framework — demoblaze.com

End-to-end test automation framework built with [Playwright](https://playwright.dev/) and TypeScript, targeting [demoblaze.com](https://www.demoblaze.com). Covers Login and Cart functional flows with Allure reporting and GitHub Actions CI/CD.

---

## Table of Contents

- [Framework Structure](#framework-structure)
- [Design Rationale](#design-rationale)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Allure Reporting](#allure-reporting)
- [CI/CD](#cicd)
- [Test Coverage](#test-coverage)

---

## Framework Structure

```
playwright_framework/
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions CI/CD pipeline
├── common/
│   ├── common-data.ts           # Shared test credentials (env-var driven)
│   └── fixture.ts               # Custom Playwright fixtures (guessPage / userPage)
├── page/
│   ├── NavigationBar.ts         # Top navigation bar page object
│   ├── Login.ts                 # Login modal page object
│   ├── HomePage.ts              # Home / product listing page object
│   ├── ProductPage.ts           # Product detail page object
│   ├── CartPage.ts              # Cart page object
│   ├── PlaceOrderModal.ts       # Place Order form modal page object
│   └── OrderConfirmationModal.ts# SweetAlert order confirmation page object
├── tests/
│   ├── login.spec.ts            # 18 Login test cases (TC-LOG-001 – TC-LOG-018)
│   └── cart.spec.ts             # 26 Cart test cases  (TC-CRT-001 – TC-CRT-026)
├── playwright.config.ts         # Playwright configuration
├── package.json
└── tsconfig.json
```

---

## Design Rationale

### Page Object Model (POM)
Each UI component has its own class under `page/`. Locators are private; only typed getter methods and action methods are public. This means a selector change requires editing exactly one file.

### Custom Fixtures (`common/fixture.ts`)
Two fixtures extend the built-in `page` fixture:

| Fixture | Description |
|---|---|
| `guessPage` | Fresh browser context — unauthenticated guest session |
| `userPage` | Pre-authenticated context — logs in via `Account` credentials before the test body runs |

Both record video at 1024×768. On test failure the video is attached to the Allure/Playwright report automatically; on pass the recording is discarded.

### Env-var driven configuration
`baseURL` and test credentials are read from environment variables, falling back to local defaults. This means the same suite runs locally with no changes and in CI with secrets injected.

| Variable | Default | Purpose |
|---|---|---|
| `BASE_URL` | `https://www.demoblaze.com` | Target environment URL |

### Cross-browser support
`playwright.config.ts` defines three projects — **Chromium**, **Firefox**, and **WebKit** — so the full suite runs across all engines with a single command.

### Allure reporting
Each test is annotated with `allureId`, `feature`, `story`, `description`, and `step` from `allure-js-commons`. This produces structured, filterable HTML reports with timeline, categories, and per-step attachments.

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18 LTS or later |
| npm | 9+ |
| Java | 11+ (required by Allure CLI) |

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/gundam22112001/Take-home-automation-test.git
cd Take-home-automation-test

# 2. Install Node dependencies
npm ci

# 3. Install Playwright browsers and OS dependencies
npx playwright install --with-deps
```

---

## Configuration

### Local `.env` (optional)
Create a `.env` file in the project root to override defaults without touching source files:

```
BASE_URL=https://www.demoblaze.com
TEST_USERNAME=your_username
TEST_PASSWORD=your_password
```

Playwright picks these up automatically if you uncomment the `dotenv` block in `playwright.config.ts`.

### Run a specific browser only
Pass `--project` to target one engine:

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

---

## Running Tests

### Run all tests (all browsers)
```bash
npm test
```

### Run a specific test suite
```bash
# Login suite only
npx playwright test tests/login.spec.ts

# Cart suite only
npx playwright test tests/cart.spec.ts
```

### Filter by test ID
```bash
# All TC-LOG cases
npx playwright test --grep "TC-LOG"

# Single test case
npx playwright test --grep "TC-CRT-011"
```

### Run with a specific browser
```bash
npx playwright test --project=chromium tests/cart.spec.ts
```

### Run in headed mode (watch the browser)
```bash
npx playwright test --headed
```

### Run in UI mode (interactive test explorer)
```bash
npx playwright test --ui
```

### Debug a specific test
```bash
npx playwright test --debug --grep "TC-LOG-001"
```

---

## Allure Reporting

### Generate and open report after a test run
```bash
npm run allure:report
```

### Step-by-step
```bash
# Clean previous results
npm run allure:clean

# Run tests (produces allure-results/)
npm test

# Generate HTML report
npm run allure:generate

# Open in browser
npm run allure:open
```

### Fresh run (clean + test + generate + open in one command)
```bash
npm run test:fresh
```

> **Note:** Playwright HTML report is also generated automatically at `playwright-report/index.html` and can be viewed with `npx playwright show-report`.

---

## Test Coverage

### Login (`tests/login.spec.ts`)

| Range | Group | Count |
|---|---|---|
| TC-LOG-001 – TC-LOG-007 | Functional | 7 |
| TC-LOG-008 – TC-LOG-011 | Edge Case | 4 |
| TC-LOG-012 – TC-LOG-018 | Negative | 7 |
| **Total** | | **18** |

### Cart (`tests/cart.spec.ts`)

| Range | Group | Count |
|---|---|---|
| TC-CRT-001 – TC-CRT-019 | Functional | 19 |
| TC-CRT-020 – TC-CRT-026 | Edge Case | 7 |
| **Total** | | **26** |
