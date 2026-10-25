/**
 * JSON Schemas (draft-07) of the Book Store API responses used by the challenge.
 * Built from the real responses of https://demoqa.com, since the Swagger page was offline.
 *
 * They describe the STRUCTURE of each response: which fields exist, their types and which
 * ones are required. `additionalProperties: false` makes any unexpected field fail the test.
 */

const nonEmptyString = { type: 'string', minLength: 1 };

/** One book of the catalog, as returned by the API. */
const book = {
  type: 'object',
  required: [
    'isbn',
    'title',
    'subTitle',
    'author',
    'publish_date',
    'publisher',
    'pages',
    'description',
    'website',
  ],
  properties: {
    isbn: nonEmptyString,
    title: nonEmptyString,
    subTitle: { type: 'string' },
    author: nonEmptyString,
    publish_date: { type: 'string', format: 'date-time' },
    publisher: { type: 'string' },
    pages: { type: 'integer', minimum: 1 },
    description: { type: 'string' },
    website: { type: 'string', format: 'uri' },
  },
  additionalProperties: false,
};

/** Schema names used in the feature files -> schema. */
export const SCHEMAS = {
  // POST /Account/v1/User (201)
  'user created': {
    type: 'object',
    required: ['userID', 'username', 'books'],
    properties: {
      userID: nonEmptyString,
      username: nonEmptyString,
      books: { type: 'array', maxItems: 0 },
    },
    additionalProperties: false,
  },

  // POST /Account/v1/GenerateToken (200) - same shape on success and on failure
  token: {
    type: 'object',
    required: ['token', 'expires', 'status', 'result'],
    properties: {
      token: { type: ['string', 'null'] },
      expires: { anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
      status: { type: 'string', enum: ['Success', 'Failed'] },
      result: nonEmptyString,
    },
    additionalProperties: false,
  },

  // POST /Account/v1/Authorized (200)
  authorization: { type: 'boolean' },

  // GET /BookStore/v1/Books (200)
  'book list': {
    type: 'object',
    required: ['books'],
    properties: {
      books: { type: 'array', minItems: 1, items: book },
    },
    additionalProperties: false,
  },

  // POST /BookStore/v1/Books (201)
  'books added': {
    type: 'object',
    required: ['books'],
    properties: {
      books: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['isbn'],
          properties: { isbn: nonEmptyString },
          additionalProperties: false,
        },
      },
    },
    additionalProperties: false,
  },

  // GET /Account/v1/User/{userId} (200)
  'user details': {
    type: 'object',
    required: ['userId', 'username', 'books'],
    properties: {
      userId: nonEmptyString,
      username: nonEmptyString,
      books: { type: 'array', items: book },
    },
    additionalProperties: false,
  },

  // Any 4xx error of the API, e.g. { "code": "1200", "message": "UserName and Password required." }
  error: {
    type: 'object',
    required: ['code', 'message'],
    properties: {
      code: { type: 'string', pattern: '^[0-9]+$' },
      message: nonEmptyString,
    },
    additionalProperties: false,
  },
};
