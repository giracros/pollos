import { test, expect } from '../fixtures/fixtures.js';
import { CartPage } from "../lib/pages/cartPage";
import { LoginPage } from "../lib/pages/loginPage";
import { CheckoutPage } from "../lib/pages/checkoutPage";
import { HomePage } from "../lib/pages/homePage";
import { PostOrderPage } from "../lib/pages/postOrderPage";
import {giftCards, contactInfo} from "../testData/appData";
import { GiftCardPage } from "../lib/pages/giftCardPage";

test.describe("Validate Gift Cards feature", () => {

  let loginPage;
  let cartPage;
  let checkoutPage;
  let homePage;
  let postOrderPage;
  let giftCardPage;
  
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cartPage  = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    homePage = new HomePage(page);
    postOrderPage = new PostOrderPage(page);
    giftCardPage = new GiftCardPage(page);
  });

  test("Add Gift Cards and Place Order for Guest user", async ({page}) => {
    await loginPage.navigateToQaEnv();
    await homePage.selectAStoreLocation();
    await homePage.clickStartOrderBtn();
    await homePage.selectMenuItem("Drinks");
    let itemQuantity = 5;
    await cartPage.addItemToCart("Pepsi", itemQuantity);
    await cartPage.proceedToCheckout();
    const num1 = "123456789123456789";
    const pin1 = "1234567890"
    await giftCardPage.verifyMaxInputLimitForGCNumberAndPin(num1, pin1);
    const reafCard = giftCards.card1;
    const rcscCard = giftCards.card7;
    let selectedGcPin = [];
    await giftCardPage.verifyGiftCardErrorMessages(reafCard.cardNumber, reafCard.pin, rcscCard.cardNumber, rcscCard.pin);
    await checkoutPage.fillContactInfo(contactInfo.firstName, contactInfo.lastName, contactInfo.email, contactInfo.phoneNumber);
    await giftCardPage.addMaximumGCAndverifyEach(giftCards);
    let gcPin = await giftCardPage.selectFirstGiftCard();
    selectedGcPin.push(gcPin);
    await giftCardPage.verifyWarningMessageForRemainingPayment();
    await giftCardPage.verifyGiftCardMaxLimit();
    await checkoutPage.verifyPlaceOrderIsDisabled();
    let additionalPins = await giftCardPage.selectGiftCardsUntilSubtotalIsGreater(giftCards);
    selectedGcPin.push(...additionalPins);
    await giftCardPage.verifyGiftCardsRadioButtonDisabled();
    let gcUsedValue = await giftCardPage.getGiftCardUsedValue(selectedGcPin);
    await checkoutPage.clickPlaceOrderButton();
    await postOrderPage.verifyPostOrderGiftCard(gcUsedValue);
    await postOrderPage.clickViewReceiptButton();
    await postOrderPage.verifyPostOrderReceiptGC(gcUsedValue);
  });

  test("Validate error messages, add gift cards for registered users", async({ page })=>{
    const reafCard = giftCards.card2;
    const rcscCard = giftCards.card7;
    await loginPage.loginAsRegisteredUser();
    await homePage.selectAStoreLocation();
    await homePage.clearCartIfNotEmpty();
    await homePage.selectMenuItem("Drinks");
    let itemQuantity = 4;
    await cartPage.addItemToCart("Pepsi", itemQuantity);
    await cartPage.proceedToCheckout();
    const num1 = "123456789123456789";
    const pin1 = "1234567890"
    await giftCardPage.verifyMaxInputLimitForGCNumberAndPin(num1, pin1);
    await giftCardPage.verifyGiftCardErrorMessages(reafCard.cardNumber, reafCard.pin, rcscCard.cardNumber, rcscCard.pin);
    const addedGCs = await giftCardPage.addMaximumGCAndverifyEach(giftCards);
    await giftCardPage.checkAddedGiftCardsCount(5);
    await checkoutPage.verifyPlaceOrderIsDisabled();
    const selectedGCsPin = await giftCardPage.selectGiftCardsUntilSubtotalIsGreater(giftCards);
    const balance = await giftCardPage.getGcBalance(selectedGCsPin);
    await giftCardPage.verifyGiftCardsRadioButtonDisabled();
    let gcUsedValue = await giftCardPage.getGiftCardUsedValue(selectedGCsPin);
    await checkoutPage.clickPlaceOrderButton();
    await postOrderPage.closePostOrderFavoriteOrderModal();
    await postOrderPage.postOrderGiftCardVerifications(selectedGCsPin, gcUsedValue);
    await homePage.clickCheckoutPageProfileIcon();
    await giftCardPage.verifyGcBalance(balance);
    await giftCardPage.verifyMaxInputLimitForGCNumberAndPin(num1, pin1);
    await giftCardPage.verifyGiftCardErrorMessages(reafCard.cardNumber, reafCard.pin, rcscCard.cardNumber, rcscCard.pin);
    await giftCardPage.removeAllgiftCards();
    await giftCardPage.verifyNumberOfGiftCardAdded(0);
  });

  test('Place order by GCs added at checkout page and added at payment methods page', async({page})=>{
    await loginPage.loginAsRegisteredUser();
    await homePage.selectAStoreLocation();
    await homePage.clearCartIfNotEmpty();
    await homePage.clickProfileIcon();
    await giftCardPage.clickPaymentMethodlink();
    await giftCardPage.removeAllgiftCards();
    await giftCardPage.verifyNumberOfGiftCardAdded(0);
    const gcCount = 2;
    const addedGCsAtProfilePage = await giftCardPage.addMultipleGCAndverifyEach(giftCards, gcCount);
    await homePage.clickStartOrderBtn();
    await homePage.selectMenuItem("Drinks");
    let itemQuantity = 4;
    await cartPage.addItemToCart("Pepsi", itemQuantity);
    await cartPage.proceedToCheckout();
    for (const card of addedGCsAtProfilePage) {
        await giftCardPage.verifyGiftCardIsAdded(card.cardNumber, card.pin);
    }
    const addedGCsAtCheckout = await giftCardPage.addMultipleGCAndverifyEach(giftCards, gcCount+2);
    await checkoutPage.verifyPlaceOrderIsDisabled();
    const pin1 = await giftCardPage.selectGiftCard(addedGCsAtProfilePage[0].cardNumber, addedGCsAtProfilePage[0].pin);
    await giftCardPage.verifyWarningMessageForRemainingPayment();
    const pin2 = await giftCardPage.selectGiftCard(addedGCsAtCheckout[0].cardNumber, addedGCsAtCheckout[0].pin);
    const allGiftCards = [...addedGCsAtCheckout, ...addedGCsAtProfilePage];
    let selectedGCsPin = await giftCardPage.selectGiftCardsUntilSubtotalIsGreater(allGiftCards);
    selectedGCsPin.push(pin1);
    selectedGCsPin.push(pin2);
    const balance = await giftCardPage.getGcBalance(selectedGCsPin);
    let gcUsedValue = await giftCardPage.getGiftCardUsedValue(selectedGCsPin);
    await checkoutPage.clickPlaceOrderButton();
    await postOrderPage.closePostOrderFavoriteOrderModal();
    await postOrderPage.postOrderGiftCardVerifications(selectedGCsPin, gcUsedValue);
    await homePage.clickCheckoutPageProfileIcon();
    await giftCardPage.verifyGcBalance(balance);
    await giftCardPage.verifyNumberOfGiftCardAdded(2);
    await giftCardPage.removeAllgiftCards();
    await giftCardPage.verifyNumberOfGiftCardAdded(0);
  });
});