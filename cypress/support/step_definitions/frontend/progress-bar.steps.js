import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import progressBarPage from '../../pages/progress-bar-page';

/*
 * Steps for: Progress Bar.
 */

When('I click the Start button', function () {
  progressBarPage.start();
});

When('I stop the progress bar before 25%', function () {
  progressBarPage.stopBefore25Percent();
});

When('I click the Start button again', function () {
  progressBarPage.start();
});

When('the progress bar reaches 100%', function () {
  progressBarPage.waitUntil100Percent();
});

When('I reset the progress bar', function () {
  progressBarPage.reset();
});

Then('the progress bar value should be less than or equal to {int}%', function (limit) {
  progressBarPage.shouldBeAtMost(limit);
});

Then('the progress bar value should be {int}%', function (value) {
  progressBarPage.shouldBeAt(value);
});
