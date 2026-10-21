Feature: F8 Allocation types

  @story-F8.1
  Rule: The administrator sees only active allocation types

    Scenario: Listing types
      Given "Engineering" is active and "Retired Type" is deleted
      When Harsha the administrator opens allocation types
      Then "Engineering" is listed and "Retired Type" is not

  @story-F8.2
  Rule: A new allocation type needs a name, an active engagement type and a default engagement code

    Scenario: Adding a type
      When Harsha the administrator adds "Support Rotation" under "Internal Engagement" with the code "SUP-ROT"
      Then "Support Rotation" is listed with the code "SUP-ROT"

    @negative
    Scenario: A missing default code
      When Harsha the administrator adds "Support Rotation" under "Internal Engagement" with no default code
      Then no allocation type is added

  @story-F8.3
  Rule: Deleting an allocation type hides it without destroying it

    Scenario: Deleting a type
      Given "Support Rotation" exists
      When Harsha the administrator deletes it
      Then "Support Rotation" is no longer listed
