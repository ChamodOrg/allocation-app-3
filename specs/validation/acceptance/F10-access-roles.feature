Feature: F10 Access roles

  @story-F10.1
  Rule: An administrator changes a role's privileges, and the change is audit logged

    Scenario: Granting a privilege
      Given the role "Requesters" does not hold "View dashboard"
      When Harsha the administrator grants it and saves
      Then "Requesters" holds "View dashboard"

  @story-F10.1
  Rule: Only an administrator can change role privileges

    @negative
    Scenario: A requester has no access roles screen
      Given Maya is a requester
      When she looks for the access roles screen
      Then she cannot open it

  @story-F10.2
  Rule: A role is added by typing the name of a directory group and starts with no privileges

    Scenario: Adding a role
      When Harsha the administrator adds the role "TravelDesk"
      Then "TravelDesk" is listed with no privileges
