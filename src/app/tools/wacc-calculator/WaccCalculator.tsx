"use client";

import { useMemo, useState, type ReactNode } from "react";
import { capm, wacc } from "@/lib/calculators/wacc";
import { CalcGrid, DataTable, fmt, fmtPct, Notice, num, NumberField, Stat, StatGrid, Toggle, type Column } from "../_components/ui";

interface Row { source: string; value: number; weight: number; cost: number; weighted: number }

const COLUMNS: Column<Row>[] = [
  { key: "source", label: "Source of finance", align: "left" },
  { key: "value", label: "Market value", format: (v) => fmt(v as number, 0) },
  { key: "weight", label: "Weight", format: (v) => fmtPct(v as number, 2) },
  { key: "cost", label: "Cost (after tax)", format: (v) => fmtPct(v as number, 2) },
  { key: "weighted", label: "Weighted cost", format: (v) => fmtPct(v as number, 3) },
];

const Sub = ({ children }: { children: ReactNode }) => (
  <p className="text-xs font-bold uppercase tracking-wider -mb-1" style={{ color: "var(--green)" }}>{children}</p>
);

export default function WaccCalculator() {
  const [E, setE] = useState("6,000,000");
  const [ke, setKe] = useState("12");
  const [useCapm, setUseCapm] = useState(false);
  const [rf, setRf] = useState("4");
  const [beta, setBeta] = useState("1.2");
  const [rm, setRm] = useState("9");
  const [D, setD] = useState("4,000,000");
  const [kd, setKd] = useState("8");
  const [tax, setTax] = useState("30");
  const [usePref, setUsePref] = useState(false);
  const [P, setP] = useState("1,000,000");
  const [kp, setKp] = useState("9");

  const keUsed = useCapm ? capm(num(rf) / 100, num(beta), num(rm) / 100) : num(ke) / 100;
  const res = useMemo(
    () =>
      wacc({
        equityValue: num(E) || 0,
        debtValue: num(D) || 0,
        costOfEquity: keUsed,
        costOfDebt: (num(kd) || 0) / 100,
        taxRate: (num(tax) || 0) / 100,
        prefValue: usePref ? num(P) || 0 : 0,
        costOfPref: usePref ? (num(kp) || 0) / 100 : 0,
      }),
    [E, D, keUsed, kd, tax, usePref, P, kp],
  );

  const rows: Row[] = res.error
    ? []
    : [
        { source: "Equity", value: num(E) || 0, weight: res.weightEquity, cost: keUsed, weighted: res.weightEquity * keUsed },
        { source: "Debt", value: num(D) || 0, weight: res.weightDebt, cost: res.afterTaxCostOfDebt, weighted: res.weightDebt * res.afterTaxCostOfDebt },
        ...(usePref ? [{ source: "Preference shares", value: num(P) || 0, weight: res.weightPref, cost: (num(kp) || 0) / 100, weighted: res.weightPref * ((num(kp) || 0) / 100) }] : []),
      ];

  return (
    <CalcGrid
      inputs={
        <div className="flex flex-col gap-4">
          <Sub>Equity</Sub>
          <NumberField label="Market value of equity (E)" value={E} onChange={setE} hint="Shares in issue × share price (ex-dividend)." />
          <Toggle label="Estimate cost of equity with CAPM" checked={useCapm} onChange={setUseCapm} />
          {useCapm ? (
            <div className="grid grid-cols-3 gap-2 items-end">
              <NumberField label="Risk-free (Rf)" value={rf} onChange={setRf} suffix="%" />
              <NumberField label="Beta (β)" value={beta} onChange={setBeta} />
              <NumberField label="Market (Rm)" value={rm} onChange={setRm} suffix="%" />
            </div>
          ) : (
            <NumberField label="Cost of equity (Ke)" value={ke} onChange={setKe} suffix="%" />
          )}
          <Sub>Debt</Sub>
          <NumberField label="Market value of debt (D)" value={D} onChange={setD} hint="Market price of bonds/loan notes, not nominal value." />
          <div className="grid grid-cols-2 gap-3 items-end">
            <NumberField label="Pre-tax cost of debt (Kd)" value={kd} onChange={setKd} suffix="%" />
            <NumberField label="Corporate tax rate" value={tax} onChange={setTax} suffix="%" />
          </div>
          <Toggle label="Include preference shares" checked={usePref} onChange={setUsePref} hint="Preference dividends get no tax relief." />
          {usePref && (
            <div className="grid grid-cols-2 gap-3 items-end">
              <NumberField label="Market value" value={P} onChange={setP} />
              <NumberField label="Cost (Kp)" value={kp} onChange={setKp} suffix="%" />
            </div>
          )}
        </div>
      }
      results={
        res.error || !Number.isFinite(keUsed) ? (
          <Notice>{res.error ?? "Enter a cost of equity."}</Notice>
        ) : (
          <>
            <StatGrid>
              <Stat highlight label="WACC" value={fmtPct(res.wacc)} sub="Discount rate for average-risk projects" />
              <Stat label="Cost of equity used" value={fmtPct(keUsed)} sub={useCapm ? `${fmt(num(rf), 2)}% + ${fmt(num(beta), 2)} × (${fmt(num(rm), 2)}% − ${fmt(num(rf), 2)}%)` : "Entered directly"} />
              <Stat label="After-tax cost of debt" value={fmtPct(res.afterTaxCostOfDebt)} sub={`${fmt(num(kd), 2)}% × (1 − ${fmt(num(tax), 0)}%)`} />
              <Stat label="Weight of equity" value={fmtPct(res.weightEquity, 1)} sub="E ÷ V" />
              <Stat label="Weight of debt" value={fmtPct(res.weightDebt, 1)} sub="D ÷ V" />
              <Stat label="Total value (V)" value={fmt(res.totalValue, 0)} sub={usePref ? "E + D + P" : "E + D"} />
            </StatGrid>
            <DataTable
              title="WACC workings"
              caption="Weighted average cost of capital workings"
              filename="wacc-workings"
              columns={COLUMNS}
              rows={rows}
              footer={{ source: "Total", value: fmt(res.totalValue, 0), weight: "100.00%", weighted: fmtPct(res.wacc, 3) }}
            />
          </>
        )
      }
    />
  );
}
