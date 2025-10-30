import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import globalSetup from './global-setup.js';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 90000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  globalSetup: './global-setup.js',

  reporter: [
    ['list'],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],

  use: {
    baseURL: 'https://qa.kfc-digital.io',
    headless: true,
    ignoreHTTPSErrors: true,
    viewport: { width: 1920, height: 1080 },
    geolocation: { latitude: 37.7749, longitude: -122.4194 },
    permissions: ['geolocation'],
    timezoneId: 'America/Los_Angeles',
    locale: 'en-US',
    storageState: 'playwright/.auth/storageState.json',
    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-http2',
        '--window-size=1920,1080',
      ],
    },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'on',
  },

  projects: [
    // 🔹 Precheck project
    // {
    //   name: 'precheck',
    //   testMatch: /.*precheck\.spec\.js/,
    //   use: { 
    //     ...devices['Desktop Chrome'],
    //     userAgent: process.env.USER_AGENT || 'KFC-Playwright-CI/1.0 (+GitLab CI)',
    //     extraHTTPHeaders: {
    //       'X-KFC-PIPELINE': process.env.PIPELINE_GUID || '6f8a3d47-2b1f-4b1e-8f8f-1c2b3a4d5e6f',
    //     },
    //   },
    // },

    // 🔹 tests runs only if precheck passes
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        userAgent: process.env.USER_AGENT || 'KFC-Playwright-CI/1.0 (+GitLab CI)',
        extraHTTPHeaders: {
          'X-KFC-PIPELINE': process.env.PIPELINE_GUID || '6f8a3d47-2b1f-4b1e-8f8f-1c2b3a4d5e6f',
        },
        storageState: 'playwright/.auth/storageState.json',
      },
    },
  ],
});
