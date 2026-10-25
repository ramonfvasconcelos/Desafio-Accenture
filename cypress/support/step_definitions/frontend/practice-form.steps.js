import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import practiceFormPage from '../../pages/practice-form-page';
import { buildStudent } from '../../factories/student-factory';

/*
 * Steps for: Practice Form.
 */

When('I fill in all the fields with random data', function () {
  practiceFormPage.fill(buildStudent());
});

When('I upload the file {string}', function (fileName) {
  practiceFormPage.uploadPicture(fileName);
});

When('I submit the form', function () {
  practiceFormPage.submit();
});

When('I close the popup', function () {
  practiceFormPage.closePopup();
});

Then('the popup should be displayed', function () {
  practiceFormPage.shouldShowPopup();
});

Then('the popup title should be {string}', function (title) {
  practiceFormPage.shouldShowPopupTitle(title);
});

Then('the popup should not be displayed', function () {
  practiceFormPage.shouldNotShowPopup();
});
