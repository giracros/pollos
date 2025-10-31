import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

export default async function globalSetup() {
  const configuredUrl = process.env.BASE_URL?.trim();
  const fallbackMarkup = '<html><head><title>Smoke Test</title></head><body><h1 data-testid="smoke-heading">Smoke test page</h1></body></html>';
  const fallbackUrl = `data:text/html,${encodeURIComponent(fallbackMarkup)}`;
  const targetUrl = configuredUrl || fallbackUrl;
  console.log(`🔹 Running smoke precheck against ${configuredUrl ?? 'embedded smoke page'}`);

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-http2',
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

  try {
    const response = await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });

    if (configuredUrl) {
      if (!response || !response.ok()) {
        throw new Error(`Navigation to ${configuredUrl} failed with status ${response ? response.status() : 'N/A'}`);
      }
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    } else {
      await page.waitForSelector('[data-testid="smoke-heading"]', { timeout: 5000 });
    }

    const artifactsDir = path.join('test-results');
    fs.mkdirSync(artifactsDir, { recursive: true });
    await page.screenshot({ path: path.join(artifactsDir, 'precheck.png'), fullPage: true });

    console.log('✅ Precheck passed.');
  } catch (error) {
    console.error(`❌ Precheck failed: ${error.message}`);
    try {
      const artifactsDir = path.join('test-results');
      fs.mkdirSync(artifactsDir, { recursive: true });
      await page.screenshot({ path: path.join(artifactsDir, 'precheck-failed.png'), fullPage: true });
    } catch {}
    throw error;
  } finally {
    await browser.close();
  }
}
