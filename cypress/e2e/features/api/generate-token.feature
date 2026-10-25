@api
Feature: Generate token
  As a registered Book Store customer
  I want to log in with my credentials
  So that I receive an access token

  @positive @smoke
  Scenario: Generate a token for a registered user
    Given a user is already registered
    When I generate an access token
    Then the response status should be 200
    And the token status should be "Success"
    And the result message should be "User authorized successfully."
    And a token should be returned

  # Decision table: the valid + valid combination is the scenario above.
  # The API answers 200 even when the login fails; the failure is shown in the body.
  @negative @decision-table
  Scenario Outline: Reject the login with <username> username and <password> password
    Given a user is already registered
    When I request a token with <username> username and <password> password
    Then the response status should be 200
    And the token status should be "Failed"
    And the result message should be "User authorization failed."
    And no token should be returned

    Examples:
      | username | password |
      | valid    | wrong    |
      | wrong    | valid    |
      | wrong    | wrong    |

  @negative @equivalence-partitioning
  Scenario Outline: Reject the login with <username> username and <password> password
    Given a user is already registered
    When I request a token with <username> username and <password> password
    Then the response status should be 400
    And the error code should be "1200"
    And the error message should be "UserName and Password required."

    Examples:
      | username | password |
      | valid    | empty    |
      | empty    | valid    |
