import { expect } from "@playwright/test";
import { BasePage } from "./basePage";
import locators from '../locators/cartPage.json' assert { type: "json"}

export class CartPage extends BasePage {
  constructor(page) {
        super(page);
        this.page = page;
        this.checkoutBtn = page.getByRole('button', { name: 'Checkout $' });
        this.continueToCheckoutBtn = page.getByRole('button', { name: 'Continue To Checkout $' });
        this.itemsToConsiderPopup = page.getByRole('dialog').getByRole('heading', { name: 'Items To Consider' });
  }

  async increaseItemQuantity(iteration) {
    for (let i = 0; i < iteration; i++) {
      await this.clickOnElement(locators.buttons.increaseQuantityButton);
      await this.page.waitForTimeout(500);
    }
  }

  async addItemToCart(plpItem, iteration = 0) {
    const waitForAddToCart = this.page.waitForResponse(response =>
      response.url().includes('addLineItemsToCart') && response.status() === 200
    );
    const elem = this.page.locator('div[class*="ProductCardInformation_product-card__heading"]').getByText(plpItem, { exact: true }).first();
    await elem.scrollIntoViewIfNeeded();
    await elem.click();
    await this.increaseItemQuantity(iteration);
    await this.clickOnElement(locators.buttons.addToBagButton);
    await waitForAddToCart;
  }

  async clickCartIcon() {
    await this.clickOnElement(locators.icons.cartIcon);
  }

  async clickCheckoutButton() {
    await this.clickOnElement(locators.buttons.checkoutButton);
  }

  async proceedFromConfirmOrderDetailsPrompt() {
    await this.page.getByRole('link', { name: 'Continue' }).click();
  }

  async clickContinueToCheckoutButton() {
    const button = this.page.getByRole('button', { name: 'Continue To Checkout $' });
    if (await button.count() > 0) {
      await this.page.getByRole('button', { name: 'Continue To Checkout $' }).click();
    }
  }

  async proceedToCheckout(){
    await this.clickCartIcon();
    await this.clickCheckoutButton();
    await this.clickContinueToCheckoutButton();
    await this.proceedFromConfirmOrderDetailsPrompt();
  }

  async calculateTotalPrice(priceStr, quantity) {
    if (!priceStr || quantity <= 0) return '$0.00';
    const numericStr = priceStr.replace(/\$/g, '').replace(/,/g, '');
    const unitPrice = parseFloat(numericStr);
    if (isNaN(unitPrice)) throw new Error(`Invalid price: ${priceStr}`);
    const total = unitPrice * quantity;
    return '$' + total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  async validateCartItem(itemName, expectedQuantity, expectedPrice) {
    const cartItemLocator = this.page.locator('[class*="CartItem_container"]', { hasText: itemName });
  
    try {
      await expect(cartItemLocator.first()).toBeVisible({ timeout: 7000 });
    } catch {
      throw new Error(`Cart item not found or not visible: ${itemName}`);
    }
  
    const itemCount = await cartItemLocator.count();
    if (itemCount === 0) {
      throw new Error(`Cart item count is 0 for: ${itemName}`);
    }
  
    const quantityButton = cartItemLocator.getByRole('button', { name: /expand quantity picker/i });
    await expect(quantityButton).toBeVisible({ timeout: 3000 });
  
    const quantityText = (await quantityButton.locator('span').textContent())?.trim();
    if (quantityText !== `x${expectedQuantity}`) {
      throw new Error(
        `Quantity mismatch for ${itemName}: expected x${expectedQuantity}, got ${quantityText}`
      );
    }
  
    const priceLocator = cartItemLocator.locator('div[class*="CartItem_price"]');
    await expect(priceLocator).toBeVisible({ timeout: 3000 });
  
    const priceText = (await priceLocator.textContent())?.trim();
    if (priceText !== expectedPrice) {
      throw new Error(
        `Price mismatch for ${itemName}: expected ${expectedPrice}, got ${priceText}`
      );
    }
  }  

  async selectFirstItemAndIncreaseQuantity(quantity) {
    const firstItemImage = this.page.getByRole('dialog').getByRole('img').first();
    await firstItemImage.waitFor({ state: 'visible' });
    const itemName = await firstItemImage.getAttribute('alt');
    const itemContainer = firstItemImage.locator('..').locator('..').locator('..');
    const initialPlusButton = await itemContainer.getByLabel('expand quantity picker');
    if (quantity > 0) {
      await initialPlusButton.click();
      await this.page.waitForTimeout(2000);
      if (quantity > 1) {
        for (let i = 1; i < quantity; i++) {
          await initialPlusButton.click();
          await this.page.getByLabel('quantity-increase').click();
          await this.page.waitForTimeout(2000);
        }
      }
    }
    await this.page.waitForTimeout(3000); // Wait for price to be updated
    const price = await this.page.getByRole('dialog').getByText('$', { exact: false }).last().textContent();
    return { 
      itemToConsiderPopupAddedItem: itemName, 
      totalPriceAfterAddedItem: price 
    };
  }

}
