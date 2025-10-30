import { test, expect } from '../fixtures/fixtures.js';
import { StoreSearchPage } from '../lib/pages/quickDeliveryFlow.js';
import deliveryStoreData from '../testData/deliveryAddressData.js';
import {HomePage} from '../lib/pages/homePage';
import { ProductListingPage } from '../lib/pages/productListingPage';
import { CartPage } from '../lib/pages/cartPage';
import { CheckoutPage } from '../lib/pages/checkoutPage';
import { PostOrderPage } from '../lib/pages/postOrderPage';
import {contactInfo, creditCard} from "../testData/appData";

test.describe('Feature: Delivery Up Order FLow - Guest User', () => {
  
  test.beforeEach(async ({ page }) => {
    const storeSearchPage = new StoreSearchPage(page);
    await storeSearchPage.navigateToStoreSearch();
  });

  test('Delivery Order - Add Menu Items to Cart and Place Order', async ({ page }) => {
    const homePage = new HomePage(page);
    const productListingPage = new ProductListingPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const postOrderPage = new PostOrderPage(page);
    const item1 = "Chicken Sandwich";
    const item2 = "Chicken Little Combo";
    const itemQuantity = 3;

    const storeSearchPage = new StoreSearchPage(page);
    const { testStore } = deliveryStoreData.deliveryStores;
    await storeSearchPage.performDeliveryStoreSearch(testStore.homeAddress, testStore.displayName);
    await storeSearchPage.clickOrderNow(testStore.displayName);
    await homePage.clickStartOrderBtn();
    await homePage.selectMenuItem("Sandwiches");
    const firstItemPrice = await productListingPage.getProductPrice(item1);
    await cartPage.addItemToCart(item1, itemQuantity);
    const secondItemPrice = await productListingPage.getProductPrice(item2);
    await cartPage.addItemToCart(item2, itemQuantity);
    await cartPage.clickCartIcon();
    const totalPrice1 = await cartPage.calculateTotalPrice(firstItemPrice, itemQuantity + 1);
    const totalPrice2 = await cartPage.calculateTotalPrice(secondItemPrice, itemQuantity + 1)
    await cartPage.validateCartItem(item1, itemQuantity+1, totalPrice1);
    await cartPage.validateCartItem(item2, itemQuantity+1, totalPrice2);
    expect(await cartPage.checkoutBtn).toBeEnabled();
    await cartPage.checkoutBtn.click();
    expect(await cartPage.itemsToConsiderPopup).toBeVisible();
    const { itemToConsiderPopupAddedItem, totalPriceAfterAddedItem } = await cartPage.selectFirstItemAndIncreaseQuantity(3);
    await cartPage.continueToCheckoutBtn.click();
    await cartPage.proceedFromConfirmOrderDetailsPrompt();
    await checkoutPage.validateDeliveryAddress();
    const tip = await checkoutPage.addDriverTip();
    await checkoutPage.fillContactInfo(contactInfo.firstName, contactInfo.lastName, contactInfo.email, contactInfo.phoneNumber);
    await checkoutPage.newCreditCardRadioButton.click();
    await checkoutPage.fillCreditCardInfo(creditCard.name, creditCard.cardNumber, creditCard.expirationDate, creditCard.cvv, creditCard.zipCode);
    expect (await checkoutPage.placeOrder).toBeVisible();
    await checkoutPage.clickPlaceOrderButton();
    await postOrderPage.yourOrderHeading.waitFor({ state: 'visible' });
    expect (await postOrderPage.yourOrderHeading).toBeVisible();
    const today = new Date();
    const formattedToday = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear()}`;
    await expect(postOrderPage.page.getByText(`Delivery On ${formattedToday}`)).toBeVisible();
    await expect(postOrderPage.page.getByText('Delivery To')).toBeVisible();
    await expect(postOrderPage.page.getByText(`Delivery From ${deliveryStoreData.deliveryStores.testStore.deliveryFromCheckoutPage}`)).toBeVisible();
    const totalRow = page.getByText('TOTAL:', { exact: true }).locator('..');
    await expect(totalRow).toContainText(`$${(parseFloat(totalPriceAfterAddedItem.replace('$', '')) + parseFloat(tip.replace('$', ''))).toFixed(2)}`);
  });
});

