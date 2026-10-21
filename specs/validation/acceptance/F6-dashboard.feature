Feature: F6 Dashboard

  @story-F6.1
  Rule: The dashboard charts allocations by engagement type and by paid and non-paid allocation type

    Scenario: Reading today's figures
      Given live allocations exist on paid and internal engagements
      When Ana the finance analyst opens the dashboard
      Then she sees allocations by engagement type with counts and percentages
      And she sees paid and non-paid allocations by allocation type

  @story-F6.2
  Rule: Only a past date no later than yesterday can be chosen

    Scenario: Narrowing to one business unit
      Given allocations exist in "Integration" and "Identity"
      When Ana the finance analyst narrows the dashboard to "Identity"
      Then only allocations funded by "Identity" are counted

    @negative
    Scenario: Today is not a past date
      Given the date today is "2026-01-15"
      When Ana the finance analyst chooses "2026-01-15" as the date
      Then the dashboard does not show figures for that date
