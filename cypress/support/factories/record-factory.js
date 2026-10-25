import { faker } from '@faker-js/faker';

/** Letters only, so the value is shown exactly as typed. */
function buildWord() {
  return faker.string
    .alpha({ length: { min: 4, max: 10 }, casing: 'lower' })
    .replace(/^./, (letter) => letter.toUpperCase());
}

/**
 * A Web Tables record with random data.
 * @returns {import('../pages/web-tables-page').TableRecord}
 */
export function buildRecord() {
  return {
    firstName: buildWord(),
    lastName: buildWord(),
    email: `${faker.string.alphanumeric({ length: 8, casing: 'lower' })}@example.com`,
    age: String(faker.number.int({ min: 18, max: 65 })),
    salary: String(faker.number.int({ min: 1000, max: 20000 })),
    department: buildWord(),
  };
}

/** Column titles used in the feature file -> property of the record. */
const COLUMN_KEYS = {
  'First Name': 'firstName',
  'Last Name': 'lastName',
  Email: 'email',
  Age: 'age',
  Salary: 'salary',
  Department: 'department',
};

/**
 * Converts one row of a Cucumber data table into a record.
 * @param {Record<string, string>} row - e.g. { "First Name": "Lucas", ... }
 * @returns {import('../pages/web-tables-page').TableRecord}
 */
export function recordFromRow(row) {
  return Object.fromEntries(
    Object.entries(row).map(([column, value]) => [COLUMN_KEYS[column], value]),
  );
}
