
const m365Features = [
  "Advanced identity and access management with conditional access",
  "Web, mobile, and desktop versions of Word, Excel, PowerPoint, and Outlook",
  "1 TB of cloud storage per user in OneDrive",
  "Microsoft Teams chat, meetings, and collaboration",
  "Device and app management with Intune",
];

export const SERVICE_NAV_ITEMS = [
  { slug: "tizzy-mail", label: "Tizzy Mail", href: "/services/tizzy-mail" },
  { slug: "microsoft-365", label: "Microsoft 365", href: "/services/microsoft-365" },
  { slug: "google-workspace", label: "Google Workspace", href: "/services/google-workspace" },
];

export const SERVICE_CATALOG_BY_SLUG = {
  "microsoft-solution-partner": {
    pageTitle: "Microsoft 365",
    breadcrumbLabel: "Microsoft 365",
    searchPlaceholder: "Search plan",
    intro: {
      headline: [
        "Find the Perfect Microsoft 365 Plan for Your Business"
      ],
      subline:
        "Flexible productivity, collaboration, and security tools designed for modern teams.",
    },
    categories: [
      { id: "with-teams", label: "Plans With Teams" },
      { id: "no-teams", label: "Plans Without Teams" },
      { id: "copilot-teams", label: "Plans With Copilot (Teams)" },
      { id: "copilot-no-teams", label: "Plans With Copilot (No Teams)" },
    ],
    defaultCategoryId: "with-teams",
    planCardHeaderBg: "#1a2744",
    plans: [
      {
        id: "m365-biz-prem",
        categoryId: "with-teams",
        title: "Microsoft 365 Business Premium",
        price: 1830,
        currency: "INR",
        originalPrice: 2287,
        discountPercent: 20,
        periodNote: "user/month, paid yearly",
        gstNote: "GST 18% Additional",
        features: m365Features,
      },
      {
        id: "m365-biz-std",
        categoryId: "with-teams",
        title: "Microsoft 365 Business Standard",
        price: 990,
        currency: "INR",
        periodNote: "user/month, paid yearly",
        gstNote: "GST 18% Additional",
        features: m365Features.slice(0, 4),
      },
      {
        id: "m365-biz-basic",
        categoryId: "no-teams",
        title: "Microsoft 365 Business Basic",
        price: 515,
        currency: "INR",
        originalPrice: 644,
        discountPercent: 20,
        periodNote: "user/month, paid yearly",
        gstNote: "GST 18% Additional",
        features: m365Features.slice(0, 3),
      },
      {
        id: "m365-e5",
        categoryId: "copilot-teams",
        title: "Microsoft 365 E5",
        price: 4200,
        currency: "INR",
        periodNote: "user/month, paid yearly",
        gstNote: "GST 18% Additional",
        features: m365Features,
      },
    ],
  },

  "google-cloud-partner": {
    pageTitle: "Google Workspace",
    breadcrumbLabel: "Google Workspace",
    searchPlaceholder: "Search plan",
    intro: {
      headline: ['Choose the Right Google Workspace Plan'],
      subline: "Simple, secure and powerful tools to Support your business grow",
    },
    categories: [
      { id: "business", label: "Business" },
      { id: "enterprise", label: "Enterprise" },
    ],
    defaultCategoryId: "business",
    planCardHeaderBg: "#1967d2",
    plans: [
      {
        id: "gw-business-starter",
        categoryId: "business",
        title: "Business Starter",
        price: 499,
        currency: "INR",
        periodNote: "user/month, paid yearly",
        gstNote: "GST 18% Additional",
        features: [
          "Custom and secure business email",
          "100 participant video meetings",
          "30 GB pooled storage per user",
        ],
      },
      {
        id: "gw-business-standard",
        categoryId: "business",
        title: "Business Standard",
        price: 999,
        currency: "INR",
        originalPrice: 1199,
        discountPercent: 17,
        periodNote: "user/month, paid yearly",
        gstNote: "GST 18% Additional",
        features: [
          "2 TB pooled storage per user",
          "150 participant video meetings + recording",
          "Shared drives for your team",
        ],
      },
      {
        id: "gw-enterprise-plus",
        categoryId: "enterprise",
        title: "Enterprise Plus",
        price: 2499,
        currency: "INR",
        periodNote: "user/month, paid yearly",
        gstNote: "GST 18% Additional",
        features: [
          "Advanced endpoint management",
          "Enhanced security and compliance controls",
          "Noise cancellation and live streaming in Meet",
        ],
      },
    ],
  },

  "tizzy": {
    pageTitle: "Tizzy Mail",
    breadcrumbLabel: "Tizzy Mail",
    searchPlaceholder: "Search plan",
    intro: {
      headline: [
        "Tizzy® Mail INDIA",
        "Cloud Business Email Hosting Plans on Amazon AWS",
      ],
      subline: "AI & Machine Learning–based Email Security with Tizzy Mail Enterprise & Corporate Plans.",
    },
    categories: [
      { id: "standard", label: "Standard" },
      { id: "premium", label: "Premium" },
    ],
    defaultCategoryId: "standard",
    planCardHeaderBg: "#0d5c2e",
    plans: [
      {
        id: "tizzy-mailbox-5",
        categoryId: "standard",
        title: "Mailbox Pack (5 users)",
        price: 299,
        currency: "INR",
        periodNote: "per month",
        gstNote: "GST as applicable",
        features: [
          "5 mailboxes on your domain",
          "Webmail and mobile sync",
          "Basic spam filtering",
        ],
      },
      {
        id: "tizzy-mailbox-25",
        categoryId: "premium",
        title: "Mailbox Pack (25 users)",
        price: 1299,
        currency: "INR",
        originalPrice: 1499,
        discountPercent: 13,
        periodNote: "per month",
        gstNote: "GST as applicable",
        features: [
          "25 mailboxes on your domain",
          "Priority support",
          "Advanced anti-spam and archiving",
        ],
      },
    ],
  },
};

export function getValidServiceSlugs() {
  return Object.keys(SERVICE_CATALOG_BY_SLUG);
}

export function isValidServiceSlug(slug) {
  return typeof slug === "string" && Boolean(SERVICE_CATALOG_BY_SLUG[slug]);
}

export function getServiceCatalogConfig(slug) {
  return SERVICE_CATALOG_BY_SLUG[slug] ?? null;
}
