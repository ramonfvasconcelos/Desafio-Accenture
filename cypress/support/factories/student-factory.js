import { faker } from '@faker-js/faker';

/*
 * Options confirmed on https://demoqa.com/automation-practice-form
 */
const GENDERS = ['Male', 'Female', 'Other'];
const HOBBIES = ['Sports', 'Reading', 'Music'];
const SUBJECTS = [
  'Hindi',
  'English',
  'Maths',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Commerce',
  'Accounting',
  'Economics',
  'Arts',
  'Social Studies',
  'History',
  'Civics',
];
const CITIES_BY_STATE = {
  NCR: ['Delhi', 'Gurgaon', 'Noida'],
  'Uttar Pradesh': ['Agra', 'Lucknow', 'Merrut'],
  Haryana: ['Karnal', 'Panipat'],
  Rajasthan: ['Jaipur', 'Jaiselmer'],
};

/**
 * @typedef {object} Student
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {'Male'|'Female'|'Other'} gender
 * @property {string} mobile - 10 digits
 * @property {Date} dateOfBirth
 * @property {string[]} subjects
 * @property {string[]} hobbies
 * @property {string} address
 * @property {string} state
 * @property {string} city
 */

/** Letters only, so the name never has characters like apostrophes. */
function buildName() {
  return faker.string
    .alpha({ length: { min: 4, max: 10 }, casing: 'lower' })
    .replace(/^./, (letter) => letter.toUpperCase());
}

/**
 * A student with every field of the form filled with random data.
 * @returns {Student}
 */
export function buildStudent() {
  const state = faker.helpers.arrayElement(Object.keys(CITIES_BY_STATE));

  return {
    firstName: buildName(),
    lastName: buildName(),
    email: `${faker.string.alphanumeric({ length: 8, casing: 'lower' })}@example.com`,
    gender: faker.helpers.arrayElement(GENDERS),
    mobile: faker.string.numeric(10),
    dateOfBirth: faker.date.birthdate({ mode: 'age', min: 18, max: 60 }),
    subjects: faker.helpers.arrayElements(SUBJECTS, { min: 1, max: 3 }),
    hobbies: faker.helpers.arrayElements(HOBBIES, { min: 1, max: 3 }),
    address: faker.location.streetAddress(),
    state,
    city: faker.helpers.arrayElement(CITIES_BY_STATE[state]),
  };
}
