export type DashboardItem = {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  icon: "wallet" | "users" | "labs" | "imaging" | "rx" | "cpt" | "billing" | "insurance" | "settings";
  status?: "incomplete" | "complete";
  actionTone?: "blue" | "orange";
  linkLabel?: string;
};

export const DASHBOARD_ITEMS: DashboardItem[] = [
  {
    id: "subscription",
    title: "Purchase subscription",
    description: "Buy a Practice Fusion subscription to unlock clinical workflows for your practice.",
    actionLabel: "Buy a subscription",
    icon: "wallet",
    actionTone: "orange",
  },
  {
    id: "users",
    title: "Add users",
    description: "Invite providers and staff so your team can access charts and schedule.",
    actionLabel: "Add your users",
    icon: "users",
    status: "incomplete",
    linkLabel: "Video tutorial",
  },
  {
    id: "labs",
    title: "Connect to labs",
    description: "Order labs electronically and receive results in the patient chart.",
    actionLabel: "Add your labs",
    icon: "labs",
    status: "incomplete",
    linkLabel: "Video tutorial",
  },
  {
    id: "imaging",
    title: "Connect imaging",
    description: "Connect imaging centers to order studies and review results.",
    actionLabel: "Connect imaging centers",
    icon: "imaging",
    status: "incomplete",
    linkLabel: "Video tutorial",
  },
  {
    id: "erx",
    title: "e-Prescribing",
    description: "Set up e-Prescribing so providers can send prescriptions electronically.",
    actionLabel: "Set up e-Prescribing",
    icon: "rx",
    status: "incomplete",
    linkLabel: "Video tutorial",
  },
  {
    id: "cpt",
    title: "CPT codes license access",
    description: "Review Optum360 CPT code license access for your practice billing workflows.",
    actionLabel: "Learn more",
    icon: "cpt",
  },
  {
    id: "billing",
    title: "Billing dashboard",
    description: "Track claims, patient balances, and payment activity from one place.",
    actionLabel: "Open billing",
    icon: "billing",
    linkLabel: "Video tutorial",
  },
  {
    id: "eligibility",
    title: "Insurance eligibility",
    description: "Check patient eligibility before the visit to reduce claim denials.",
    actionLabel: "Check eligibility",
    icon: "insurance",
  },
  {
    id: "settings",
    title: "Settings",
    description: "Manage personal and practice-level settings.",
    actionLabel: "Open settings",
    icon: "settings",
  },
];
