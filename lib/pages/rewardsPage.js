import { BasePage } from './basePage';
import locators from '../locators/rewardsPage.json' assert { type: "json" };
import { expect } from '@playwright/test';

export class RewardsPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
  }

  async clickRewardItem(rewardName) {
    const itemLocator = this.page.locator(`//p[@aria-label='${rewardName}']`);
    const isVisible = await itemLocator.isVisible();
    if (isVisible) {
      await itemLocator.click();
      console.log(`Clicked on the item: ${rewardName}`);
    } else {
      console.error(`Element with text '${rewardName}' not found.`);
    }
    try {
      await this.page.getByText('Choose one of any of the following to redeem.').waitFor({
        state: 'visible',
        timeout: 3000,
      });
    
      const containerLocator = this.page.locator("//div[contains(@class,'SrvRewards_secretrecipe-subcategories-container')]");
      await containerLocator.first().waitFor({ state: 'visible', timeout: 3000 });
    
      await containerLocator.first().click();
    } catch (error) {
      console.log('No other options are there to redeem.');
    }    
  }

  async clickRewardsLink() {
    await this.page.locator(locators.rewards.rewardsLink).click();
  }

  async clickRedeemButton() {
    await this.page.locator(locators.rewards.redeemButton).waitFor({state: 'visible', timeout: 3000});
    await this.page.locator(locators.rewards.redeemButton).click();
    await this.page.waitForTimeout(5000);
  }

  async clickReplaceAndRedeemButton() {
    await this.page.locator(locators.rewards.replaceAndRedeemButton).click();
    await this.page.waitForTimeout(5000);
  }

  async clickCartIcon() {
    await this.page.waitForSelector(locators.cart.cartIcon, {
      state: 'visible',
      timeout: 20000,
    });
    await this.page.locator(locators.cart.cartIcon).click();
  }

  async clickContinueOrderDetailConfirmation() {
    await this.page.locator(locators.cart.continueOrderDetailConfirmation).click();
  }
  
} 