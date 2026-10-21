Feature: F1 Customer engagements

  @story-F1.1 @story-F1.2
  Rule: A requester raises a customer engagement of one of the five customer types from an account's opportunity and product

    Scenario: Raising a Paid engagement
      Given Maya the requester is on the engagement request form
      When she raises a "Paid" engagement for "Acme Bank" with a start date of "2026-02-02" and an end date of "2026-04-30"
      Then the engagement appears in the list for "Acme Bank" with the request status "New"

    @negative
    Scenario: A start date after the end date is refused
      Given Maya the requester is on the engagement request form
      When she submits a "Paid" engagement for "Acme Bank" with a start date of "2026-05-01" and an end date of "2026-04-30"
      Then the list of engagements has no new engagement

  @story-F1.3
  Rule: A requester records where and how the engagement happens

    Scenario: Recording an on-site engagement
      Given Maya the requester is raising a "Non-Paid Pre Sale" engagement for "Globex Retail"
      When she saves it as "Off-site" in "United Kingdom" with customer contact "J. Reeves"
      Then the engagement shows nature "Off-site" and country "United Kingdom"

  @story-F1.4 @story-F1.8
  Rule: A requester sees every customer engagement with its allocated consultants and can filter and search

    Scenario: Filtering by type
      Given engagements of types "Paid" and "Non-Paid Pre Sale" exist
      When Maya the requester filters the list by type "Paid"
      Then every engagement listed has the type "Paid"

    Scenario: Seeing allocated consultants
      Given an engagement for "Acme Bank" has "nimal@wso2.example" allocated
      When Maya the requester opens the engagement list
      Then the row for "Acme Bank" shows "nimal"

  @story-F1.5 @story-F1.9
  Rule: A requester edits an engagement, and for a paid engagement refreshes its dates from the CRM

    Scenario: Editing an engagement
      Given Maya the requester has raised an engagement for "Acme Bank"
      When she changes its country to "Singapore" and saves
      Then the engagement shows country "Singapore" and request status "Updated"

  @story-F1.6
  Rule: A requester completes an engagement request and reopens it to In Progress

    Scenario: Completing then reopening
      Given Maya the requester has an engagement in progress
      When she completes the request and then reopens it
      Then the request status is "In Progress"

  @story-F1.7
  Rule: Cancelling an engagement cancels every allocation on it

    Scenario: Cancelling an engagement with an allocation
      Given an engagement has a confirmed allocation for "nimal@wso2.example"
      When Maya the requester cancels the engagement
      Then the engagement status is "Cancelled"
      And the allocation is shown as "Allocation Cancelled"
