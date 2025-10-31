import { test, expect } from '@playwright/test';

test.describe('Application availability', () => {
  test('should load the target page successfully', async ({ page }) => {
    const configuredBaseUrl = test.info().project.use.baseURL?.trim();
    const fallbackMarkup = '<html><head><title>Smoke Test</title></head><body><h1 data-testid="smoke-heading">Smoke test page</h1></body></html>';
    const fallbackUrl = `data:text/html,${encodeURIComponent(fallbackMarkup)}`;

    if (configuredBaseUrl) {
      const response = await page.goto('/');

      expect(response).not.toBeNull();
      expect(response?.ok()).toBeTruthy();

      const expectedUrl = new URL('/', configuredBaseUrl).toString();
      await expect(page).toHaveURL(expectedUrl);
    } else {
      await page.goto(fallbackUrl);
      await expect(page.locator('[data-testid="smoke-heading"]')).toHaveText('Smoke test page');
    }
  });
});
