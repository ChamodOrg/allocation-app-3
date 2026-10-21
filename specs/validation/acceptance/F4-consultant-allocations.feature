Feature: F4 Consultant allocations

  @story-F4.1 @story-F4.2 @story-F4.4
  Rule: An allocation manager allocates a staff member to an engagement, starting Ready for Clearance

    Scenario: Allocating a consultant
      Given Dilani the allocation manager has opened the workspace of "CO-ACME-0142"
      When she allocates "kavya@wso2.example" from "2026-03-02" to "2026-04-30" with travel not required
      Then the engagement lists the allocation as "Ready for Clearance"
      And the engagement request status is "In Progress"

  @story-F4.2 @story-F4.3
  Rule: A person cannot be allocated while another live allocation covers the period

    @negative
    Scenario: Double booking is refused
      Given "nimal@wso2.example" is allocated to "CO-ACME-0142" from "2026-02-02" to "2026-03-13"
      When Dilani the allocation manager allocates "nimal@wso2.example" to another engagement from "2026-03-01" to "2026-03-20"
      Then the other engagement has no allocation

  @story-F4.3
  Rule: Only active partner consultants can be allocated, and their allocation starts Confirmed

    Scenario: Allocating a partner consultant
      Given Lena is an active partner consultant at "Northwind Consulting"
      When Dilani the allocation manager allocates Lena to an engagement
      Then the allocation is shown as "Confirmed"

  @story-F4.5
  Rule: Overhead time around a paid engagement stays within 14 days either side

    Scenario: Adding preparation time
      Given a "Paid" engagement starts on "2026-02-02"
      When Dilani the allocation manager allocates a consultant with 5 days of preparation
      Then the consultant also has an "Engagement Overhead" allocation ending the day before "2026-02-02"

  @story-F4.6
  Rule: Clearance moves only along its allowed paths

    Scenario: Clearing an allocation
      Given an allocation is "Clearance In Progress"
      When Dilani the allocation manager sets it to "Accepted by Consultant"
      Then the allocation is shown as "Accepted by Consultant"

    @negative
    Scenario: A skipped step is not offered
      Given an allocation is "Clearance In Progress"
      When Dilani the allocation manager tries to set it to "Confirmed"
      Then the allocation is still "Clearance In Progress"

    @negative
    Scenario: A cancelled allocation is final
      Given an allocation is "Allocation Cancelled"
      When Dilani the allocation manager tries to set it to "Confirmed"
      Then the allocation is still "Allocation Cancelled"

  @story-F4.7
  Rule: Every engagement allocation is listed and can be updated from the list

    Scenario: Filtering by consultant
      Given allocations exist for "nimal@wso2.example" and "kavya@wso2.example"
      When Dilani the allocation manager filters by "kavya"
      Then only allocations of "kavya@wso2.example" are listed

  @story-F4.8
  Rule: Consultants are found by skill from suggested skills the manager can adjust

    Scenario: Searching by skill
      Given the engagement scope mentions API management
      When Dilani the allocation manager searches for consultants with "API Management"
      Then "Ana Silva" is among the consultants found

  @story-F4.9
  Rule: The engagement request is completed or reopened from its allocation workspace

    Scenario: Completing from the workspace
      Given Dilani the allocation manager has opened the workspace of "CO-ACME-0142"
      When she marks the request completed
      Then the request status is "Completed"
