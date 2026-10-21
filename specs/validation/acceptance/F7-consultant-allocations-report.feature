Feature: F7 Consultant allocations report

  @story-F7.1
  Rule: The report covers one consultant or everyone for a period

    Scenario: Running for one consultant
      Given allocations exist for "nimal@wso2.example" and "kavya@wso2.example"
      When Ana the finance analyst runs the report for "nimal@wso2.example" from "2026-01-01" to "2026-03-31"
      Then only rows of "nimal@wso2.example" are listed

  @story-F7.2
  Rule: Working days exclude Saturdays and Sundays, and allocations coded LEFT are left out

    Scenario: Counting working days
      Given "nimal@wso2.example" is allocated from Monday "2026-02-02" to Sunday "2026-02-08"
      When Ana the finance analyst runs the report for February 2026
      Then the row shows 5 working days and 7 calendar days

    @negative
    Scenario: A departed consultant's code is left out
      Given an allocation is coded "LEFT"
      When Ana the finance analyst runs the report for its period
      Then no row carries the code "LEFT"

  @story-F7.3
  Rule: The report can be downloaded as a CSV file

    Scenario: Downloading
      Given the report lists 4 rows
      When Ana the finance analyst downloads the CSV
      Then the file holds 4 rows under the report's columns
