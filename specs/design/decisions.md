# Technical decisions

- \[architecture\] One backend service and one browser app; the platform's Postgres holds only the app's own tables (allocation types, partner consultants, funding lookups, engagement code data, roles and privileges, audit log), while engagements and allocations stay in the finance system. *assumed* (all)
- \[architecture\] The skill suggestions of F4.8 are matched by keyword between the engagement scope and the skills register, five at most, not by an AI model, so the design has no agent component. *assumed* (F4)
- \[security\] Reference reads (allocation types, active partners, reference data, org data, employees, the caller's privileges) need only sign-in; every other operation needs one scope. *assumed* (all)
- \[security\] The three customer allocate privileges are one scope, `allocations:allocate`, because the gateway checks one scope per operation. *assumed* (F4, F10)
- \[security\] Access roles are the project's six roles with fixed scopes; the Access roles screen edits the app's own role-to-privilege table, which is stored and audited. *assumed* (F10)
- \[data-model\] Dates are stored as ISO dates and shown as yyyy-MM-dd. *assumed* (all)
- \[allocations-api\] Lists return 30 rows per page by default, with search, sort and filters on the server. *assumed* (F1, F2, F3, F4)
- \[allocations-api\] Notifications are sent after the write succeeds; a failed send is logged and never fails the request. *assumed* (F1, F2, F3, F4)
- \[allocations-webapp\] The report's CSV is built in the browser from the report rows. *assumed* (F7)