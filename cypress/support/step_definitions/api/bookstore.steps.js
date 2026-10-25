import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { faker } from '@faker-js/faker';
import bookStoreService from '../../api/bookstore-service';

/*
 * Steps for: Books (list and rent).
 * Scenario data is kept in the Cucumber World (`this`), see account.steps.js.
 */

/**
 * Lists the catalog and yields the ISBNs of the first books.
 * @param {number} quantity
 * @returns {Cypress.Chainable<string[]>}
 */
function getCatalogIsbns(quantity) {
  return bookStoreService.listBooks().then((response) => {
    expect(response.status, 'precondition: list books').to.eq(200);
    return response.body.books.slice(0, quantity).map((book) => book.isbn);
  });
}

// ---------- Given ----------

Given('the user has rented {int} book(s)', function (quantity) {
  getCatalogIsbns(quantity).then((isbns) => {
    bookStoreService.rentBooks(this.userId, isbns, this.token).then((response) => {
      expect(response.status, 'precondition: rent books').to.eq(201);
      this.rentedIsbns = isbns;
    });
  });
});

// ---------- When ----------

When('I list the available books', function () {
  bookStoreService.listBooks().then((response) => {
    this.response = response;
    this.availableBooks = response.body.books;
  });
});

When('I rent {int} book(s) from the list', function (quantity) {
  // "Free choice" from the challenge: the books are picked at random from the catalog.
  const chosenBooks = faker.helpers.arrayElements(this.availableBooks, quantity);
  this.rentedIsbns = chosenBooks.map((book) => book.isbn);

  bookStoreService.rentBooks(this.userId, this.rentedIsbns, this.token).then((response) => {
    this.response = response;
  });
});

When('I try to rent a book without an access token', function () {
  getCatalogIsbns(1).then((isbns) => {
    bookStoreService.rentBooks(this.userId, isbns).then((response) => {
      this.response = response;
    });
  });
});

When('I try to rent a book with the ISBN {string}', function (isbn) {
  bookStoreService.rentBooks(this.userId, [isbn], this.token).then((response) => {
    this.response = response;
  });
});

When('I try to rent the same book again', function () {
  bookStoreService.rentBooks(this.userId, this.rentedIsbns, this.token).then((response) => {
    this.response = response;
  });
});

// ---------- Then ----------

Then('the catalog should contain books', function () {
  expect(this.response.body.books).to.be.an('array').that.is.not.empty;
});

Then('every book should have an ISBN, a title and an author', function () {
  this.response.body.books.forEach((book) => {
    expect(book.isbn, 'isbn').to.be.a('string').and.not.be.empty;
    expect(book.title, 'title').to.be.a('string').and.not.be.empty;
    expect(book.author, 'author').to.be.a('string').and.not.be.empty;
  });
});

Then('the {int} book(s) should be in the response', function (quantity) {
  const returnedIsbns = this.response.body.books.map((book) => book.isbn);

  expect(returnedIsbns).to.have.length(quantity);
  expect(returnedIsbns).to.have.members(this.rentedIsbns);
});
