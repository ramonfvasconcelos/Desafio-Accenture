@frontend
Feature: Browser Windows
  As a user
  I want to open a new browser window
  So that I can see its content

  # Cypress cannot control a second browser window (a documented limitation of the tool).
  # So the test intercepts window.open to confirm the new window was requested,
  # opens that same address to check the message, and then comes back.
  @smoke
  Scenario: Open a new window and check its message
    # 1. Access https://demoqa.com/
    Given I am on the demoqa home page
    # 2. Choose the "Alerts, Frame & Windows" option
    When I choose the "Alerts, Frame & Windows" card
    # 3. Click the "Browser Windows" submenu
    And I choose the "Browser Windows" menu item
    # 4. Click the "New Window" button
    And I click the New Window button
    # 5. Make sure a new window was opened and check its message
    Then a new window should be opened
    And the new window should show the message "This is a sample page"
    # 6. Close the new window
    When I close the new window
    Then I should be back on the Browser Windows page
