Feature: F9 Partner consultants

  @story-F9.1 @story-F9.2
  Rule: A partner consultant needs a company, country and names, and the personal email is optional

    Scenario: Adding a partner consultant
      When Harsha the administrator adds "Omar Haddad" of "Contoso Partners" in "Jordan" as Active
      Then "Omar Haddad" is listed as Active

    @negative
    Scenario: A name with digits is refused
      When Harsha the administrator adds a partner consultant whose first name is "Om4r"
      Then no partner consultant is added

  @story-F9.3
  Rule: A partner consultant with any allocation on record is marked Left, never deleted

    Scenario: Deleting one with allocations
      Given "Lena Kovacs" has 2 allocations on record
      When Harsha the administrator deletes her
      Then she is still listed with the status "Left"

    Scenario: Deleting one without allocations
      Given "Omar Haddad" has no allocations
      When Harsha the administrator deletes him
      Then he is no longer listed
