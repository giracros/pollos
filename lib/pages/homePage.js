import { BasePage } from "./basePage";
import locators from '../locators/homePage.json' assert { type: "json" };
import storeAddressData from '../../testData/storeAddressData.js';
import { expect } from "@playwright/test";

export class HomePage extends BasePage{
    constructor(page){
      super(page);
      this.page = page;
      this.pickupTab = page.getByText('PickupDelivery');
      this.searchByStateCityZipInput = page.getByPlaceholder('Search by State, City or Zip');
      this.orderButton = page.getByRole('button', { name: 'Order', exact: true });
    }
    
  async clickStartOrderBtn() {
    await this.clickOnElement(locators.orderFlow.buttonStartOrder);
  }

  
  async selectMenuItem(menuItem) {
    await this.page.locator(`//div[contains(@class,'PlpMenuPage') and text()='${menuItem}']`).click();
  }

  async selectAStoreLocation() {
    await this.page.getByText('Select a store to start your').click();
    await this.searchByStateCityZipInput.click();
    await this.searchByStateCityZipInput.fill(storeAddressData.testAddress1);
    await this.page.locator(`//span[contains(text(),"${storeAddressData.testAddress1}")]`).click({ force: true });
    await this.orderButton.first().click();
  }

  async verifyHeroBannerButtons(){
    const elems = this.page.locator(locators.heroBanner.paginationButton);
    const count = await elems.count();
    for(let i=0;i<count;i++){
      await this.clickOnElement(elems.nth(i));
      await this.page.waitForTimeout(1500);
      const btnText = await this.getElementText(locators.heroBanner.reedemButton);
      expect(["Redeem Now", "Order Now"]).toContain(btnText);
    }
  }

  async verifyHeroBannerTermsAndConditionModal(){
    await this.page.getByRole('link', { name: 'terms & conditions' }).click();
    const text = (await this.page.getByRole('heading', { name: 'terms & conditions' }).textContent()).trim();
    expect(text).toEqual("terms & conditions");
    await this.page.getByRole('button', { name: 'Close', exact: true }).click();
  }

  async verifyFullMenuLink(){
    await this.page.getByRole('link', { name: 'Full Menu' }).click();
    const menuHeader = await this.page.getByRole('heading', { name: 'KFC MENU' }).textContent();
    expect(menuHeader).toEqual("KFC MENU");
  }

  async clickKfcLogo(){
    await this.page.getByRole('link', { name: 'KFC Logo - Link to Home' }).click();
  }

  async verifyTheLatestSeeAllLink(){
    await this.page.getByRole('link', { name: 'See All' }).click();
    const menuHeader = await this.getElementText(locators.menuCategory.header);
    // expect(menuHeader).toEqual("Deals");  // DEALS / The Latest / Featured
    const url = await this.getCurrentURL();
    expect(url).toContain("menu#featured");
  }

  async verifyOneTapFavourites(){
    await this.verifyOneTapFavouriteHeaderAccordingToTiming();
    await this.verifyPdpItemNameForFavoriteItemCustomizeButton();
  }

  async verifyOneTapFavouriteHeaderAccordingToTiming(){
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    let lunchHeader = "Lunch-Time Favorites";
    let dinnerHeader = "Dinner-Time Favorites";
    let lateNightHeader = "Late-Night Favorites";
  // Lunch Favorites - Store opening hours to 3:30 PM
    if (hours < 15 || (hours === 15 && minutes <= 30)) {
        let actualHeader = await this.getElementText(locators.oneTapFavorites.header);
        expect(actualHeader).toEqual(lunchHeader);
        const elem = await this.page.locator(locators.oneTapFavorites.itemsBar);
        await expect(elem).toBeVisible();
      } 
    // dinner Favorites - 3:30 PM - 7:30 PM
      else if(hours < 19 || (hours === 19 && minutes <= 30)){
        let actualHeader = await this.getElementText(locators.oneTapFavorites.header);
        expect(actualHeader).toEqual(dinnerHeader);
        const elem = await this.page.locator(locators.oneTapFavorites.itemsBar);
        await expect(elem).toBeVisible();
      } 
    // late night Favorites - 7:30 PM until store close
      else{
        let actualHeader = await this.getElementText(locators.oneTapFavorites.header);
        expect(actualHeader).toEqual(lateNightHeader);
        const elem = await this.page.locator(locators.oneTapFavorites.itemsBar);
        await expect(elem).toBeVisible();
      }    
  }
  
  async verifyPdpItemNameForFavoriteItemCustomizeButton(){
    const elem = await this.page.locator(locators.oneTapFavorites.itemsName).first();
    const itemName = await elem.textContent();
    await this.page.locator(locators.oneTapFavorites.customizeButton).first().click();
    await this.page.waitForTimeout(2000);
    const pdpItemName = await this.getElementText(locators.pdp.itemName);
    expect(pdpItemName).toEqual(itemName);
  }

  async clickCheckoutPageProfileIcon(){
    await this.clickOnElement(locators.orderFlow.checkoutPageProfileIcon);
  }

  async clickProfileIcon(){
    await this.clickOnElement(locators.header.profileIcon);
  }

  async clearCartIfNotEmpty() {
    const cartIcon = this.page.locator(locators.orderFlow.cartIcon);
    const ariaLabel = await cartIcon.getAttribute('aria-label');
    if (ariaLabel !== 'Cart Icon') {
      await this.clickOnElement(locators.orderFlow.cartIcon);
      await this.clickOnElement(locators.orderFlow.clearMyBagButton);
      await this.clickOnElement(locators.orderFlow.confirmClearBagButton);
      await this.clickOnElement(locators.orderFlow.backToMenuButton);
    } else {
      await this.clickStartOrderBtn();
      console.log("Cart is Empty");
    }
  }

  async navigateToHomePage() {
    await this.page.goto('/');
  }

  async selectStoreToStartOrder() {
    await this.clickOnElement(locators.orderFlow.buttonSelectStore);
    await this.clickOnElement(locators.orderFlow.localizationPickUpTab);
    const address = storeAddressData['testAddress1'];
    await this.fillText(locators.orderFlow.pickupInputField, address);
    await this.page.waitForTimeout(5000);
    const suggestionItem = this.page.locator('li[role="option"]', { hasText: address });
    await suggestionItem.first().click();
    await this.page.locator(locators.orderFlow.orderNowButton).first().click();
    await this.page.waitForTimeout(2000);
  }

  async clickRewardsButton() {
    await this.page.locator(locators.orderFlow.rewardsButton).click();
  }

  async getRewardsPoints() {
    const rewardsPointsLocator = this.page.locator("//span[@data-testid='Header-points-value']");
    await rewardsPointsLocator.waitFor({ state: 'visible' });
    const pointsText = await rewardsPointsLocator.textContent();
    const cleanedText = pointsText.replace(/,/g, '');
    console.log(cleanedText);
    const pointsNumber = parseInt(cleanedText, 10);
    if (isNaN(pointsNumber)) {
      console.log('Invalid points value.');
      return 0;
    }
    return pointsNumber;
  }
}
