import BasePage from './base-page';

/** Elements confirmed on https://demoqa.com/progress-bar */
const SELECTORS = {
  startStopButton: '#startStopButton',
  resetButton: '#resetButton',
  progressBar: '#progressBar [role="progressbar"]',
};

/*
 * Measured on the page: the bar is driven only by a browser timer (setInterval)
 * that adds 1% every 100 ms. It makes no calls to the server.
 *
 * The test takes control of that timer (cy.clock) and moves it forward itself
 * (cy.tick), 1% at a time. The bar only moves when the test says so, so it stops
 * exactly where the test wants, no matter how slow the machine is.
 * Only setInterval/clearInterval are controlled: page loading, server calls
 * and everything else on the page keep running in real time.
 */
const CONTROLLED_TIMERS = ['setInterval', 'clearInterval'];
const ONE_PERCENT_MS = 100;
const STOP_AT_PERCENT = 20;

/*
 * BUG-002 (docs/bug-reports.md): the Reset button appears at 100%, but the page timer
 * only stops on its next run, about 100 ms later. A Reset clicked before that restarts the bar.
 * So the test lets 1 s of page time pass at 100% before resetting, like a person would,
 * and lets 1 s more pass after it, to prove the bar really stays at 0%.
 */
const PAGE_TIME_AROUND_RESET_MS = 1000;

class ProgressBarPage extends BasePage {
  /** First Start: takes control of the bar timer before the timer is created. */
  start() {
    cy.clock(null, CONTROLLED_TIMERS);
    this.clickStartStop('Start');
  }

  startAgain() {
    this.clickStartStop('Start');
  }

  stopBefore25Percent() {
    this.advanceTo(STOP_AT_PERCENT);
    this.clickStartStop('Stop');
  }

  waitUntil100Percent() {
    this.advanceTo(100);
  }

  reset() {
    cy.tick(PAGE_TIME_AROUND_RESET_MS);
    cy.get(SELECTORS.resetButton).click();
    cy.tick(PAGE_TIME_AROUND_RESET_MS);
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

  // ---------- helpers ----------

  /**
   * Moves the page timer forward 1% at a time until the bar reaches the percentage.
   * After each step it waits for the bar to show the new value before the next one,
   * so the bar never goes past the target.
   * @param {number} percent
   */
  advanceTo(percent) {
    this.currentValue().then((current) => {
      if (current >= percent) {
        return;
      }
      cy.tick(ONE_PERCENT_MS, { log: false });
      cy.get(SELECTORS.progressBar).should(($bar) => {
        expect(Number($bar.attr('aria-valuenow')), 'progress bar value (%)').to.be.above(current);
      });
      this.advanceTo(percent);
    });
  }

  /** @returns {Cypress.Chainable<number>} */
  currentValue() {
    return cy.get(SELECTORS.progressBar).invoke('attr', 'aria-valuenow').then(Number);
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
