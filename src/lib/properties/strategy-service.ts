import "server-only";
import { after } from "next/server";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { revalidatePublicProperties } from "@/lib/cache/revalidate";
import {
  strategyReadinessErrors,
  type StrategyInput,
} from "@/lib/properties/strategy";
import { translatePropertyInBackground } from "@/lib/properties/translate";

export class StrategyError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const JSON_FIELDS = ["comparables", "businessOptions"] as const;

function toData(input: StrategyInput) {
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue;
    if ((JSON_FIELDS as readonly string[]).includes(key)) {
      data[key] = value === null ? Prisma.DbNull : value;
    } else {
      data[key] = value;
    }
  }
  return data;
}

function toNumber(value: { toString(): string } | null | undefined) {
  if (value === null || value === undefined) return null;
  const parsed = Number(value.toString());
  return Number.isFinite(parsed) ? parsed : null;
}

export async function getStrategy(propertyId: string) {
  return prisma.propertyStrategy.findUnique({ where: { propertyId } });
}

// Crea o actualiza la estrategia. Campo omitido = no se toca, null = se
// borra. Pasar a READY exige tesis, tipo de renta y renta mensual.
export async function upsertStrategy(propertyId: string, input: StrategyInput) {
  const current = await getStrategy(propertyId);
  const data = toData(input);

  const merged = {
    summary: input.summary !== undefined ? input.summary : current?.summary,
    rentStrategy:
      input.rentStrategy !== undefined ? input.rentStrategy : current?.rentStrategy,
    rentKind: input.rentKind !== undefined ? input.rentKind : current?.rentKind,
    monthlyRent:
      input.monthlyRent !== undefined
        ? input.monthlyRent
        : toNumber(current?.monthlyRent),
  };
  const nextStatus = input.status ?? current?.status ?? "PENDING";

  if (nextStatus === "READY") {
    const errors = strategyReadinessErrors(merged);
    if (errors.length) {
      throw new StrategyError(
        422,
        "strategy_incomplete",
        "La estrategia no se puede marcar como lista todavía.",
        { missing: errors },
      );
    }
    if (current?.status !== "READY") data.readyAt = new Date();
  }

  const saved = await prisma.propertyStrategy.upsert({
    where: { propertyId },
    create: {
      ...(data as Omit<Prisma.PropertyStrategyUncheckedCreateInput, "propertyId">),
      propertyId,
    },
    update: data as Prisma.PropertyStrategyUncheckedUpdateInput,
  });

  // Una propiedad con estrategia lista pasa a destacada. Solo en el momento
  // en que pasa a READY: si después se quita el destacado a mano, no se
  // vuelve a marcar.
  if (nextStatus === "READY" && current?.status !== "READY") {
    await prisma.property.update({
      where: { id: propertyId },
      data: { isFeatured: true },
    });
  }

  revalidatePublicProperties();
  after(() => translatePropertyInBackground(propertyId));
  return saved;
}
