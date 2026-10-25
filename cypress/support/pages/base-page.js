/**
 * Actions shared by every page of demoqa.com.
 * Each page object extends this class.
 */
export default class BasePage {
  /** Opens the demoqa home page. */
  openHomePage() {
    cy.visit('/');
  }

  /**
   * Clicks one of the cards of the home page.
   * @param {string} cardName - e.g. "Forms"
   */
  chooseCard(cardName) {
    cy.contains('.card h5', cardName).click();
  }

  /**
   * Clicks an item of the left side menu.
   * @param {string} itemName - e.g. "Practice Form"
   */
  chooseMenuItem(itemName) {
    cy.contains('.menu-list li', itemName).click();
  }
}
