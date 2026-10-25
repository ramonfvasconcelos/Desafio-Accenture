/**
 * Global support file: loaded once before every feature file.
 */
import './commands';
import { isThirdPartyError } from './utils/third-party';

/**
 * Only errors thrown by third-party scripts are ignored.
 * Any error coming from the application under test still fails the scenario.
 */
Cypress.on('uncaught:exception', (error) => !isThirdPartyError(error));

beforeEach(() => {
  cy.blockThirdPartyScripts();
});
