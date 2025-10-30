import { BasePage } from './basePage';
import { faker } from '@faker-js/faker';

export class GuestDetailsFormPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this.firstName = page.locator('input[name="firstName"]');
        this.lastName = page.locator('input[name="lastName"]');
        this.email = page.getByRole('textbox', {name: 'Email'});
        this.phoneNumber = page.locator('input[name="phoneNumber"]');
        this.optToKfcRewardsCheckbox = page.locator('label').filter({ hasText: 'By opting into KFC Rewards I' }).locator('figure');
        this.promotionAndRewardsEmailToggle = page.locator('div').filter({ hasText: /^Promotions & Rewards Emails$/ }).getByTestId('Toggle').locator('span');
        this.promotionAndRewardsTextToggle = page.locator('div').filter({ hasText: /^Promotions & Rewards Texts$/ }).getByTestId('Toggle').locator('span');
        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.skipTakeMeToRewardsLink = page.getByRole('link', { name: 'Skip, take me to Rewards link' });
        this.nextButton = page.getByRole('button', { name: 'Next' });
    }

    async enterFirstName() {
        const randomFirstName = faker.person.firstName();
        await this.firstName.fill(randomFirstName);
    }

    async enterLastName() {
        const randomLastName = faker.person.lastName();
        await this.lastName.fill(randomLastName);
    }

    async clickPromotionAndRewardsEmailToggle() {
        await this.promotionAndRewardsEmailToggle.click();
    }

    async clickPromotionAndRewardsTextToggle() {
        await this.promotionAndRewardsTextToggle.click();
    }

    async clickSubmit() {
        await this.submitButton.click();
    }

    async clickNext() {
        await this.nextButton.click();
    }

    async clickSave() {
        await this.saveButton.click();
    }

}