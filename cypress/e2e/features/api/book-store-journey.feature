@api
Feature: Book Store rental journey
  As a Book Store customer
  I want to create an account and rent books
  So that the chosen books are kept in my collection

  # The 6 steps required by the challenge, executed as one continuous flow.
  @positive @smoke
  Scenario: Create a user, authorize it and rent two books
    Given I have valid credentials for a new user

    # Step 1 - Create the user
    When I create the user
    Then the response status should be 201
    And the response should contain the user ID and the username

    # Step 2 - Generate the access token
    When I generate an access token
    Then the response status should be 200
    And a token should be returned

    # Step 3 - Confirm the user is authorized
    When I check whether the user is authorized
    Then the response status should be 200
    And the authorization result should be true

    # Step 4 - List the available books
    When I list the available books
    Then the response status should be 200
    And the catalog should contain books

    # Step 5 - Rent two books of free choice
    When I rent 2 books from the list
    Then the response status should be 201
    And the 2 books should be in the response

    # Step 6 - Show the user details with the rented books
    When I request the user details
    Then the response status should be 200
    And the user details should contain the rented books
