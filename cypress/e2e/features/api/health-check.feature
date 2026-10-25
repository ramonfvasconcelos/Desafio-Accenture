@api @health
Feature: Health check
  As the team running the tests
  I want to know that every endpoint of the challenge is up and answering fast
  So that an environment outage is reported clearly, not as dozens of failing tests

  # demoqa has no /health endpoint, so each endpoint gets its lightest call.
  # None of them creates data: the calls use empty data, a user that does not exist
  # or no access token. Any answer from the API, with the expected status code,
  # proves the endpoint is up. If it is down or slower than 3 s, the test fails.

  # 1. Create a user - /Account/v1/User
  @smoke
  Scenario: The create user endpoint is up
    Given I have credentials with empty username and empty password
    When I create the user
    Then the response status should be 400
    And the error message should be "UserName and Password required."
    And the response time should be under 3000 ms

  # 2. Generate an access token - /Account/v1/GenerateToken
  @smoke
  Scenario: The generate token endpoint is up
    Given I have valid credentials for a new user
    When I generate an access token
    Then the response status should be 200
    And the token status should be "Failed"
    And the response time should be under 3000 ms

  # 3. Confirm the user is authorized - /Account/v1/Authorized
  @smoke
  Scenario: The authorization endpoint is up
    Given I have valid credentials for a new user
    When I check whether the user is authorized
    Then the response status should be 404
    And the error message should be "User not found!"
    And the response time should be under 3000 ms

  # 4. List the available books - GET /BookStore/v1/Books
  @smoke
  Scenario: The list books endpoint is up
    When I list the available books
    Then the response status should be 200
    And the response time should be under 3000 ms

  # 5. Rent books - POST /BookStore/v1/Books (no access token is sent)
  @smoke
  Scenario: The rent books endpoint is up
    When I try to rent a book without an access token
    Then the response status should be 401
    And the error message should be "User not authorized!"
    And the response time should be under 3000 ms

  # 6. User details - /Account/v1/User/{userID} (no access token is sent)
  @smoke
  Scenario: The user details endpoint is up
    When I request the details of a user that does not exist
    Then the response status should be 401
    And the error message should be "User not authorized!"
    And the response time should be under 3000 ms
