import { test, expect } from '../fixtures/fixtures.js';
import { HeaderPage } from '../lib/pages/headerPage';

test.describe('Header Navigation & Functionality', () => {
  let headerPage;

  test.beforeEach(async ({ page }) => {
    headerPage = new HeaderPage(page);
    //await headerPage.navigateToHomePage();
  });

  test('should display Menu and redirect to menu page', async ({ page }) => {
    await headerPage.validateHeaderLinkVisible('Menu');
    await headerPage.openMenu();
    await headerPage.validateMenuPageRedirect();
  });

  test('should display Rewards and redirect to dashboard if logged out', async ({ page }) => {
    await headerPage.validateHeaderLinkVisible('Rewards');
    await headerPage.openRewards();
    await headerPage.validateRewardsEnrollRedirect();
  });

  test('should display Rewards and redirect to dashboard if logged in', async ({ page }) => {
    await headerPage.loginTestUserWithOTP();
    await headerPage.validateHeaderLinkVisible('Rewards');
    await headerPage.openRewards();
    await headerPage.validateRewardsDashboardRedirect();
  });

  test('should display Careers and redirect to careers page', async ({ page }) => {
    await headerPage.validateHeaderLinkVisible('Careers');
    await headerPage.openCareers();
    await headerPage.validateCareersPageRedirect();
  });

  test('should display Gift Cards and prompt with external site prompt', async ({ page }) => {
    await headerPage.validateHeaderLinkVisible('Gift Cards');
    const modal = await headerPage.clickGiftCardsAndHandleModal();
    await modal.getByRole('button', { name: 'Back to KFC.com' }).click();
   
  });

  test.skip('should display Gift Cards and redirect to gift cards page', async ({ page }) => {
    await headerPage.validateHeaderLinkVisible('Gift Cards');
    const modal = await headerPage.clickGiftCardsAndHandleModal();
    const giftCardPopup = await headerPage.clickGiftCardAndHandlePopup(modal);
    await headerPage.validateGiftCardPopup(giftCardPopup);
  });

  test('should display Find A KFC and redirect to external locations site', async ({ page, context }) => {
    await headerPage.validateHeaderLinkVisible('Find A KFC');
    const newPage = await headerPage.clickFindAKFCAndHandlePopup(context);
    await headerPage.validateExternalLocationsRedirect(newPage);
    await headerPage.searchLocationOnExternalSite(newPage, '33327');
  });
}); 