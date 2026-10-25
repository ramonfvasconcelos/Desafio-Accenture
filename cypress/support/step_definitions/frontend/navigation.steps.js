import { Given, When } from '@badeball/cypress-cucumber-preprocessor';
import BasePage from '../../pages/base-page';

/*
 * Navigation shared by every frontend feature:
 * home page -> card -> side menu item.
 */

const page = new BasePage();

Given('I am on the demoqa home page', function () {
  page.openHomePage();
});

When('I choose the {string} card', function (cardName) {
  page.chooseCard(cardName);
});

When('I choose the {string} menu item', function (itemName) {
  page.chooseMenuItem(itemName);
});
