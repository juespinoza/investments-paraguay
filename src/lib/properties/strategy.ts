import { z } from "zod";
import {
  computeInvestmentMetrics,
  type InvestmentMetrics,
} from "@/lib/properties/investment";

export const RENT_STRATEGIES = [
  "LONG_TERM",
  "SHORT_TERM",
  "COMMERCIAL",
  "RESALE",
] as const;
export type RentStrategyCode = (typeof RENT_STRATEGIES)[number];

const ComparableSchema = z.object({
  title: z.string().trim().min(1).max(200),
  price: z.number().positive().max(1e12),
  areaM2: z.number().positive().max(1e7).nullable().optional(),
  url: z.string().trim().url().max(500).nullable().optional(),
});

const BusinessOptionSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(1200),
});

const text = (max: number) => z.string().trim().max(max).nullable().optional();
const percent = z.number().min(0).max(100).nullable().optional();
const amount = z.number().min(0).max(1e12).nullable().optional();

// Contrato para cargar o actualizar la estrategia de una propiedad (API del
// publicador y, más adelante, la oficina virtual). Campo omitido = no se
// toca; null = se borra.
export const StrategyInputSchema = z
  .object({
    status: z.enum(["PENDING", "READY"]).optional(),
    summary: text(600),
    rentStrategy: z.enum(RENT_STRATEGIES).nullable().optional(),
    rentKind: z.enum(["ACTUAL", "ESTIMATED"]).nullable().optional(),
    monthlyRent: amount,
    occupancyPct: percent,
    managementFeePct: percent,
    monthlyExpenses: amount,
    annualTaxes: amount,
    acquisitionCostsPct: percent,
    appreciationPct: percent,
    zonePricePerM2: amount,
    zonePriceSource: text(300),
    comparables: z.array(ComparableSchema).max(12).nullable().optional(),
    businessOptions: z.array(BusinessOptionSchema).max(8).nullable().optional(),
    zoneSummary: text(3000),
    risks: text(3000),
    methodology: text(3000),
    // No se guarda: false evita que la propiedad pase a destacada al
    // marcar la estrategia como READY (por defecto, sí pasa).
    featureOnReady: z.boolean().optional(),
  })
  .strict();

export type StrategyInput = z.infer<typeof StrategyInputSchema>;

// Una estrategia se puede marcar READY solo con lo mínimo para que la ficha
// tenga sentido: tesis, tipo de renta y renta mensual (o reventa).
export function strategyReadinessErrors(strategy: {
  summary?: string | null;
  rentStrategy?: string | null;
  rentKind?: string | null;
  monthlyRent?: number | null;
}) {
  const errors: string[] = [];
  if (!strategy.summary?.trim()) errors.push("summary es obligatorio");
  if (!strategy.rentStrategy) errors.push("rentStrategy es obligatorio");
  if (strategy.rentStrategy && strategy.rentStrategy !== "RESALE") {
    if (!strategy.monthlyRent) errors.push("monthlyRent es obligatorio");
    if (!strategy.rentKind) errors.push("rentKind es obligatorio");
  }
  return errors;
}

export type BusinessOption = z.infer<typeof BusinessOptionSchema>;
export type Comparable = z.infer<typeof ComparableSchema>;

export function parseBusinessOptions(value: unknown): BusinessOption[] {
  const parsed = z.array(BusinessOptionSchema).safeParse(value);
  return parsed.success ? parsed.data : [];
}

export function parseComparables(value: unknown): Comparable[] {
  const parsed = z.array(ComparableSchema).safeParse(value);
  return parsed.success ? parsed.data : [];
}

export type PublicStrategy = {
  status: "PENDING" | "READY";
  summary: string | null;
  rentStrategy: RentStrategyCode | null;
  rentKind: "ACTUAL" | "ESTIMATED" | null;
  monthlyRent: number | null;
  occupancyPct: number | null;
  managementFeePct: number | null;
  monthlyExpenses: number | null;
  annualTaxes: number | null;
  acquisitionCostsPct: number | null;
  appreciationPct: number | null;
  zonePricePerM2: number | null;
  zonePriceSource: string | null;
  comparables: Comparable[];
  businessOptions: BusinessOption[];
  zoneSummary: string | null;
  risks: string | null;
  methodology: string | null;
  metrics: InvestmentMetrics;
  updatedAt: string;
};

// Superficie para el precio por m²: terreno en lotes y chacras, construcción
// en el resto; si no hay ninguna, la superficie general.
export function investmentAreaM2(input: {
  propertyTypeCode: string | null;
  areaM2: number | null;
  builtM2: number | null;
  landM2: number | null;
}) {
  const isLand = /TERRENO|LOTE|CHACRA|CAMPO/i.test(input.propertyTypeCode ?? "");
  return (isLand ? input.landM2 : input.builtM2) ?? input.areaM2;
}

type StrategyRecord = {
  status: "PENDING" | "READY";
  summary: string | null;
  rentStrategy: RentStrategyCode | null;
  rentKind: "ACTUAL" | "ESTIMATED" | null;
  monthlyRent: number | null;
  occupancyPct: number | null;
  managementFeePct: number | null;
  monthlyExpenses: number | null;
  annualTaxes: number | null;
  acquisitionCostsPct: number | null;
  appreciationPct: number | null;
  zonePricePerM2: number | null;
  zonePriceSource: string | null;
  comparables: unknown;
  businessOptions: unknown;
  zoneSummary: string | null;
  risks: string | null;
  methodology: string | null;
  updatedAt: Date;
};

type TranslationRecord = {
  summary: string | null;
  zoneSummary: string | null;
  risks: string | null;
  methodology: string | null;
  businessOptions: unknown;
} | null;

export function toPublicStrategy(
  strategy: StrategyRecord,
  context: { price: number | null; areaM2: number | null },
  translation: TranslationRecord,
): PublicStrategy {
  const translatedOptions = translation
    ? parseBusinessOptions(translation.businessOptions)
    : [];

  return {
    status: strategy.status,
    summary: translation?.summary ?? strategy.summary,
    rentStrategy: strategy.rentStrategy,
    rentKind: strategy.rentKind,
    monthlyRent: strategy.monthlyRent,
    occupancyPct: strategy.occupancyPct,
    managementFeePct: strategy.managementFeePct,
    monthlyExpenses: strategy.monthlyExpenses,
    annualTaxes: strategy.annualTaxes,
    acquisitionCostsPct: strategy.acquisitionCostsPct,
    appreciationPct: strategy.appreciationPct,
    zonePricePerM2: strategy.zonePricePerM2,
    zonePriceSource: strategy.zonePriceSource,
    comparables: parseComparables(strategy.comparables),
    businessOptions: translatedOptions.length
      ? translatedOptions
      : parseBusinessOptions(strategy.businessOptions),
    zoneSummary: translation?.zoneSummary ?? strategy.zoneSummary,
    risks: translation?.risks ?? strategy.risks,
    methodology: translation?.methodology ?? strategy.methodology,
    metrics: computeInvestmentMetrics({
      price: context.price,
      areaM2: context.areaM2,
      monthlyRent: strategy.monthlyRent,
      occupancyPct: strategy.occupancyPct,
      managementFeePct: strategy.managementFeePct,
      monthlyExpenses: strategy.monthlyExpenses,
      annualTaxes: strategy.annualTaxes,
      acquisitionCostsPct: strategy.acquisitionCostsPct,
      zonePricePerM2: strategy.zonePricePerM2,
    }),
    updatedAt: strategy.updatedAt.toISOString(),
  };
}
