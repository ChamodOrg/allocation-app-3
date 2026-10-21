import { useState, type ReactNode } from "react";
import {
  Alert, AppShell, Badge, Breadcrumbs, Button, Detail, Dialog, Drawer, EmptyState, Field, Filters, Form,
  Heading, Screen, Section, Stat, StatGroup, Table, Tabs, Text, ValidationSummary, defineApp,
  useCollection, useDisplayState, useNav, useParams, useRole,
} from "@wso2/prototype-kit";

type Tone = "default" | "info" | "success" | "warning" | "error";

interface Engagement {
  id: string; code: string; customer: string; type: string; allocationType: string; nature: string;
  country: string; start: string; end: string; requestStatus: string; engagementStatus: string;
  requester: string; businessUnit: string; consultants: string;
}
interface Allocation {
  id: string; engagementId: string; engagementCode: string; consultant: string; allocationType: string;
  start: string; end: string; clearanceStatus: string; comment: string; travel: string;
}
interface AllocationType {
  id: string; name: string; engagementType: string; department: string; defaultCode: string; suffix: string; notify: string;
}
interface Partner {
  id: string; partner: string; name: string; country: string; email: string; phone: string; status: string; allocations: string;
}
interface Role { id: string; name: string; privileges: string }
interface TeamAllocation {
  id: string; person: string; team: string; type: string; code: string; start: string; end: string; comment: string;
}
interface ReportRow {
  id: string; consultant: string; engagementType: string; allocationType: string; department: string;
  businessUnit: string; code: string; mode: string; workingDays: string; workingHours: string;
}
interface Count { id: string; group: string; label: string; businessUnit: string; count: number }
interface Consultant { id: string; name: string; email: string; skills: string }

const engagements: Engagement[] = [
  { id: "1001", code: "CO-ACME-0142", customer: "Acme Bank", type: "Paid", allocationType: "Paid Implementation", nature: "On-site", country: "Sri Lanka", start: "2026-02-02", end: "2026-04-30", requestStatus: "In Progress", engagementStatus: "Confirmed", requester: "Maya Fernando", businessUnit: "Integration", consultants: "Nimal Perera" },
  { id: "1002", code: "PRE-GLOBEX-007", customer: "Globex Retail", type: "Non-Paid Pre Sale", allocationType: "Pre Sale Support", nature: "Off-site", country: "United Kingdom", start: "2026-02-09", end: "2026-02-20", requestStatus: "New", engagementStatus: "Pending", requester: "Maya Fernando", businessUnit: "Identity", consultants: "None yet" },
  { id: "1003", code: "ENG-RND-2026", customer: "WSO2 Internal", type: "Internal Engagement", allocationType: "Engineering", nature: "Off-site", country: "Sri Lanka", start: "2026-01-20", end: "2026-03-31", requestStatus: "Pending Approval", engagementStatus: "Pending", requester: "Ravi Perera", businessUnit: "Integration", consultants: "None yet" },
  { id: "1004", code: "MKT-SUMMIT-26", customer: "WSO2 Internal", type: "Marketing Event", allocationType: "Marketing Event Support", nature: "Hybrid", country: "United States", start: "2026-05-12", end: "2026-05-14", requestStatus: "Pending Approval", engagementStatus: "Pending", requester: "Ana Silva", businessUnit: "Identity", consultants: "None yet" },
  { id: "1005", code: "PS-INITECH-021", customer: "Initech", type: "Paid Post Sale", allocationType: "Paid Implementation", nature: "On-site", country: "Australia", start: "2025-10-01", end: "2025-12-19", requestStatus: "Completed", engagementStatus: "Completed", requester: "Maya Fernando", businessUnit: "Integration", consultants: "Kavya Jayasinghe" },
];

const allocations: Allocation[] = [
  { id: "2001", engagementId: "1001", engagementCode: "CO-ACME-0142", consultant: "nimal@wso2.example", allocationType: "Paid Implementation", start: "2026-02-02", end: "2026-03-13", clearanceStatus: "Confirmed", comment: "Lead engineer", travel: "Yes" },
  { id: "2002", engagementId: "1001", engagementCode: "CO-ACME-0142", consultant: "kavya@wso2.example", allocationType: "Paid Implementation", start: "2026-03-02", end: "2026-04-30", clearanceStatus: "Clearance In Progress", comment: "Waiting for lead's answer", travel: "No" },
  { id: "2003", engagementId: "1005", engagementCode: "PS-INITECH-021", consultant: "kavya@wso2.example", allocationType: "Paid Implementation", start: "2025-10-01", end: "2025-12-19", clearanceStatus: "Confirmed", comment: "", travel: "Yes" },
  { id: "2004", engagementId: "1002", engagementCode: "PRE-GLOBEX-007", consultant: "ana@wso2.example", allocationType: "Pre Sale Support", start: "2026-02-09", end: "2026-02-13", clearanceStatus: "Ready for Clearance", comment: "", travel: "No" },
];

const allocationTypes: AllocationType[] = [
  { id: "t1", name: "Paid Implementation", engagementType: "Paid", department: "Delivery", defaultCode: "CO-DELIVERY", suffix: "", notify: "Yes" },
  { id: "t2", name: "Engineering", engagementType: "Internal Engagement", department: "Engineering", defaultCode: "ENG-GEN", suffix: "", notify: "Yes" },
  { id: "t3", name: "Marketing Event Support", engagementType: "Marketing Event", department: "Marketing", defaultCode: "MKT-EVT", suffix: "-EV", notify: "No" },
  { id: "t4", name: "Engagement Overhead", engagementType: "Internal Engagement", department: "Delivery", defaultCode: "OVH-GEN", suffix: "-OH", notify: "Yes" },
];

const partners: Partner[] = [
  { id: "p1", partner: "Northwind Consulting", name: "Lena Kovacs", country: "Hungary", email: "lena@northwind.example", phone: "+3612345678", status: "Active", allocations: "2" },
  { id: "p2", partner: "Contoso Partners", name: "Omar Haddad", country: "Jordan", email: "omar@contoso.example", phone: "", status: "Active", allocations: "0" },
  { id: "p3", partner: "Contoso Partners", name: "Priya Nair", country: "India", email: "", phone: "+919876543210", status: "Left", allocations: "1" },
];

const roles: Role[] = [
  { id: "r1", name: "AllocationManagers", privileges: "Allocate to Paid engagements|Update clearance status|View engagement allocations" },
  { id: "r2", name: "Requesters", privileges: "Create customer engagement|Edit customer engagement|View engagements" },
  { id: "r3", name: "Approvers", privileges: "Approve internal engagements|Approve marketing events" },
];

const PRIVILEGES = [
  "View dashboard", "Create customer engagement", "Edit customer engagement", "View engagements",
  "Allocate to Paid engagements", "Update clearance status", "View engagement allocations",
  "Approve internal engagements", "Approve marketing events", "Manage team allocations",
];

const teamAllocations: TeamAllocation[] = [
  { id: "3001", person: "nimal@wso2.example", team: "Platform", type: "Engineering", code: "ENG-GEN", start: "2025-12-01", end: "2026-01-30", comment: "Maintenance" },
  { id: "3002", person: "kavya@wso2.example", team: "Platform", type: "Engineering", code: "ENG-GEN", start: "2026-01-12", end: "2026-02-27", comment: "" },
  { id: "3003", person: "sunil@wso2.example", team: "Integration QA", type: "Engineering", code: "ENG-GEN", start: "2026-02-02", end: "2026-03-31", comment: "Test automation" },
];

const reportRows: ReportRow[] = [
  { id: "r1", consultant: "nimal@wso2.example", engagementType: "Paid", allocationType: "Paid Implementation", department: "Delivery", businessUnit: "Integration", code: "CO-ACME-0142", mode: "Daily", workingDays: "30", workingHours: "240" },
  { id: "r2", consultant: "kavya@wso2.example", engagementType: "Paid Post Sale", allocationType: "Paid Implementation", department: "Delivery", businessUnit: "Integration", code: "PS-INITECH-021", mode: "Daily", workingDays: "10", workingHours: "80" },
  { id: "r3", consultant: "sunil@wso2.example", engagementType: "Internal Engagement", allocationType: "Engineering", department: "Engineering", businessUnit: "Integration", code: "ENG-GEN", mode: "Daily", workingDays: "20", workingHours: "160" },
  { id: "r4", consultant: "ana@wso2.example", engagementType: "Non-Paid Pre Sale", allocationType: "Pre Sale Support", department: "Sales Engineering", businessUnit: "Identity", code: "PRE-GLOBEX-007", mode: "Hourly", workingDays: "3", workingHours: "12" },
];

const counts: Count[] = [
  { id: "c1", group: "Engagement type", label: "Paid", businessUnit: "Integration", count: 12 },
  { id: "c2", group: "Engagement type", label: "Non-Paid Pre Sale", businessUnit: "Integration", count: 4 },
  { id: "c3", group: "Engagement type", label: "Internal Engagement", businessUnit: "Integration", count: 9 },
  { id: "c4", group: "Engagement type", label: "Paid", businessUnit: "Identity", count: 7 },
  { id: "c5", group: "Engagement type", label: "Marketing Event", businessUnit: "Identity", count: 3 },
  { id: "c6", group: "Paid", label: "Paid Implementation", businessUnit: "Integration", count: 12 },
  { id: "c7", group: "Paid", label: "Paid Implementation", businessUnit: "Identity", count: 5 },
  { id: "c8", group: "Paid", label: "Paid Advisory", businessUnit: "Identity", count: 2 },
  { id: "c9", group: "Non-paid", label: "Engineering", businessUnit: "Integration", count: 9 },
  { id: "c10", group: "Non-paid", label: "Pre Sale Support", businessUnit: "Integration", count: 4 },
  { id: "c11", group: "Non-paid", label: "Marketing Event Support", businessUnit: "Identity", count: 3 },
];

const consultants: Consultant[] = [
  { id: "k1", name: "Sunil Wickrama", email: "sunil@wso2.example", skills: "Kubernetes, API Management" },
  { id: "k2", name: "Ana Silva", email: "ana@wso2.example", skills: "Java, API Management" },
];

const transitions: Record<string, string[]> = {
  "Tentative": ["Clearance In Progress", "Confirmed", "Confirmed - Visa Pending", "Allocation Cancelled"],
  "Ready for Clearance": ["Clearance In Progress", "Confirmed", "Confirmed - Visa Pending", "Allocation Cancelled"],
  "Clearance In Progress": ["Accepted by Consultant", "Rejected by Consultant", "Allocation Cancelled"],
  "Accepted by Consultant": ["Confirmed", "Confirmed - Visa Pending", "Rejected by Consultant", "Allocation Cancelled"],
  "Confirmed": ["Rejected by Consultant", "Rejected - Visa Issues", "Rejected - Other", "Allocation Cancelled"],
  "Confirmed - Visa Pending": ["Confirmed", "Rejected - Visa Issues", "Rejected by Consultant", "Allocation Cancelled"],
};
const FINAL = ["Allocation Cancelled", "Rejected by Consultant", "Rejected - Visa Issues", "Rejected - Other"];
const engagementTypes = ["Paid", "Paid Pre Sale", "Paid Post Sale", "Non-Paid Pre Sale", "Non-Paid Post Sale", "Internal Engagement", "Marketing Event"];
const businessUnits = ["Integration", "Identity"];

const users: Record<string, { name: string; email: string }> = {
  Requester: { name: "Maya Fernando", email: "maya@wso2.example" },
  Approver: { name: "Ravi Perera", email: "ravi@wso2.example" },
  AllocationManager: { name: "Dilani Mendis", email: "dilani@wso2.example" },
  TeamManager: { name: "Chamara Silva", email: "chamara@wso2.example" },
  FinanceAnalyst: { name: "Ana Silva", email: "ana.f@wso2.example" },
  Administrator: { name: "Harsha Jayawardena", email: "harsha@wso2.example" },
};
const fallbackUser = { name: "Maya Fernando", email: "maya@wso2.example" };

function statusTone(s: string): Tone {
  if (s === "Confirmed" || s === "Approved" || s === "Completed" || s === "Accepted by Consultant" || s === "Active") return "success";
  if (s.startsWith("Rejected") || s === "Cancelled" || s === "Allocation Cancelled" || s === "Left") return "error";
  if (s === "Pending Approval" || s === "Ready for Clearance" || s === "Tentative" || s === "New") return "warning";
  return "info";
}

function Shell({ children }: { children: ReactNode }) {
  const role = useRole();
  return (
    <AppShell
      id="shell"
      user={users[role] ?? fallbackUser}
      nav={[
        { id: "nav.dashboard", label: "Dashboard", to: "screen.dashboard" },
        { id: "nav.engagements", label: "Engagements", to: "screen.engagements" },
        { id: "nav.engagement-allocations", label: "Engagement allocations", to: "screen.engagement-allocations" },
        { id: "nav.approvals", label: "Approvals", to: "screen.approvals" },
        { id: "nav.team-allocations", label: "Team allocations", to: "screen.team-allocations" },
        { id: "nav.report", label: "Allocations report", to: "screen.report" },
        { id: "nav.allocation-types", label: "Allocation types", to: "screen.allocation-types" },
        { id: "nav.partners", label: "Partner consultants", to: "screen.partners" },
        { id: "nav.roles", label: "Access roles", to: "screen.roles" },
      ]}
      account="screen.account"
      signOut="screen.signed-out"
    >
      {children}
    </AppShell>
  );
}

function StatusDialog({ allocationId, onClose }: { allocationId: string | null; onClose: () => void }) {
  const allocs = useCollection<Allocation>("allocations");
  const a = allocationId ? allocs.get(allocationId) : undefined;
  const options = a ? (transitions[a.clearanceStatus] ?? []) : [];
  return (
    <Dialog id="dialog.status" title="Update clearance status" open={a !== undefined} onClose={onClose}>
      <Form
        id="form.status"
        onSubmit={(v) => {
          if (a && v.status) allocs.update(a.id, { clearanceStatus: v.status, comment: v.comment ?? a.comment });
          onClose();
        }}
        actions={<Button id="btn.status.save" label="Save status" emphasis="primary" submit />}
      >
        <Field id="field.status" name="status" label="New status" type="select" options={options} required />
        <Field id="field.status-comment" name="comment" label="Comment" type="textarea" />
      </Form>
    </Dialog>
  );
}

function Engagements() {
  const state = useDisplayState();
  const role = useRole();
  const all = useCollection<Engagement>("engagements");
  const allocs = useCollection<Allocation>("allocations");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const items = state === "state.empty" ? [] : all.items.filter((e) =>
    (type === "All" || e.type === type) && (query === "" || `${e.customer} ${e.code}`.toLowerCase().includes(query.toLowerCase())));
  const cancel = (e: Engagement) => {
    all.update(e.id, { engagementStatus: "Cancelled", requestStatus: "Cancelled" });
    allocs.items.filter((a) => a.engagementId === e.id).forEach((a) => allocs.update(a.id, { clearanceStatus: "Allocation Cancelled" }));
  };
  return (
    <Shell>
      <Heading id="heading.engagements" text="Engagements" />
      {state === "state.failed" && (
        <Alert id="alert.engagements-failed" tone="error" title="Engagements unavailable" text="The finance system did not answer. Try again in a few minutes." />
      )}
      <Section
        id="section.engagements"
        title="Engagement requests"
        count={items.length}
        subtitle="Customer and internal engagements. The list opens on the last two years."
        actions={role === "Requester" ? <Button id="btn.raise" label="Raise engagement" emphasis="primary" to="screen.engagement-form" /> : undefined}
      >
        <Filters id="filters.engagements">
          <Field id="field.search" label="Search" value={query} onChange={setQuery} placeholder="Account or code" />
          <Field id="field.type" label="Type" type="select" options={["All", ...engagementTypes]} value={type} onChange={setType} />
        </Filters>
        <Table
          id="table.engagements"
          columns={["Code", "Account", "Type", "Dates", "Consultants", "Engagement status", { label: "Request", kind: "status" }]}
          rows={items.map((e) => ({
            id: `engagement.${e.id}`,
            cells: [e.code, e.customer, e.type, `${e.start} to ${e.end}`, e.consultants, e.engagementStatus],
            status: { text: e.requestStatus, tone: statusTone(e.requestStatus) },
            ...(role === "AllocationManager" ? { to: "screen.allocations", params: { engagement: e.id } } : {}),
            actions: role === "Requester" ? [
              { id: `engagement.${e.id}.edit`, label: "Edit", to: "screen.engagement-form", params: { engagement: e.id } },
              e.requestStatus === "Completed"
                ? { id: `engagement.${e.id}.reopen`, label: "Reopen", onPress: () => all.update(e.id, { requestStatus: "In Progress" }) }
                : { id: `engagement.${e.id}.complete`, label: "Complete", onPress: () => all.update(e.id, { requestStatus: "Completed" }) },
              { id: `engagement.${e.id}.cancel`, label: "Cancel engagement", emphasis: "danger" as const, onPress: () => cancel(e) },
            ] : [],
          }))}
          empty={<EmptyState id="empty.engagements" title="No engagements" text="Engagement requests you raise appear here." />}
        />
      </Section>
    </Shell>
  );
}

function EngagementForm() {
  const { engagement: id } = useParams();
  const state = useDisplayState();
  const navigate = useNav();
  const all = useCollection<Engagement>("engagements");
  const [issues, setIssues] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const existing = id ? all.get(id) : undefined;
  const shown = state === "state.validation-error" ? ["Account is required", "Start date must be on or before the end date"] : issues;
  const save = (v: Record<string, string>) => {
    const start = v.start ?? "";
    const end = v.end ?? "";
    if (start > end) { setIssues(["Start date must be on or before the end date"]); return; }
    const type = v.type ?? "Paid";
    const internal = type === "Internal Engagement" || type === "Marketing Event";
    const base = {
      type, customer: internal ? "WSO2 Internal" : (v.account ?? ""), allocationType: v.allocationType ?? "",
      nature: v.nature ?? "On-site", country: v.country ?? "", start, end, code: v.code ?? "", businessUnit: v.businessUnit ?? "Integration",
    };
    if (existing) {
      all.update(existing.id, { ...base, requestStatus: existing.requestStatus === "Pending Approval" ? "Pending Approval" : "Updated" });
    } else {
      all.create({ ...base, requestStatus: internal ? "Pending Approval" : "New", engagementStatus: "Pending", requester: "Maya Fernando", consultants: "None yet" });
    }
    navigate.go("screen.engagements");
  };
  return (
    <Shell>
      <Breadcrumbs id="crumbs.form" items={[{ id: "crumb.engagements", label: "Engagements", to: "screen.engagements" }, { id: "crumb.form", label: existing ? "Edit engagement" : "New engagement" }]} />
      <Heading id="heading.form" text={existing ? `Edit ${existing.code}` : "Raise an engagement request"} />
      {note !== "" && <Alert id="alert.note" tone="info" text={note} />}
      {shown.length > 0 && <ValidationSummary id="validation.form" issues={shown} />}
      <Form id="form.engagement" onSubmit={save} actions={<Button id="btn.save" label={existing ? "Save changes" : "Submit request"} emphasis="primary" submit />}>
        <Field id="field.form-type" name="type" label="Engagement type" type="select" options={engagementTypes} defaultValue={existing?.type ?? "Paid"} required />
        <Field id="field.account" name="account" label="Account" type="select" options={["Acme Bank", "Globex Retail", "Initech"]} defaultValue={existing?.customer} />
        <Field id="field.opportunity" name="opportunity" label="Opportunity" placeholder="CRM opportunity" />
        <Field id="field.product" name="product" label="Product line item" placeholder="CRM product, paid types only" />
        <Field id="field.allocation-type" name="allocationType" label="Allocation type" type="select" options={allocationTypes.map((t) => t.name)} defaultValue={existing?.allocationType} />
        <Field id="field.code" name="code" label="Engagement code" defaultValue={existing?.code} required />
        <Field id="field.nature" name="nature" label="Nature" type="select" options={["On-site", "Off-site", "Physical", "Virtual", "Hybrid"]} defaultValue={existing?.nature ?? "On-site"} required />
        <Field id="field.country" name="country" label="Country" defaultValue={existing?.country} required />
        <Field id="field.address" name="address" label="Address" />
        <Field id="field.contact" name="contact" label="Customer contact" />
        <Field id="field.start" name="start" label="Start date" type="date" defaultValue={existing?.start} required />
        <Field id="field.end" name="end" label="End date" type="date" defaultValue={existing?.end} required />
        <Field id="field.business-unit" name="businessUnit" label="Business unit" type="select" options={businessUnits} defaultValue={existing?.businessUnit ?? "Integration"} required />
        <Field id="field.scope" name="scope" label="Scope" type="textarea" />
      </Form>
      {existing && (
        <Section id="section.crm" title="CRM">
          <Button id="btn.refresh-dates" label="Fetch new dates from the CRM" onPress={() => setNote("Dates refreshed from the CRM product: 2026-02-02 to 2026-04-30.")} />
          <Button id="btn.crm-record" label="Open the CRM record" onPress={() => setNote("Opening the CRM record in a new tab.")} />
        </Section>
      )}
    </Shell>
  );
}

function Allocations() {
  const { engagement: id } = useParams();
  const state = useDisplayState();
  const engs = useCollection<Engagement>("engagements");
  const allocs = useCollection<Allocation>("allocations");
  const [adding, setAdding] = useState(false);
  const [searching, setSearching] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [issues, setIssues] = useState<string[]>([]);
  const eng = (id ? engs.get(id) : undefined) ?? engs.items[0]!;
  const mine = state === "state.empty" ? [] : allocs.items.filter((a) => a.engagementId === eng.id);
  const add = (v: Record<string, string>) => {
    const who = v.email ?? "";
    const start = v.start ?? "";
    const end = v.end ?? "";
    const clash = allocs.items.some((a) => a.consultant === who && !FINAL.includes(a.clearanceStatus) && a.start <= end && a.end >= start);
    if (clash) { setIssues([`${who} already has a live allocation in that period`]); return; }
    allocs.create({ engagementId: eng.id, engagementCode: eng.code, consultant: who, allocationType: v.type ?? eng.allocationType, start, end, clearanceStatus: "Ready for Clearance", comment: v.comment ?? "", travel: v.travel ?? "No" });
    engs.update(eng.id, { requestStatus: "In Progress" });
    setIssues([]);
    setAdding(false);
    setEmail("");
  };
  return (
    <Shell>
      <Breadcrumbs id="crumbs.allocations" items={[{ id: "crumb.engagements", label: "Engagements", to: "screen.engagements" }, { id: "crumb.workspace", label: eng.code }]} />
      <Heading
        id="heading.allocations"
        text={`Allocations for ${eng.code}`}
        actions={
          <>
            <Button id="btn.find" label="Find consultants by skill" onPress={() => setSearching(true)} />
            <Button
              id="btn.complete"
              label={eng.requestStatus === "Completed" ? "Reopen request" : "Mark request completed"}
              onPress={() => engs.update(eng.id, { requestStatus: eng.requestStatus === "Completed" ? "In Progress" : "Completed" })}
            />
          </>
        }
      />
      <Detail id="detail.engagement" fields={[
        { label: "Account", value: eng.customer }, { label: "Type", value: eng.type }, { label: "Nature", value: eng.nature },
        { label: "Country", value: eng.country }, { label: "Dates", value: `${eng.start} to ${eng.end}` }, { label: "Request status", value: eng.requestStatus },
      ]} />
      {state === "state.failed" && (
        <Alert id="alert.skills-failed" tone="error" title="Skills register unavailable" text="Consultant search by skill is down. Allocate by email in the meantime." />
      )}
      <Section id="section.allocations" title="Allocations" count={mine.length} subtitle="Staff and partner consultants on this engagement."
        actions={<Button id="btn.add-allocation" label="Add allocation" emphasis="primary" onPress={() => setAdding(true)} />}>
        <Table
          id="table.allocations"
          columns={["Consultant", "Allocation type", "Dates", "Travel", "Comment", { label: "Clearance", kind: "status" }]}
          rows={mine.map((a) => ({
            id: `allocation.${a.id}`,
            cells: [a.consultant, a.allocationType, `${a.start} to ${a.end}`, a.travel, a.comment],
            status: { text: a.clearanceStatus, tone: statusTone(a.clearanceStatus) },
            actions: FINAL.includes(a.clearanceStatus) ? [] : [{ id: `allocation.${a.id}.status`, label: "Update status", onPress: () => setEditing(a.id) }],
          }))}
          empty={<EmptyState id="empty.allocations" title="Nobody allocated yet" text="Add an allocation to start clearance." />}
        />
      </Section>
      <Dialog id="dialog.add" title="Add allocation" open={adding} onClose={() => setAdding(false)}>
        {issues.length > 0 && <ValidationSummary id="validation.add" issues={issues} />}
        <Form id="form.add" onSubmit={add} actions={<Button id="btn.add.save" label="Allocate" emphasis="primary" submit />}>
          <Field id="field.email" name="email" label="Consultant email" value={email} onChange={setEmail} required pattern=".+@wso2\.example" patternMessage="Use the company email address" />
          <Field id="field.alloc-type" name="type" label="Allocation type" type="select" options={allocationTypes.map((t) => t.name)} defaultValue={eng.allocationType} required />
          <Field id="field.alloc-start" name="start" label="Start date" type="date" defaultValue={eng.start} required />
          <Field id="field.alloc-end" name="end" label="End date" type="date" defaultValue={eng.end} required />
          <Field id="field.travel" name="travel" label="Travel required" type="select" options={["Yes", "No"]} defaultValue="No" required />
          <Field id="field.alloc-comment" name="comment" label="Comment" type="textarea" />
        </Form>
      </Dialog>
      <Drawer id="drawer.search" title="Find consultants by skill" open={searching} onClose={() => setSearching(false)}>
        {state === "state.delayed" && <Alert id="alert.suggestions-delayed" tone="info" text="Suggested skills are on their way. You can pick skills yourself meanwhile." />}
        <Text id="text.scope" text="Suggested from the engagement scope, five at most:" />
        <Badge id="badge.skill-1" label="API Management" tone="info" />
        <Badge id="badge.skill-2" label="Kubernetes" tone="info" />
        <Badge id="badge.skill-3" label="Java" tone="info" />
        <Table
          id="table.consultants"
          columns={["Name", "Email", "Skills"]}
          rows={consultants.map((c) => ({
            id: `consultant.${c.id}`,
            cells: [c.name, c.email, c.skills],
            actions: [{ id: `consultant.${c.id}.allocate`, label: "Allocate", onPress: () => { setEmail(c.email); setSearching(false); setAdding(true); } }],
          }))}
        />
      </Drawer>
      <StatusDialog allocationId={editing} onClose={() => setEditing(null)} />
    </Shell>
  );
}

function EngagementAllocations() {
  const state = useDisplayState();
  const allocs = useCollection<Allocation>("allocations");
  const [who, setWho] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const items = state === "state.empty" ? [] : allocs.items.filter((a) => who === "" || a.consultant.includes(who.toLowerCase()));
  return (
    <Shell>
      <Heading id="heading.engagement-allocations" text="Engagement allocations" />
      <Section id="section.engagement-allocations" title="Allocations" count={items.length} subtitle="Opens on two months back to two months ahead.">
        <Filters id="filters.allocations">
          <Field id="field.consultant" label="Consultant" value={who} onChange={setWho} placeholder="Email" />
        </Filters>
        <Table
          id="table.engagement-allocations"
          columns={["Engagement", "Consultant", "Allocation type", "Dates", "Comment", { label: "Clearance", kind: "status" }]}
          rows={items.map((a) => ({
            id: `allocation.${a.id}`,
            cells: [a.engagementCode, a.consultant, a.allocationType, `${a.start} to ${a.end}`, a.comment],
            status: { text: a.clearanceStatus, tone: statusTone(a.clearanceStatus) },
            actions: FINAL.includes(a.clearanceStatus) ? [] : [{ id: `allocation.${a.id}.status`, label: "Update status", onPress: () => setEditing(a.id) }],
          }))}
          empty={<EmptyState id="empty.engagement-allocations" title="No allocations" text="Nothing matches these filters." />}
        />
      </Section>
      <StatusDialog allocationId={editing} onClose={() => setEditing(null)} />
    </Shell>
  );
}

function Approvals() {
  const state = useDisplayState();
  const all = useCollection<Engagement>("engagements");
  const [bu, setBu] = useState("All");
  const [editing, setEditing] = useState<string | null>(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [country, setCountry] = useState("");
  const target = editing ? all.get(editing) : undefined;
  const pending = (kinds: string[]) => state === "state.empty" ? [] : all.items.filter((e) =>
    e.requestStatus === "Pending Approval" && kinds.includes(e.type) && (bu === "All" || e.businessUnit === bu));
  const approve = (eid: string) => all.update(eid, { requestStatus: "Approved", engagementStatus: "Confirmed" });
  const table = (prefix: string, kinds: string[]) => (
    <Table
      id={`table.${prefix}`}
      columns={["Code", "Type", "Requester", "Business unit", "Dates", { label: "Request", kind: "status" }]}
      rows={pending(kinds).map((e) => ({
        id: `${prefix}.${e.id}`,
        cells: [e.code, e.type, e.requester, e.businessUnit, `${e.start} to ${e.end}`],
        status: { text: e.requestStatus, tone: "warning" as const },
        actions: [
          { id: `${prefix}.${e.id}.approve`, label: "Approve", onPress: () => approve(e.id) },
          { id: `${prefix}.${e.id}.correct`, label: "Correct", onPress: () => { setEditing(e.id); setStart(e.start); setEnd(e.end); setCountry(e.country); } },
        ],
      }))}
      empty={<EmptyState id={`empty.${prefix}`} title="Nothing waiting" text="Requests that need approval appear here." />}
    />
  );
  return (
    <Shell>
      <Heading id="heading.approvals" text="Approvals" />
      <Section id="section.approvals" title="Waiting for approval" subtitle="Approval is final and cannot be undone.">
        <Filters id="filters.approvals">
          <Field id="field.approval-bu" label="Business unit" type="select" options={["All", ...businessUnits]} value={bu} onChange={setBu} />
        </Filters>
        <Tabs id="tabs.approvals" tabs={[
          { id: "tab.internal", label: "Internal engagements", content: table("internal", ["Internal Engagement"]) },
          { id: "tab.events", label: "Marketing events", content: table("event", ["Marketing Event"]) },
        ]} />
      </Section>
      <Dialog
        id="dialog.correct"
        title={target ? `Correct ${target.code}` : "Correct request"}
        open={target !== undefined}
        onClose={() => setEditing(null)}
        actions={
          <>
            <Button id="btn.send-back" label="Send back as updated" onPress={() => { if (target) all.update(target.id, { start, end, country }); setEditing(null); }} />
            <Button id="btn.approve-changes" label="Approve with changes" emphasis="primary" onPress={() => { if (target) all.update(target.id, { start, end, country, requestStatus: "Approved", engagementStatus: "Confirmed" }); setEditing(null); }} />
          </>
        }
      >
        <Field id="field.correct-start" label="Start date" type="date" value={start} onChange={setStart} />
        <Field id="field.correct-end" label="End date" type="date" value={end} onChange={setEnd} />
        <Field id="field.correct-country" label="Country" value={country} onChange={setCountry} />
      </Dialog>
    </Shell>
  );
}

function TeamAllocations() {
  const state = useDisplayState();
  const rows = useCollection<TeamAllocation>("teamAllocations");
  const types = useCollection<AllocationType>("allocationTypes");
  const [team, setTeam] = useState("Platform");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const [csv, setCsv] = useState("nimal,Platform,2026-02-02,2026-02-27,Engineering\nkavya,Platform,2026-03-01,2026-02-01,Engineering\nsunil,Platform,2026-03-02,2026-03-27,Gardening");
  const [errors, setErrors] = useState<string[]>([]);
  const [valid, setValid] = useState<Omit<TeamAllocation, "id">[]>([]);
  const [checked, setChecked] = useState(false);
  const target = editing ? rows.get(editing) : undefined;
  const items = state === "state.empty" ? [] : rows.items.filter((r) => r.team === team);
  const add = (v: Record<string, string>) => {
    const person = v.person ?? "";
    const start = v.start ?? "";
    const end = v.end ?? "";
    if (start < "2025-12-16") { setIssues(["A default allocation cannot start more than 30 days in the past"]); return; }
    if (rows.items.some((r) => r.person === person && r.start <= end && r.end >= start)) {
      setIssues(["The person already has an allocation in that period. Reload the timeline."]);
      return;
    }
    const t = types.items.find((x) => x.name === v.type);
    rows.create({ person, team, type: v.type ?? "", code: t ? t.defaultCode : "", start, end, comment: v.comment ?? "" });
    setIssues([]);
    setAdding(false);
  };
  const validate = () => {
    const errs: string[] = [];
    const ok: Omit<TeamAllocation, "id">[] = [];
    csv.split("\n").map((l) => l.trim()).filter((l) => l !== "").forEach((line, i) => {
      const p = line.split(",").map((s) => s.trim());
      if (p.length !== 5) { errs.push(`Row ${i + 1}: expected five columns`); return; }
      const [user, rowTeam, start, end, typeName] = p as [string, string, string, string, string];
      const t = types.items.find((x) => x.name === typeName);
      if (!t) { errs.push(`Row ${i + 1}: allocation type "${typeName}" does not exist`); return; }
      if (start > end) { errs.push(`Row ${i + 1}: start date is after the end date`); return; }
      ok.push({ person: `${user.toLowerCase()}@wso2.example`, team: rowTeam, type: t.name, code: t.defaultCode, start, end, comment: "" });
    });
    setErrors(errs);
    setValid(ok);
    setChecked(true);
  };
  return (
    <Shell>
      <Heading id="heading.team" text="Team allocations" />
      <Section id="section.team" title="Default allocations" count={items.length} subtitle="Work people do when not on an engagement."
        actions={<Button id="btn.add-default" label="Add default allocation" emphasis="primary" onPress={() => setAdding(true)} />}>
        <Filters id="filters.team">
          <Field id="field.bu" label="Business unit" type="select" options={businessUnits} defaultValue="Integration" />
          <Field id="field.team" label="Team" type="select" options={["Platform", "Integration QA"]} value={team} onChange={setTeam} />
        </Filters>
        <Table
          id="table.team"
          columns={["Person", "Allocation type", "Code", "Dates", "Comment"]}
          rows={items.map((r) => ({
            id: `team.${r.id}`,
            cells: [r.person, r.type, r.code, `${r.start} to ${r.end}`, r.comment],
            actions: r.start < "2025-12-16" ? [] : [
              { id: `team.${r.id}.edit`, label: "Update", onPress: () => setEditing(r.id) },
              { id: `team.${r.id}.remove`, label: "Remove", emphasis: "danger" as const, onPress: () => rows.remove(r.id) },
            ],
          }))}
          empty={<EmptyState id="empty.team" title="No default allocations" text="Add one or upload a CSV." />}
        />
      </Section>
      <Section id="section.bulk" title="Bulk upload" subtitle="Five columns: username, team, start date, end date, allocation type name.">
        <Field id="field.csv" label="CSV rows" type="textarea" value={csv} onChange={setCsv} />
        <Button id="btn.validate" label="Check rows" onPress={validate} />
        {checked && errors.length > 0 && <ValidationSummary id="validation.bulk" issues={errors} />}
        {checked && (
          <Alert id="alert.bulk" tone={errors.length > 0 ? "warning" : "success"} text={`${valid.length} valid rows, ${errors.length} with errors.`} />
        )}
        {checked && valid.length > 0 && (
          <Button id="btn.submit-valid" label="Add valid rows" emphasis="primary" onPress={() => { valid.forEach((r) => rows.create(r)); setValid([]); setChecked(false); }} />
        )}
        {checked && errors.length > 0 && <Button id="btn.error-file" label="Download error file" onPress={() => setChecked(true)} />}
      </Section>
      <Dialog id="dialog.add-default" title="Add default allocation" open={adding} onClose={() => setAdding(false)}>
        {issues.length > 0 && <ValidationSummary id="validation.add-default" issues={issues} />}
        <Form id="form.add-default" onSubmit={add} actions={<Button id="btn.add-default.save" label="Add" emphasis="primary" submit />}>
          <Field id="field.person" name="person" label="Person" placeholder="name@wso2.example" required />
          <Field id="field.default-type" name="type" label="Allocation type" type="select" options={types.items.map((t) => t.name)} required />
          <Field id="field.default-start" name="start" label="Start date" type="date" required />
          <Field id="field.default-end" name="end" label="End date" type="date" required />
          <Field id="field.default-comment" name="comment" label="Comment" type="textarea" />
        </Form>
      </Dialog>
      <Dialog id="dialog.update-default" title="Update default allocation" open={target !== undefined} onClose={() => setEditing(null)}>
        <Form id="form.update-default" onSubmit={(v) => { if (target) rows.update(target.id, { end: v.end ?? target.end, comment: v.comment ?? target.comment }); setEditing(null); }}
          actions={<Button id="btn.update-default.save" label="Save" emphasis="primary" submit />}>
          <Field id="field.update-end" name="end" label="End date" type="date" defaultValue={target?.end} required />
          <Field id="field.update-comment" name="comment" label="Comment" type="textarea" defaultValue={target?.comment} />
        </Form>
      </Dialog>
    </Shell>
  );
}

function Dashboard() {
  const state = useDisplayState();
  const all = useCollection<Count>("counts");
  const [bu, setBu] = useState("All");
  const [asOf, setAsOf] = useState("2026-01-14");
  const tooLate = asOf > "2026-01-14";
  const sums = (group: string): [string, number][] => {
    const m: Record<string, number> = {};
    if (state !== "state.empty") {
      all.items.filter((c) => c.group === group && (bu === "All" || c.businessUnit === bu)).forEach((c) => { m[c.label] = (m[c.label] ?? 0) + c.count; });
    }
    return Object.entries(m);
  };
  const breakdown = (prefix: string, title: string, group: string) => {
    const entries = sums(group);
    const total = entries.reduce((n, e) => n + e[1], 0);
    return (
      <Section id={`section.${prefix}`} title={title} count={total}>
        <Table
          id={`table.${prefix}`}
          columns={["Label", { label: "Allocations", kind: "number" }, { label: "Share", kind: "number" }]}
          rows={entries.map(([label, n]) => ({ id: `${prefix}.${label}`, cells: [label, String(n), `${Math.round((n * 100) / total)}%`] }))}
          empty={<EmptyState id={`empty.${prefix}`} title="No allocations" text="Nothing was allocated for this selection." />}
        />
      </Section>
    );
  };
  const byType = sums("Engagement type").reduce((n, e) => n + e[1], 0);
  const paid = sums("Paid").reduce((n, e) => n + e[1], 0);
  const nonPaid = sums("Non-paid").reduce((n, e) => n + e[1], 0);
  return (
    <Shell>
      <Heading id="heading.dashboard" text="Dashboard" />
      <Filters id="filters.dashboard">
        <Field id="field.dash-bu" label="Business unit" type="select" options={["All", ...businessUnits]} value={bu} onChange={setBu} />
        <Field id="field.as-of" label="As of (past date)" type="date" value={asOf} onChange={setAsOf} error={tooLate ? "Pick yesterday or earlier" : undefined} />
      </Filters>
      <StatGroup>
        <Stat id="stat.total" label="Live allocations" value={String(byType)} hint="across engagement types" icon="Users" />
        <Stat id="stat.paid" label="Paid" value={String(paid)} hint="paid engagement types" icon="DollarSign" tone="success" />
        <Stat id="stat.nonpaid" label="Non-paid" value={String(nonPaid)} hint="pre sale, post sale and internal" icon="Briefcase" />
      </StatGroup>
      {breakdown("by-type", "Allocations by engagement type", "Engagement type")}
      {breakdown("paid", "Paid allocations by allocation type", "Paid")}
      {breakdown("nonpaid", "Non-paid allocations by allocation type", "Non-paid")}
    </Shell>
  );
}

function Report() {
  const state = useDisplayState();
  const all = useCollection<ReportRow>("reportRows");
  const [who, setWho] = useState("");
  const [note, setNote] = useState("");
  const items = state === "state.empty" ? [] : all.items.filter((r) => who === "" || r.consultant.includes(who.toLowerCase()));
  return (
    <Shell>
      <Heading id="heading.report" text="Consultant allocations report" />
      {note !== "" && <Alert id="alert.csv" tone="success" text={note} />}
      <Section id="section.report" title="Report" count={items.length} subtitle="People with no allocation appear on their team's default allocation."
        actions={<Button id="btn.csv" label="Download CSV" emphasis="primary" onPress={() => setNote(`consultant-allocations.csv downloaded with ${items.length} rows.`)} />}>
        <Filters id="filters.report">
          <Field id="field.report-who" label="Consultant" value={who} onChange={setWho} placeholder="Everyone" />
          <Field id="field.report-from" label="From" type="date" defaultValue="2026-01-01" />
          <Field id="field.report-to" label="To" type="date" defaultValue="2026-03-31" />
        </Filters>
        <Table
          id="table.report"
          columns={["Consultant", "Engagement type", "Allocation type", "Department", "Business unit", "Engagement code", "Daily or hourly", { label: "Working days", kind: "number" }, { label: "Working hours", kind: "number" }]}
          rows={items.map((r) => ({
            id: `report.${r.id}`,
            cells: [r.consultant, r.engagementType, r.allocationType, r.department, r.businessUnit, r.code, r.mode, r.workingDays, r.workingHours],
          }))}
          empty={<EmptyState id="empty.report" title="No rows" text="No allocations in this period." />}
        />
      </Section>
    </Shell>
  );
}

function AllocationTypes() {
  const state = useDisplayState();
  const types = useCollection<AllocationType>("allocationTypes");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const target = editing ? types.get(editing) : undefined;
  const items = state === "state.empty" ? [] : types.items;
  const save = (v: Record<string, string>) => {
    const rec = { name: v.name ?? "", engagementType: v.engagementType ?? "", department: v.department ?? "", defaultCode: v.code ?? "", suffix: v.suffix ?? "", notify: v.notify ?? "Yes" };
    if (target) types.update(target.id, rec); else types.create(rec);
    setAdding(false);
    setEditing(null);
  };
  return (
    <Shell>
      <Heading id="heading.types" text="Allocation types" />
      <Section id="section.types" title="Active allocation types" count={items.length}
        actions={<Button id="btn.add-type" label="Add allocation type" emphasis="primary" onPress={() => setAdding(true)} />}>
        <Table
          id="table.types"
          columns={["Name", "Engagement type", "Department", "Default code", "Suffix", "Notify allocations group"]}
          rows={items.map((t) => ({
            id: `type.${t.id}`,
            cells: [t.name, t.engagementType, t.department, t.defaultCode, t.suffix, t.notify],
            actions: [
              { id: `type.${t.id}.edit`, label: "Edit", onPress: () => setEditing(t.id) },
              { id: `type.${t.id}.delete`, label: "Delete", emphasis: "danger" as const, onPress: () => types.remove(t.id) },
            ],
          }))}
          empty={<EmptyState id="empty.types" title="No allocation types" text="Add the first one." />}
        />
      </Section>
      <Dialog id="dialog.type" title={target ? "Edit allocation type" : "Add allocation type"} open={adding || target !== undefined} onClose={() => { setAdding(false); setEditing(null); }}>
        <Form id="form.type" onSubmit={save} actions={<Button id="btn.type.save" label="Save" emphasis="primary" submit />}>
          <Field id="field.type-name" name="name" label="Name" defaultValue={target?.name} required />
          <Field id="field.type-engagement" name="engagementType" label="Engagement type" type="select" options={engagementTypes} defaultValue={target?.engagementType} required />
          <Field id="field.type-code" name="code" label="Default engagement code" defaultValue={target?.defaultCode} required />
          <Field id="field.type-suffix" name="suffix" label="Code suffix" defaultValue={target?.suffix} />
          <Field id="field.type-department" name="department" label="Department" defaultValue={target?.department} />
          <Field id="field.type-notify" name="notify" label="Notify the allocations group" type="select" options={["Yes", "No"]} defaultValue={target?.notify ?? "Yes"} />
        </Form>
      </Dialog>
    </Shell>
  );
}

function Partners() {
  const state = useDisplayState();
  const all = useCollection<Partner>("partners");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const target = editing ? all.get(editing) : undefined;
  const items = state === "state.empty" ? [] : all.items;
  const remove = (p: Partner) => { if (p.allocations === "0") all.remove(p.id); else all.update(p.id, { status: "Left" }); };
  const save = (v: Record<string, string>) => {
    const rec = { partner: v.partner ?? "", name: `${v.first ?? ""} ${v.last ?? ""}`.trim(), country: v.country ?? "", email: v.email ?? "", phone: v.phone ?? "", status: v.status ?? "Active" };
    if (target) all.update(target.id, rec); else all.create({ ...rec, allocations: "0" });
    setAdding(false);
    setEditing(null);
  };
  return (
    <Shell>
      <Heading id="heading.partners" text="Partner consultants" />
      <Alert id="alert.partners" tone="info" text="A partner consultant who has any allocation on record cannot be deleted; they are marked Left instead." />
      <Section id="section.partners" title="Roster" count={items.length}
        actions={<Button id="btn.add-partner" label="Add partner consultant" emphasis="primary" onPress={() => setAdding(true)} />}>
        <Table
          id="table.partners"
          columns={["Partner company", "Name", "Country", "Personal email", "Phone", { label: "Status", kind: "status" }]}
          rows={items.map((p) => ({
            id: `partner.${p.id}`,
            cells: [p.partner, p.name, p.country, p.email, p.phone],
            status: { text: p.status, tone: statusTone(p.status) },
            actions: [
              { id: `partner.${p.id}.edit`, label: "Edit", onPress: () => setEditing(p.id) },
              { id: `partner.${p.id}.delete`, label: "Delete", emphasis: "danger" as const, onPress: () => remove(p) },
            ],
          }))}
          empty={<EmptyState id="empty.partners" title="No partner consultants" text="Add the first one." />}
        />
      </Section>
      <Dialog id="dialog.partner" title={target ? "Edit partner consultant" : "Add partner consultant"} open={adding || target !== undefined} onClose={() => { setAdding(false); setEditing(null); }}>
        <Form id="form.partner" onSubmit={save} actions={<Button id="btn.partner.save" label="Save" emphasis="primary" submit />}>
          <Field id="field.partner-company" name="partner" label="Partner company" defaultValue={target?.partner} required />
          <Field id="field.partner-country" name="country" label="Country" defaultValue={target?.country} required />
          <Field id="field.partner-first" name="first" label="First name" defaultValue={target?.name.split(" ")[0]} required pattern="[\p{L}'. -]+" patternMessage="Letters, apostrophes, spaces, dots and hyphens only" />
          <Field id="field.partner-last" name="last" label="Last name" required />
          <Field id="field.partner-email" name="email" label="Personal email (reference only)" defaultValue={target?.email} />
          <Field id="field.partner-phone" name="phone" label="Phone number" defaultValue={target?.phone} pattern="\+?[0-9]*" patternMessage="Digits with an optional leading plus" />
          <Field id="field.partner-status" name="status" label="Status" type="select" options={["Active", "Left"]} defaultValue={target?.status ?? "Active"} required />
        </Form>
      </Dialog>
    </Shell>
  );
}

function Roles() {
  const rs = useCollection<Role>("roles");
  const [roleName, setRoleName] = useState("AllocationManagers");
  const [draft, setDraft] = useState<string[] | null>(null);
  const [saved, setSaved] = useState(false);
  const role = rs.items.find((r) => r.name === roleName) ?? rs.items[0]!;
  const current = draft ?? role.privileges.split("|").filter((x) => x !== "");
  return (
    <Shell>
      <Heading id="heading.roles" text="Access roles" />
      {saved && <Alert id="alert.saved" tone="success" text="Privileges saved and recorded in the audit log." />}
      <Section id="section.role" title="Role privileges" subtitle="Roles are directory groups; privileges change only when you save.">
        <Field id="field.role" label="Role" type="select" options={rs.items.map((r) => r.name)} value={role.name} onChange={(v) => { setRoleName(v); setDraft(null); setSaved(false); }} />
        {PRIVILEGES.map((p, i) => (
          <Field
            key={`priv.${i}`}
            id={`field.priv-${i}`}
            label={p}
            type="switch"
            value={current.includes(p) ? "on" : "off"}
            onChange={(v) => setDraft(v === "on" ? [...current, p] : current.filter((x) => x !== p))}
          />
        ))}
        <Button id="btn.save-role" label="Save privileges" emphasis="primary" onPress={() => { rs.update(role.id, { privileges: current.join("|") }); setDraft(null); setSaved(true); }} />
      </Section>
      <Section id="section.new-role" title="Add a role" subtitle="Type the name of a directory group.">
        <Form id="form.new-role" onSubmit={(v) => { rs.create({ name: v.name ?? "", privileges: "" }); setRoleName(v.name ?? role.name); setDraft(null); }}
          actions={<Button id="btn.add-role" label="Add role" submit />}>
          <Field id="field.new-role" name="name" label="Directory group name" required />
        </Form>
      </Section>
    </Shell>
  );
}

function Account() {
  const role = useRole();
  const user = users[role] ?? fallbackUser;
  return (
    <Shell>
      <Heading id="heading.account" text="Account" />
      <Detail id="detail.account" fields={[{ label: "Name", value: user.name }, { label: "Email", value: user.email }, { label: "Role", value: role }]} />
    </Shell>
  );
}

function SignedOut() {
  return (
    <Screen>
      <Heading id="heading.signed-out" text="You are signed out" />
      <Button id="btn.sign-in" label="Sign in" emphasis="primary" to="screen.account" />
    </Screen>
  );
}

export default defineApp({
  screens: {
    "screen.engagements": Engagements,
    "screen.engagement-form": EngagementForm,
    "screen.allocations": Allocations,
    "screen.engagement-allocations": EngagementAllocations,
    "screen.approvals": Approvals,
    "screen.team-allocations": TeamAllocations,
    "screen.dashboard": Dashboard,
    "screen.report": Report,
    "screen.allocation-types": AllocationTypes,
    "screen.partners": Partners,
    "screen.roles": Roles,
    "screen.account": Account,
    "screen.signed-out": SignedOut,
  },
  data: { engagements, allocations, allocationTypes, partners, roles, teamAllocations, reportRows, counts },
});
