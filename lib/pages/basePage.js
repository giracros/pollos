import { resolve } from 'path';
import locators from '../locators/basePage.json' assert { type: "json"}
import { expect } from '@playwright/test';

export class BasePage {

    constructor(page) {
        this.page = page;
    }

    /* Wait for timeout */
    async wait(){
        await this.page.waitForTimeout(3000);
    }

    /* get the element */
    async getElement(locator) {
        const element = await this.page.locator(locator)
        return element;
    }

    /* get all elements */
    async getAllElements(locator) {
        const elements = await this.page.locator(locator).all();
        // const elements = await this.page.$$(locator);
        return elements;
    }

    /* Click on the element (accepts string or locator) */
    async clickOnElement(locator) {
        if (typeof locator === 'string') {
            await this.page.locator(locator).click();
        } else {
            await locator.click();
        }
    }

    /* Mouse hover on the element */
    async hoverOnElement(locator) {
        await this.page.locator(locator).hover();
    }

    /* Enter the text into the text field */
    async fillText(locator, text) {
        await this.page.locator(locator).fill(text);
    }

    /* Return the page title */
    async getPageTitle() {
        const title =  await this.page.title();        
        return title;
    }

    /* Get page URL */
    async getCurrentURL() {
        const currentUrl = await this.page.url();
        return currentUrl;
    }

    /* Returns the text content */
    async getElementText(locator) {
        const text = await this.page.locator(locator).textContent();
        return text;
    }

  async validateLinkVisible(linkMap, linkName) {
    const link = linkMap[linkName];
    if (!link) {
      const availableLinks = Object.keys(linkMap).join(', ');
      throw new Error(`Unknown link: "${linkName}". Available links: [${availableLinks}]`);
    }
    try {
      await expect(link).toBeVisible();
    } catch (err) {
      throw new Error(`Link "${linkName}" is not visible. Original error: ${err.message}`);
    }
  }

  async validateTextVisible(text, exact = false) {
    await expect(this.page.getByText(text, { exact })).toBeVisible();
  }

  async validateHeadingVisible(headingText) {
    this.page.waitForLoadState('domcontentloaded'); 
    await expect(this.page.getByRole('heading', { name: headingText })).toBeVisible();
  }

  async validateModalHeading(headingText) {
    const modal = this.page.locator('[role="dialog"], .modal, .external-site-prompt');
    await expect(modal.getByRole('heading', { name: headingText })).toBeVisible();
    return modal;
  }

  async openPopup(linkLocator) {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.clickOnElement(linkLocator)
    ]);
    return popup;
  }
}