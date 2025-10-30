import { expect } from "@playwright/test";
import { BasePage } from './basePage';
import locators from '../locators/checkoutPage.json' assert { type: "json"}
import deliveryAddressData from "../../testData/deliveryAddressData";

export class CheckoutPage extends BasePage{
  constructor(page) {
        super(page);
        this.page = page;
        this.newCreditCardRadioButton = page.locator('label').filter({ hasText: 'New Credit Card' });
        this.nameOnCard = page.locator('iframe[title="UCOM-SDK"]').contentFrame().getByRole('textbox', { name: 'Name on Card' });
        this.cardNumber = page.locator('iframe[title="UCOM-SDK"]').contentFrame().getByRole('textbox', { name: 'Card Number' });
        this.expirationDate = page.locator('iframe[title="UCOM-SDK"]').contentFrame().getByRole('textbox', { name: 'Expiration Date' });
        this.cvv = page.locator('iframe[title="UCOM-SDK"]').contentFrame().getByRole('textbox', { name: 'CVV' });
        this.zipCode = page.locator('iframe[title="UCOM-SDK"]').contentFrame().getByRole('textbox', { name: 'Billing Zip Code' });
        this.useThisCard = page.locator('iframe[title="UCOM-SDK"]').contentFrame().getByRole('button', { name: 'Use This Card' });
        this.placeOrder = page.getByRole('button', { name: 'Place Order $' });
    }

  async fillContactInfo(firstName, lastName, email, phoneNumber) {
    await this.fillText(locators.inputs.firstNameInput, firstName);
    await this.fillText(locators.inputs.lastNameInput, lastName);
    await this.fillText(locators.inputs.emailInput, email);
    await this.fillText(locators.inputs.phoneNumberInput, phoneNumber);
  }

  async verifyPlaceOrderIsDisabled() {
    await expect(this.page.locator(locators.buttons.placeOrderButton)).toBeDisabled();
  }

  async clickPlaceOrderButton() {
    await this.clickOnElement(locators.buttons.placeOrderButton);
    await this.page.waitForTimeout(12000);
  }    

  async closeSaveThisOrderAsFavForNextTime() {
    try {
      const closeIcon = this.page.locator("//button[@aria-label='close Icon']");
      await closeIcon.waitFor({ state: 'visible', timeout: 25000 });
      await closeIcon.click();
      await page.waitForTimeout(5000);
    } catch(error) {
      // eslint-disable-next-line no-console
      console.log('Close icon is not there.');
    } 
  }

  async clickBackToMenu() {
    await this.page.locator(locators.buttons.backToMenuButtonbackToMenu).click();
  }

  async fillCreditCardInfo(name, cardNumber, expirationDate, cvv, zipCode) {
    await this.nameOnCard.fill(name);
    await this.cardNumber.fill(cardNumber);
    await this.expirationDate.fill(expirationDate);
    await this.cvv.fill(cvv);
    await this.zipCode.fill(zipCode);
    await this.useThisCard.click(); 
  }

  async addDriverTip() {
    const firstTipButton = this.page.locator('div[class*="DeliveryTip"]').getByRole('button').first();
    await firstTipButton.waitFor({ state: 'visible' });
    await firstTipButton.click();
    const buttonText = await firstTipButton.textContent();
    await expect(firstTipButton).toHaveAttribute('data-selected', 'true');
    return buttonText;
  }

  async validateDeliveryAddress() {
    await expect(this.page.getByText(deliveryAddressData.deliveryStores.testStore.deliveryAddressCheckoutPage)).toBeVisible();
    await expect(this.page.getByText(deliveryAddressData.deliveryStores.testStore.deliveryFromCheckoutPage)).toBeVisible();
  }

}
