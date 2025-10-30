import { test, expect } from '../fixtures/fixtures.js';
import { LoginPage } from '../lib/pages/loginPage';
import { createTempMailAccount, getOTPFromMailTm } from '../lib/utils/tempMailAccountHelper';
import { GuestDetailsFormPage } from '../lib/pages/guestDetailsFormPage';

test.describe('New Account Creation flow', () => {
  test('Validate new user account is created', async ({ page }) => {
    const { email, token } = await createTempMailAccount();
    const loginPage = new LoginPage(page);
    const guestDetailsFormPage = new GuestDetailsFormPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.loginWithGivenUser(email);
    const otp = await getOTPFromMailTm(token);
    console.log(`Extracted OTP: ${otp}`);
    await loginPage.enterOTP(otp);
    await guestDetailsFormPage.enterFirstName();
    await guestDetailsFormPage.enterLastName();
    await guestDetailsFormPage.clickNext();
    await guestDetailsFormPage.clickPromotionAndRewardsEmailToggle();
    await guestDetailsFormPage.clickPromotionAndRewardsTextToggle();
    await guestDetailsFormPage.clickSave();
    await expect(page.getByText('Success! Account created.')).toBeVisible();
  });
});
