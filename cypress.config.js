const { defineConfig } = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');

/**
 * Registers the Cucumber preprocessor and bundles feature files with esbuild.
 * @param {Cypress.PluginEvents} on
 * @param {Cypress.PluginConfigOptions} config
 * @returns {Promise<Cypress.PluginConfigOptions>}
 */
async function setupNodeEvents(on, config) {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    'file:preprocessor',
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    }),
  );

  return config;
}

module.exports = defineConfig({
  // Kept at the root level (not inside `e2e`), so `--config` on the command line
  // can override it: `npm run test:ci` turns retries on in CI.
  // Retries stay off locally, so flaky tests are visible.
  retries: 0,

  e2e: {
    baseUrl: 'https://demoqa.com',
    specPattern: 'cypress/e2e/features/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents,
    viewportWidth: 1366,
    viewportHeight: 768,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    pageLoadTimeout: 60000,
    screenshotOnRunFailure: true,
    // Public values read in the tests with Cypress.expose() (Cypress 16+).
    expose: {
      apiUrl: 'https://demoqa.com',
    },
  },
});
