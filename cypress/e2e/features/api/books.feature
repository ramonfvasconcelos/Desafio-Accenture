@api
Feature: Books
  As a Book Store customer
  I want to see the catalog and rent books
  So that the books are added to my collection

  @positive @smoke
  Scenario: List the available books
    When I list the available books
    Then the response status should be 200
    And the catalog should contain books
    And every book should have an ISBN, a title and an author

  # Boundary: 1 book is the minimum rental, 2 books is what the challenge asks for.
  @positive @boundary
  Scenario Outline: Rent <quantity> <books> from the catalog
    Given a user is registered and authorized
    When I list the available books
    And I rent <quantity> <books> from the list
    Then the response status should be 201
    And the <quantity> <books> should be in the response

    Examples:
      | quantity | books |
      | 1        | book  |
      | 2        | books |

  @negative
  Scenario: Reject renting a book without an access token
    Given a user is already registered
    When I try to rent a book without an access token
    Then the response status should be 401
    And the error code should be "1200"
    And the error message should be "User not authorized!"

  @negative @equivalence-partitioning
  Scenario: Reject renting a book that is not in the catalog
    Given a user is registered and authorized
    When I try to rent a book with the ISBN "0000000000000"
    Then the response status should be 400
    And the error code should be "1205"
    And the error message should be "ISBN supplied is not available in Books Collection!"

  @negative @error-guessing
  Scenario: Reject renting the same book twice
    Given a user is registered and authorized
    And the user has rented 1 book
    When I try to rent the same book again
    Then the response status should be 400
    And the error code should be "1210"
    And the error message should be "ISBN already present in the User's Collection!"
