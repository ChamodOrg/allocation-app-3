Feature: F5 Team allocations

  @story-F5.1
  Rule: A team manager sees one team's default allocations for a period

    Scenario: Viewing a team
      Given the "Platform" team has default allocations for "nimal@wso2.example" and "kavya@wso2.example"
      When Chamara the team manager picks the "Platform" team
      Then both allocations are listed

  @story-F5.2
  Rule: A new default allocation is refused when the person already has another allocation in the period

    Scenario: Adding a default allocation
      Given "sunil@wso2.example" has no allocation in March 2026
      When Chamara the team manager adds an "Engineering" default allocation for him from "2026-03-02" to "2026-03-27"
      Then the team lists it with the code "ENG-GEN"

    @negative
    Scenario: Overlap is refused
      Given "kavya@wso2.example" has a default allocation from "2026-01-12" to "2026-02-27"
      When Chamara the team manager adds one for her from "2026-02-01" to "2026-02-10"
      Then the team still lists only one allocation for "kavya@wso2.example"

  @story-F5.3
  Rule: A default allocation that started more than 30 days ago can no longer be changed or removed

    @negative
    Scenario: An old allocation is locked
      Given "nimal@wso2.example" has a default allocation that started on "2025-12-01"
      When Chamara the team manager looks for a way to remove it
      Then the allocation is still listed

    Scenario: Removing a recent allocation
      Given "kavya@wso2.example" has a default allocation that started on "2026-01-12"
      When Chamara the team manager removes it
      Then it is no longer listed

  @story-F5.4
  Rule: A CSV upload adds the valid rows and reports each failing row

    @negative
    Scenario: A row with an unknown allocation type
      Given a file with a valid row for "nimal" and a row naming the allocation type "Gardening"
      When Chamara the team manager checks the file
      Then one row is valid and one row is reported with the reason

    Scenario: Submitting the valid rows
      Given a checked file with one valid row for "nimal"
      When Chamara the team manager adds the valid rows
      Then "nimal@wso2.example" has a new default allocation
