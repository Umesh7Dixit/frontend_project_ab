"use client";

import SideDrawer from "@/components/SideDrawer";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

type Details = {
  title: string;
  description: string;
  content: React.ReactNode;
};

function getSelectedItemDetails(selectedItem: string): Details {
  switch (selectedItem) {
    case "basic":
      return {
        title: "Basic Details",
        description:
          "Project identity — the minimal metadata that tags and groups your inventory.",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This section identifies the project and the physical /
              organizational unit you&apos;re reporting for. Keep these values
              consistent across reports.
            </p>

            <dl className="grid gap-2 text-sm">
              <div>
                <dt className="font-medium">Industry</dt>
                <dd className="text-xs text-muted-foreground">
                  Select the sector that best matches the facility&apos;s activities.
                  Example: <code>manufacturing</code>. Why: helps suggest
                  default emission factors and group reports.
                </dd>
              </div>

              <div>
                <dt className="font-medium">Organization Name</dt>
                <dd className="text-xs text-muted-foreground">
                  Legal or corporate name (e.g. <code>Acme Pvt Ltd</code>). Why:
                  used for access, exports and corporate-level rollups. Prefer
                  canonical names — avoid synonyms.
                </dd>
              </div>

              <div>
                <dt className="font-medium">Facility</dt>
                <dd className="text-xs text-muted-foreground">
                  Human-friendly site name (e.g.{" "}
                  <code>Acme Plant — Mangalore</code>). Why: main label on
                  dashboards and charts.
                </dd>
              </div>

              <div>
                <dt className="font-medium">Facility ID</dt>
                <dd className="text-xs text-muted-foreground">
                  A short stable identifier (e.g. <code>ACME-MNG-01</code>).
                  Why: use for integrations, deduping, and linking external data
                  (meters, invoices).
                </dd>
              </div>
            </dl>

            <Separator />

            <div className="text-xs space-y-1">
              <p>
                <strong>Quick tips:</strong> Always keep{" "}
                <code>Organization Name</code> and <code>Facility ID</code>{" "}
                consistent — they are the single biggest source of messy
                reports.
              </p>
              <p>
                <strong>Common mistakes:</strong> free-text org names that vary,
                missing facility IDs, or using generic facility names like
                “Plant A”.
              </p>
            </div>
          </div>
        ),
      };

    case "ownershipScope":
      return {
        title: "Ownership & Scope",
        description:
          "Defines who is responsible and what part of operations is included in the inventory.",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This determines accountability and the boundaries used for
              emissions. Choices here affect which emissions are in/out of the
              report.
            </p>

            <dl className="grid gap-2 text-sm">
              <div>
                <dt className="font-medium">Responsible</dt>
                <dd className="text-xs text-muted-foreground">
                  The person or role accountable for the inventory (e.g.{" "}
                  <code>Head of EHS — Raj</code>). Why: single point of contact
                  for review and approvals.
                </dd>
              </div>

              <div>
                <dt className="font-medium">Intended User</dt>
                <dd className="text-xs text-muted-foreground">
                  Who will use these reports (e.g.{" "}
                  <code>Internal stakeholders, auditors</code>). Why: helps
                  tailor level-of-detail and export formats.
                </dd>
              </div>

              <div>
                <dt className="font-medium">Intended Use of Inventory</dt>
                <dd className="text-xs text-muted-foreground">
                  Short description of purpose (e.g. compliance, voluntary
                  reporting, internal reduction targets). Why: clarifies whether
                  you need full assurance-level data or summary estimates.
                </dd>
              </div>

              <div>
                <dt className="font-medium">Organizational Boundary</dt>
                <dd className="text-xs text-muted-foreground">
                  Choose how you define the organization for reporting. Options:
                  <ul className="list-disc ml-4 mt-1 text-xs text-muted-foreground">
                    <li>
                      <strong>Operational control</strong> — include facilities
                      you control operationally (common for operational
                      reporting).
                    </li>
                    <li>
                      <strong>Financial control</strong> — include entities you
                      control financially (used for investor-facing reports).
                    </li>
                    <li>
                      <strong>Equity share</strong> — include proportionate
                      share of JV emissions.
                    </li>
                  </ul>
                  <div className="mt-1 text-[11px]">
                    <strong>Example:</strong> If you run a site day-to-day
                    (hiring/firing, setting processes) choose{" "}
                    <em>Operational</em>. If you own 30% of a JV but don’t
                    operate it, consider <em>Equity</em>.
                  </div>
                </dd>
              </div>
            </dl>

            <Separator />

            <div className="text-xs space-y-1">
              <p>
                <strong>Why it matters:</strong> Boundary choice changes which
                emission sources are included — affecting your baseline and
                reduction claims.
              </p>
              <p>
                <strong>Common mistakes:</strong> mixing boundaries across
                facilities, not documenting boundary rationale, or failing to
                reflect JV ownership correctly.
              </p>
            </div>
          </div>
        ),
      };

    case "reportingPermissions":
      return {
        title: "Reporting & Permissions",
        description:
          "Period, protocol and access rules — critical for accurate aggregation and compliance.",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This section determines how you measure and who can interact with
              the inventory. Fill dates precisely — they drive all periodized
              calculations.
            </p>

            <dl className="grid gap-2 text-sm">
              <div>
                <dt className="font-medium">Reporting Protocol</dt>
                <dd className="text-xs text-muted-foreground">
                  Choose the standard you follow:
                  <ul className="list-disc ml-4 mt-1 text-xs text-muted-foreground">
                    <li>
                      <strong>GHG Protocol</strong> — widely used for corporate
                      inventories (scope 1/2/3 definitions, guidance for
                      boundaries).
                    </li>
                    <li>
                      <strong>ISO 14064</strong> — good when seeking ISO-aligned
                      assurance.
                    </li>
                    <li>
                      <strong>Custom</strong> — internal or sector-specific
                      rules; document assumptions carefully.
                    </li>
                  </ul>
                </dd>
              </div>

              <div>
                <dt className="font-medium">Reporting Period (From / To)</dt>
                <dd className="text-xs text-muted-foreground">
                  Exact period for aggregation. Use ISO date strings
                  (YYYY-MM-DD). Examples:
                  <ul className="list-disc ml-4 mt-1 text-xs text-muted-foreground">
                    <li>
                      Full calendar year: <code>2024-01-01</code> to{" "}
                      <code>2024-12-31</code>
                    </li>
                    <li>
                      Quarter: <code>2024-04-01</code> to{" "}
                      <code>2024-06-30</code>
                    </li>
                  </ul>
                  <div className="mt-1 text-[11px]">
                    <strong>Validation:</strong> ensure <code>From ≤ To</code>.
                    Store as ISO strings to avoid timezone shifts.
                  </div>
                </dd>
              </div>

              <div>
                <dt className="font-medium">Base Year</dt>
                <dd className="text-xs text-muted-foreground">
                  The year you compare reductions against (ex: <code>2019</code>{" "}
                  or <code>2019-01-01</code>). Use a stable baseline and
                  document any normalization (activity, scope changes).
                </dd>
              </div>

              <div>
                <dt className="font-medium">Access Given to Users</dt>
                <dd className="text-xs text-muted-foreground">
                  Comma-separated emails or IDs for people who should have edit
                  or view access. Example:{" "}
                  <code>alice@acme.com, bob@acme.com</code>. Prefer invite-based
                  access (unique IDs) over free-text names.
                </dd>
              </div>
            </dl>

            <Separator />

            <div className="text-xs space-y-1">
              <p>
                <strong>Why it matters:</strong> Reporting period & protocol
                drive aggregation rules, factor selection, and how you compare
                performance against a base year.
              </p>
              <p>
                <strong>Common mistakes:</strong> partial dates (missing day),
                timezone conversions that shift day boundaries, failing to
                validate the date range, using inconsistent base years across
                reports.
              </p>
            </div>
          </div>
        ),
      };

    default:
      return {
        title: "Details",
        description: "No details available for this selection.",
        content: (
          <p className="text-sm text-muted-foreground">No details available.</p>
        ),
      };
  }
}

const InfoDrawer = ({ open, onClose, selectedItem }: any) => {
  const { title, description, content } = getSelectedItemDetails(
    selectedItem ?? ""
  );

  return (
    <SideDrawer open={open} onClose={onClose} title={title}>
      <ScrollArea className="h-full p-4 space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">{description}</p>
          <Separator className="my-3" />
          {content}
        </div>
      </ScrollArea>
    </SideDrawer>
  );
};

export default InfoDrawer;
