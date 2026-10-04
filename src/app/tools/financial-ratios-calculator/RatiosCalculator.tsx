"use client";

import { useMemo, useState } from "react";
import { computeRatios, formatRatio, type Ratio, type RatioGroup, type RatioInputs } from "@/lib/calculators/ratios";
import { CalcGrid, DataTable, num, NumberField, Panel, type Column } from "../_components/ui";

type Key = keyof RatioInputs;

const FIELDS: { section: string; items: { key: Key; label: string; hint?: string }[] }[] = [
  {
    section: "Income statement",
    items: [
      { key: "revenue", label: "Revenue" },
      { key: "costOfSales", label: "Cost of sales" },
      { key: "operatingProfit", label: "Operating profit (PBIT)" },
      { key: "interestExpense", label: "Interest expense" },
      { key: "netProfit", label: "Profit after tax" },
    ],
  },
  {
    section: "Statement of financial position",
    items: [
      { key: "inventory", label: "Inventory" },
      { key: "receivables", label: "Trade receivables" },
      { key: "cash", label: "Cash & equivalents" },
      { key: "currentAssets", label: "Total current assets" },
      { key: "payables", label: "Trade payables" },
      { key: "currentLiabilities", label: "Total current liabilities" },
      { key: "totalAssets", label: "Total assets" },
      { key: "equity", label: "Total equity" },
      { key: "longTermDebt", label: "Non-current borrowings" },
    ],
  },
];

const DEFAULTS: Record<Key, string> = {
  revenue: "1,000,000",
  costOfSales: "600,000",
  operatingProfit: "150,000",
  interestExpense: "30,000",
  netProfit: "90,000",
  inventory: "120,000",
  receivables: "100,000",
  cash: "30,000",
  currentAssets: "250,000",
  payables: "60,000",
  currentLiabilities: "125,000",
  totalAssets: "875,000",
  equity: "500,000",
  longTermDebt: "250,000",
};

const GROUPS: RatioGroup[] = ["Liquidity", "Profitability", "Efficiency", "Gearing"];

type Row = Ratio & { display: string };
const COLUMNS: Column<Row>[] = [
  { key: "group", label: "Group", align: "left" },
  { key: "name", label: "Ratio", align: "left" },
  { key: "display", label: "Result" },
  { key: "formula", label: "Formula", align: "left" },
];

export default function RatiosCalculator() {
  const [v, setV] = useState(DEFAULTS);
  const ratios = useMemo(() => {
    const inputs = Object.fromEntries(Object.entries(v).map(([k, s]) => [k, num(s) || 0])) as unknown as RatioInputs;
    return computeRatios(inputs).map((r) => ({ ...r, display: formatRatio(r) }));
  }, [v]);

  return (
    <div className="flex flex-col gap-5">
      <CalcGrid
        inputs={
          <div className="flex flex-col gap-6">
            {FIELDS.map((g) => (
              <fieldset key={g.section}>
                <legend className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--green)" }}>{g.section}</legend>
                <div className="grid grid-cols-2 gap-3 items-end">
                  {g.items.map((f) => (
                    <NumberField key={f.key} label={f.label} value={v[f.key]} onChange={(s) => setV((o) => ({ ...o, [f.key]: s }))} />
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        }
        results={GROUPS.map((g) => (
          <Panel key={g} title={`${g} ratios`}>
            <ul className="flex flex-col divide-y" style={{ borderColor: "var(--border)" }}>
              {ratios
                .filter((r) => r.group === g)
                .map((r) => (
                  <li key={r.key} className="py-3 first:pt-0 last:pb-0" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-bold text-[15px]" style={{ color: "var(--text-1)" }}>{r.name}</span>
                      <span className="font-bold text-lg shrink-0" style={{ color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif", fontVariantNumeric: "tabular-nums" }}>
                        {r.display}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{r.formula}</p>
                    <p className="text-sm mt-1.5" style={{ color: "var(--text-2)", lineHeight: 1.55 }}>{r.interpretation}</p>
                  </li>
                ))}
            </ul>
          </Panel>
        ))}
      />
      <DataTable title="Ratio summary" caption="All ratios" filename="financial-ratios" columns={COLUMNS} rows={ratios} />
    </div>
  );
}
