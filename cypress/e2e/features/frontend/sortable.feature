@frontend
Feature: Sortable
  As a user
  I want to reorder a list with drag and drop
  So that the items are shown in the order I want

  # The test reads the current order of the list and, position by position,
  # drags the item that belongs there. So it works whatever the initial order is.
  @smoke
  Scenario: Put the list items in ascending order with drag and drop
    # 1. Access https://demoqa.com/
    Given I am on the demoqa home page
    # 2. Choose the "Interactions" option
    When I choose the "Interactions" card
    # 3. Click the "Sortable" submenu
    And I choose the "Sortable" menu item
    # 4. Using drag and drop, put the items in ascending order
    And I drag and drop the items into ascending order
    Then the items should be in the order "One, Two, Three, Four, Five, Six"
