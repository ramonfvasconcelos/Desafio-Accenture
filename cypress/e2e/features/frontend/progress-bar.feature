@frontend
Feature: Progress Bar
  As a user
  I want to start, stop and reset a progress bar
  So that I can control its progress

  # The bar is moved by a page timer (1% every 100 ms). The test controls that timer and
  # moves it 1% at a time, so the bar stops at exactly 20%, whatever the machine speed.
  # Known defect BUG-002: a Reset clicked right at 100% restarts the bar (see docs/bug-reports.md),
  # so the test lets 1 s of page time pass at 100% before resetting, like a person would.
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
