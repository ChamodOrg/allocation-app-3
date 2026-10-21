Feature: F3 Engagement approvals

  @story-F3.1
  Rule: The approval queue holds only internal engagements and marketing events in Pending Approval, in two tabs

    Scenario: A pending internal engagement is queued
      Given an internal engagement "ENG-RND-2026" is "Pending Approval"
      When Ravi the approver opens the approvals queue
      Then "ENG-RND-2026" is listed under internal engagements
      And no customer engagement is listed

    Scenario: Filtering by business unit
      Given pending requests exist in "Integration" and "Identity"
      When Ravi the approver filters the queue by "Identity"
      Then only "Identity" requests are listed

  @story-F3.2
  Rule: Only an approver approves, and approval is final

    Scenario: Approving a request
      Given an internal engagement "ENG-RND-2026" is "Pending Approval"
      When Ravi the approver approves it
      Then "ENG-RND-2026" leaves the queue and its request status is "Approved"

    @negative
    Scenario: A requester cannot approve
      Given Maya the requester has an internal engagement "Pending Approval"
      When Maya looks for a way to approve it
      Then the request is still "Pending Approval"

  @story-F3.3
  Rule: An approver may correct a pending request, then approve it or send it back as updated

    Scenario: Correcting the country and approving
      Given a marketing event "MKT-SUMMIT-26" is "Pending Approval" in "United States"
      When Ravi the approver changes its country to "Canada" and approves it
      Then "MKT-SUMMIT-26" is "Approved" with country "Canada"
