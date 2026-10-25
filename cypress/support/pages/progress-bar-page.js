import BasePage from './base-page';

/** Elements confirmed on https://demoqa.com/progress-bar */
const SELECTORS = {
  startStopButton: '#startStopButton',
  resetButton: '#resetButton',
  progressBar: '#progressBar [role="progressbar"]',
};

/*
 * Measured on the page: the bar grows 1% every 100 ms (100% in about 10 s).
 * The test runs in real time, so every movement of the bar is visible.
 * It stops the bar once it passes 15%: a 10% margin (about 1 s) below the 25% limit.
 */
const STOP_FROM_PERCENT = 15;
const TIME_TO_REACH_100_PERCENT_MS = 15000;

/*
 * BUG-002 (docs/bug-reports.md): the Reset button appears at 100%, but the page timer
 * only stops about 100 ms later. A Reset clicked inside that window restarts the bar.
 * So the test pauses at 100%, like a person would, and the full bar stays visible.
 */
const PAUSE_AT_100_PERCENT_MS = 1000;

class ProgressBarPage extends BasePage {
  start() {
    this.clickStartStop('Start');
  }

  stopBefore25Percent() {
    cy.get(SELECTORS.progressBar).should(($bar) => {
      expect(Number($bar.attr('aria-valuenow'))).to.be.at.least(STOP_FROM_PERCENT);
    });
    this.clickStartStop('Stop');
  }

  waitUntil100Percent() {
    cy.get(SELECTORS.progressBar, { timeout: TIME_TO_REACH_100_PERCENT_MS }).should(
      'have.attr',
      'aria-valuenow',
      '100',
    );
  }

  reset() {
    // The only fixed pause of the project, on purpose - see BUG-002 above.
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(PAUSE_AT_100_PERCENT_MS);
    cy.get(SELECTORS.resetButton).click();
  }

  /** @param {number} limit - percentage */
  shouldBeAtMost(limit) {
    cy.get(SELECTORS.progressBar)
      .invoke('attr', 'aria-valuenow')
      .then((value) => {
        expect(Number(value), 'progress bar value (%)').to.be.at.most(limit);
      });
  }

  /** @param {number} value - percentage */
  shouldBeAt(value) {
    cy.get(SELECTORS.progressBar).should('have.attr', 'aria-valuenow', String(value));
  }

  /**
   * The same button shows "Start" or "Stop", depending on the bar state.
   * @param {'Start'|'Stop'} label
   */
  clickStartStop(label) {
    cy.get(SELECTORS.startStopButton).should('have.text', label);
    cy.get(SELECTORS.startStopButton).click();
  }
}

export default new ProgressBarPage();
