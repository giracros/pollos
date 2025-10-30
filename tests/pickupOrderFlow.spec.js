import { test, expect } from '../fixtures/fixtures.js';
import { StoreSearchPage } from '../lib/pages/quickPickupFlow';
import {HomePage} from '../lib/pages/homePage';
import { ProductListingPage } from '../lib/pages/productListingPage';
import { CartPage } from '../lib/pages/cartPage';
import storeData from '../testData/storeAddressData.js';
import {contactInfo, creditCard} from "../testData/appData";
import { CheckoutPage } from '../lib/pages/checkoutPage';
import { PostOrderPage } from '../lib/pages/postOrderPage';

test.describe('Feature: Pickup Order flow', () => {
  
  test.beforeEach(async ({ page }) => {
    const storeSearchPage = new StoreSearchPage(page);
    await storeSearchPage.navigateToStoreSearch();
  });

  test('Pick-Up Order Guest User - Add Menu Items to Cart, Checkout and Place Order',   async ({ page }) => {
    const storeSearchPage = new StoreSearchPage(page);
    const homePage = new HomePage(page);
    const productListingPage = new ProductListingPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const postOrderPage = new PostOrderPage(page);
    const { testStore } = storeData.stores;
    const itemName = "Classic Chicken Sandwich";
    const itemQuantity = 3;

    await storeSearchPage.performCompleteStoreSearch(testStore.address,testStore.displayName,testStore.pickupLocation);
    await homePage.clickStartOrderBtn();
    await homePage.selectMenuItem("Sandwiches");
    const price = await productListingPage.getProductPrice(itemName);
    await cartPage.addItemToCart(itemName, itemQuantity);
    await cartPage.clickCartIcon();
    const totalPrice = await cartPage.calculateTotalPrice(price, itemQuantity + 1)
    await cartPage.validateCartItem(itemName, itemQuantity+1, totalPrice);
    expect(await cartPage.checkoutBtn).toBeEnabled();
    await cartPage.checkoutBtn.click();
    expect(await cartPage.itemsToConsiderPopup).toBeVisible();
    const { itemToConsiderPopupAddedItem, totalPriceAfterAddedItem } = await cartPage.selectFirstItemAndIncreaseQuantity(3);
    await cartPage.continueToCheckoutBtn.click();
    await cartPage.proceedFromConfirmOrderDetailsPrompt();
    await checkoutPage.fillContactInfo(contactInfo.firstName, contactInfo.lastName, contactInfo.email, contactInfo.phoneNumber);
    await checkoutPage.newCreditCardRadioButton.click();
    await checkoutPage.fillCreditCardInfo(creditCard.name, creditCard.cardNumber, creditCard.expirationDate, creditCard.cvv, creditCard.zipCode);
    expect (await checkoutPage.placeOrder).toBeVisible();
    await checkoutPage.clickPlaceOrderButton();
    await postOrderPage.yourOrderHeading.waitFor({ state: 'visible' });
    expect (await postOrderPage.yourOrderHeading).toBeVisible();
    await expect(postOrderPage.page.getByText(itemName)).toBeVisible();
    const normalizedItemName = itemToConsiderPopupAddedItem.replace('and', '&');
    await expect(postOrderPage.page.getByText(normalizedItemName)).toBeVisible();
    const totalRow = page.getByText('TOTAL:', { exact: true }).locator('..');
    await expect(totalRow).toContainText(totalPriceAfterAddedItem);
  });
});

