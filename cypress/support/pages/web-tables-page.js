import BasePage from './base-page';

/** Elements confirmed on https://demoqa.com/webtables */
const SELECTORS = {
  addButton: '#addNewRecordButton',
  searchBox: '#searchBox',
  rows: 'table tbody tr',
  form: '.modal-content',
  firstName: '#firstName',
  lastName: '#lastName',
  email: '#userEmail',
  age: '#age',
  salary: '#salary',
  department: '#department',
  submit: '#submit',
  editButton: '[id^="edit-record-"]',
  deleteButton: '[id^="delete-record-"]',
};

/** Order of the columns in the table. */
const COLUMNS = ['firstName', 'lastName', 'age', 'email', 'salary', 'department'];

/**
 * @typedef {object} TableRecord
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email - unique, used to find the record
 * @property {string} age
 * @property {string} salary
 * @property {string} department
 */

class WebTablesPage extends BasePage {
  /** @param {TableRecord} record */
  addRecord(record) {
    cy.get(SELECTORS.addButton).click();
    this.fillAndSubmitForm(record);
  }

  /**
   * @param {TableRecord} record - the record as it is now
   * @param {TableRecord} newData - the new values
   */
  editRecord(record, newData) {
    this.findRow(record).find(SELECTORS.editButton).click();
    this.fillAndSubmitForm(newData);
  }

  /** @param {TableRecord} record */
  deleteRecord(record) {
    this.findRow(record).find(SELECTORS.deleteButton).click();
  }

  /** @param {TableRecord} record */
  shouldShowRecord(record) {
    this.findRow(record)
      .find('td')
      .then(($cells) => {
        const shown = [...$cells].slice(0, COLUMNS.length).map((cell) => cell.innerText.trim());
        expect(shown).to.deep.eq(COLUMNS.map((column) => record[column]));
      });
  }

  /** @param {TableRecord} record */
  shouldNotShowRecord(record) {
    this.searchFor(record.email);
    cy.contains(SELECTORS.rows, record.email).should('not.exist');
  }

  // ---------- helpers ----------

  /**
   * The table shows 10 rows per page, so the record is found with the
   * search box: it works no matter which page the record is on.
   * @param {TableRecord} record
   */
  findRow(record) {
    this.searchFor(record.email);
    return cy.contains(SELECTORS.rows, record.email);
  }

  /** @param {string} text */
  searchFor(text) {
    cy.get(SELECTORS.searchBox).clear();
    cy.get(SELECTORS.searchBox).type(text);
  }

  /** @param {TableRecord} record */
  fillAndSubmitForm(record) {
    COLUMNS.forEach((column) => {
      cy.get(SELECTORS[column]).clear();
      cy.get(SELECTORS[column]).type(record[column]);
    });
    cy.get(SELECTORS.submit).click();
    cy.get(SELECTORS.form).should('not.exist');
  }
}

export default new WebTablesPage();
