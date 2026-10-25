import BasePage from './base-page';

/** Elements confirmed on https://demoqa.com/browser-windows */
const SELECTORS = {
  newWindowButton: '#windowButton',
  pageTitle: 'h1',
  sampleHeading: '#sampleHeading',
};

const BROWSER_WINDOWS_PATH = '/browser-windows';
const NEW_WINDOW_PATH = '/sample';

class BrowserWindowsPage extends BasePage {
  /**
   * Cypress cannot control a second browser window. Before the click,
   * window.open is replaced by a stub that records the call instead of
   * opening the window, so the test can check what was requested.
   */
  clickNewWindow() {
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
    cy.get(SELECTORS.newWindowButton).click();
  }

  shouldHaveOpenedNewWindow() {
    cy.get('@windowOpen').should('have.been.calledOnceWith', NEW_WINDOW_PATH, '_blank');
  }

  /**
   * Opens, in the current tab, the same address the new window would show.
   * @param {string} message
   */
  shouldShowMessageInNewWindow(message) {
    cy.get('@windowOpen').then((windowOpen) => {
      const [address] = windowOpen.firstCall.args;
      cy.visit(address);
    });
    cy.get(SELECTORS.sampleHeading).should('have.text', message);
  }

  /** The "new window" was opened in this tab, so closing it means going back. */
  closeNewWindow() {
    cy.go('back');
  }

  shouldBeOnBrowserWindowsPage() {
    cy.location('pathname').should('eq', BROWSER_WINDOWS_PATH);
    cy.get(SELECTORS.pageTitle).should('have.text', 'Browser Windows');
  }
}

export default new BrowserWindowsPage();
