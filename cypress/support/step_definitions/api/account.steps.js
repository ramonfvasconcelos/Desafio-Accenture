import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import accountService from '../../api/account-service';
import { authorizeUser, registerUser } from '../../api/account-flows';
import { buildCredentials, buildUserName, buildValidPassword } from '../../factories/user-factory';

/*
 * Steps for: Create user, Generate token, Authorization and User details.
 *
 * The scenario data (credentials, userId, token and the last response) is kept
 * in the Cucumber World (`this`), which starts empty for every scenario.
 * That is why the steps use `function () {}` instead of arrow functions.
 */

const NON_EXISTENT_USER_ID = '00000000-0000-0000-0000-000000000000';

/**
 * Turns the words used in the feature files into real values.
 * @param {'valid'|'wrong'|'empty'} kind
 * @param {{ valid: string, wrong: string }} values
 * @returns {string}
 */
function resolveValue(kind, { valid, wrong }) {
  const valuesByKind = { valid, wrong, empty: '' };

  if (!(kind in valuesByKind)) {
    throw new Error(`Unknown value "${kind}". Use: valid, wrong or empty.`);
  }
  return valuesByKind[kind];
}

// ---------- Given ----------

Given('I have valid credentials for a new user', function () {
  this.credentials = buildCredentials();
});

Given(
  'I have credentials with {word} username and {word} password',
  function (usernameKind, passwordKind) {
    this.credentials = {
      userName: resolveValue(usernameKind, { valid: buildUserName(), wrong: buildUserName() }),
      password: resolveValue(passwordKind, {
        valid: buildValidPassword(),
        wrong: buildValidPassword(),
      }),
    };
  },
);

Given('I have a new username with the password {string}', function (password) {
  this.credentials = buildCredentials({ password });
});

Given('a user is already registered', function () {
  this.credentials = buildCredentials();
  registerUser(this.credentials).then((userId) => {
    this.userId = userId;
  });
});

Given('a user is registered and authorized', function () {
  this.credentials = buildCredentials();
  registerUser(this.credentials).then((userId) => {
    this.userId = userId;
  });
  authorizeUser(this.credentials).then((token) => {
    this.token = token;
  });
});

// ---------- When ----------

When('I create the user', function () {
  accountService.createUser(this.credentials).then((response) => {
    this.response = response;
    if (response.status === 201) {
      this.userId = response.body.userID;
    }
  });
});

When('I generate an access token', function () {
  accountService.generateToken(this.credentials).then((response) => {
    this.response = response;
    this.token = response.body.token;
  });
});

When(
  'I request a token with {word} username and {word} password',
  function (usernameKind, passwordKind) {
    const credentials = {
      userName: resolveValue(usernameKind, {
        valid: this.credentials.userName,
        wrong: buildUserName(),
      }),
      password: resolveValue(passwordKind, {
        valid: this.credentials.password,
        wrong: buildValidPassword(),
      }),
    };

    accountService.generateToken(credentials).then((response) => {
      this.response = response;
    });
  },
);

When('I check whether the user is authorized', function () {
  accountService.isAuthorized(this.credentials).then((response) => {
    this.response = response;
  });
});

When('I request the user details', function () {
  accountService.getUser(this.userId, this.token).then((response) => {
    this.response = response;
  });
});

When('I request the user details without an access token', function () {
  accountService.getUser(this.userId).then((response) => {
    this.response = response;
  });
});

When('I request the details of a user that does not exist', function () {
  accountService.getUser(NON_EXISTENT_USER_ID, this.token).then((response) => {
    this.response = response;
  });
});

// ---------- Then ----------

Then('the response should contain the user ID and the username', function () {
  expect(this.response.body.userID).to.be.a('string').and.not.be.empty;
  expect(this.response.body.username).to.eq(this.credentials.userName);
});

Then('the token status should be {string}', function (status) {
  expect(this.response.body.status).to.eq(status);
});

Then('the result message should be {string}', function (message) {
  expect(this.response.body.result).to.eq(message);
});

Then('a token should be returned', function () {
  expect(this.response.body.token).to.be.a('string').and.not.be.empty;
});

Then('no token should be returned', function () {
  expect(this.response.body.token).to.be.null;
});

Then('the authorization result should be {word}', function (expected) {
  expect(this.response.body).to.eq(expected === 'true');
});

Then('the user details should show an empty book collection', function () {
  expect(this.response.body.userId).to.eq(this.userId);
  expect(this.response.body.username).to.eq(this.credentials.userName);
  expect(this.response.body.books).to.be.an('array').that.is.empty;
});

Then('the user details should contain the rented books', function () {
  expect(this.response.body.userId).to.eq(this.userId);
  expect(this.response.body.username).to.eq(this.credentials.userName);

  const isbnsInCollection = this.response.body.books.map((book) => book.isbn);
  expect(isbnsInCollection).to.have.members(this.rentedIsbns);
});
