import { Then } from '@badeball/cypress-cucumber-preprocessor';
import { validateSchema } from '../../api/schema-validator';

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

Then('the response should match the {string} schema', function (schemaName) {
  const { valid, errors } = validateSchema(schemaName, this.response.body);
  expect(valid, `"${schemaName}" schema: ${errors}`).to.be.true;
});

Then('the response time should be under {int} ms', function (limit) {
  expect(this.response.duration, 'response time (ms)').to.be.below(limit);
});
