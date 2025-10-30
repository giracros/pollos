import { test as base, expect as baseExpect } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/*', route => {
      const blockedHosts = [
        'www.googletagmanager.com',
        'www.datadoghq-browser-agent.com',
        'www.google-analytics.com'
      ];
      const requestUrl = route.request().url();
      if (blockedHosts.some(host => requestUrl.includes(host))) {
        return route.abort();
      }
      return route.continue();
    });

    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('.HomeMenuItem_image-container__p1Y9n', { timeout: 60000 });

    await use(page);
  }
});

export const expect = baseExpect;
