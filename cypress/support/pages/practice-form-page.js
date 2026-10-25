import BasePage from './base-page';

/** Element ids confirmed on https://demoqa.com/automation-practice-form */
const SELECTORS = {
  firstName: '#firstName',
  lastName: '#lastName',
  email: '#userEmail',
  mobile: '#userNumber',
  dateOfBirth: '#dateOfBirthInput',
  yearSelect: '.react-datepicker__year-select',
  monthSelect: '.react-datepicker__month-select',
  subjectsInput: '#subjectsInput',
  subjectOption: '.subjects-auto-complete__option',
  picture: '#uploadPicture',
  address: '#currentAddress',
  state: '#state',
  city: '#city',
  dropdownOption: '[id*="-option-"]',
  submit: '#submit',
  popup: '.modal-content',
  popupTitle: '#example-modal-sizes-title-lg',
  closePopup: '#closeLargeModal',
};

const GENDER_IDS = { Male: 'gender-radio-1', Female: 'gender-radio-2', Other: 'gender-radio-3' };
const HOBBY_IDS = {
  Sports: 'hobbies-checkbox-1',
  Reading: 'hobbies-checkbox-2',
  Music: 'hobbies-checkbox-3',
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

class PracticeFormPage extends BasePage {
  /**
   * Fills in every field of the form (except the picture).
   * @param {import('../factories/student-factory').Student} student
   */
  fill(student) {
    cy.get(SELECTORS.firstName).type(student.firstName);
    cy.get(SELECTORS.lastName).type(student.lastName);
    cy.get(SELECTORS.email).type(student.email);
    cy.get(`label[for="${GENDER_IDS[student.gender]}"]`).click();
    cy.get(SELECTORS.mobile).type(student.mobile);
    this.selectDateOfBirth(student.dateOfBirth);
    student.subjects.forEach((subject) => this.addSubject(subject));
    student.hobbies.forEach((hobby) => cy.get(`label[for="${HOBBY_IDS[hobby]}"]`).click());
    cy.get(SELECTORS.address).type(student.address);
    this.chooseFromDropdown(SELECTORS.state, student.state);
    this.chooseFromDropdown(SELECTORS.city, student.city);
  }

  /** @param {Date} date */
  selectDateOfBirth(date) {
    const day = String(date.getDate()).padStart(3, '0');

    cy.get(SELECTORS.dateOfBirth).click();
    cy.get(SELECTORS.yearSelect).select(String(date.getFullYear()));
    cy.get(SELECTORS.monthSelect).select(MONTHS[date.getMonth()]);
    cy.get(`.react-datepicker__day--${day}:not(.react-datepicker__day--outside-month)`).click();
  }

  /** @param {string} subject */
  addSubject(subject) {
    cy.get(SELECTORS.subjectsInput).type(subject);
    cy.contains(SELECTORS.subjectOption, subject).click();
  }

  /** @param {string} fileName - file inside cypress/fixtures */
  uploadPicture(fileName) {
    cy.get(SELECTORS.picture).selectFile(`cypress/fixtures/${fileName}`);
  }

  /**
   * @param {string} dropdown - selector of the dropdown container
   * @param {string} option - visible text of the option
   */
  chooseFromDropdown(dropdown, option) {
    cy.get(dropdown).click();
    cy.get(dropdown).contains(SELECTORS.dropdownOption, option).click();
  }

  submit() {
    cy.get(SELECTORS.submit).click();
  }

  closePopup() {
    cy.get(SELECTORS.closePopup).click();
  }

  shouldShowPopup() {
    cy.get(SELECTORS.popup).should('be.visible');
  }

  /** @param {string} title */
  shouldShowPopupTitle(title) {
    cy.get(SELECTORS.popupTitle).should('have.text', title);
  }

  shouldNotShowPopup() {
    cy.get(SELECTORS.popup).should('not.exist');
  }
}

export default new PracticeFormPage();
