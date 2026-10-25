/**
 * Thin wrapper around cy.request shared by every service.
 * It never fails on non-2xx status codes, so the scenarios
 * can assert negative responses explicitly.
 */
class ApiClient {
  /**
   * @param {object} options
   * @param {'GET'|'POST'|'PUT'|'DELETE'} options.method
   * @param {string} options.path - Endpoint path, e.g. "/Account/v1/User".
   * @param {object} [options.body]
   * @param {string} [options.token] - Bearer token, when the endpoint requires authentication.
   * @returns {Cypress.Chainable<Cypress.Response<any>>}
   */
  send({ method, path, body, token }) {
    return cy.request({
      method,
      url: `${Cypress.expose('apiUrl')}${path}`,
      body,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      failOnStatusCode: false,
    });
  }
}

export default new ApiClient();
