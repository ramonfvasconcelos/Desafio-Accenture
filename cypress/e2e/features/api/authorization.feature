@api
Feature: Authorization
  As a registered Book Store customer
  I want to know whether my user is authorized
  So that I know I can rent books

  @positive @state-transition
  Scenario: A user is authorized after generating a token
    Given a user is registered and authorized
    When I check whether the user is authorized
    Then the response status should be 200
    And the authorization result should be true

  @negative @state-transition
  Scenario: A user is not authorized before generating a token
    Given a user is already registered
    When I check whether the user is authorized
    Then the response status should be 200
    And the authorization result should be false

  @negative
  Scenario: Check the authorization of a user that does not exist
    Given I have valid credentials for a new user
    When I check whether the user is authorized
    Then the response status should be 404
    And the error code should be "1207"
    And the error message should be "User not found!"
