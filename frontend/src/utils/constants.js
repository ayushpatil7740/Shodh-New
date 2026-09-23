export const CATEGORIES = [
  'Electronics',
  'Documents & IDs',
  'Wallets & Bags',
  'Keys',
  'Clothing & Accessories',
  'Books & Stationery',
  'Jewelry & Watches',
  'Other',
];

export const CATEGORY_ICONS = {
  Electronics: 'Laptop',
  'Documents & IDs': 'FileText',
  'Wallets & Bags': 'Briefcase',
  Keys: 'Key',
  'Clothing & Accessories': 'Shirt',
  'Books & Stationery': 'BookOpen',
  'Jewelry & Watches': 'Watch',
  Other: 'HelpCircle',
};

export const ITEM_STATUSES = [
  { value: 'active', label: 'Active / Open', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'claimed', label: 'Claimed', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'resolved', label: 'Resolved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'handed_over', label: 'Handed Over', color: 'bg-teal-50 text-teal-700 border-teal-200' },
];

export const DEMO_ACCOUNTS = {
  admin: {
    email: 'admin@shodh.org',
    password: 'adminpassword123',
    label: 'Campus Admin (Security Desk)',
    badge: 'Admin Panel & Moderation Access',
  },
  user1: {
    email: 'aarav@shodh.org',
    password: 'userpassword123',
    label: 'Aarav Sharma (Student)',
    badge: 'Lost MacBook & Resolved Sony Headphones',
  },
  user2: {
    email: 'priya@shodh.org',
    password: 'userpassword123',
    label: 'Priya Patel (Student)',
    badge: 'Found AirPods & Lost Calculator',
  },
};
