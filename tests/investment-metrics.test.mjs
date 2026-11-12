import { test } from "node:test";
import assert from "node:assert/strict";
import { computeInvestmentMetrics } from "../src/lib/properties/investment.ts";

// Departamento de USD 84.000, 32 m², alquiler de USD 450 al mes.
const base = {
  price: 84000,
  areaM2: 32,
  monthlyRent: 450,
  occupancyPct: null,
  managementFeePct: 8,
  monthlyExpenses: 60,
  annualTaxes: 150,
  acquisitionCostsPct: 3,
  zonePricePerM2: 2800,
};

test("calcula rendimiento bruto, neto, recupero y precio por m²", () => {
  const m = computeInvestmentMetrics(base);
  // 450 × 12 = 5.400; 5.400 ÷ 84.000 = 6,43 %
  assert.equal(m.grossAnnualRent, 5400);
  assert.equal(m.grossYieldPct, 6.4);
  // 5.400 × 0,92 − 720 − 150 = 4.098; inversión 86.520 → 4,74 %
  assert.equal(m.netAnnualIncome, 4098);
  assert.equal(m.totalInvestment, 86520);
  assert.equal(m.netYieldPct, 4.7);
  assert.equal(m.paybackYears, 21.1);
  // 84.000 ÷ 32 = 2.625 por m², 6,25 % debajo de 2.800 (se redondea a 6,2)
  assert.equal(m.pricePerM2, 2625);
  assert.equal(m.zoneDiffPct, -6.2);
});

test("la ocupación reduce la renta bruta (alquiler temporario)", () => {
  const m = computeInvestmentMetrics({ ...base, monthlyRent: 900, occupancyPct: 60 });
  assert.equal(m.grossAnnualRent, 6480);
});

test("sin renta no inventa rendimiento", () => {
  const m = computeInvestmentMetrics({ ...base, monthlyRent: null });
  assert.equal(m.grossYieldPct, null);
  assert.equal(m.netYieldPct, null);
  assert.equal(m.paybackYears, null);
  assert.equal(m.pricePerM2, 2625);
});
