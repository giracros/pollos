import { test, expect } from '../fixtures/fixtures.js';
import { StoreSearchPage } from '../lib/pages/quickDeliveryFlow';
import deliveryStoreData from '../testData/deliveryAddressData.js';

test.describe('Feature: Setup Delivery Address - Full Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    const storeSearchPage = new StoreSearchPage(page);
    await storeSearchPage.navigateToStoreSearch();
  });

  /**
   * @description Test to verify the address search is functional as expected
   */
  test('Setup Delivery Address - Address search is functional as expected', async ({ page }) => {
    const storeSearchPage = new StoreSearchPage(page);
    const { testStore } = deliveryStoreData.deliveryStores;
    await storeSearchPage.performDeliveryStoreSearch(testStore.homeAddress, testStore.displayName);
    await storeSearchPage.clickOrderNow(testStore.displayName);
    await storeSearchPage.verifyDeliveryLocationSetup();

  });

  /**
   * @description Test to verify the store does not delivery orders
   */
  test('Setup Delivery Address - Store does not delivery orders', async ({ page }) => {
    const storeSearchPage = new StoreSearchPage(page);
    const { testStore } = deliveryStoreData.deliveryStores;
    await storeSearchPage.invalidDeliveryAddress(testStore.invalidAddress, testStore.displayName);
  });
});

