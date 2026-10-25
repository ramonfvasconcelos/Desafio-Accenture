@frontend
Feature: Web Tables
  As a user
  I want to manage the records of a table
  So that the table always shows up-to-date data

  Background:
    # 1. Access https://demoqa.com/
    Given I am on the demoqa home page
    # 2. Choose the "Elements" option
    When I choose the "Elements" card
    # 3. Click the "Web Tables" submenu
    And I choose the "Web Tables" menu item

  @smoke
  Scenario: Create, edit and delete a record
    # 4. Create a new record
    When I create a new record with random data
    Then the record should be displayed in the table
    # 5. Edit the new record
    When I edit the record with random data
    Then the record should be displayed in the table
    # 6. Delete the new record
    When I delete the record
    Then the record should not be displayed in the table

  # Bonus: the 12 records come from the Cucumber data table below.
  # To create more records, just add rows here - no code change is needed.
  # Known defect BUG-003: a new record cannot be deleted on its own (see docs/bug-reports.md).
  @bonus
  Scenario: Create 12 records dynamically and delete all of them
    When I create the following records:
      | First Name | Last Name | Email                  | Age | Salary | Department  |
      | Lucas      | Almeida   | lucas.qa@example.com   | 25  | 4500   | QA          |
      | Julia      | Barbosa   | julia.qa@example.com   | 31  | 6200   | Engineering |
      | Pedro      | Carvalho  | pedro.qa@example.com   | 28  | 5100   | Product     |
      | Mariana    | Dias      | mariana.qa@example.com | 35  | 7300   | Design      |
      | Rafael     | Esteves   | rafael.qa@example.com  | 42  | 8800   | Finance     |
      | Beatriz    | Ferreira  | beatriz.qa@example.com | 27  | 4900   | Marketing   |
      | Gabriel    | Gomes     | gabriel.qa@example.com | 33  | 6600   | Sales       |
      | Larissa    | Henrique  | larissa.qa@example.com | 29  | 5400   | Support     |
      | Thiago     | Ibrahim   | thiago.qa@example.com  | 38  | 7900   | Legal       |
      | Camila     | Jardim    | camila.qa@example.com  | 24  | 4200   | People      |
      | Felipe     | Klein     | felipe.qa@example.com  | 45  | 9500   | Operations  |
      | Renata     | Lima      | renata.qa@example.com  | 30  | 5800   | Compliance  |
    Then all the created records should be displayed in the table
    When I delete all the created records
    Then none of the created records should be displayed in the table
