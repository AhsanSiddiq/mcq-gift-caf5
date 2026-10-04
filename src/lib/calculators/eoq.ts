/** Economic order quantity, with optional quantity discounts. Pure functions. */

/** EOQ = √(2·Co·D / Ch) */
export function eoq(annualDemand: number, orderCost: number, holdingCostPerUnit: number): number {
  if (!(annualDemand > 0 && orderCost > 0 && holdingCostPerUnit > 0)) return NaN;
  return Math.sqrt((2 * orderCost * annualDemand) / holdingCostPerUnit);
}

export interface InventoryCost {
  quantity: number;
  orders: number;
  orderingCost: number;
  holdingCost: number;
  purchaseCost: number;
  total: number;
}

export function inventoryCost(q: number, annualDemand: number, orderCost: number, holdingCostPerUnit: number, unitPrice = 0): InventoryCost {
  const orders = annualDemand / q;
  const orderingCost = orders * orderCost;
  const holdingCost = (q / 2) * holdingCostPerUnit;
  const purchaseCost = annualDemand * unitPrice;
  return { quantity: q, orders, orderingCost, holdingCost, purchaseCost, total: orderingCost + holdingCost + purchaseCost };
}

export interface DiscountTier { minQty: number; price: number }

export interface DiscountOption extends InventoryCost {
  price: number;
  minQty: number;
  /** Holding cost per unit per year used for this tier */
  holdingPerUnit: number;
  /** EOQ at this tier's holding cost before adjusting it into the tier's quantity band */
  rawEoq: number;
  adjusted: boolean;
  best: boolean;
}

/**
 * Standard quantity-discount method: for each price band compute EOQ (holding cost may depend on price), move it into
 * the band (up to the band minimum if it is too small), then compare total annual cost (purchase + ordering + holding)
 * and choose the lowest.
 */
export function eoqWithDiscounts(params: {
  annualDemand: number;
  orderCost: number;
  basePrice: number;
  /** If set, holding cost = holdingPct × price; otherwise a fixed amount per unit */
  holdingPct?: number;
  holdingPerUnit?: number;
  tiers: DiscountTier[];
}): DiscountOption[] {
  const { annualDemand: D, orderCost: Co, basePrice, holdingPct, holdingPerUnit = 0, tiers } = params;
  const bands: DiscountTier[] = [{ minQty: 0, price: basePrice }, ...tiers.filter((t) => t.minQty > 0 && t.price > 0)].sort(
    (a, b) => a.minQty - b.minQty,
  );
  const options: DiscountOption[] = bands.map((t, idx) => {
    const ch = holdingPct !== undefined ? holdingPct * t.price : holdingPerUnit;
    const raw = eoq(D, Co, ch);
    const maxQty = idx < bands.length - 1 ? bands[idx + 1].minQty - 1 : Infinity;
    let q = Math.max(raw, t.minQty, 1);
    if (q > maxQty) q = Math.max(maxQty, 1);
    return { ...inventoryCost(q, D, Co, ch, t.price), price: t.price, minQty: t.minQty, holdingPerUnit: ch, rawEoq: raw, adjusted: q !== raw, best: false };
  });
  let bestIdx = 0;
  options.forEach((o, i) => {
    if (o.total < options[bestIdx].total) bestIdx = i;
  });
  if (options[bestIdx]) options[bestIdx].best = true;
  return options;
}
