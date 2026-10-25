@api @health
Feature: Health check
  As the team running the tests
  I want to know that the demoqa APIs are up and answering fast
  So that an environment outage is reported clearly, not as dozens of failing tests

  # demoqa has no /health endpoint, so the lightest public calls are used. No data is created.

  @smoke
  Scenario: The Book Store API is up
    When I list the available books
    Then the response status should be 200
    And the response time should be under 3000 ms

  # A user that does not exist is used on purpose: the call needs no setup and creates nothing.
  # The 404 "User not found!" answer proves the Account API is up and processing requests.
  @smoke
  Scenario: The Account API is up
    Given I have valid credentials for a new user
    When I check whether the user is authorized
    Then the response status should be 404
    And the response time should be under 3000 ms
