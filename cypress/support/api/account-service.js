import apiClient from './api-client';

const ACCOUNT_PATH = '/Account/v1';

/**
 * Service Object for the Account endpoints of the Book Store API.
 * @typedef {{ userName: string, password: string }} Credentials
 */
class AccountService {
  /** @param {Credentials} credentials */
  createUser(credentials) {
    return apiClient.send({ method: 'POST', path: `${ACCOUNT_PATH}/User`, body: credentials });
  }

  /** @param {Credentials} credentials */
  generateToken(credentials) {
    return apiClient.send({
      method: 'POST',
      path: `${ACCOUNT_PATH}/GenerateToken`,
      body: credentials,
    });
  }

  /** @param {Credentials} credentials */
  isAuthorized(credentials) {
    return apiClient.send({
      method: 'POST',
      path: `${ACCOUNT_PATH}/Authorized`,
      body: credentials,
    });
  }

  /**
   * @param {string} userId
   * @param {string} [token]
   */
  getUser(userId, token) {
    return apiClient.send({ method: 'GET', path: `${ACCOUNT_PATH}/User/${userId}`, token });
  }

  /**
   * @param {string} userId
   * @param {string} token
   */
  deleteUser(userId, token) {
    return apiClient.send({ method: 'DELETE', path: `${ACCOUNT_PATH}/User/${userId}`, token });
  }
}

export default new AccountService();
