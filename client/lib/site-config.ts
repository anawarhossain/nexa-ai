export const siteConfig = {
  name: "Nexa AI",
  tagline: "The agentic AI platform",
  description:
    "Deploy AI agents that plan, draft, and refine work on their own — starting with content, expanding to your whole workflow.",
  url: "https://nexa-ai.example.com",
  contact: {
    email: "hello@nexa-ai.example.com",
    supportEmail: "support@nexa-ai.example.com",
    address: "House 14, Road 7, Dhanmondi, Dhaka 1209, Bangladesh",
  },
  social: {
    twitter: "https://twitter.com/nexaai",
    github: "https://github.com/nexa-ai",
    linkedin: "https://linkedin.com/company/nexa-ai",
  },
};

// লগড-আউট অবস্থায় দেখা যাবে (ন্যূনতম ৩টি রুট প্রয়োজন — এখানে ৪টি)
export const loggedOutNav = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Modules", href: "/#modules" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/#faq" },
];

// লগড-ইন অবস্থায় দেখা যাবে (ন্যূনতম ৫টি রুট প্রয়োজন — এখানে ৫টি)
export const loggedInNav = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Content Generator", href: "/dashboard/content-generator" },
  { label: "Explore Items", href: "/items" },
  { label: "Add Item", href: "/items/add" },
  { label: "Manage Items", href: "/items/manage" },
];

export const footerLinks = {
  Product: [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Modules", href: "/#modules" },
    { label: "Content Generator", href: "/dashboard/content-generator" },
    { label: "Explore Items", href: "/items" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Help & Support", href: "/help" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};
