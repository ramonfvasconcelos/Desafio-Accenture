@api
Feature: User details
  As a registered Book Store customer
  I want to see my account details
  So that I can check which books are in my collection

  @positive
  Scenario: Show the details of a user without books
    Given a user is registered and authorized
    When I request the user details
    Then the response status should be 200
    And the user details should show an empty book collection

  @positive
  Scenario: Show the details of a user with rented books
    Given a user is registered and authorized
    And the user has rented 2 books
    When I request the user details
    Then the response status should be 200
    And the user details should contain the rented books

  @negative
  Scenario: Reject showing the user details without an access token
    Given a user is already registered
    When I request the user details without an access token
    Then the response status should be 401
    And the error code should be "1200"
    And the error message should be "User not authorized!"

  @negative
  Scenario: Reject showing the details of a user that does not exist
    Given a user is registered and authorized
    When I request the details of a user that does not exist
    Then the response status should be 401
    And the error code should be "1207"
    And the error message should be "User not found!"
