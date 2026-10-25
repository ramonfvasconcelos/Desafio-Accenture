import { THIRD_PARTY_HOSTS } from './utils/third-party';

/**
 * Blocks ads/trackers so pages load faster and no overlay covers
 * the elements under test.
 */
Cypress.Commands.add('blockThirdPartyScripts', () => {
  cy.intercept({ url: THIRD_PARTY_HOSTS }, { statusCode: 204, body: '' }).as('thirdParty');
});
