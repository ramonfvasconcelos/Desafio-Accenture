import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import browserWindowsPage from '../../pages/browser-windows-page';

/*
 * Steps for: Browser Windows.
 */

When('I click the New Window button', function () {
  browserWindowsPage.clickNewWindow();
});

Then('a new window should be opened', function () {
  browserWindowsPage.shouldHaveOpenedNewWindow();
});

Then('the new window should show the message {string}', function (message) {
  browserWindowsPage.shouldShowMessageInNewWindow(message);
});

When('I close the new window', function () {
  browserWindowsPage.closeNewWindow();
});

Then('I should be back on the Browser Windows page', function () {
  browserWindowsPage.shouldBeOnBrowserWindowsPage();
});
