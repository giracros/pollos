import { expect } from "@playwright/test";
import { BasePage } from "./basePage";
import locators from '../locators/postOrderPage.json' assert { type: "json"}

export class ProductListingPage extends BasePage{
    constructor(page) {
        super(page);
        this.page = page;
    }

    async getProductPrice(itemName) {
        const card = this.page.getByRole('link', { name: itemName, exact: true });
        const priceLocator = card.getByText(/\$\d+(?:\.\d{2})?/, { exact: false });
        const priceText = await priceLocator.first().textContent();
        if (!priceText) {
            throw new Error(`Price not found for product: ${itemName}`);
        }
        return priceText.trim();
    }

  }