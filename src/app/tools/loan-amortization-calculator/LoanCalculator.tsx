"use client";

import { useMemo, useState } from "react";
import { amortise, type AmortisationRow } from "@/lib/calculators/loan";
import { CalcGrid, DataTable, fmt, fmtPct, Notice, num, NumberField, SelectField, Stat, StatGrid, Toggle, type Column } from "../_components/ui";

type Freq = "12" | "4" | "2" | "1";
const FREQS: { value: Freq; label: string }[] = [
  { value: "12", label: "Monthly" },
  { value: "4", label: "Quarterly" },
  { value: "2", label: "Half-yearly" },
  { value: "1", label: "Annually" },
];
const PERIOD_NAME: Record<Freq, string> = { "12": "month", "4": "quarter", "2": "half-year", "1": "year" };

const COLUMNS: Column<AmortisationRow>[] = [
  { key: "period", label: "Period", align: "left", format: (v) => String(v) },
  { key: "opening", label: "Opening balance" },
  { key: "payment", label: "Payment" },
  { key: "interest", label: "Interest" },
  { key: "principal", label: "Principal" },
  { key: "closing", label: "Closing balance" },
];

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("250,000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("5");
  const [freq, setFreq] = useState<Freq>("12");
  const [inAdvance, setInAdvance] = useState(false);
  const [balloon, setBalloon] = useState("");

  const res = useMemo(
    () =>
      amortise({
        principal: num(principal),
        annualRate: num(rate) / 100,
        years: num(years),
        periodsPerYear: Number(freq),
        inAdvance,
        balloon: num(balloon) || 0,
      }),
    [principal, rate, years, freq, inAdvance, balloon],
  );

  const per = PERIOD_NAME[freq];
  const P = num(principal);

  return (
    <CalcGrid
      inputs={
        <div className="flex flex-col gap-4">
          <NumberField label="Amount borrowed / lease liability" value={principal} onChange={setPrincipal} />
          <NumberField label="Annual interest rate (nominal)" value={rate} onChange={setRate} suffix="%" hint="For a lease, use the rate implicit in the lease or the incremental borrowing rate." />
          <div className="grid grid-cols-2 gap-3 items-end">
            <NumberField label="Term" value={years} onChange={setYears} suffix="years" />
            <SelectField label="Payments" value={freq} onChange={setFreq} options={FREQS} />
          </div>
          <NumberField label="Balloon / residual value (optional)" value={balloon} onChange={setBalloon} placeholder="0" hint="An amount still owed after the last regular payment, e.g. a guaranteed residual value." />
          <Toggle label="Payments in advance (lease style)" checked={inAdvance} onChange={setInAdvance} hint="First payment is made on day one (annuity due). Leave off for a normal loan paid in arrears." />
        </div>
      }
      results={
        res.error ? (
          <Notice>{res.error}</Notice>
        ) : (
          <>
            <StatGrid>
              <Stat highlight label={`Payment per ${per}`} value={fmt(res.payment)} sub={`${res.periods} payments ${inAdvance ? "in advance" : "in arrears"}`} />
              <Stat label="Total interest" value={fmt(res.totalInterest)} sub={P > 0 ? `${fmtPct(res.totalInterest / P, 1)} of the amount borrowed` : undefined} />
              <Stat label="Total repaid" value={fmt(res.totalPaid)} sub={num(balloon) > 0 ? `Includes balloon of ${fmt(num(balloon))}` : "All payments"} />
              <Stat label={`Rate per ${per}`} value={fmtPct(res.periodicRate, 4)} sub="Annual rate ÷ payments per year" />
              <Stat label="Effective annual rate" value={fmtPct(Math.pow(1 + res.periodicRate, Number(freq)) - 1, 3)} sub="(1 + periodic rate)^m − 1" />
              <Stat label="First-period interest" value={fmt(res.rows[0]?.interest)} sub={`${fmtPct(res.rows[0] ? res.rows[0].interest / res.payment : 0, 1)} of the first payment`} />
            </StatGrid>
            <DataTable
              title="Amortisation schedule"
              caption="Loan amortisation schedule"
              filename="amortisation-schedule"
              columns={COLUMNS}
              rows={res.rows}
              maxHeight={520}
              footer={{
                period: "Total",
                payment: fmt(res.payment * res.periods),
                interest: fmt(res.rows.reduce((s, r) => s + r.interest, 0)),
                principal: fmt(res.rows.reduce((s, r) => s + r.principal, 0)),
              }}
            />
          </>
        )
      }
    />
  );
}
