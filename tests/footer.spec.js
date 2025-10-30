import { test, expect } from '../fixtures/fixtures.js';
import { FooterPage } from '../lib/pages/footerPage';

test.describe('Test Suite: Footer Validations', () => {
  let footerPage;

  test.beforeEach(async ({ page }) => {
    footerPage = new FooterPage(page);
  });

   test('should display Privacy Center', async () => {
    await footerPage.validateFooterLinkVisible('Privacy Center');
    const popup = await footerPage.openPrivacyCenter();
    await footerPage.validatePrivacyCenter(popup);
  });

  test('should display Terms Of Use', async () => {
    await footerPage.validateFooterLinkVisible('Terms of Use');
    const popup = await footerPage.openTermsOfUse();
    await footerPage.validateTermsOfUse(popup);
  });

  test('should display Our Cookies and Ads', async () => {
    await footerPage.validateFooterLinkVisible('Our Cookies and Ads');
    const popup = await footerPage.openCookiesAndAds();
    await footerPage.validateCookiesAndAds(popup);
  });

  test('should display Accessibility Statement', async () => {
    await footerPage.validateFooterLinkVisible('Accessibility Statement');
    const popup = await footerPage.openAccessibilityStatement();
    await footerPage.validateAccessibilityStatement(popup);
  });

  test('should display KFC Rewards Terms', async () => {
    await footerPage.validateFooterLinkVisible('KFC Rewards Terms');
    const popup = await footerPage.openKfcRewardsTerms();
    await footerPage.validateKfcRewardsTerms(popup);
  });

  test('should display FAQ', async () => {
    await footerPage.validateFooterLinkVisible('FAQ');
    const popup = await footerPage.openFaq();
    await footerPage.validateFaq(popup);
  });

  test('Verify Menu footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('Menu');
    await footerPage.openMenuFromFooter();
    await footerPage.validateMenuFooter();
  });

  test('Verify fullNutritionGuide footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('full Nutrition Guide');
    await footerPage.openFullNutritionFromFooter();
    await footerPage.validateFullNutritionFooter();
  });

  test('Verify Nutrition Calculator footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('Nutrition Calculator');
    await footerPage.openNutritionCalculatorFromFooter();
    await footerPage.validateNutritionCalculatorFooter();
  });

  test('Verify Food Allergies & Sensitivities footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('Food Allergies & Sensitivities');
    await footerPage.openFoodAllergiesFromFooter();
    await footerPage.validateFoodAllergiesFooter();
  });

  test('Verify Restaurant Careers footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('Restaurant Careers');
    await footerPage.openRestaurantCareersFromFooter();
    await footerPage.validateRestaurantCareersFooter();
  });

  test('Verify Corporate Careers footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('Corporate Careers');
    await footerPage.openCorporateCareersFromFooter();
    await footerPage.validateCorporateCareersFooter();
  });

  test('Verify Culture footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('Culture');
    await footerPage.openCultureFromFooter();
    await footerPage.validateCultureFooter();
  });

  test('Verify Growth footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('Growth');
    await footerPage.openGrowthFromFooter();
    await footerPage.validateGrowthFooter();
  });

  test('Verify About KFC footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('About KFC');
    await footerPage.openAboutKfcFromFooter();
    await footerPage.validateAboutKfcFooter();
  });

  test('Verify How We Make Chicken footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('How We Make Chicken');
    await footerPage.openMakeChickenFromFooter();
    await footerPage.validateMakeChickenFooter();
  });

  test('Verify FAQs footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('FAQs');
    await footerPage.openFaqsFromFooter();
    await footerPage.validateFaqsFooter();
  });

  test('Verify Company Responsibility footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('Company Responsibility');
    await footerPage.openCompanyResponsibilityFromFooter();
    await footerPage.validateCompanyResponsibilityFooter();
  });

  test('Verify Franchise a KFC footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('Franchise a KFC');
    await footerPage.openFranchiseKFCFromFooter();
    await footerPage.validateFranchiseKFCFooter();
  });

  test('Verify KFC Newsroom footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('KFC Newsroom');
    await footerPage.openKFCNewsroomFooter();
    await footerPage.validateKFCNewsroomFooter();
  });


  test('Verify Contact Us footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('Contact Us');
    await footerPage.openContactUsFromFooter();
    await footerPage.validateContactUsFooter();
  });

  test('Verify Facebook footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('Facebook');
     await footerPage.openFacebookFromFooter();
     await footerPage.validateNewPageUrls('https://www.facebook.com/KFC/');
     
  });

  test('Verify KFC Merch footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('KFC Merch');
    await footerPage.openKFCMerchFromFooter();
    await footerPage.validateNewPageUrls('https://kfcshop.com/');
   
  });

  test('Verify twitter footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('twitter');
    await footerPage.opentwitterFromFooter();
   await footerPage.validateNewPageUrls('https://x.com/kfc');
  });

  test('Verify Instagram footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('Instagram');
    await footerPage.openInstagramFromFooter();
    await footerPage.validateNewPageUrls('https://www.instagram.com/accounts/login');
  });

  test('Verify Kfc App footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('KFC App');
    await footerPage.openKFCAppFromFooter();
   await footerPage.validateNewPageUrls('https://qa.kfc-digital.io/app');
  });

  test('Verify KFC Foundation footer link on homepage', async () => {
    await footerPage.validateFooterLinkVisible('KFC Foundation');
    await footerPage.openKFCfoundationFromFooter();
    await footerPage.validateNewPageUrls('https://kfcfoundation.org/');
    
  });

 
});

