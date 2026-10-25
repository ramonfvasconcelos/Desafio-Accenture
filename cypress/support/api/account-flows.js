import accountService from './account-service';

/**
 * Reusable preconditions built on top of the Account service.
 * They assert their own success, so a broken precondition fails
 * with a clear message instead of a confusing error later on.
 */

/**
 * Registers a user and yields its userID.
 * @param {{ userName: string, password: string }} credentials
 * @returns {Cypress.Chainable<string>}
 */
export function registerUser(credentials) {
  return accountService.createUser(credentials).then((response) => {
    expect(response.status, 'precondition: user registration').to.eq(201);
    return response.body.userID;
  });
}

/**
 * Generates an access token and yields it.
 * @param {{ userName: string, password: string }} credentials
 * @returns {Cypress.Chainable<string>}
 */
export function authorizeUser(credentials) {
  return accountService.generateToken(credentials).then((response) => {
    expect(response.body.status, 'precondition: token generation').to.eq('Success');
    return response.body.token;
  });
}
