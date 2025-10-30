import { chromium } from '@playwright/test';
import fs from 'fs';

export default async function globalSetup() {
  console.log('🔹 Running global precheck...');

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-http2', // force HTTP/1.1
      '--window-size=1920,1080',
    ],
  });

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'X-KFC-PIPELINE': process.env.PIPELINE_GUID || '6f8a3d47-2b1f-4b1e-8f8f-1c2b3a4d5e6f',
      'User-Agent': process.env.USER_AGENT || 'KFC-Playwright-CI/1.0 (+GitLab CI)',
    },
  });

  const page = await context.newPage();

  const blockedHosts = [
    '**/gtm.js',
    '**/datadog.js',
    '**/hotjar.com/**',
    '**/google-analytics.com/**',
  ];
  for (const url of blockedHosts) {
    await page.route(url, route => route.abort());
  }

  try {
    let response;
    for (let i = 0; i < 3; i++) {
      try {
        response = await page.goto('https://qa.kfc-digital.io', { waitUntil: 'domcontentloaded', timeout: 90000 });
        if (response && response.status() < 400) break;
      } catch (err) {
        console.warn(`Navigation attempt ${i + 1} failed: ${err.message}`);
        if (i === 2) throw err;
      }
    }

    await page.waitForSelector('.HomeMenuItem_image-container__p1Y9n', { timeout: 90000 });

    try {
      await page.waitForResponse(
        resp => resp.url().includes('graphql.contentful.com') && resp.status() === 200,
        { timeout: 30000 }
      );
    } catch {
      console.warn('⚠️ Contentful GraphQL response not detected — continuing anyway');
    }

    console.log('✅ Precheck passed, saving storage state...');
    await context.storageState({ path: 'playwright/.auth/storageState.json' });

    await page.screenshot({ path: 'test-results/precheck-debug.png', fullPage: true });

  } catch (err) {
    console.error('❌ Precheck failed:', err.message);
    try { await page.screenshot({ path: 'test-results/precheck-failed.png', fullPage: true }); } catch {}
    process.exit(1);
  } finally {
    await browser.close();
  }
}
