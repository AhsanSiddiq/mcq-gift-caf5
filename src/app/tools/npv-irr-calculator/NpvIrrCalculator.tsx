"use client";

import { useRef, useState } from "react";
import { irr, mirr, npv, npvSchedule, payback, type NpvRow } from "@/lib/calculators/npv";
import { AddRowButton, CalcGrid, DataTable, fmt, fmtPct, Notice, num, NumberField, RemoveButton, Stat, StatGrid, type Column } from "../_components/ui";

const PRESETS: { label: string; rate: string; flows: string[] }[] = [
  { label: "Standard project", rate: "10", flows: ["-100,000", "30,000", "40,000", "50,000", "20,000"] },
  { label: "Multiple IRRs", rate: "15", flows: ["-100", "230", "-132"] },
  { label: "No IRR", rate: "10", flows: ["-1,000", "-500", "-200"] },
];

const COLUMNS: Column<NpvRow>[] = [
  { key: "year", label: "Year", align: "left", format: (v) => String(v) },
  { key: "cashFlow", label: "Cash flow" },
  { key: "factor", label: "Discount factor", format: (v) => fmt(v as number, 4), raw: (v) => Math.round((v as number) * 1e6) / 1e6 },
  { key: "presentValue", label: "Present value" },
  { key: "cumulativePV", label: "Cumulative PV" },
];

const yearsLabel = (y: number | null) => (y === null ? "Never" : `${fmt(y, 2)} years`);

export default function NpvIrrCalculator() {
  const nextId = useRef(100);
  const [rate, setRate] = useState(PRESETS[0].rate);
  const [flows, setFlows] = useState(() => PRESETS[0].flows.map((v, i) => ({ id: i, value: v })));

  const load = (p: (typeof PRESETS)[number]) => {
    setRate(p.rate);
    setFlows(p.flows.map((v) => ({ id: nextId.current++, value: v })));
  };

  const r = num(rate) / 100;
  const values = flows.map((f) => num(f.value) || 0);
  const res = (() => {
    if (!Number.isFinite(r) || r <= -1) return null;
    const outlay = values[0] < 0 ? -values[0] : 0;
    const pvLater = npv(r, values) - values[0];
    return {
      npv: npv(r, values),
      irr: irr(values),
      mirr: mirr(values, r, r),
      pi: outlay > 0 ? pvLater / outlay : null,
      payback: payback(values),
      discountedPayback: payback(values, r),
      rows: npvSchedule(r, values),
    };
  })();

  return (
    <CalcGrid
      inputs={
        <div className="flex flex-col gap-4">
          <NumberField label="Discount rate (cost of capital)" value={rate} onChange={setRate} suffix="%" />
          <div>
            <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--text-2)" }} id="cf-label">
              Cash flows <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(outflows negative)</span>
            </p>
            <ol className="flex flex-col gap-2" aria-labelledby="cf-label">
              {flows.map((f, i) => (
                <li key={f.id} className="flex items-end gap-2">
                  <div className="flex-1 min-w-0">
                    <NumberField
                      label={i === 0 ? "Year 0 (today)" : `Year ${i}`}
                      value={f.value}
                      onChange={(v) => setFlows((fs) => fs.map((x) => (x.id === f.id ? { ...x, value: v } : x)))}
                    />
                  </div>
                  <RemoveButton
                    label={`Remove year ${i}`}
                    disabled={flows.length <= 2}
                    onClick={() => setFlows((fs) => fs.filter((x) => x.id !== f.id))}
                  />
                </li>
              ))}
            </ol>
          </div>
          <AddRowButton onClick={() => setFlows((fs) => [...fs, { id: nextId.current++, value: "" }])}>Add year {flows.length}</AddRowButton>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-3)" }}>Load an example</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button key={p.label} type="button" onClick={() => load(p)} className="rounded-full px-3.5 py-2 text-xs font-bold cursor-pointer" style={{ background: "var(--bg-3)", color: "var(--text-2)", border: "1px solid var(--border)" }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      results={
        !res ? (
          <Notice>Enter a discount rate greater than −100%.</Notice>
        ) : (
          <>
            <StatGrid>
              <Stat
                highlight
                label="Net present value"
                value={fmt(res.npv)}
                sub={res.npv > 0 ? "Positive: accept, it adds value at this rate" : res.npv < 0 ? "Negative: reject at this cost of capital" : "Zero: breaks even at this rate"}
              />
              <Stat
                label="IRR"
                value={res.irr.irr === null ? "None" : res.irr.roots.length > 1 ? res.irr.roots.map((x) => fmtPct(x)).join(" & ") : fmtPct(res.irr.irr)}
                sub={res.irr.irr === null ? "No rate makes NPV zero" : res.irr.roots.length > 1 ? "Multiple IRRs" : res.irr.irr > r ? "Above cost of capital" : "Below cost of capital"}
              />
              <Stat label="MIRR" value={res.mirr === null ? "–" : fmtPct(res.mirr)} sub="Reinvested at the discount rate" />
              <Stat label="Profitability index" value={res.pi === null ? "–" : fmt(res.pi, 3)} sub="PV of later flows ÷ initial outlay" />
              <Stat label="Payback" value={yearsLabel(res.payback)} sub="Undiscounted" />
              <Stat label="Discounted payback" value={yearsLabel(res.discountedPayback)} sub={`At ${fmt(num(rate), 2)}%`} />
            </StatGrid>
            {res.irr.message && <Notice tone={res.irr.irr === null ? "error" : "info"}>{res.irr.message}</Notice>}
            <DataTable title="Discounted cash flow table" caption="NPV workings" filename="npv-workings" columns={COLUMNS} rows={res.rows} footer={{ year: "NPV", presentValue: fmt(res.npv) }} />
          </>
        )
      }
    />
  );
}
