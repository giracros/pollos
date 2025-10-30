import { test, expect } from '../fixtures/fixtures.js';
import { fetchGmailOTP } from '../lib/utils/gmailHelper';
import { LoginPage } from '../lib/pages/loginPage';
import locators from '../lib/locators/loginPage.json' assert { type: "json"};
import homePageLocators from '../lib/locators/homePage.json' assert { type: "json"};
import { HomePage } from '../lib/pages/homePage';
import { RewardsPage } from '../lib/pages/rewardsPage';
import { kidsMealReward, mediumBeverageReward } from '../testData/rewardsData';
import { CartPage } from '../lib/pages/cartPage';
import { CheckoutPage } from '../lib/pages/checkoutPage';

test.describe('Rewards feature', () => {
  let loginPage;
  let homePage;
  let rewardsPage;
  let cartPage;
  let checkoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    homePage = new HomePage(page);
    rewardsPage = new RewardsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await loginPage.navigateToLoginPage()
    await loginPage.loginAsTestUser()
    const otp = await fetchGmailOTP();
    if (otp) {
      await loginPage.enterOTP(otp); 
    } else {
      console.error('Failed to retrieve OTP code');
    }
    await expect(loginPage.page.getByText('Welcome Back!')).toBeVisible();
    await homePage.selectAStoreLocation();
    await homePage.clearCartIfNotEmpty();
  });

  test('Validate Reward Points', async ({page}) => {
    await homePage.clickRewardsButton();
    await rewardsPage.clickRewardsLink();
    const totalRewardPoints = await homePage.getRewardsPoints();
    await rewardsPage.clickRewardItem(mediumBeverageReward.rewardName);
    await rewardsPage.clickRedeemButton();
    await rewardsPage.clickCartIcon();
    await cartPage.clickCheckoutButton();
    await cartPage.clickContinueToCheckoutButton();
    await cartPage.proceedFromConfirmOrderDetailsPrompt();
    await checkoutPage.clickPlaceOrderButton();
    await checkoutPage.closeSaveThisOrderAsFavForNextTime();
    await checkoutPage.clickBackToMenu();
    await homePage.clickRewardsButton();
    const rewardPointsStr = mediumBeverageReward.rewardPoints;
    const totalRewardPointsAfterDeduction = await homePage.getRewardsPoints();
    const rewardPoints = parseInt(rewardPointsStr.replace(/,/g, ''), 10);
    if (isNaN(rewardPoints)) {
      console.error("Invalid reward points value: " + rewardPointsStr);
      return;
    }
    const expectedPoints = totalRewardPoints - rewardPoints;
    expect(totalRewardPointsAfterDeduction).toBe(expectedPoints);
  })

  test('Replace and Redeem reward', async ({page}) => {
    await homePage.clickRewardsButton();
    await rewardsPage.clickRewardsLink();
    await rewardsPage.clickRewardItem(kidsMealReward.rewardName);
    await rewardsPage.clickRedeemButton();
    await rewardsPage.clickRewardItem(mediumBeverageReward.rewardName);
    await rewardsPage.clickReplaceAndRedeemButton();
    await rewardsPage.clickCartIcon();
    await expect(rewardsPage.page.getByText('1 Item')).toBeVisible();
    await expect(rewardsPage.page.getByLabel('Reward Points')).toBeVisible();
  })
})
