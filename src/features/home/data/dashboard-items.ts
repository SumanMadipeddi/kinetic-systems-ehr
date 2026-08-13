export type DashboardIconId =
  | "wallet"
  | "users"
  | "labs"
  | "imaging"
  | "rx"
  | "cpt"
  | "billing"
  | "insurance"
  | "settings"
  | "book"
  | "messages"
  | "templates"
  | "marketplace"
  | "payments"
  | "telehealth";

export type DashboardFooterBrand = "veradigm" | "trustcommerce" | "updox";

export type DashboardItem = {
  id: string;
  title: string;
  description: string;
  /** Omit for informational cards with no CTA button */
  actionLabel?: string;
  icon: DashboardIconId;
  /** Where the icon renders — title row (default) or bottom-right decorative */
  iconPlacement?: "title" | "footer" | "none";
  status?: "incomplete" | "complete";
  actionTone?: "blue" | "orange";
  linkLabel?: string;
  footerBrand?: DashboardFooterBrand;
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
    status: "incomplete"
  },
  {
    id: "labs",
    title: "Connect to labs",
    description: "Send orders and receive results in your EHR",
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
  {
    id: "customer-support",
    title: "Customer support",
    description: "Learn about popular topics, and find resources for your practice",
    icon: "book",
    iconPlacement: "footer",
  },
  {
    id: "direct-messaging",
    title: "Set up direct messaging",
    description: "Register your unique Direct address",
    actionLabel: "Set up Direct messaging",
    icon: "messages",
    status: "incomplete",
  },
  {
    id: "template-community",
    title: "Template community",
    description: "Find, rate, and share charting templates with the community",
    icon: "templates",
    iconPlacement: "footer",
  },
  {
    id: "pf-billing-services",
    title: "Practice Fusion Billing Services",
    description:
      "Optimize your practice's revenue and ease medical billing tasks—upgrade your subscription today.",
    actionLabel: "Learn more",
    icon: "billing",
    iconPlacement: "none",
    status: "incomplete",
  },
  {
    id: "veradigm-programs",
    title: "Veradigm programs",
    description: "Connect to a range of programs for your EHR through the Veradigm portal",
    icon: "marketplace",
    iconPlacement: "none",
    footerBrand: "veradigm",
  },
  {
    id: "app-marketplace",
    title: "App Marketplace",
    description: "Add new apps, and manage existing authorized apps",
    actionLabel: "Open App Marketplace",
    icon: "marketplace",
    iconPlacement: "none",
  },
  {
    id: "patient-payments",
    title: "Integrated Patient Payment Solution",
    description:
      "Simplify payment collection with TrustCommerce for a smooth, secure, and integrated experience.",
    icon: "payments",
    iconPlacement: "none",
    footerBrand: "trustcommerce",
  },
  {
    id: "telehealth",
    title: "Telehealth",
    description: "Register with Updox for an integrated Telehealth solution.",
    icon: "telehealth",
    iconPlacement: "none",
    footerBrand: "updox",
  },
];
