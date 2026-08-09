import {
  Banknote,
  LayoutGrid,
  ReceiptText,
  ShoppingCart,
  Users,
  Wrench,
} from "lucide-react";

// Admin console paths
export const ADMIN_ROUTES = {
  dashboard: "/admin",
  technicians: "/admin/technicians",
  orders: "/admin/orders",
  commissions: "/admin/commissions",
    customers: "/admin/customers",
  earnings: "/admin/earnings",
  settings: "/admin/settings",
};

/**
 * Sidebar items
 */
export const ADMIN_NAV_ITEMS = [
  {
    key: "dashboard",
    label: "لوحة التحكم",
    icon: LayoutGrid,
    to: ADMIN_ROUTES.dashboard,
    ready: true,
  },

  {
    key: "technicians",
    label: "الفنين",
    icon: Wrench,
    to: ADMIN_ROUTES.technicians,
    ready: true,
  },


  {
    key: "orders",
    label: "الطلبات",
    icon: ShoppingCart,
    to: ADMIN_ROUTES.orders,
    ready: true,
  },

  {
    key: "commissions",
    label: "العمولات",
    icon: Banknote,
    to: ADMIN_ROUTES.commissions,
    ready: true,
  },

    {
    key: "customers",
    label: "العملاء",
    icon: Users,
    to: ADMIN_ROUTES.customers,
    ready: true,
  },

  {
    key: "earnings",
    label: "الأرباح",
    icon: ReceiptText,
    to: ADMIN_ROUTES.earnings,
    ready: true,
  },
];