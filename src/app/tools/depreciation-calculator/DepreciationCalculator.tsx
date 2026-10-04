"use client";

import { useMemo, useState } from "react";
import { depreciationSchedule, type DepreciationMethod, type DepreciationRow } from "@/lib/calculators/depreciation";
import { CalcGrid, DataTable, fmt, fmtPct, Notice, num, NumberField, Segmented, Stat, StatGrid, type Column } from "../_components/ui";

const METHODS: { value: DepreciationMethod; label: string }[] = [
  { value: "straight-line", label: "Straight‑line" },
  { value: "reducing-balance", label: "Reducing balance" },
  { value: "sum-of-years", label: "Sum of years" },
];

const COLUMNS: Column<DepreciationRow>[] = [
  { key: "year", label: "Year", align: "left", format: (v) => String(v) },
  { key: "opening", label: "Opening NBV" },
  { key: "depreciation", label: "Depreciation" },
  { key: "accumulated", label: "Accumulated" },
  { key: "closing", label: "Closing NBV" },
];

export default function DepreciationCalculator() {
  const [method, setMethod] = useState<DepreciationMethod>("straight-line");
  const [cost, setCost] = useState("50,000");
  const [residual, setResidual] = useState("5,000");
  const [life, setLife] = useState("5");
  const [rate, setRate] = useState("");

  const result = useMemo(() => {
    const r = num(rate);
    return depreciationSchedule(method, num(cost), num(residual) || 0, num(life), Number.isFinite(r) && r > 0 ? r / 100 : undefined);
  }, [method, cost, residual, life, rate]);

  const first = result.rows[0];
  const last = result.rows[result.rows.length - 1];
  const methodLabel = METHODS.find((m) => m.value === method)!.label;

  return (
    <CalcGrid
      inputs={
        <div className="flex flex-col gap-4">
          <Segmented label="Method" value={method} onChange={setMethod} options={METHODS} />
          <NumberField label="Cost of the asset" value={cost} onChange={setCost} hint="Purchase price plus costs to bring it into use." />
          <NumberField label="Residual (salvage) value" value={residual} onChange={setResidual} hint="Expected disposal proceeds at the end of its life." />
          <NumberField label="Useful life" value={life} onChange={setLife} suffix="years" />
          {method === "reducing-balance" && (
            <NumberField
              label="Depreciation rate (optional)"
              value={rate}
              onChange={setRate}
              suffix="%"
              placeholder={result.rate ? (result.rate * 100).toFixed(2) : "e.g. 20"}
              hint="Leave blank to use the rate that brings cost down to residual value exactly by the end of the life. Enter 40 for double-declining on a 5-year asset."
            />
          )}
        </div>
      }
      results={
        result.error ? (
          <Notice>{result.error}</Notice>
        ) : (
          <>
            <StatGrid>
              <Stat highlight label={method === "straight-line" ? "Annual depreciation" : "Year 1 depreciation"} value={fmt(first?.depreciation)} sub={methodLabel} />
              <Stat label="Depreciable amount" value={fmt(result.depreciableAmount)} sub="Cost − residual value" />
              {method === "reducing-balance" ? (
                <Stat label="Rate applied" value={fmtPct(result.rate)} sub={rate.trim() ? "Your rate" : "1 − (RV ÷ cost)^(1/n)"} />
              ) : (
                <Stat label="Rate (of depreciable amount)" value={method === "straight-line" ? fmtPct(1 / result.rows.length) : fmtPct(result.rows.length / ((result.rows.length * (result.rows.length + 1)) / 2))} sub={method === "straight-line" ? "1 ÷ useful life" : `Year 1: ${result.rows.length} ÷ ${(result.rows.length * (result.rows.length + 1)) / 2}`} />
              )}
              <Stat label="Total depreciation" value={fmt(result.totalDepreciation)} sub={`Over ${result.rows.length} years`} />
              <Stat label="Final carrying amount" value={fmt(last?.closing)} sub={last && Math.abs(last.closing - (num(residual) || 0)) > 0.005 ? "Above residual: rate too low to fully depreciate" : "Equals residual value"} />
              <Stat label="Final year charge" value={fmt(last?.depreciation)} sub={`Year ${last?.year}`} />
            </StatGrid>
            <DataTable
              title="Depreciation schedule"
              caption={`${methodLabel} depreciation schedule`}
              filename={`depreciation-${method}`}
              columns={COLUMNS}
              rows={result.rows}
              footer={{ year: "Total", depreciation: fmt(result.totalDepreciation) }}
            />
          </>
        )
      }
    />
  );
}
