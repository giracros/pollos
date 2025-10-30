import { test, expect } from '../fixtures/fixtures.js';
import {LoginPage} from '../lib/pages/loginPage';
import { HomePage } from '../lib/pages/homePage';

test.describe('Validate Home Page', () => {

    test("Verify home page Hero Banner, Featured items and One tap Favorites", async({page})=>{
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);
        await loginPage.loginAsRegisteredUser();
        await homePage.selectAStoreLocation();
        await homePage.verifyHeroBannerButtons();
        await homePage.verifyHeroBannerTermsAndConditionModal();
        await homePage.verifyFullMenuLink();
        await homePage.clickKfcLogo();
        await homePage.verifyTheLatestSeeAllLink();
        await homePage.clickKfcLogo();
        await homePage.verifyOneTapFavourites();
    });
});