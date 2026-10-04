"use client";

import { useMemo, useState } from "react";
import { cvp, cvpTable, type CvpRow } from "@/lib/calculators/cvp";
import { CalcGrid, DataTable, fmt, fmtPct, Notice, num, NumberField, Stat, StatGrid, type Column } from "../_components/ui";

const COLUMNS: Column<CvpRow>[] = [
  { key: "units", label: "Units sold", align: "left", format: (v) => fmt(v as number, 0) },
  { key: "revenue", label: "Revenue" },
  { key: "variableCosts", label: "Variable costs" },
  { key: "fixedCosts", label: "Fixed costs" },
  { key: "totalCosts", label: "Total costs" },
  { key: "profit", label: "Profit / (loss)", format: (v) => ((v as number) < 0 ? `(${fmt(-(v as number))})` : fmt(v as number)) },
];

export default function BreakEvenCalculator() {
  const [price, setPrice] = useState("25");
  const [vc, setVc] = useState("15");
  const [fixed, setFixed] = useState("60,000");
  const [budget, setBudget] = useState("8,000");
  const [target, setTarget] = useState("30,000");

  const input = useMemo(
    () => ({ price: num(price), variableCost: num(vc), fixedCosts: num(fixed), budgetUnits: num(budget) || 0, targetProfit: num(target) || 0 }),
    [price, vc, fixed, budget, target],
  );
  const r = useMemo(() => cvp(input), [input]);
  const table = useMemo(() => {
    if (r.error) return [];
    const max = Math.max(input.budgetUnits, r.targetUnits, r.breakEvenUnits) * 1.25 || 10;
    const raw = max / 10;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
    return cvpTable(input, step * 10, 10);
  }, [input, r]);

  return (
    <CalcGrid
      inputs={
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 items-end">
            <NumberField label="Selling price per unit" value={price} onChange={setPrice} />
            <NumberField label="Variable cost per unit" value={vc} onChange={setVc} />
          </div>
          <NumberField label="Total fixed costs (per period)" value={fixed} onChange={setFixed} />
          <NumberField label="Budgeted sales" value={budget} onChange={setBudget} suffix="units" hint="Used for margin of safety and budgeted profit." />
          <NumberField label="Target profit" value={target} onChange={setTarget} hint="Volume needed to earn this profit after fixed costs." />
        </div>
      }
      results={
        r.error ? (
          <Notice>{r.error}</Notice>
        ) : (
          <>
            <StatGrid>
              <Stat highlight label="Break-even point" value={`${fmt(r.breakEvenUnits, 0)} units`} sub={`Exact: ${fmt(r.breakEvenUnits, 2)} units`} />
              <Stat label="Break-even revenue" value={fmt(r.breakEvenRevenue)} sub="Fixed costs ÷ C/S ratio" />
              <Stat label="Contribution per unit" value={fmt(r.contributionPerUnit)} sub="Price − variable cost" />
              <Stat label="C/S (CM) ratio" value={fmtPct(r.cmRatio)} sub="Contribution ÷ sales" />
              <Stat
                label="Margin of safety"
                value={fmtPct(r.marginOfSafetyPct, 1)}
                sub={`${fmt(r.marginOfSafetyUnits, 0)} units · ${fmt(r.marginOfSafetyRevenue, 0)} revenue`}
              />
              <Stat label="Budgeted profit" value={r.budgetProfit < 0 ? `(${fmt(-r.budgetProfit)})` : fmt(r.budgetProfit)} sub={`At ${fmt(input.budgetUnits, 0)} units`} />
              <Stat label="Units for target profit" value={fmt(Math.ceil(r.targetUnits - 1e-9), 0)} sub={`Revenue ${fmt(r.targetRevenue, 0)}`} />
              <Stat label="Operating leverage" value={r.operatingLeverage ? `${fmt(r.operatingLeverage, 2)}x` : "–"} sub="Contribution ÷ profit" />
            </StatGrid>
            {r.marginOfSafetyUnits < 0 && <Notice tone="info">Budgeted sales are below break-even, so the plan makes a loss. The margin of safety is negative.</Notice>}
            <DataTable
              title="Profit at different volumes"
              caption="Cost-volume-profit table"
              filename="break-even-table"
              columns={COLUMNS}
              rows={table}
              rowHighlight={(row) => row === table.find((x) => x.profit >= 0)}
            />
          </>
        )
      }
    />
  );
}
