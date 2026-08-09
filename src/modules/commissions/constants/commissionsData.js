// The commissions the console lists, and the figures summarised above them.
//
// The rows sat inside CommissionsTable, which left the summary above the table
// with nowhere to read them from. They live here so the table and the summary
// count the same commissions and cannot drift apart.
export const COMMISSIONS = [
  {
    id: 1,
    week: "الأسبوع 42",
    date: "15 - 21 أغسطس",
    technician: "أحمد محمود",
    code: "#TECH-001",
    initials: "أ.م",
    earnings: "1,250",
    commission: "187.5",
    dueDate: "25 أغسطس 2023",
    status: "paid",
  },
  {
    id: 2,
    week: "الأسبوع 42",
    date: "15 - 21 أغسطس",
    technician: "أحمد محمود",
    code: "#TECH-001",
    initials: "أ.م",
    earnings: "1,250",
    commission: "187.5",
    dueDate: "25 أغسطس 2023",
    status: "paid",
  },
  {
    id: 3,
    week: "الأسبوع 42",
    date: "15 - 21 أغسطس",
    technician: "أحمد محمود",
    code: "#TECH-001",
    initials: "أ.م",
    earnings: "1,250",
    commission: "187.5",
    dueDate: "--------",
    status: "pending",
  },
  {
    id: 4,
    week: "الأسبوع 42",
    date: "15 - 21 أغسطس",
    technician: "أحمد محمود",
    code: "#TECH-001",
    initials: "أ.م",
    earnings: "1,250",
    commission: "187.5",
    dueDate: "--------",
    status: "pending",
  },
];

// The figures carry thousands separators for display, so they are read back as
// numbers before anything is added up.
const amount = (value) => Number(String(value).replace(/,/g, "")) || 0;

const money = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

/** Totals for the three tiles above the table. */
export const commissionsSummary = (rows = COMMISSIONS) => {
  const total = rows.reduce((sum, row) => sum + amount(row.commission), 0);

  const paid = rows
    .filter((row) => row.status === "paid")
    .reduce((sum, row) => sum + amount(row.commission), 0);

  return {
    total: money.format(total),
    paid: money.format(paid),
    pending: money.format(total - paid),
  };
};
