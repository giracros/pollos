import { BasePage } from './basePage';
import locators from '../locators/headerPage.json' assert { type: "json" };
import { LoginPage } from './loginPage';
import { fetchGmailOTP } from '../utils/gmailHelper';
import { expect } from '@playwright/test';

export class HeaderPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
  }

  async navigateToHomePage() {
    await this.page.goto('/');
  }

  get menuLink() {
    return this.page.locator(locators.headerLinks.menu);
  }
  get rewardsLink() {
    return this.page.locator(locators.headerLinks.rewards);
  }
  get careersLink() {
    return this.page.locator(locators.headerLinks.careers);
  }
  get giftCardsLink() {
    return this.page.locator(locators.headerLinks.giftCards);
  }
  get findAKFCLink() {
    return this.page.locator(locators.headerLinks.findAKFC);
  }

  get linkMap() {
    return {
      'Menu': this.menuLink,
      'Rewards': this.rewardsLink,
      'Careers': this.careersLink,
      'Gift Cards': this.giftCardsLink,
      'Find A KFC': this.findAKFCLink
    };
  }

  async openMenu() {
    await this.clickOnElement(this.menuLink);
  }
  async openRewards() {
    await this.clickOnElement(this.rewardsLink);
  }
  async openCareers() {
    await this.clickOnElement(this.careersLink);
  }
  async openGiftCards() {
    await this.clickOnElement(this.giftCardsLink);
    await this.page.waitForTimeout(2000);
  }
  async openFindAKFC() {
    await this.clickOnElement(this.findAKFCLink);
  }

  async validateHeaderLinkVisible(linkName) {
    await this.validateLinkVisible(this.linkMap, linkName);
  }

  async validateModalHeading(headingText) {
    await this.validateModalHeading(headingText);
  }

  async clickGiftCardsAndHandleModal() {
    await this.openGiftCards();
    const modal = this.page.locator('[role="dialog"], .modal, .external-site-prompt');
    await modal.getByRole('heading', { name: 'You are about to leave kfc.com' }).waitFor({ state: 'visible', timeout: 5000 });
    return modal;
  }

  async clickFindAKFCAndHandlePopup(context) {
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      this.openFindAKFC()
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }

  async clickGiftCardAndHandlePopup(modal) {
    return await this.openPopup(modal.getByRole('button', { name: /continue/i }));
  }

  async loginTestUserWithOTP() {
    const loginPage = new LoginPage(this.page);
    await loginPage.navigateToLoginPage();
    await loginPage.loginAsTestUser();
    const otp = await fetchGmailOTP();
    if (otp) {
      await loginPage.enterOTP(otp);
    } else {
      throw new Error('Failed to retrieve OTP code');
    }
  }

  async searchLocationOnExternalSite(newPage, zipCode) {
    if (await newPage.getByRole('button', { name: 'Accept' }).isVisible().catch(() => false)) {
      await newPage.getByRole('button', { name: 'Accept' }).click();
    }
    await newPage.getByRole('textbox', { name: /City, State/ }).click();
    await newPage.getByRole('textbox', { name: /City, State/ }).fill(zipCode);
    await newPage.getByRole('button', { name: /Submit a search/ }).click();
    await newPage.getByText(/locations near/).waitFor({ state: 'visible' });
  }

  async validateMenuPageRedirect() {
    await expect(this.page).toHaveURL(/\/menu/);
    await this.validateHeadingVisible('KFC Menu');
  }

  async validateRewardsEnrollRedirect() {
    await expect(this.page).toHaveURL(/\/dashboard\/enroll/);
    await this.validateTextVisible('Earn Points on Purchases');
  }

  async validateRewardsDashboardRedirect() {
    await expect(this.page).toHaveURL(/\/dashboard/);
    await expect(this.page.getByTestId('Header-welcome-message')).toBeVisible();
  }

  async validateCareersPageRedirect() {
    await expect(this.page).toHaveURL(/\/careers/);
    await this.validateHeadingVisible('Join Our KFC Family');
  }

  async validateGiftCardPopup(popup) {
    await expect(popup.getByRole('heading', { name: 'Save 10% on Gift Cards' })).toBeVisible();
  }

  async validateExternalLocationsRedirect(newPage) {
    await expect(newPage).toHaveURL(/https:\/\/locations\.kfc\.com\/search/);
  }
} 