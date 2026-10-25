# QA Automation Challenge – Accenture

Automated tests for the [demoqa.com](https://demoqa.com) QA Automation challenge, written with
**Cypress**, **Cucumber (Gherkin)** and **JavaScript**, following the **Page Object** pattern.

| Part                  | What is tested                                                                                                          | Scenarios |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------- |
| **Part 1 – API**      | Book Store API: create a user, generate a token, check authorization, list books, rent two books, show the user details | 32        |
| **Part 2 – Frontend** | Practice Form, Browser Windows, Web Tables (with bonus), Progress Bar, Sortable                                         | 6         |

The whole suite runs with a single command: `npm test`.

---

## Contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [How to run](#how-to-run)
- [Project structure](#project-structure)
- [Architecture](#architecture)
- [Traceability: challenge → tests](#traceability-challenge--tests)
- [Test design – Part 1 (API)](#test-design--part-1-api)
- [Technical decisions](#technical-decisions)
- [Defects found](#defects-found)
- [Continuous integration](#continuous-integration)

---

## Tech stack

| Tool                                                                                                 | Version | Purpose                                  |
| ---------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------- |
| [Cypress](https://www.cypress.io)                                                                    | 16      | Test runner for API and frontend         |
| [@badeball/cypress-cucumber-preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor) | 28      | Runs Gherkin `.feature` files in Cypress |
| [@faker-js/faker](https://fakerjs.dev)                                                               | 10      | Random test data                         |
| ESLint + eslint-plugin-cypress                                                                       | 10 / 7  | Code quality and Cypress best practices  |
| Prettier + EditorConfig                                                                              | 3       | Consistent formatting                    |
| GitHub Actions                                                                                       | –       | Runs the suite on every push             |

## Getting started

**Prerequisites:** [Node.js](https://nodejs.org) 20.19 or newer, and Google Chrome.

```bash
git clone <repository-url>
cd <repository-folder>
npm install
```

## How to run

| Command                 | What it does                                           |
| ----------------------- | ------------------------------------------------------ |
| `npm test`              | Runs the whole suite (API + frontend)                  |
| `npm run test:api`      | Runs only Part 1 (`@api`)                              |
| `npm run test:frontend` | Runs only Part 2 (`@frontend`)                         |
| `npm run test:smoke`    | Runs only the main flows (`@smoke`)                    |
| `npm run cy:open`       | Opens the Cypress app, to watch the tests step by step |
| `npm run lint`          | Checks the code with ESLint                            |
| `npm run format:check`  | Checks the formatting with Prettier                    |

Any tag combination also works, for example: `npx cypress run --expose tags="@api and @negative"`.

After a run, an HTML report is created at **`reports/cucumber-report.html`**.

## Project structure

```
.
├── .github/workflows/cypress.yml     # CI pipeline (GitHub Actions)
├── cypress/
│   ├── e2e/features/
│   │   ├── api/                      # Part 1 – one .feature per step of the challenge
│   │   └── frontend/                 # Part 2 – one .feature per screen
│   ├── fixtures/upload.txt           # File uploaded in the Practice Form
│   └── support/
│       ├── api/                      # Service Objects: one method per API endpoint
│       ├── pages/                    # Page Objects: selectors and actions of each screen
│       ├── factories/                # Random test data
│       ├── step_definitions/         # Glue between Gherkin and the code
│       │   ├── api/
│       │   └── frontend/
│       ├── utils/                    # Third-party (ads) handling
│       ├── commands.js               # Custom Cypress commands
│       └── e2e.js                    # Global setup, loaded before every test
├── docs/
│   ├── bug-reports.md                # Defects found in the system under test
│   └── evidence/                     # Screenshots of the defects
├── cypress.config.js
└── .cypress-cucumber-preprocessorrc.json
```

## Architecture

Each layer has a single responsibility:

```
.feature (Gherkin)          WHAT is tested, in business language
      │
step definitions            Glue: maps each Gherkin sentence to code
      │
Page / Service Objects      HOW to talk to a screen or to an endpoint
      │
Cypress                     cy.get / cy.click (screens) – cy.request (API, in api-client.js)
```

- **Page Objects** (`support/pages`): every screen extends `BasePage`, which holds the navigation shared by all screens (home page → card → side menu).
- **Service Objects** (`support/api`): `api-client.js` is the only place that calls `cy.request`. `account-service.js` and `bookstore-service.js` expose one method per endpoint.
- **Factories** (`support/factories`): build random data that always satisfies the rules of the system (for example, a password with uppercase, lowercase, digit and special character).
- **Scenario state**: the data shared between steps (user, token, record…) is kept in the Cucumber World (`this`), which is reset for every scenario. That is why the steps use `function () {}` instead of arrow functions.
- **Test data cleanup**: every user created by an API scenario is deleted at the end of it (`step_definitions/api/hooks.js`).

## Traceability: challenge → tests

### Part 1 – API

| Step of the challenge                   | Endpoint                         | Covered by                                                      |
| --------------------------------------- | -------------------------------- | --------------------------------------------------------------- |
| 1. Create a user                        | `POST /Account/v1/User`          | `book-store-journey.feature` (step 1), `create-user.feature`    |
| 2. Generate an access token             | `POST /Account/v1/GenerateToken` | `book-store-journey.feature` (step 2), `generate-token.feature` |
| 3. Confirm the user is authorized       | `POST /Account/v1/Authorized`    | `book-store-journey.feature` (step 3), `authorization.feature`  |
| 4. List the available books             | `GET /BookStore/v1/Books`        | `book-store-journey.feature` (step 4), `books.feature`          |
| 5. Rent two books of free choice        | `POST /BookStore/v1/Books`       | `book-store-journey.feature` (step 5), `books.feature`          |
| 6. Show the user details with the books | `GET /Account/v1/User/{userId}`  | `book-store-journey.feature` (step 6), `user-details.feature`   |

`book-store-journey.feature` runs the 6 steps as **one continuous flow**, exactly as the challenge asks.

### Part 2 – Frontend

Each scenario follows the steps of its slide, one by one, with the step number written as a comment in the `.feature` file.

| Screen                                    | Feature                         | Scenario                                                                                        |
| ----------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------- |
| Forms → Practice Form                     | `practice-form.feature`         | Fill in the whole form with random data, upload `upload.txt`, submit, check the popup, close it |
| Alerts, Frame & Windows → Browser Windows | `browser-windows.feature`       | Open a new window, check "This is a sample page", close it                                      |
| Elements → Web Tables                     | `web-tables.feature`            | Create, edit and delete a record                                                                |
| Elements → Web Tables (**bonus**)         | `web-tables.feature` (`@bonus`) | Create 12 records from a Cucumber data table and delete all of them                             |
| Widgets → Progress Bar                    | `progress-bar.feature`          | Stop before 25%, check the value is ≤ 25%, start again, reset at 100%                           |
| Interactions → Sortable                   | `sortable.feature`              | Put the items in ascending order with drag and drop                                             |

## Test design – Part 1 (API)

Every scenario states its expected response (status, error code and message) in the `.feature` file itself.
All the expected responses were confirmed against the real API before being written.

| Technique                    | Where it is used                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------ |
| **Happy path**               | One positive scenario per endpoint, plus the full journey                                        |
| **Equivalence partitioning** | Missing username/password, ISBN not in the catalog, request without token                        |
| **Boundary value analysis**  | Password with 7, 8 and 9 characters; renting 1 and 2 books                                       |
| **Decision table**           | Password rules (one rule broken per row); login with valid/wrong username × valid/wrong password |
| **State transition**         | A user is authorized only after generating a token                                               |
| **Error guessing**           | Duplicated username, renting the same book twice                                                 |

Tags: `@positive`, `@negative`, `@boundary`, `@decision-table`, `@equivalence-partitioning`, `@state-transition`, `@error-guessing`.

## Technical decisions

**Cypress 16 – `expose` instead of `env`.** Cypress 16 removed `Cypress.env()`. Public values (the API URL) are set in `expose` and read with `Cypress.expose()`, and the tags are passed with `--expose tags=…`.

**Third-party scripts.** demoqa.com loads ads and trackers that slow down the pages and throw errors unrelated to the application. They are blocked with `cy.intercept`, and only errors coming from them are ignored; any error from the application still fails the test (`support/utils/third-party.js`).

**Browser Windows.** Cypress cannot control a second browser window (a documented limitation of the tool). The test replaces `window.open` with a stub, checks it was called with `/sample` in a new window, opens that same address to check the message, and then goes back.

**Web Tables.** The table shows 10 rows per page, and the bonus creates 12 records (15 with the 3 that already exist). Each record is found with the search box, by its unique email, so the test works no matter which page the record is on. The 12 records live in a Cucumber data table: adding a row creates one more record, with no code change.

**Progress Bar.** The test runs in real time, so the bar movement is visible. It waits for the bar value itself (it stops the bar once it passes 15%, a 10% margin below the 25% limit). The only fixed pause of the project is the 1 s at 100% before Reset, because of BUG-002.

**Sortable.** The list uses native HTML5 drag and drop. The test reads the current order and, position by position, drags the item that belongs there (`dragstart → dragenter → dragover → drop → dragend`), so it works whatever the initial order is.

**No fixed waits.** Every synchronization waits for a visible condition (an element, a text, a value), never for a fixed time. ESLint enforces it (`cypress/no-unnecessary-waiting`).

## Defects found

Two defects of the system under test were found and documented in **[docs/bug-reports.md](docs/bug-reports.md)**, with steps to reproduce, investigation and evidence.

| Id      | Screen        | Defect                                                   | Effect on the tests                                                                                         |
| ------- | ------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| BUG-001 | Practice Form | The **Close** button does not close the submission popup | The Practice Form scenario **fails on purpose** on its last step: it follows the challenge and clicks Close |
| BUG-002 | Progress Bar  | **Reset** clicked right at 100% restarts the bar         | The test pauses 1 s at 100% before Reset, as a person would                                                 |

## Continuous integration

The pipeline in `.github/workflows/cypress.yml` runs the whole suite in Chrome on every push and pull request, and can also be started by hand (**Actions → Cypress tests → Run workflow**).
In CI, a failed test is retried once and videos are recorded. The HTML report, screenshots and videos are attached to each run as the `cypress-results` artifact.

> While BUG-001 is open, the pipeline finishes with one failed scenario (Practice Form), as described above.
