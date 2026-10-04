"use client";

import { useMemo, useRef, useState } from "react";
import { eoq, eoqWithDiscounts, inventoryCost, type DiscountOption, type InventoryCost } from "@/lib/calculators/eoq";
import { AddRowButton, CalcGrid, DataTable, fmt, Notice, num, NumberField, RemoveButton, Segmented, Stat, StatGrid, Toggle, type Column } from "../_components/ui";

type HoldMode = "pct" | "unit";

const SENS_COLS: Column<InventoryCost & { label: string }>[] = [
  { key: "label", label: "Order size", align: "left" },
  { key: "quantity", label: "Quantity", format: (v) => fmt(v as number, 0) },
  { key: "orders", label: "Orders / year", format: (v) => fmt(v as number, 2) },
  { key: "orderingCost", label: "Ordering cost" },
  { key: "holdingCost", label: "Holding cost" },
  { key: "total", label: "Total relevant cost" },
];

const DISC_COLS: Column<DiscountOption>[] = [
  { key: "price", label: "Unit price", align: "left", format: (v, r) => `${fmt(v as number)}${r.minQty > 0 ? ` (≥ ${fmt(r.minQty, 0)})` : " (base)"}` },
  { key: "rawEoq", label: "EOQ at price", format: (v) => fmt(v as number, 0) },
  { key: "quantity", label: "Order qty used", format: (v) => fmt(v as number, 0) },
  { key: "purchaseCost", label: "Purchase cost" },
  { key: "orderingCost", label: "Ordering cost" },
  { key: "holdingCost", label: "Holding cost" },
  { key: "total", label: "Total annual cost" },
];

export default function EoqCalculator() {
  const nextId = useRef(10);
  const [demand, setDemand] = useState("12,000");
  const [orderCost, setOrderCost] = useState("150");
  const [price, setPrice] = useState("12");
  const [holdMode, setHoldMode] = useState<HoldMode>("pct");
  const [holdPct, setHoldPct] = useState("20");
  const [holdUnit, setHoldUnit] = useState("2.40");
  const [useDiscounts, setUseDiscounts] = useState(false);
  const [tiers, setTiers] = useState([
    { id: 1, minQty: "2,000", price: "11.70" },
    { id: 2, minQty: "5,000", price: "11.40" },
  ]);

  const D = num(demand);
  const Co = num(orderCost);
  const p = num(price) || 0;
  const ch = holdMode === "pct" ? (num(holdPct) / 100) * p : num(holdUnit);

  const result = useMemo(() => {
    if (!(D > 0)) return { error: "Enter annual demand greater than zero." } as const;
    if (!(Co > 0)) return { error: "Enter a cost per order greater than zero." } as const;
    if (!(ch > 0)) return { error: holdMode === "pct" ? "Enter a unit price and a holding cost % greater than zero." : "Enter a holding cost per unit greater than zero." } as const;
    const q = eoq(D, Co, ch);
    const base = inventoryCost(q, D, Co, ch, p);
    const sens = [0.5, 0.75, 1, 1.25, 1.5, 2].map((m) => ({ label: m === 1 ? "EOQ" : `${m * 100}% of EOQ`, ...inventoryCost(q * m, D, Co, ch, p) }));
    const options = useDiscounts
      ? eoqWithDiscounts({
          annualDemand: D,
          orderCost: Co,
          basePrice: p,
          holdingPct: holdMode === "pct" ? num(holdPct) / 100 : undefined,
          holdingPerUnit: holdMode === "unit" ? ch : undefined,
          tiers: tiers.map((t) => ({ minQty: num(t.minQty), price: num(t.price) })).filter((t) => t.minQty > 0 && t.price > 0),
        })
      : null;
    return { q, base, sens, options, best: options?.find((o) => o.best) };
  }, [D, Co, ch, p, holdMode, holdPct, useDiscounts, tiers]);

  return (
    <CalcGrid
      inputs={
        <div className="flex flex-col gap-4">
          <NumberField label="Annual demand (D)" value={demand} onChange={setDemand} suffix="units" />
          <NumberField label="Cost per order (Co)" value={orderCost} onChange={setOrderCost} hint="Admin, delivery and receiving costs for each order placed." />
          <NumberField label="Purchase price per unit" value={price} onChange={setPrice} hint={holdMode === "pct" ? "Needed for % holding cost and total purchase cost." : "Optional. Used for total annual cost."} />
          <Segmented
            label="Holding cost (Ch) expressed as"
            value={holdMode}
            onChange={setHoldMode}
            options={[
              { value: "pct", label: "% of price" },
              { value: "unit", label: "Amount per unit" },
            ]}
          />
          {holdMode === "pct" ? (
            <NumberField label="Holding cost per year" value={holdPct} onChange={setHoldPct} suffix="% of price" />
          ) : (
            <NumberField label="Holding cost per unit per year" value={holdUnit} onChange={setHoldUnit} />
          )}
          <Toggle label="Supplier offers quantity discounts" checked={useDiscounts} onChange={setUseDiscounts} hint="Compare the EOQ with ordering enough to qualify for a lower price." />
          {useDiscounts && (
            <div className="flex flex-col gap-2">
              {tiers.map((t, i) => (
                <div key={t.id} className="flex items-end gap-2">
                  <div className="flex-1 min-w-0">
                    <NumberField label={`Tier ${i + 1} min. qty`} value={t.minQty} onChange={(v) => setTiers((ts) => ts.map((x) => (x.id === t.id ? { ...x, minQty: v } : x)))} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <NumberField label="Unit price" value={t.price} onChange={(v) => setTiers((ts) => ts.map((x) => (x.id === t.id ? { ...x, price: v } : x)))} />
                  </div>
                  <RemoveButton label={`Remove tier ${i + 1}`} onClick={() => setTiers((ts) => ts.filter((x) => x.id !== t.id))} />
                </div>
              ))}
              <AddRowButton onClick={() => setTiers((ts) => [...ts, { id: nextId.current++, minQty: "", price: "" }])}>Add price break</AddRowButton>
            </div>
          )}
        </div>
      }
      results={
        "error" in result ? (
          <Notice>{result.error}</Notice>
        ) : (
          <>
            <StatGrid>
              <Stat highlight label="Economic order quantity" value={`${fmt(result.q, 0)} units`} sub={`Exact: ${fmt(result.q, 2)}`} />
              <Stat label="Orders per year" value={fmt(result.base.orders, 2)} sub={`About every ${fmt(365 / result.base.orders, 0)} days`} />
              <Stat label="Annual ordering cost" value={fmt(result.base.orderingCost)} sub="(D ÷ Q) × Co" />
              <Stat label="Annual holding cost" value={fmt(result.base.holdingCost)} sub={`(Q ÷ 2) × Ch, Ch = ${fmt(ch)}`} />
              <Stat label="Total relevant cost" value={fmt(result.base.orderingCost + result.base.holdingCost)} sub="Ordering + holding" />
              <Stat label="Total incl. purchases" value={p > 0 ? fmt(result.base.total) : "–"} sub={p > 0 ? `Purchases ${fmt(result.base.purchaseCost, 0)}` : "Enter a unit price"} />
            </StatGrid>
            {result.options && result.best && (
              <Notice tone="info">
                {result.best.minQty > 0
                  ? `Take the discount: order ${fmt(result.best.quantity, 0)} units at ${fmt(result.best.price)}. Total annual cost is ${fmt(result.best.total)}, saving ${fmt(result.options[0].total - result.best.total)} against ordering the EOQ at the base price.`
                  : `No discount pays for itself: stick with the EOQ of ${fmt(result.best.quantity, 0)} units at the base price (total annual cost ${fmt(result.best.total)}).`}
              </Notice>
            )}
            {result.options ? (
              <DataTable title="Quantity discount comparison" caption="Total annual cost at each price break" filename="eoq-discounts" columns={DISC_COLS} rows={result.options} rowHighlight={(r) => r.best} />
            ) : (
              <DataTable title="Cost at different order sizes" caption="Ordering and holding cost around the EOQ" filename="eoq-sensitivity" columns={SENS_COLS} rows={result.sens} rowHighlight={(r) => r.label === "EOQ"} />
            )}
          </>
        )
      }
    />
  );
}
