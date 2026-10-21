Feature: F2 Internal engagements and marketing events

  @story-F2.1 @story-F2.4
  Rule: An internal engagement is raised against the organization's own account and waits for approval

    Scenario: Raising an internal engagement
      Given Ravi the requester is on the engagement request form
      When he raises an "Internal Engagement" in "Sri Lanka" from "2026-01-20" to "2026-03-31"
      Then the engagement is listed for "WSO2 Internal" with the request status "Pending Approval"

    Scenario: Editing while pending keeps it pending
      Given an internal engagement is "Pending Approval"
      When Ravi the requester changes its end date to "2026-04-15"
      Then its request status is still "Pending Approval"

  @story-F2.2
  Rule: A marketing event's funding percentages are each above zero and sum to exactly 100

    @negative
    Scenario: A split that does not add up
      Given Ana the requester is raising a "Marketing Event"
      When she funds it 60 percent and 30 percent from two business units
      Then no marketing event is added

    Scenario: A split that adds up
      Given Ana the requester is raising a "Marketing Event"
      When she funds it 60 percent and 40 percent from two business units
      Then the event is listed with the request status "Pending Approval"

  @story-F2.3
  Rule: Internal engagements and events appear in one list with the same filters as customer engagements

    Scenario: Finding an event by type
      Given a "Marketing Event" and a "Paid" engagement exist
      When Ana the requester filters the list by type "Marketing Event"
      Then only marketing events are listed

  @story-F2.5
  Rule: A requester completes, reopens or cancels an internal engagement as for a customer engagement

    Scenario: Cancelling an internal engagement
      Given Ravi the requester has an internal engagement
      When he cancels it
      Then its engagement status is "Cancelled"
