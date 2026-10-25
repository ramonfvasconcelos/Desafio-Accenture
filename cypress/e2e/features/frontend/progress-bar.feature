@frontend
Feature: Progress Bar
  As a user
  I want to start, stop and reset a progress bar
  So that I can control its progress

  # The bar grows 1% every 100 ms and the test runs in real time, so every movement is visible.
  # It waits for the bar value itself and stops it once it passes 15%.
  # Known defect BUG-002: a Reset clicked right at 100% restarts the bar (see docs/bug-reports.md),
  # so the test pauses for 1 s at 100% before resetting, like a person would.
  @smoke
  Scenario: Stop the progress bar before 25% and reset it at 100%
    # 1. Access https://demoqa.com/
    Given I am on the demoqa home page
    # 2. Choose the "Widgets" option
    When I choose the "Widgets" card
    # 3. Click the "Progress Bar" submenu
    And I choose the "Progress Bar" menu item
    # 4. Click the "Start" button
    And I click the Start button
    # 5. Stop before 25%
    And I stop the progress bar before 25%
    # 6. Validate that the value is less than or equal to 25%
    Then the progress bar value should be less than or equal to 25%
    # 7. Press "Start" again and, when it reaches 100%, reset the progress bar
    When I click the Start button again
    And the progress bar reaches 100%
    And I reset the progress bar
    Then the progress bar value should be 0%
