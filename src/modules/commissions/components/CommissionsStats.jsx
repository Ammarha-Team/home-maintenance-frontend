import { Banknote, CircleCheck, Hourglass } from "lucide-react";

import { commissionsSummary } from "../constants/commissionsData";

// What each tile counts, and the colour it carries. Settled commissions read as
// success and outstanding ones as a warning, the way the table marks its rows.
const TILES = [
  {
    key: "total",
    label: "إجمالي العمولات",
    icon: Banknote,
    tone: "bg-[#EEF3FD] text-[#4775C9]",
  },
  {
    key: "paid",
    label: "العمولات المسددة",
    icon: CircleCheck,
    tone: "bg-[#E7F5EB] text-[#4BA35A]",
  },
  {
    key: "pending",
    label: "العمولات المستحقة",
    icon: Hourglass,
    tone: "bg-[#FBE8E8] text-[#D55A5A]",
  },
];

/**
 * The three figures above the commissions table, counted from the same rows the
 * table lists so the two can never disagree.
 */
export default function CommissionsStats() {
  const summary = commissionsSummary();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {TILES.map((tile) => {
        const Icon = tile.icon;

        return (
          <div
            key={tile.key}
            className="flex items-center gap-3 rounded-[8px] border border-[#E8EAF0] bg-white px-4 py-3 shadow-[0_1px_5px_rgba(0,0,0,0.04)]"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tile.tone}`}
            >
              <Icon size={16} aria-hidden="true" />
            </span>

            <div className="text-right">
              <p className="text-[10px] text-[#9B9B9B]">{tile.label}</p>

              <p className="mt-0.5 text-[14px] font-bold text-[#4A4A4A]">
                {/* A latin figure drifts to the wrong end of an RTL line
                    unless it is marked as the LTR run it is. */}
                <span dir="ltr">{summary[tile.key]}</span>
                <span className="mr-1 text-[9px] font-medium text-[#999]">
                  ج.م
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
