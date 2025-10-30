import { BasePage } from "./basePage";
import locators from '../locators/quickPickupFlow.json' assert { type: "json"};
import { expect } from "@playwright/test";

export class StoreSearchPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
    }

    async navigateToStoreSearch() {
        await this.page.goto('/');
        await this.page.getByText('Select a store to start your').click();

    }

    async performCompleteStoreSearch(address, storeName, pickupLocation) {
        await this.searchStoreByAddress(address);
        await this.verifyStoreDetails(storeName);
        await this.clickOrderNow(storeName);
        await this.verifyPickupLocation(pickupLocation);
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

    async performCompleteStoreSearchInvalidAddress(address, storeName) {
        await this.searchStoreByAddress(address);
        await this.verifyStoreNotAcceptingOrders(storeName);
      
    }

    async verifyStoreNotAcceptingOrders(storeName) {
        await expect(this.page.getByText('Not accepting online orders').first()).toBeVisible();
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

    async verifyStoreSearchElements() {
        await this.validateHeadingVisible('Start Your Order');
        await expect(this.page.getByLabel('Start Your Order').getByText('Select a store to start your')).toBeVisible();
        await expect(this.page.getByLabel('Start Your Order').getByText('PickupDelivery')).toBeVisible();
        await expect(this.page.getByPlaceholder('Search by State, City or Zip')).toBeVisible();
        await this.validateHeadingVisible('Find My KFC');
        await expect(this.page.getByRole('button', { name: 'Use My Current Location' })).toBeVisible();
        await expect(this.page.locator(locators.mapContainer)).toBeVisible();
    }

    async verifyStoreListDisplayed() {
        await expect(this.page.getByRole('listitem')).toHaveCount.toBeGreaterThan(0);
    }

    async clickOrderNow(storeName) {
        await this.page.getByRole('listitem').filter({ hasText: storeName }).locator(locators.storeLocationCard).click();
    }

    async verifyPickupLocation(pickupLocation) {
        await expect(this.page.getByText(pickupLocation)).toBeVisible();
    }

    async clickUseMyCurrentLocation() {
        await this.page.locator(locators.useMyCurrentLocationButton).toBeVisible();
    }

    async verifyOrderButtons() {
        await expect(this.page.locator(locators.storeLocationCard)).toBeVisible();
    }
    
    async setGeolocation(context, coordinates) {
        await context.grantPermissions(['geolocation'], { origin: 'https://qa.kfc-digital.io' });
        await context.setGeolocation(coordinates);
    }

    async verifyUseMyLocationButtonVisible() {
        const useMyLocationBtn = this.page.locator(locators.useMyCurrentLocationButton);
        await expect(useMyLocationBtn).toBeVisible();
        return useMyLocationBtn;
    }

    async performCompleteStoreSearchDetailStore(address, storeName, pickupLocation) {
        await this.searchStoreByAddress(address);
        await this.verifyStoreDetails(storeName);
    }
}
