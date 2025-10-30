import { expect } from "@playwright/test";
import { BasePage } from './basePage';
import locators from '../locators/giftCardPage.json' assert { type: "json"}

export class GiftCardPage extends BasePage{
  constructor(page) {
        super(page);
        this.page = page;
    }

    async addGiftCard(cardNumber, pin) {
    await this.page.locator(locators.buttons.addAGiftCard).first().click();
    await this.fillText(locators.inputs.giftCardNumber, cardNumber);
    await this.fillText(locators.inputs.giftCardPin, pin);
    await this.page.waitForTimeout(500);
    await this.clickOnElement(locators.buttons.saveGiftCard);
  }

  async checkInvalidOrNoBalanceErrorMessage(){
    let flag = await this.page.getByTestId('error_message-undefined').isVisible({ timeout: 2000 });
    if(flag){
    await this.page.locator(locators.buttons.gcModalClose).click({force:true});
    };
    return flag;
  }

  async verifyGiftCardIsAdded(param1, param2) {
    let number = param1;
    let pin = param2;
    if (number.length == 16) {
      pin = number.slice(-4);
    }
    await expect(
      this.page.locator(`//span[text()='Gift Card - ${pin}']`)
    ).toBeVisible({ timeout: 6000 });
  }

  async checkAddGiftCardButtonVisibility() {
      return await this.page.locator(locators.buttons.addAGiftCard).first().isVisible();
  }

  async verifyGiftCardMaxLimit() {
    await expect(this.page.locator(locators.images.giftCards)).toHaveCount(5);
  }

  async selectGiftCard(param1, param2) {
    let number = param1;
    let pin = param2;
    if (number.length == 16) {
      pin = number.slice(-4);
    }
    const xpath = 
    `//div[contains(@class,'PaymentItemCard_radio') and not(contains(@class,'selected'))]/../following-sibling::span[text()='Gift Card - ${pin}']`;
    if(await this.page.locator(xpath).isVisible()){
        await this.page.locator(xpath).click();
        return pin;
      }
  }

  async verifyWarningMessageForRemainingPayment() {
    await expect(this.page.locator(locators.texts.giftcardRemainingBalanceWarning)).toBeVisible();
  }

  async verifyMaxInputLimitForGCNumberAndPin(cardNumber, pin){
    await this.clickOnElement(locators.buttons.addAGiftCard);
    await this.page.locator(locators.inputs.giftCardNumber).type(cardNumber, {delay: 50});
    let enteredNumber = await this.page.locator(locators.inputs.giftCardNumber).inputValue();
    let withoutSpaceNumber = enteredNumber.replace(/\s/g, "")
    await expect(withoutSpaceNumber.length).toBe(16);

    await this.page.locator(locators.inputs.giftCardPin).type(pin, {delay: 20});
    let enteredPin = await this.page.locator(locators.inputs.giftCardPin).inputValue();
    await expect(enteredPin.length).toBe(8);
  }

  async verifyGiftCardsRadioButtonDisabled() {
    await this.page.waitForTimeout(200);
    const buttons = await this.page.locator(
      "//div[contains(@class,'PaymentItemCard_radio') and not(contains(@class,'selected'))]"
    );
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      // await expect(buttons.nth(i)).toBeDisabled();
      await expect(buttons.nth(i)).toHaveClass(/PaymentItemCard_disabled/);
    }
  }

  async getGiftCardUsedValue(selectedGcPin) {
    const gcUsedValues = {};
    for(let i=0;i<selectedGcPin.length;i++){
        let value = await this.page.locator(`//span[text()=' - ${selectedGcPin[i]}']/../../span[2]`).textContent();
        value = value.trim().replace(/[-$]/g, "");
        gcUsedValues[selectedGcPin[i]] = value;
    }  
    return gcUsedValues;
  }

  async verifyGiftCardErrorMessages(reafGC, reafPin, rcscGC, rcscPin){
    await this.verifyErrorMessagesForIncorrectRcscGC(rcscGC, rcscPin)
    await this.verifyErrorMessagesForIncorrectReafGC(reafGC, reafPin)
    await this.checkInvalidOrNoBalanceErrorMessage();
  }

  //  verify error message if pin is less than 8 digits or GC number is less than 16 digits
  async verifyErrorMessagesForIncorrectReafGC(reafGC, reafPin){
    let pin = "1234";
    await this.fillText(locators.inputs.giftCardNumber, reafGC);
    await this.fillText(locators.inputs.giftCardPin, pin);
    await expect(this.page.locator(locators.texts.giftCardNumError)).not.toBeVisible({ timeout: 3000 });
    await expect(this.page.locator(locators.texts.giftCardPinError)).toBeVisible({ timeout: 3000 });
    await expect(this.page.locator(locators.buttons.saveGiftCard)).toBeDisabled();
    // incorrect pin
    pin = "12345";
    await this.fillText(locators.inputs.giftCardPin, pin);
    await expect(this.page.locator(locators.texts.giftCardNumError)).not.toBeVisible({ timeout: 3000 });
    await expect(this.page.locator(locators.texts.giftCardPinError)).toBeVisible({ timeout: 3000 });
    await expect(this.page.locator(locators.buttons.saveGiftCard)).toBeDisabled();
    // incorrect number & pin
    let gcNumber = "1235678"
    await this.fillText(locators.inputs.giftCardNumber, gcNumber);
    await this.fillText(locators.inputs.giftCardPin, pin);
    await expect(this.page.locator(locators.texts.giftCardNumError)).toBeVisible({timeout:3000});
    await expect(this.page.locator(locators.texts.giftCardPinError)).toBeVisible({ timeout: 3000 });
    await expect(this.page.locator(locators.buttons.saveGiftCard)).toBeDisabled();
    // correct number & pin
    await this.fillText(locators.inputs.giftCardNumber, reafGC);
    await this.fillText(locators.inputs.giftCardPin, reafPin);
    await expect(this.page.locator(locators.texts.giftCardNumError)).not.toBeVisible({ timeout: 3000 });
    await expect(this.page.locator(locators.texts.giftCardPinError)).not.toBeVisible({ timeout: 3000 });
    await expect(this.page.locator(locators.buttons.saveGiftCard)).toBeEnabled();
    await this.clickOnElement(locators.buttons.saveGiftCard);
    await this.page.waitForTimeout(3000);
  }

  // verify error message if pin is more than or less than 4 digits and GC number is less than or greater than 8
  async verifyErrorMessagesForIncorrectRcscGC(rcscGC, rcscPin){
    let pin = "12";
    await this.fillText(locators.inputs.giftCardNumber, rcscGC);
    await this.fillText(locators.inputs.giftCardPin, pin);
    await expect(this.page.locator(locators.texts.giftCardNumError)).not.toBeVisible({ timeout: 3000 });
    await expect(this.page.locator(locators.texts.giftCardPinError)).toBeVisible({ timeout: 3000 });
    await expect(this.page.locator(locators.buttons.saveGiftCard)).toBeDisabled();
    pin = "123456";
    await this.fillText(locators.inputs.giftCardPin, pin);
    await expect(this.page.locator(locators.texts.giftCardNumError)).not.toBeVisible({ timeout: 3000 });
    await expect(this.page.locator(locators.texts.giftCardPinError)).toBeVisible({ timeout: 3000 });
    await expect(this.page.locator(locators.buttons.saveGiftCard)).toBeDisabled();
    // correct pin and incorrect number
    let gcNumber = "1234567989";
    await this.fillText(locators.inputs.giftCardNumber, gcNumber);
    await this.fillText(locators.inputs.giftCardPin, rcscPin);
    await expect(this.page.locator(locators.texts.giftCardNumError)).toBeVisible({ timeout: 3000 });
    await expect(this.page.locator(locators.texts.giftCardPinError)).toBeVisible({ timeout: 3000 });
    await expect(this.page.locator(locators.buttons.saveGiftCard)).toBeDisabled();
    // correct number & pin
    await this.fillText(locators.inputs.giftCardNumber, rcscGC);
    await this.fillText(locators.inputs.giftCardPin, rcscPin);
    await expect(this.page.locator(locators.texts.giftCardNumError)).not.toBeVisible({ timeout: 3000 });
    await expect(this.page.locator(locators.texts.giftCardPinError)).not.toBeVisible({ timeout: 3000 });
    await expect(this.page.locator(locators.buttons.saveGiftCard)).toBeEnabled();
  }

  async addMaximumGCAndverifyEach(giftCards){
    const successfullyAddedGiftCards = [];
    for (const [key, card] of Object.entries(giftCards)) {
        if (await this.checkAddGiftCardButtonVisibility()) {
          await this.addGiftCard(card.cardNumber, card.pin);
          await this.page.waitForTimeout(1500);
          const error = await this.checkInvalidOrNoBalanceErrorMessage();
          if(error){
            continue;
          }
          successfullyAddedGiftCards.push({
          cardNumber: card.cardNumber,
          pin: card.pin
        });
          await this.verifyGiftCardIsAdded(card.cardNumber, card.pin);
        }
    }
    return successfullyAddedGiftCards;
  }

  async selectGiftCardsUntilSubtotalIsGreater(giftCards){
    let selectedGcPin = []
    for(const card of Object.values(giftCards)){
      if(await this.page.locator(locators.buttons.placeOrder).isEnabled()){
        break;
      }
        let pin = await this.selectGiftCard(card.cardNumber, card.pin); // returns undefined if GC already selected
        // Only push if pin is not undefined
        if (pin !== undefined) {
          selectedGcPin.push(pin);
        }
    }
    return selectedGcPin;
  }

  async addMultipleGCAndverifyEach(giftCards, numberOfGCs){
    const successfullyAddedGiftCards = [];
    for (const [key, card] of Object.entries(giftCards)) {
      if(await this.page.locator(locators.images.giftCards).count()==numberOfGCs){
            break;
      }
        else{
          await this.addGiftCard(card.cardNumber, card.pin);
          await this.page.waitForTimeout(1500);
          const error = await this.checkInvalidOrNoBalanceErrorMessage();
          if(error){
            continue;
          }
          successfullyAddedGiftCards.push({
          cardNumber: card.cardNumber,
          pin: card.pin
        });
          await this.verifyGiftCardIsAdded(card.cardNumber, card.pin);
        }
    }
    return successfullyAddedGiftCards;
  }

  async getGcBalance(gcPin){
    const gcBalance = {};
    for(let i=0;i<gcPin.length;i++){
      let balance = await this.page.locator(`//span[text()='Gift Card - ${gcPin[i]}']/../following-sibling::div/span`).textContent();
      balance = balance.replace(/[^\d.]/g, "");
      gcBalance[gcPin[i]] = balance;
    }
    return gcBalance;
  }

  async checkAddedGiftCardsCount(count) {
    await expect(this.page.locator(locators.images.giftCards)).toHaveCount(count);
  }

  async clickPaymentMethodlink(){
        await this.clickOnElement(locators.links.paymentMethodLink);
    }

    async verifyNumberOfGiftCardAdded(count){
        await expect(this.page.locator(locators.images.addedGiftCards)).toHaveCount(count);
    }

    async removeAllgiftCards(){
        await this.page.waitForTimeout(3000);
        if(await this.page.locator(locators.buttons.giftCardEdit).count()>0){
            await this.clickOnElement(locators.buttons.giftCardEdit);
            await this.page.waitForTimeout(500);
            const count = await this.page.locator(locators.buttons.giftCardRemove).count();
            for(let i=0;i<count;i++){
                await this.page.locator("button[data-testid='remove-button']").first().click();
                await this.page.waitForTimeout(3000);
            }
        }
    }

    async verifyGcBalance(gcBalances){
        await this.clickPaymentMethodlink();
        for(const[pin, balance] of Object.entries(gcBalances)){
            if(balance == "0" || balance == "0.00"){
                const elem = await this.page.locator(`//span[text()='Gift Card - ${pin}']`).count();   
                await expect(elem).toBe(0);
            }
            else{
                let gcValue = await this.page.locator(`//span[text()='Gift Card - ${pin}']/following-sibling::span`).textContent();
                gcValue = gcValue.trim().replace(/[-$]/g, "");
                expect(gcValue).toEqual(balance);
            }
        }
    }

    async selectFirstGiftCard(){
      let pin = await this.page.locator(locators.others.firstGiftCard).textContent();
      pin = pin.replace(/\D/g, "");
      await this.clickOnElement(locators.others.firstGiftCard);
      return pin;
    }
}