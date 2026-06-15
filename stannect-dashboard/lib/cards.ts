export type CardKind = "main" | "kpi" | "dashboard" | "integration";

export interface CardMetric {
  label: string;
  value: string;
  delta?: string;
  /** Positive = good (up), negative = bad. Drives delta color. */
  direction?: "up" | "down" | "flat";
}

export interface CardData {
  id: string;
  kind: CardKind;
  title: string;
  subtitle?: string;
  metrics: CardMetric[];
  /** Tiny sparkline series, normalized any range. */
  trend?: number[];
  /** Which brand accent tints the card header rule. */
  accent?: 1 | 2 | 3;
  status?: string;
  /** Marks the central Stannect node that everything chains back to. */
  isHub?: boolean;
}

let counter = 0;
export function nextId(prefix = "card"): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

const spark = (...n: number[]) => n;

/** The workspace as it first loads. The hub anchors every chain. */
export const defaultCards: CardData[] = [
  {
    id: "hub-main",
    kind: "main",
    title: "Main Dashboard",
    subtitle: "Stannect Core",
    isHub: true,
    accent: 1,
    status: "All systems connected",
    metrics: [
      { label: "Automations live", value: "24", delta: "+3", direction: "up" },
      { label: "Connected sources", value: "6" },
    ],
    trend: spark(8, 10, 9, 12, 14, 13, 16, 18),
  },
  {
    id: "kpi-revenue",
    kind: "kpi",
    title: "Revenue",
    subtitle: "Month to date",
    accent: 1,
    metrics: [
      { label: "MTD", value: "$48.2k", delta: "+12.4%", direction: "up" },
      { label: "Target", value: "78%" },
    ],
    trend: spark(20, 22, 21, 25, 27, 26, 30, 34, 33, 38),
  },
  {
    id: "kpi-leads",
    kind: "kpi",
    title: "Leads",
    subtitle: "Pipeline health",
    accent: 2,
    metrics: [
      { label: "New", value: "312", delta: "+8.1%", direction: "up" },
      { label: "Conversion", value: "21%", delta: "-1.2%", direction: "down" },
    ],
    trend: spark(12, 15, 14, 18, 17, 20, 19, 24, 23, 26),
  },
  {
    id: "dash-ops",
    kind: "dashboard",
    title: "Operations",
    subtitle: "Live dashboard",
    accent: 3,
    status: "Updated 2m ago",
    metrics: [
      { label: "Jobs active", value: "57" },
      { label: "On schedule", value: "92%", delta: "+4%", direction: "up" },
    ],
    trend: spark(30, 28, 31, 33, 32, 35, 37, 36, 39, 41),
  },
  {
    id: "int-jobtread",
    kind: "integration",
    title: "JobTread",
    subtitle: "Integration",
    accent: 2,
    status: "Synced",
    metrics: [
      { label: "Records synced", value: "1,204", delta: "+46", direction: "up" },
      { label: "Last sync", value: "Just now" },
    ],
    trend: spark(5, 9, 7, 12, 11, 15, 14, 18),
  },
];

export interface CardTemplate {
  key: string;
  label: string;
  description: string;
  build: () => CardData;
}

/** Options surfaced by the "Add card" button. */
export const cardTemplates: CardTemplate[] = [
  {
    key: "kpi",
    label: "User KPI",
    description: "Track a single metric with trend",
    build: () => ({
      id: nextId("kpi"),
      kind: "kpi",
      title: "New KPI",
      subtitle: "Custom metric",
      accent: 1,
      metrics: [
        { label: "Current", value: "—" },
        { label: "Goal", value: "—" },
      ],
      trend: spark(10, 12, 11, 14, 13, 16, 15, 18),
    }),
  },
  {
    key: "dashboard",
    label: "Dashboard",
    description: "A grouped view of several metrics",
    build: () => ({
      id: nextId("dash"),
      kind: "dashboard",
      title: "New Dashboard",
      subtitle: "Live dashboard",
      accent: 3,
      status: "Draft",
      metrics: [
        { label: "Widgets", value: "0" },
        { label: "Shared with", value: "—" },
      ],
      trend: spark(20, 22, 21, 24, 26, 25, 28, 30),
    }),
  },
  {
    key: "integration",
    label: "JobTread Integration",
    description: "Connect an external source",
    build: () => ({
      id: nextId("int"),
      kind: "integration",
      title: "JobTread",
      subtitle: "Integration",
      accent: 2,
      status: "Connecting…",
      metrics: [
        { label: "Status", value: "Pending" },
        { label: "Records", value: "—" },
      ],
      trend: spark(4, 6, 5, 8, 7, 10, 9, 12),
    }),
  },
  {
    key: "custom",
    label: "Blank card",
    description: "Start from an empty card",
    build: () => ({
      id: nextId("custom"),
      kind: "kpi",
      title: "Untitled",
      subtitle: "Custom",
      accent: 1,
      metrics: [{ label: "Metric", value: "—" }],
      trend: spark(10, 11, 10, 12, 11, 13, 12, 14),
    }),
  },
];
