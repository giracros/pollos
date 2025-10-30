import { BasePage } from './basePage';
import locators from '../locators/loginPage.json' assert { type: "json"}
import { expect} from '@playwright/test';
import { assert } from 'console';
import { fetchGmailOTP } from '../utils/gmailHelper';

export class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    }

    async navigateToLoginPage() {
        await this.page.goto('/login');
    }

    async navigateToQaEnv(){
      await this.page.goto('/');
    }

    async loginAsTestUser() {
        await this.fillText(locators.auth.emailTextBox, 'kfctestuserautomation001@gmail.com');
        await this.continueButton.click();
        await this.page.waitForTimeout(10000); // wait for email to be received
    }

    async enterOTP(otp) {
        if (!otp || otp.length !== 6) {
            console.error('Invalid OTP format:', otp);
            return;
        }

        const digits = otp.split('');
        console.log('Entering OTP:', otp);

        for (let i = 0; i < digits.length; i++) {
            const inputLocator = this.page.locator(`(//div[contains(@class, "ConfirmOTPModal") or contains(@class, "ConfirmCode")]//input)[${i + 1}]`);
            await inputLocator.waitFor({ state: 'visible', timeout: 5000 });
            await inputLocator.click();
            await inputLocator.press(digits[i]);
            await this.page.waitForTimeout(200);
        }     
    }

    async loginAsRegisteredUser(){
        await this.navigateToLoginPage();
        await this.loginAsTestUser();
        const otp = await fetchGmailOTP();
        await this.enterOTP(otp);
  }
    async loginWithGivenUser(email) {
        await this.fillText(locators.auth.emailTextBox, email);
        await this.continueButton.click();
        await this.page.waitForTimeout(10000); // wait for email to be received
    }
}