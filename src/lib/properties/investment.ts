// Métricas de inversión de una propiedad a partir de su estrategia.
// Módulo puro (sin base de datos) para poder probarlo y para que la ficha
// muestre exactamente las mismas fórmulas en "Cómo lo calculamos".
//
// Todos los montos están en la moneda de la propiedad.

export type StrategyInputs = {
  price: number | null;
  areaM2: number | null;
  monthlyRent: number | null;
  // 0–100. Sin dato: 100 % (alquiler de largo plazo con contrato).
  occupancyPct: number | null;
  // 0–100, sobre la renta cobrada (administración, plataforma de alquiler).
  managementFeePct: number | null;
  // Gastos mensuales a cargo del dueño: expensas, servicios, mantenimiento.
  monthlyExpenses: number | null;
  // Impuesto inmobiliario y otros impuestos anuales.
  annualTaxes: number | null;
  // 0–100, sobre el precio: escribanía, impuestos de compra, comisión.
  acquisitionCostsPct: number | null;
  zonePricePerM2: number | null;
};

export type InvestmentMetrics = {
  pricePerM2: number | null;
  // Diferencia contra el promedio de la zona, en %. Negativo = más barato.
  zoneDiffPct: number | null;
  grossAnnualRent: number | null;
  netAnnualIncome: number | null;
  totalInvestment: number | null;
  grossYieldPct: number | null;
  netYieldPct: number | null;
  paybackYears: number | null;
};

function positive(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : null;
}

function pct(value: number | null | undefined, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value / 100
    : fallback;
}

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function computeInvestmentMetrics(
  inputs: StrategyInputs,
): InvestmentMetrics {
  const price = positive(inputs.price);
  const area = positive(inputs.areaM2);
  const rent = positive(inputs.monthlyRent);
  const zonePrice = positive(inputs.zonePricePerM2);

  const pricePerM2 = price && area ? round(price / area, 0) : null;
  const zoneDiffPct =
    pricePerM2 && zonePrice ? round((pricePerM2 / zonePrice - 1) * 100, 1) : null;

  const totalInvestment = price
    ? round(price * (1 + pct(inputs.acquisitionCostsPct, 0)), 0)
    : null;

  if (!price || !rent || !totalInvestment) {
    return {
      pricePerM2,
      zoneDiffPct,
      grossAnnualRent: null,
      netAnnualIncome: null,
      totalInvestment,
      grossYieldPct: null,
      netYieldPct: null,
      paybackYears: null,
    };
  }

  const grossAnnualRent = rent * 12 * pct(inputs.occupancyPct, 1);
  const netAnnualIncome =
    grossAnnualRent * (1 - pct(inputs.managementFeePct, 0)) -
    (positive(inputs.monthlyExpenses) ?? 0) * 12 -
    (positive(inputs.annualTaxes) ?? 0);

  return {
    pricePerM2,
    zoneDiffPct,
    grossAnnualRent: round(grossAnnualRent, 0),
    netAnnualIncome: round(netAnnualIncome, 0),
    totalInvestment,
    grossYieldPct: round((grossAnnualRent / price) * 100, 1),
    netYieldPct: round((netAnnualIncome / totalInvestment) * 100, 1),
    paybackYears:
      netAnnualIncome > 0 ? round(totalInvestment / netAnnualIncome, 1) : null,
  };
}
