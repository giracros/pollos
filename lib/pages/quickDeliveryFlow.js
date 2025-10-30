import { BasePage } from "./basePage";
import locators from '../locators/quickDeliveryFlow.json' assert { type: "json"};
import { expect } from "@playwright/test";

export class StoreSearchPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
    }

    async navigateToStoreSearch() {
        await this.page.goto('/');
        await this.page.getByText('Select a store to start your').click();
        await this.page.getByLabel('Start Your Order').getByText('PickupDelivery').click();
    }

    async searchStoreByAddress(address) {
        await this.page.locator(locators.searchPlaceholder).fill(address);
        await this.page.waitForTimeout(2000);
        try {
            await this.page.locator(locators.autoSuggestionFirstItem).click();
        } catch {
            const suggestionItem = this.page.locator(locators.autoSuggestionItem, { hasText: address });
            await suggestionItem.first().click();
        }
    }

    async verifyStoreNotAcceptingOrders(storeName) {
        await expect(this.page.getByText('Sorry, delivery is not').first()).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Switch to Pickup' })).toBeVisible();

    }

    async verifyStoreDetails(storeName, storeAddress = null) {
        await expect(this.page.getByText(storeName)).toBeVisible();
        if (storeAddress) {
            await expect(this.page.getByText(storeAddress, { exact: true })).toBeVisible();
            await this.validateHeadingVisible('NEAREST LOCATIONS');
            await this.validateTextVisible('Open until 12:30 AM');
            await this.validateTextVisible('0.01 mi');
            await expect(this.page.getByRole('listitem').filter({ hasText: storeName }).getByTestId('location-card-cta')).toBeVisible();
            await expect(this.page.getByRole('button', { name: 'KFC 2733 13th St, 2733 13th' }).locator('div')).toBeVisible();
            await page.getByRole('button', { name: 'KFC 2733 13th St, 2733 13th' }).locator('div').click();
            await expect(page.getByRole('heading', { name: 'KFC 2733 13th St', exact: true })).toBeVisible();
            await this.validateTextVisible('Open today from 1:30 am - 12:');
            await expect(page.locator(locators.mapContainer)).toBeVisible();
        }
    }

    async clickOrderNow(storeName) {
        await this.page.getByRole('listitem').filter({ hasText: storeName }).getByRole('button').click();
    }

    async verifyDeliveryStoreDetails() {
        await expect(this.page.getByRole('button', { name: 'Use this Address' })).toBeVisible();
        await expect(this.page.getByRole('textbox')).toBeVisible();
        await expect(this.page.locator(locators.mapContainer)).toBeVisible();
    }

    async verifyDeliveryLocation() {   
        await expect(this.page.getByRole('heading', { name: 'Tell us where to deliver your' })).toBeVisible();
        await expect(this.page.getByPlaceholder('Enter Delivery Address')).toBeVisible();
    }

    async verifyDeliveryLocationSetup() {
        await expect(this.page.getByText("Deliver to: 2722 13th Street")).toBeVisible();
    }

    async performCompleteStoreSearchDetailStore(address, storeName, pickupLocation) {
        await this.searchStoreByAddress(address);
        await this.verifyStoreDetails(storeName);
    }

    async performCompleteStoreSearch(address, storeName, pickupLocation) {
        await this.searchStoreByAddress(address);
        await this.verifyStoreDetails(storeName);
        await this.clickOrderNow(storeName);
        await this.verifyDeliveryLocationSetup(pickupLocation);
    }

    async performDeliveryStoreSearch(address, storeName) {
        await this.searchStoreByAddress(address);
        await this.verifyDeliveryStoreDetails();
        await this.page.getByRole('textbox').click();
        await this.page.getByRole('textbox').fill('2624');
        await this.page.getByRole('button', { name: 'Use this Address' }).click();
        await this.verifyStoreDetails(storeName);
    }

    async invalidDeliveryAddress(address, storeName) {
        await this.searchStoreByAddress(address);
        await this.verifyStoreNotAcceptingOrders(storeName);
      
    }

}

