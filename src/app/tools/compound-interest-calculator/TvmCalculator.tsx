"use client";

import { useState, type ReactNode } from "react";
import { annuityFV, annuityPV, effectiveAnnualRate, futureValue, growthSchedule, perpetuityPV, presentValue, type GrowthRow } from "@/lib/calculators/tvm";
import { CalcGrid, DataTable, fmt, fmtPct, Notice, num, NumberField, Segmented, SelectField, Stat, StatGrid, type Column } from "../_components/ui";

type Mode = "fv" | "pv" | "annuity" | "perpetuity";
type Comp = "1" | "2" | "4" | "12" | "365";
const COMPS: { value: Comp; label: string }[] = [
  { value: "1", label: "Annually" },
  { value: "2", label: "Half-yearly" },
  { value: "4", label: "Quarterly" },
  { value: "12", label: "Monthly" },
  { value: "365", label: "Daily" },
];

const GROWTH_COLS: Column<GrowthRow>[] = [
  { key: "year", label: "Year", align: "left", format: (v) => String(v) },
  { key: "opening", label: "Opening balance" },
  { key: "contributions", label: "Contributions" },
  { key: "interest", label: "Interest" },
  { key: "closing", label: "Closing balance" },
];

interface DiscRow { period: number; payment: number; factor: number; pv: number; cumulative: number }
const DISC_COLS: Column<DiscRow>[] = [
  { key: "period", label: "Period", align: "left", format: (v) => String(v) },
  { key: "payment", label: "Cash flow" },
  { key: "factor", label: "Discount factor", format: (v) => fmt(v as number, 4), raw: (v) => Math.round((v as number) * 1e6) / 1e6 },
  { key: "pv", label: "Present value" },
  { key: "cumulative", label: "Cumulative PV" },
];

export default function TvmCalculator() {
  const [mode, setMode] = useState<Mode>("fv");
  // Compound interest / FV
  const [pv, setPv] = useState("10,000");
  const [contrib, setContrib] = useState("");
  // PV of a future sum
  const [fvAmt, setFvAmt] = useState("50,000");
  // Shared
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("10");
  const [comp, setComp] = useState<Comp>("1");
  // Annuity
  const [pmt, setPmt] = useState("1,000");
  const [n, setN] = useState("5");
  const [timing, setTiming] = useState<"end" | "start">("end");
  // Perpetuity
  const [growth, setGrowth] = useState("0");

  const r = num(rate) / 100;
  const m = Number(comp);
  const t = num(years);

  const switchMode = (next: Mode) => {
    setMode(next);
    // Sensible example defaults per mode
    if (next === "fv") { setRate("8"); setYears("10"); }
    if (next === "pv") { setRate("10"); setYears("5"); }
    if (next === "annuity" || next === "perpetuity") setRate("10");
  };

  let body: ReactNode;
  const bad = (msg: string) => <Notice>{msg}</Notice>;

  if (mode === "fv") {
    const P = num(pv) || 0;
    const c = num(contrib) || 0;
    if (!Number.isFinite(r) || r <= -1) body = bad("Enter a valid interest rate.");
    else if (!(t > 0) || t > 200) body = bad("Enter a term between 0 and 200 years.");
    else {
      const fv = futureValue(P, r, t, m) + annuityFV(c, r / m, m * t);
      const paid = P + c * m * t;
      const rows = growthSchedule(P, r, t, m, c);
      body = (
        <>
          <StatGrid>
            <Stat highlight label="Future value" value={fmt(fv)} sub={`After ${fmt(t, t % 1 ? 2 : 0)} years`} />
            <Stat label="Total interest earned" value={fmt(fv - paid)} sub={`On ${fmt(paid)} invested`} />
            <Stat label="Effective annual rate" value={fmtPct(effectiveAnnualRate(r, m), 3)} sub={`${COMPS.find((x) => x.value === comp)!.label} compounding`} />
            <Stat label="Growth factor" value={`${fmt(Math.pow(1 + r / m, m * t), 4)}x`} sub="(1 + r/m)^(m·t)" />
          </StatGrid>
          {rows.length > 0 && <DataTable title="Year-by-year growth" caption="Compound growth schedule" filename="compound-interest" columns={GROWTH_COLS} rows={rows} maxHeight={520} />}
        </>
      );
    }
  } else if (mode === "pv") {
    const F = num(fvAmt) || 0;
    if (!Number.isFinite(r) || r <= -1) body = bad("Enter a valid discount rate.");
    else if (!(t > 0) || t > 200) body = bad("Enter a term between 0 and 200 years.");
    else {
      const p = presentValue(F, r, t, m);
      const rows: DiscRow[] = [];
      for (let y = 1; y <= Math.min(Math.ceil(t), 60); y++) {
        const yrs = Math.min(y, t);
        const f = 1 / Math.pow(1 + r / m, m * yrs);
        rows.push({ period: yrs, payment: F, factor: f, pv: F * f, cumulative: F * f });
      }
      body = (
        <>
          <StatGrid>
            <Stat highlight label="Present value" value={fmt(p)} sub={`Of ${fmt(F)} in ${fmt(t, t % 1 ? 2 : 0)} years`} />
            <Stat label="Discount factor" value={fmt(p / (F || 1), 4)} sub="1 ÷ (1 + r/m)^(m·t)" />
            <Stat label="Discount (time value)" value={fmt(F - p)} sub="Future sum − present value" />
            <Stat label="Effective annual rate" value={fmtPct(effectiveAnnualRate(r, m), 3)} />
          </StatGrid>
          <DataTable
            title="Present value if received in each year"
            caption="Present value by year"
            filename="present-value"
            columns={DISC_COLS.filter((c) => c.key !== "cumulative").map((c) => (c.key === "period" ? { ...c, label: "Years away" } : c.key === "payment" ? { ...c, label: "Future sum" } : c))}
            rows={rows}
          />
        </>
      );
    }
  } else if (mode === "annuity") {
    const C = num(pmt) || 0;
    const periods = Math.round(num(n));
    if (!Number.isFinite(r) || r <= -1) body = bad("Enter a valid rate.");
    else if (!(periods >= 1) || periods > 1000) body = bad("Enter between 1 and 1,000 payments.");
    else {
      const due = timing === "start";
      const pvA = annuityPV(C, r, periods, due);
      const fvA = annuityFV(C, r, periods, due);
      const rows: DiscRow[] = [];
      for (let i = 0, cum = 0; i < periods; i++) {
        const k = due ? i : i + 1;
        const f = 1 / Math.pow(1 + r, k);
        cum += C * f;
        rows.push({ period: k, payment: C, factor: f, pv: C * f, cumulative: cum });
      }
      body = (
        <>
          <StatGrid>
            <Stat highlight label="Present value of annuity" value={fmt(pvA)} sub={due ? "Annuity due (payments in advance)" : "Ordinary annuity (in arrears)"} />
            <Stat label="Future value of annuity" value={fmt(fvA)} sub={`Value at the end of period ${periods}`} />
            <Stat label="Annuity factor" value={fmt(annuityPV(1, r, periods, due), 4)} sub={due ? "1 + AF(n − 1)" : "[1 − (1 + r)^−n] ÷ r"} />
            <Stat label="Total payments" value={fmt(C * periods)} sub={`${periods} × ${fmt(C)}`} />
          </StatGrid>
          <DataTable title="Discounting each payment" caption="Annuity present value workings" filename="annuity" columns={DISC_COLS} rows={rows} maxHeight={520} />
        </>
      );
    }
  } else {
    const C = num(pmt) || 0;
    const g = (num(growth) || 0) / 100;
    const value = perpetuityPV(C, r, g);
    body = !Number.isFinite(value) ? (
      bad("The discount rate must be higher than the growth rate. Otherwise the perpetuity has no finite value.")
    ) : (
      <StatGrid>
        <Stat highlight label={g ? "PV of growing perpetuity" : "PV of perpetuity"} value={fmt(value)} sub={g ? "C₁ ÷ (r − g)" : "C ÷ r"} />
        <Stat label="Perpetuity factor" value={fmt(value / (C || 1), 4)} sub={g ? "1 ÷ (r − g)" : "1 ÷ r"} />
        {g ? (
          <Stat label="Payment in 10 periods" value={fmt(C * Math.pow(1 + g, 9))} sub="C₁ × (1 + g)⁹" />
        ) : (
          <Stat label="If paid in advance" value={fmt(value + C)} sub="C + C ÷ r (first payment today)" />
        )}
        <Stat label="Implied yield" value={fmtPct(C / value + g)} sub={g ? "C₁ ÷ PV + g" : "C ÷ PV"} />
      </StatGrid>
    );
  }

  return (
    <CalcGrid
      inputs={
        <div className="flex flex-col gap-4">
          <SelectField
            label="What do you want to calculate?"
            value={mode}
            onChange={switchMode}
            options={[
              { value: "fv", label: "Compound interest (FV)" },
              { value: "pv", label: "Present value of a sum" },
              { value: "annuity", label: "Annuity" },
              { value: "perpetuity", label: "Perpetuity" },
            ]}
          />
          {mode === "fv" && (
            <>
              <NumberField label="Starting amount (principal)" value={pv} onChange={setPv} />
              <NumberField label="Regular contribution (optional)" value={contrib} onChange={setContrib} placeholder="0" hint="Added at the end of every compounding period." />
            </>
          )}
          {mode === "pv" && <NumberField label="Future amount" value={fvAmt} onChange={setFvAmt} />}
          {(mode === "fv" || mode === "pv") && (
            <>
              <NumberField label={mode === "pv" ? "Discount rate (annual)" : "Interest rate (annual)"} value={rate} onChange={setRate} suffix="%" />
              <div className="grid grid-cols-2 gap-3 items-end">
                <NumberField label="Term" value={years} onChange={setYears} suffix="years" />
                <SelectField label="Compounding" value={comp} onChange={setComp} options={COMPS} />
              </div>
            </>
          )}
          {(mode === "annuity" || mode === "perpetuity") && (
            <>
              <NumberField label={mode === "perpetuity" ? "Payment next period (C₁)" : "Payment per period"} value={pmt} onChange={setPmt} />
              <NumberField label="Discount rate per period" value={rate} onChange={setRate} suffix="%" />
            </>
          )}
          {mode === "annuity" && (
            <>
              <NumberField label="Number of payments" value={n} onChange={setN} />
              <Segmented
                label="Payments made at"
                value={timing}
                onChange={setTiming}
                options={[
                  { value: "end", label: "End (ordinary)" },
                  { value: "start", label: "Start (due)" },
                ]}
              />
            </>
          )}
          {mode === "perpetuity" && <NumberField label="Growth rate per period (optional)" value={growth} onChange={setGrowth} suffix="%" hint="Leave at 0 for a level perpetuity." />}
        </div>
      }
      results={body}
    />
  );
}
