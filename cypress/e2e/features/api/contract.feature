@api @contract
Feature: API contracts
  As a consumer of the Book Store API
  I want every response to keep its structure
  So that a change in fields or types is caught even when the status code is still right

  # Each response is validated against a JSON Schema (cypress/support/api/schemas.js) with Ajv:
  # which fields exist, their types and which ones are required. Unexpected fields fail the test.

  @positive
  Scenario: Create user - response contract
    Given I have valid credentials for a new user
    When I create the user
    Then the response status should be 201
    And the response should match the "user created" contract

  @positive
  Scenario: Generate token - response contract
    Given a user is already registered
    When I generate an access token
    Then the response status should be 200
    And the response should match the "token" contract

  @positive
  Scenario: Authorized - response contract
    Given a user is registered and authorized
    When I check whether the user is authorized
    Then the response status should be 200
    And the response should match the "authorization" contract

  @positive
  Scenario: List books - response contract
    When I list the available books
    Then the response status should be 200
    And the response should match the "book list" contract

  @positive
  Scenario: Rent books - response contract
    Given a user is registered and authorized
    When I list the available books
    And I rent 2 books from the list
    Then the response status should be 201
    And the response should match the "books added" contract

  @positive
  Scenario: User details - response contract
    Given a user is registered and authorized
    And the user has rented 2 books
    When I request the user details
    Then the response status should be 200
    And the response should match the "user details" contract

  @negative
  Scenario: Error - response contract
    Given I have credentials with empty username and empty password
    When I create the user
    Then the response status should be 400
    And the response should match the "error" contract
