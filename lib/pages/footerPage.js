import { BasePage } from './basePage';
import locators from '../locators/footerPage.json' assert { type: "json" };
import { expect } from '@playwright/test';

export class FooterPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
  }

  async navigateToFooterPage() {
     await this.page.goto('/');
  }

  get privacyCenterLink() {
    return this.page.locator(locators.links.privacyCenterLink);
  }
  get termsOfUseLink() {
    return this.page.locator(locators.links.termsOfUseLink);
  }
  get cookiesAndAdsLink() {
    return this.page.locator(locators.links.cookiesAndAdsLink);
  }
  get accessibilityStatementLink() {
    return this.page.locator(locators.links.accessibilityStatementLink);
  }
  get kfcRewardsTermsLink() {
    return this.page.locator(locators.links.kfcRewardsTermsLink);
  }
  get faqLink() {
    return this.page.locator(locators.links.faqLink);
  }
  get contentInfo() {
    return this.page.locator(locators.landmarks.contentInfo);
  }

   get MenuFooterLink() {
    return this.page.locator(locators.footerLinks.MenuFooterLink);
  }

  get fullNutritionGuide() {
    return this.page.locator(locators.footerLinks.fullNutritionGuide);
  }

  get nutritionCalculator() {
    return this.page.locator(locators.footerLinks.nutritionCalculator);
  }

  get foodAllergies() {
    return this.page.locator(locators.footerLinks.foodAllergies);
  }

  get restaurantCareers() {
    return this.page.locator(locators.footerLinks.restaurantCareers);
  }

  get corporateCareers() {
    return this.page.locator(locators.footerLinks.corporateCareers);
  }

  get culture() {
    return this.page.locator(locators.footerLinks.culture);
  }

  get growth() {
    return this.page.locator(locators.footerLinks.growth);
  }

  get aboutKfc() {
    return this.page.locator(locators.footerLinks.aboutKfc);
  }

  get howWeMakeChicken() {
    return this.page.locator(locators.footerLinks.howWeMakeChicken);
  }

  get faqs() {
    return this.page.locator(locators.footerLinks.faqs);
  }

  get contactUs() {
    return this.page.locator(locators.footerLinks.contactUs);
  }

  get facebook() {
    return this.page.locator(locators.footerLinks.facebook);
  }

  get Twitter() {
    return this.page.locator(locators.footerLinks.Twitter);
  }

  get instagram() {
    return this.page.locator(locators.footerLinks.instagram);
  }

  get kfcApp() {
    return this.page.locator(locators.footerLinks.kfcApp);
  }

  get kfcFoundation() {
    return this.page.locator(locators.footerLinks.kfcFoundation);
  }

  get companyResponsibility() {
    return this.page.locator(locators.footerLinks.companyResponsibility);
  }

  get franchiseAKfc() {
    return this.page.locator(locators.footerLinks.franchiseAKfc);
  }

  get kfcNewsroom() {
    return this.page.locator(locators.footerLinks.kfcNewsroom);
  }

  get kfcMerch() {
    return this.page.locator(locators.footerLinks.kfcMerch);
  }

  get linkMap() {
    return {
      'Privacy Center': this.privacyCenterLink,
      'Terms of Use': this.termsOfUseLink,
      'Our Cookies and Ads': this.cookiesAndAdsLink,
      'Accessibility Statement': this.accessibilityStatementLink,
      'KFC Rewards Terms': this.kfcRewardsTermsLink,
      'FAQ': this.faqLink,
          'FAQ': this.faqLink,
      'Menu': this.MenuFooterLink,
      'full Nutrition Guide': this.fullNutritionGuide,
      'Nutrition Calculator': this.nutritionCalculator,
      'Food Allergies & Sensitivities': this.foodAllergies,
      'Restaurant Careers': this.restaurantCareers,
      'Corporate Careers': this.corporateCareers,
      'Culture': this.culture,
      'Growth': this.growth,
      'About KFC': this.aboutKfc,
      'How We Make Chicken': this.howWeMakeChicken,
      'FAQs': this.faqLink,
      'Contact Us': this.contactUs,
      'Facebook': this.facebook,
      'twitter': this.Twitter,
      'Instagram': this.instagram,
      'KFC App': this.kfcApp,
      'KFC Foundation': this.kfcFoundation,
      'Company Responsibility': this.companyResponsibility,
      'Franchise a KFC': this.franchiseAKfc,
      'KFC Newsroom': this.kfcNewsroom,
      'KFC Merch': this.kfcMerch
    };
  }

  async openPrivacyCenter() {
    return await this.openPopup(this.privacyCenterLink);
  }

  async openTermsOfUse() {
    return await this.openPopup(this.termsOfUseLink);
  }

  async validateTermsOfUse(popup) {
    await this.wait();
    await expect(await popup.locator('#main')).toContainText('KFC TERMS OF USE');
  }

  async openCookiesAndAds() {
    return await this.openPopup(this.cookiesAndAdsLink);
  }

  async validateCookiesAndAds(popup) {
    await this.wait();
    await expect(await popup.getByRole('heading', { name: 'WE USE TRACKING TECHNOLOGIES' })).toBeVisible();
  }

  async openAccessibilityStatement() {
    return await this.openPopup(this.accessibilityStatementLink);
  }

  async validateAccessibilityStatement(popup) {
    await this.wait();
    await expect(popup).toHaveURL(/accessibility/i, {
      timeout: 10000,
    });
  }

  async openKfcRewardsTerms() {
    return await this.openPopup(this.kfcRewardsTermsLink);
  }

  async validateKfcRewardsTerms(popup) {
    await expect(await popup.locator('#main')).toContainText('KFC REWARDS TERMS AND CONDITIONS');
  }

  async validateFaq() {
    await this.page.locator('h2').filter({ hasText: 'How Can We Help?' }).isVisible();
  }

  async validateFooterLinkVisible(linkName) {
    await this.validateLinkVisible(this.linkMap, linkName);
  }

  async validateNewPageUrls(expectedUrlPart){
    const continueButton = this.page.getByText('Continue');

    if (await continueButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      await continueButton.click(),
    ]);
       await this.page.waitForTimeout(2000);
       await newPage.waitForLoadState('load');
    const newUrl = newPage.url();
    console.log('New tab URL:', newUrl);
    expect(newUrl).toContain(expectedUrlPart);
    await newPage.close();
    } else {
      console.log(`No popup for Clicked`);
    }
  }


  async openKFCNewsroomFooter() {
    return await this.clickOnElement(this.kfcNewsroom);
  }

  async validateKFCNewsroomFooter() {
    this.page.waitForLoadState('domcontentloaded');
    await expect(this.page.locator('div').filter({ hasText: /^Newsroom$/ }).getByRole('heading')).toBeVisible();
  }

  async openFranchiseKFCFromFooter() {
    return await this.clickOnElement(this.franchiseAKfc);
  }

  async validateFranchiseKFCFooter() {
    this.page.waitForLoadState('domcontentloaded');
    await expect(this.page.getByText('Franchising', { exact: true })).toBeVisible();
  }

  async openCompanyResponsibilityFromFooter() {
    return await this.clickOnElement(this.companyResponsibility);
  }

  async validateCompanyResponsibilityFooter() {
    this.page.waitForLoadState('domcontentloaded');
    await expect(this.page.locator('#main span').filter({ hasText: 'Company Responsibility' })).toBeVisible();
  }

  async openKFCfoundationFromFooter() {
    return await this.clickOnElement(this.kfcFoundation);
  }


  async openKFCAppFromFooter() {
    return await this.clickOnElement(this.kfcApp);
  }

  async openInstagramFromFooter() {
    return await this.clickOnElement(this.instagram);
  }

   async openKFCMerchFromFooter() {
   return await this.clickOnElement(this.kfcMerch);
  }

  async opentwitterFromFooter() {
     return await this.clickOnElement(this.Twitter);
  }

  async openFacebookFromFooter() {
    await this.clickOnElement(this.facebook);
  }


  async openContactUsFromFooter() {
    return await this.clickOnElement(this.contactUs);
  }

  async validateContactUsFooter() {
    this.page.waitForLoadState('domcontentloaded');
    await this.validateHeadingVisible('Get In Touch');
    //await expect(this.page.locator('h1').filter({ hasText: 'Get In Touch' })).toBeVisible();
  }

  async openFaqsFromFooter() {
    return await this.clickOnElement(this.faqLink);
  }

  async validateFaqsFooter() {
    this.page.waitForLoadState('domcontentloaded');
    await this.validateHeadingVisible('How Can We Help?');
    //await expect(this.page.locator('h2').filter({ hasText: 'How Can We Help?' })).toBeVisible();
  }

  async openMakeChickenFromFooter() {
    return await this.clickOnElement(this.howWeMakeChicken);
  }

  async validateMakeChickenFooter() {
    this.page.waitForLoadState('domcontentloaded');
    await this.validateHeadingVisible('We Make Our Chicken The Hard Way');
    //await expect(this.page.locator('h1').filter({ hasText: 'We Make Our Chicken The Hard Way' })).toBeVisible();
  }

  async openAboutKfcFromFooter() {
    return await this.clickOnElement(this.aboutKfc);
  }

  async validateAboutKfcFooter() {
    this.page.waitForLoadState('domcontentloaded');
    await this.validateHeadingVisible('If You Like Fried Chicken, This Is Why');
      }

  async openMenuFromFooter() {
    return await this.clickOnElement(this.MenuFooterLink);
  }

  async validateMenuFooter() {
     await this.validateHeadingVisible('KFC MENU');
  }

  async openFullNutritionFromFooter() {
    return await this.clickOnElement(this.fullNutritionGuide);
  }

  async validateFullNutritionFooter() {
    this.page.waitForLoadState('domcontentloaded');
    await expect(this.page.locator('iframe').contentFrame().getByRole('heading', { name: 'Interactive Nutrition Menu' })).toBeVisible();
  }

  async openNutritionCalculatorFromFooter() {
    return await this.clickOnElement(this.nutritionCalculator);
  }

  async validateNutritionCalculatorFooter() {
    this.page.waitForLoadState('domcontentloaded');
    await expect(this.page.locator('iframe').contentFrame().getByRole('heading', { name: 'Nutrition Calculator' })).toBeVisible();
  }

  async openFoodAllergiesFromFooter() {
    return await this.clickOnElement(this.foodAllergies);
  }

  async validateFoodAllergiesFooter() {
    this.page.waitForLoadState('domcontentloaded');
    await expect(this.page.locator('#main iframe').contentFrame().getByText('Please select the allergens')).toBeVisible();
  }

  async openRestaurantCareersFromFooter() {
    return await this.clickOnElement(this.restaurantCareers);
  }

  async validateRestaurantCareersFooter() {
    this.page.waitForLoadState('domcontentloaded');
    await this.validateHeadingVisible('Join Our KFC Family');
     }


  async openCorporateCareersFromFooter() {
    return await this.clickOnElement(this.corporateCareers);
  }

  async validateCorporateCareersFooter() {
    this.page.waitForLoadState('domcontentloaded');
     await expect(this.page.getByRole('heading', { name: 'Corporate Careers' }).nth(1)).toBeVisible();
   }



  async openCultureFromFooter() {
    return await this.clickOnElement(this.culture);
  }

  async validateCultureFooter() {
    this.page.waitForLoadState('domcontentloaded');
     await this.validateHeadingVisible('Our Culture');
  }



  async openGrowthFromFooter() {
    return await this.clickOnElement(this.growth);
  }

 
  async validateGrowthFooter() {
    this.page.waitForLoadState('domcontentloaded'); 
    await this.validateHeadingVisible('Restaurant Career Growth');
  }
} 