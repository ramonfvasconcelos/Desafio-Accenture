@api
Feature: Create user
  As a Book Store customer
  I want to create an account
  So that I can rent books

  @positive @smoke
  Scenario: Create a user with valid credentials
    Given I have valid credentials for a new user
    When I create the user
    Then the response status should be 201
    And the response should contain the user ID and the username

  @negative @equivalence-partitioning
  Scenario Outline: Reject the user creation with <username> username and <password> password
    Given I have credentials with <username> username and <password> password
    When I create the user
    Then the response status should be 400
    And the error code should be "1200"
    And the error message should be "UserName and Password required."

    Examples:
      | username | password |
      | valid    | empty    |
      | empty    | valid    |
      | empty    | empty    |

  @negative
  Scenario: Reject the user creation with a username that already exists
    Given a user is already registered
    When I create the user
    Then the response status should be 406
    And the error code should be "1204"
    And the error message should be "User exists!"

  # Decision table: each row breaks exactly one password rule.
  @negative @decision-table
  Scenario Outline: Reject a password with <broken rule>
    Given I have a new username with the password "<password>"
    When I create the user
    Then the response status should be 400
    And the error code should be "1300"
    And the error message should be "Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer."

    Examples:
      | broken rule          | password  |
      | no uppercase letter  | test@1234 |
      | no lowercase letter  | TEST@1234 |
      | no digit             | Test@abcd |
      | no special character | Test12345 |

  # Boundary value analysis: the minimum password length is 8 characters.
  @boundary
  Scenario Outline: Create a user with a password of <length> characters
    Given I have a new username with the password "<password>"
    When I create the user
    Then the response status should be <status>

    Examples:
      | length | password  | status |
      | 7      | Tes@123   | 400    |
      | 8      | Test@123  | 201    |
      | 9      | Test@1234 | 201    |
