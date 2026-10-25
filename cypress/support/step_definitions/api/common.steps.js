import { Then } from '@badeball/cypress-cucumber-preprocessor';
import { validateContract } from '../../api/contract-validator';

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

Then('the response should match the {string} contract', function (contractName) {
  const { valid, errors } = validateContract(contractName, this.response.body);
  expect(valid, `"${contractName}" contract: ${errors}`).to.be.true;
});

Then('the response time should be under {int} ms', function (limit) {
  expect(this.response.duration, 'response time (ms)').to.be.below(limit);
});
