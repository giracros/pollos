import { test, expect } from '../fixtures/fixtures.js';
import { StoreSearchPage } from '../lib/pages/quickPickupFlow';
import storeData from '../testData/storeAddressData.js';

test.describe('Feature: Store Search Full Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    const storeSearchPage = new StoreSearchPage(page);
    await storeSearchPage.navigateToStoreSearch();
  });

  test('Store Search - Start your order prompt is presented to user as expected',   async ({ page }) => {
    //* Given the user is on the KFC homepage
    //* When the user clicks the "Select a store to start your order" bar or the location icon
    //* Then the "Start Your Order" modal should open
    //* And the "Pick-Up" tab should be active
    //* And a search field should be displayed
    //* And the "Find My KFC" button should be visible
    //* And the "Use My Current Location" button should be visible
    const storeSearchPage = new StoreSearchPage(page);
    await storeSearchPage.verifyStoreSearchElements();
  });
  
  test('Store Search - Store search is functional as expected', async ({ page }) => {
    //* Given the "Start Your Order" modal is open
    //* When the user enters a valid city, state, or ZIP code in the search field
    //* Then autocomplete suggestions should appear as the user types
    //* When the user selects a suggestion
    //* Then a list of nearby KFC locations should be displayed with distance, address, operating hours, and status (open/closed)
    //* And corresponding numbered markers should appear on the map
    const storeSearchPage = new StoreSearchPage(page);
    const { testStore } = storeData.stores;
    await storeSearchPage.performCompleteStoreSearchDetailStore(testStore.address, testStore.displayName, testStore.pickupLocation);

  });

  test('Store Search - Use my Current Location is functional as expected', async ({ page, context }) => {
    //* Given the "Start Your Order" modal is open
    //* When the user clicks "Use My Current Location" (geolocation permission is granted)
    //* Then the nearest stores list and map should update based on the detected location
    //* And the user should be able to select a store from the list
    //* And the user should be able to see the store details
    //* And the user should be able to click "Order Now" to start the ordering process
    
    const storeSearchPage = new StoreSearchPage(page);
    const { testStore } = storeData.stores;
    const { testStore: testStoreCoords } = storeData.coordinates;
    
    await storeSearchPage.verifyUseMyLocationButtonVisible();
    await storeSearchPage.setGeolocation(context, testStoreCoords);
    await storeSearchPage.searchStoreByAddress(testStore.address);
    await storeSearchPage.verifyStoreDetails(testStore.displayName);
    await storeSearchPage.clickOrderNow(testStore.displayName);
    await storeSearchPage.verifyPickupLocation(testStore.pickupLocation);
    
  });

  test('Store Search - Order Now localizes user to selected store', async ({ page }) => {
    //*  Given a list of KFC stores is displayed
    //* When the user clicks "Order Now" for a store that is currently open
    //* Then that store should be selected
    //* And the user should be taken to the ordering menu for that location

    const storeSearchPage = new StoreSearchPage(page);
    const { testStore } = storeData.stores;
    
    await storeSearchPage.performCompleteStoreSearch(testStore.address,testStore.displayName,testStore.pickupLocation);
  });

  test('Store Search - Store does not exist', async ({ page }) => {
    //*  Given a list of KFC stores is displayed
    //* When the user clicks "Order Now" for a store that not accepting orders
    //* Then an message should be displayed : "Not accepting online orders"

    const storeSearchPage = new StoreSearchPage(page);
    const { testStore } = storeData.stores;
    
    await storeSearchPage.performCompleteStoreSearchInvalidAddress(testStore.invalidAddress,testStore.displayName);
  });
});

