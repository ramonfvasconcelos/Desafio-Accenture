import { Then } from '@badeball/cypress-cucumber-preprocessor';

/*
 * Response checks shared by every API feature.
 */

Then('the response status should be {int}', function (status) {
  expect(this.response.status).to.eq(status);
});

Then('the error code should be {string}', function (code) {
  expect(this.response.body.code).to.eq(code);
});

Then('the error message should be {string}', function (message) {
  expect(this.response.body.message).to.eq(message);
});
