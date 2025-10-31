# KFC QA Playwright Automation

Playwright-based automation project that can be pointed at any environment by changing the configured base URL.
The repository keeps the original Page Object Model (POM) structure under `lib/`, but the default test
execution now focuses on a single smoke scenario that verifies the application can be reached successfully.

## Prerequisites
- Node.js 20+
- npm 8+

## Getting started
1. Install dependencies:
   ```bash
   npm ci
   ```
2. Install the Playwright browsers and system dependencies (once per environment):
   ```bash
   npm run setup
   ```
3. Copy the example environment file and provide the desired overrides:
   ```bash
   cp .env.example .env
   # optionally adjust BASE_URL or fill in the Gmail OAuth values
   ```

## Environment variables
| Variable | Description |
| --- | --- |
| `BASE_URL` | Optional target host for the smoke test. When omitted, the suite navigates to an embedded offline HTML page so runs succeed without network access. |

The following variables are required when executing scenarios that fetch OTP codes from Gmail:

| Variable | Description |
| --- | --- |
| `GMAIL_CLIENT_ID` | Google OAuth client ID with Gmail API enabled. |
| `GMAIL_CLIENT_SECRET` | OAuth client secret associated with the client ID. |
| `GMAIL_REFRESH_TOKEN` | Refresh token for the Gmail account that receives OTP emails. |

Optional overrides used by the Playwright global setup:

| Variable | Description |
| --- | --- |
| `PIPELINE_GUID` | Custom GUID sent via the `X-KFC-PIPELINE` header. |
| `USER_AGENT` | Override for the default CI user agent string. |

## Running the test suite
Run the smoke check locally:

```bash
npm run e2e
```

Artifacts such as traces and HTML reports are saved under `test-results/` and `playwright-report/` respectively.

> **Note:** The global setup navigates to the configured `BASE_URL`. If you need to target
> `https://qa.kfc-digital.io`, make sure your network allows outbound HTTPS requests to that host or the smoke
> check will fail. When `BASE_URL` is not provided, the suite falls back to an embedded offline page so CI runs
> remain stable even behind restrictive proxies.

## Continuous Integration
A GitHub Actions workflow located at `.github/workflows/playwright.yml` installs browsers, executes the Playwright suite, and uploads HTML reports and traces for inspection. Configure the required Gmail secrets (`GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`) in the repository settings before triggering the workflow.
