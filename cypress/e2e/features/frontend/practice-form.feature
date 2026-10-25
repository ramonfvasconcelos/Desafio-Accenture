@frontend
Feature: Practice Form
  As a student
  I want to fill in the registration form
  So that my registration is submitted

  # Known defect BUG-001: the "Close" button does not close the popup (see docs/bug-reports.md).
  @smoke
  Scenario: Submit the Practice Form with random data
    # 1. Access https://demoqa.com/
    Given I am on the demoqa home page
    # 2. Choose the "Forms" option
    When I choose the "Forms" card
    # 3. Click the "Practice Form" submenu
    And I choose the "Practice Form" menu item
    # 4. Fill in the whole form with random values
    And I fill in all the fields with random data
    # 5. Upload a .txt file (stored in cypress/fixtures)
    And I upload the file "upload.txt"
    # 6. Submit the form
    And I submit the form
    # 7. Make sure a popup was opened
    Then the popup should be displayed
    And the popup title should be "Thanks for submitting the form"
    # 8. Close the popup
    When I close the popup
    Then the popup should not be displayed
