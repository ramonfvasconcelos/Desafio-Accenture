import { faker } from '@faker-js/faker';

/**
 * Builds a unique username, so every run creates a brand new user.
 * @returns {string}
 */
export function buildUserName() {
  return `qa_${faker.string.alphanumeric({ length: 8, casing: 'lower' })}_${Date.now()}`;
}

/**
 * Builds a password that satisfies every rule of the API:
 * uppercase, lowercase, digit, special character and at least 8 characters.
 * @param {number} [length=12]
 * @returns {string}
 */
export function buildValidPassword(length = 12) {
  const mandatoryCharacters = [
    faker.string.alpha({ length: 1, casing: 'upper' }),
    faker.string.alpha({ length: 1, casing: 'lower' }),
    faker.string.numeric(1),
    faker.helpers.arrayElement(['@', '#', '$', '%', '&', '!']),
  ];
  const filler = faker.string.alphanumeric(Math.max(length - mandatoryCharacters.length, 0));

  return faker.helpers.shuffle([...mandatoryCharacters, ...filler]).join('');
}

/**
 * @param {Partial<{ userName: string, password: string }>} [overrides]
 * @returns {{ userName: string, password: string }}
 */
export function buildCredentials(overrides = {}) {
  return {
    userName: buildUserName(),
    password: buildValidPassword(),
    ...overrides,
  };
}
