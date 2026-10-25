import apiClient from './api-client';

const BOOKSTORE_PATH = '/BookStore/v1';

/**
 * Service Object for the BookStore endpoints of the Book Store API.
 */
class BookStoreService {
  listBooks() {
    return apiClient.send({ method: 'GET', path: `${BOOKSTORE_PATH}/Books` });
  }

  /**
   * Adds books to the user's collection ("rent").
   * @param {string} userId
   * @param {string[]} isbns
   * @param {string} [token]
   */
  rentBooks(userId, isbns, token) {
    return apiClient.send({
      method: 'POST',
      path: `${BOOKSTORE_PATH}/Books`,
      body: {
        userId,
        collectionOfIsbns: isbns.map((isbn) => ({ isbn })),
      },
      token,
    });
  }
}

export default new BookStoreService();
