import { expect } from "@playwright/test";
import { BasePage } from "./basePage";
import locators from '../locators/postOrderPage.json' assert { type: "json"}

export class PostOrderPage extends BasePage{
    constructor(page) {
        super(page);
        this.page = page;
        this.yourOrderHeading = page.getByRole('heading', { name: 'Your Order', exact: true });
    }

    async verifyPostOrderGiftCard(gcUsedValue){
      for(const pin in gcUsedValue){
        const element = this.page.locator(`//div[contains(@class,'PostOrderReceiptPriceRow')]/span[text()='Gift Card - ${pin}']`);
        await expect(element).toBeVisible({timeout:10000});
        const rawValue = await element.locator("xpath=following-sibling::span").textContent();
        const postOrderGcValue = await rawValue.trim().replace(/[-$]/g, "");
        await expect(postOrderGcValue).toBe(gcUsedValue[pin]);
      }
    }

  async clickViewReceiptButton() {
    await this.clickOnElement(locators.receipt.button_viewReceipt);
  }

  async verifyPostOrderReceiptGC(gcUsedValue){
    for(const pin in gcUsedValue){
      await expect(
      this.page.locator(
        `//figure[contains(@class,'PostOrderReceiptModal')]/following-sibling::p[text()='GC -']/span[2][text()='${pin}']`
      )).toBeVisible({timeout:5000});

    const element = this.page.locator(
      `//div[contains(@class,'PostOrderReceiptModal')][2]//div[contains(@class,'PostOrderReceiptPriceRow')]/span[text()='Gift Card - ${pin}']`
    );
    await expect(element).toBeVisible({timeout:2000});
    const rawValue = await element.locator("xpath=following-sibling::span").textContent();
    const receiptGCValue = await rawValue.trim().replace(/[-$]/g, "");
    await expect(receiptGCValue).toBe(gcUsedValue[pin]);
    }
  }

  async postOrderGiftCardVerifications(gcPin, gcUsedValue){
    for(let i=0;i<gcPin.length;i++){
      const element = this.page.locator(`//div[contains(@class,'PostOrderReceiptPriceRow')]/span[text()='Gift Card - ${gcPin[i]}']`);
      await expect(element).toBeVisible();
    }
    await this.verifyPostOrderGiftCard(gcUsedValue);
    await this.clickViewReceiptButton();
    await this.page.waitForTimeout(1000);
    await this.verifyPostOrderReceiptGC(gcUsedValue);
    for(let i=0;i<gcPin.length;i++){
      await expect(
      this.page.locator(
        `//figure[contains(@class,'PostOrderReceiptModal')]/following-sibling::p[text()='GC -']/span[2][text()='${gcPin[i]}']`
      )
    ).toBeVisible();
    const element = this.page.locator(`//div[contains(@class,'PostOrderReceiptModal')][2]//div[contains(@class,'PostOrderReceiptPriceRow')]/span[text()='Gift Card - ${gcPin[i]}']`);
    await expect(element).toBeVisible();
    }
    await this.clickOnElement(locators.receipt.receiptCloseButton);
  }

  async closePostOrderFavoriteOrderModal(){
    await this.page.getByRole('button', { name: 'No, thanks' }).click({timeout:5000});
    }
  }