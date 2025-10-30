# KFC QA Playwright Automation

End-to-end Playwright test suite that exercises key customer journeys for https://qa.kfc-digital.io.
The project follows the Page Object Model (POM) pattern with shared fixtures and utilities under `lib/`.

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
3. Copy the example environment file and provide valid credentials:
   ```bash
   cp .env.example .env
   # fill in the Gmail OAuth values
   ```

## Environment variables
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
Run all end-to-end scenarios locally:

```bash
npm run e2e
```

Artifacts such as traces and HTML reports are saved under `test-results/` and `playwright-report/` respectively.

> **Note:** The global setup navigates to `https://qa.kfc-digital.io`. Runs behind restricted networks (such as the training
> environment used here) may fail with `ERR_TUNNEL_CONNECTION_FAILED`. Ensure outbound HTTPS access to that host is permitted when
> executing the suite.

## Continuous Integration
A GitHub Actions workflow located at `.github/workflows/playwright.yml` installs browsers, executes the Playwright suite, and uploads HTML reports and traces for inspection. Configure the required Gmail secrets (`GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`) in the repository settings before triggering the workflow.
