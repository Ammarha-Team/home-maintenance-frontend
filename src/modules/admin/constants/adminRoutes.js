import {
  Banknote,
  LayoutGrid,
  ReceiptText,
  ShoppingCart,
  Users,
  Wrench,
} from "lucide-react";


export const ADMIN_ROUTES = {
  dashboard: "/admin",
  technicians: "/admin/technicians",
  orders: "/admin/orders",
  commissions: "/admin/commissions",
  customers: "/admin/customers",
  profits: "/admin/profits",
  settings: "/admin/settings",
};

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
    label: "الفنيين",
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
    key: "profits",
    label: "الأرباح",
    icon: ReceiptText,
    to: ADMIN_ROUTES.profits,
    ready: true,
  },
];