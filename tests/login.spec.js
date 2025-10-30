import { test, expect } from '../fixtures/fixtures.js';
import { fetchGmailOTP } from '../lib/utils/gmailHelper';
import {LoginPage} from '../lib/pages/loginPage';

test.describe('Validate Login feature', () => {
  test('Validate OTP Login flow', async ({page}) => {
    const loginPage = new LoginPage(page)
    await loginPage.navigateToLoginPage()
    await loginPage.loginAsTestUser()
    const otp = await fetchGmailOTP();
    if (otp) {
      await loginPage.enterOTP(otp); 
    } else {
      console.error('Failed to retrieve OTP code');
    }
   await expect(loginPage.page.getByText('Welcome Back!')).toBeVisible();
  })
})
