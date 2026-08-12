"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdvisorForm, type AdvisorFormOutput } from "@/components/virtualoffice/advisors/AdvisorForm";
import { InmobiliariaForm } from "@/components/virtualoffice/inmobiliarias/InmobiliariaForm";
import { Card, CardBody, CardSection, InlineAlert, Badge } from "@/components/virtualoffice/Page";
import { PropertyForm } from "@/components/virtualoffice/properties/PropertyForm";

type InmobiliariaOption = {
  id: string;
  label: string;
};

type AdvisorOption = {
  id: string;
  label: string;
  inmobiliariaId?: string | null;
};

type PropertyValues = {
  title: string;
};

type WizardStep = "inmobiliaria" | "advisor" | "property" | "done";

type WorkflowState = {
  inmobiliariaId: string | null;
  inmobiliariaName: string | null;
  advisorId: string | null;
  advisorName: string | null;
  advisorInmobiliariaId: string | null;
  propertyId: string | null;
  propertyTitle: string | null;
};

const INITIAL_WORKFLOW: WorkflowState = {
  inmobiliariaId: null,
  inmobiliariaName: null,
  advisorId: null,
  advisorName: null,
  advisorInmobiliariaId: null,
  propertyId: null,
  propertyTitle: null,
};

const STEP_META: Array<{
  id: Exclude<WizardStep, "done">;
  title: string;
  description: string;
}> = [
  {
    id: "inmobiliaria",
    title: "Inmobiliaria",
    description: "Crea el tenant o decide seguir con un asesor independiente.",
  },
  {
    id: "advisor",
    title: "Asesor",
    description: "Da de alta el asesor y opcionalmente su usuario.",
  },
  {
    id: "property",
    title: "Propiedad",
    description: "Crea la primera propiedad y deriva la inmobiliaria desde el asesor.",
  },
];

function WizardStepPill({
  title,
  description,
  state,
}: {
  title: string;
  description: string;
  state: "current" | "completed" | "upcoming";
}) {
  const tone =
    state === "completed"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : state === "current"
        ? "border-zinc-900 bg-zinc-900 text-white"
        : "border-zinc-200 bg-zinc-50 text-zinc-500";

  return (
    <div className={`rounded-[1.4rem] border px-4 py-4 ${tone}`}>
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs leading-5 opacity-90">{description}</div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  href,
}: {
  label: string;
  value: string | null;
  href?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-[rgba(24,39,63,0.08)] bg-white px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-zinc-900">
        {value ?? "No configurado"}
      </div>
      {href ? (
        <Link
          href={href}
          className="mt-3 inline-flex text-sm font-medium text-amber-700 hover:text-amber-800"
        >
          Abrir detalle
        </Link>
      ) : null}
    </div>
  );
}

export function SuperAdminWizard({
  initialInmobiliarias,
  initialAdvisors,
}: {
  initialInmobiliarias: InmobiliariaOption[];
  initialAdvisors: AdvisorOption[];
}) {
  const [step, setStep] = useState<WizardStep>("inmobiliaria");
  const [workflow, setWorkflow] = useState<WorkflowState>(INITIAL_WORKFLOW);
  const [inmobiliariaOptions, setInmobiliariaOptions] =
    useState<InmobiliariaOption[]>(initialInmobiliarias);
  const [advisorOptions, setAdvisorOptions] =
    useState<AdvisorOption[]>(initialAdvisors);
  const [existingInmobiliariaId, setExistingInmobiliariaId] = useState("");
  const [existingAdvisorId, setExistingAdvisorId] = useState("");

  const selectedInmobiliariaLabel = useMemo(
    () =>
      workflow.inmobiliariaId
        ? inmobiliariaOptions.find((item) => item.id === workflow.inmobiliariaId)?.label ??
          workflow.inmobiliariaName
        : null,
    [inmobiliariaOptions, workflow.inmobiliariaId, workflow.inmobiliariaName],
  );

  const selectedAdvisorLabel = useMemo(
    () =>
      workflow.advisorId
        ? advisorOptions.find((item) => item.id === workflow.advisorId)?.label ??
          workflow.advisorName
        : null,
    [advisorOptions, workflow.advisorId, workflow.advisorName],
  );

  function restart() {
    setWorkflow(INITIAL_WORKFLOW);
    setStep("inmobiliaria");
    setExistingInmobiliariaId("");
    setExistingAdvisorId("");
  }

  function handleInmobiliariaCreated(result: {
    id: string;
    values: {
      name: string;
    };
  }) {
    const nextOption = { id: result.id, label: result.values.name.trim() };
    setInmobiliariaOptions((current) => {
      if (current.some((item) => item.id === result.id)) return current;
      return [...current, nextOption].sort((a, b) => a.label.localeCompare(b.label));
    });
    setWorkflow((current) => ({
      ...current,
      inmobiliariaId: result.id,
      inmobiliariaName: nextOption.label,
    }));
    setStep("advisor");
  }

  function handleAdvisorCreated(result: {
    id: string;
    values: AdvisorFormOutput;
  }) {
    const nextOption = {
      id: result.id,
      label: result.values.fullName.trim(),
      inmobiliariaId: result.values.inmobiliariaId ?? null,
    };

    setAdvisorOptions((current) => {
      if (current.some((item) => item.id === result.id)) return current;
      return [...current, nextOption].sort((a, b) => a.label.localeCompare(b.label));
    });
    setWorkflow((current) => ({
      ...current,
      advisorId: result.id,
      advisorName: nextOption.label,
      advisorInmobiliariaId: result.values.inmobiliariaId ?? null,
      inmobiliariaId: result.values.inmobiliariaId ?? current.inmobiliariaId,
      inmobiliariaName:
        result.values.inmobiliariaId
          ? inmobiliariaOptions.find((item) => item.id === result.values.inmobiliariaId)?.label ??
            current.inmobiliariaName
          : current.inmobiliariaName,
    }));
    setStep("property");
  }

  function handlePropertyCreated(result: {
    id: string;
    values: PropertyValues;
  }) {
    setWorkflow((current) => ({
      ...current,
      propertyId: result.id,
      propertyTitle: result.values.title.trim(),
    }));
    setStep("done");
  }

  function continueWithExistingInmobiliaria() {
    const selected = inmobiliariaOptions.find(
      (item) => item.id === existingInmobiliariaId,
    );
    if (!selected) return;

    setWorkflow((current) => ({
      ...current,
      inmobiliariaId: selected.id,
      inmobiliariaName: selected.label,
    }));
    setStep("advisor");
  }

  function continueWithExistingAdvisor() {
    const selected = advisorOptions.find((item) => item.id === existingAdvisorId);
    if (!selected) return;

    const linkedInmobiliaria =
      selected.inmobiliariaId
        ? inmobiliariaOptions.find((item) => item.id === selected.inmobiliariaId)
        : null;

    setWorkflow((current) => ({
      ...current,
      advisorId: selected.id,
      advisorName: selected.label,
      advisorInmobiliariaId: selected.inmobiliariaId ?? null,
      inmobiliariaId: selected.inmobiliariaId ?? current.inmobiliariaId,
      inmobiliariaName: linkedInmobiliaria?.label ?? current.inmobiliariaName,
    }));
    setStep("property");
  }

  const currentStepIndex =
    step === "done"
      ? STEP_META.length
      : STEP_META.findIndex((item) => item.id === step);

  return (
    <div className="space-y-6">
      <Card>
        <CardBody className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-950">
                Wizard de alta operativa
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
                Sigue el flujo real del Super Admin: crea una inmobiliaria si aplica,
                da de alta el asesor y termina con la primera propiedad. El sistema
                mantiene asociaciones y permisos automáticamente.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {workflow.inmobiliariaId ? <Badge tone="info">Tenant listo</Badge> : null}
              {workflow.advisorId ? <Badge tone="success">Asesor listo</Badge> : null}
              {workflow.propertyId ? <Badge tone="success">Propiedad lista</Badge> : null}
              <button
                type="button"
                onClick={restart}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Reiniciar wizard
              </button>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-3">
            {STEP_META.map((item, index) => {
              const state =
                index < currentStepIndex
                  ? "completed"
                  : index === currentStepIndex
                    ? "current"
                    : "upcoming";

              return (
                <WizardStepPill
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  state={state}
                />
              );
            })}
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <SummaryItem
              label="Inmobiliaria"
              value={selectedInmobiliariaLabel}
              href={
                workflow.inmobiliariaId
                  ? `/virtual-office/inmobiliaria/${workflow.inmobiliariaId}/edit`
                  : null
              }
            />
            <SummaryItem
              label="Asesor"
              value={selectedAdvisorLabel}
              href={
                workflow.advisorId
                  ? `/virtual-office/asesores/${workflow.advisorId}/edit`
                  : null
              }
            />
            <SummaryItem
              label="Propiedad"
              value={workflow.propertyTitle}
              href={
                workflow.propertyId
                  ? `/virtual-office/propiedades/${workflow.propertyId}/edit`
                  : null
              }
            />
          </div>
        </CardBody>
      </Card>

      {step === "inmobiliaria" ? (
        <Card>
          <CardBody>
            <CardSection
              title="Paso 1. Inmobiliaria"
              description="Crea el tenant y su usuario principal, o continúa sin inmobiliaria para dar de alta un asesor independiente."
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <InlineAlert
                  type="info"
                  message="Puedes saltar este paso si el asesor será independiente. Más adelante la propiedad heredará automáticamente la inmobiliaria desde el asesor."
                />
                <button
                  type="button"
                  onClick={() => setStep("advisor")}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Continuar sin inmobiliaria
                </button>
              </div>

              {inmobiliariaOptions.length ? (
                <div className="mb-5 rounded-[1.25rem] border border-[rgba(24,39,63,0.08)] bg-zinc-50/80 p-4">
                  <div className="text-sm font-semibold text-zinc-900">
                    Retomar con una inmobiliaria existente
                  </div>
                  <p className="mt-1 text-sm leading-6 text-zinc-600">
                    Útil si el tenant ya fue creado y solo falta seguir con asesor,
                    usuario o propiedades.
                  </p>
                  <div className="mt-3 flex flex-col gap-3 lg:flex-row">
                    <select
                      value={existingInmobiliariaId}
                      onChange={(e) => setExistingInmobiliariaId(e.target.value)}
                      className="h-11 flex-1 rounded-xl border border-zinc-200 bg-white px-3"
                    >
                      <option value="">Seleccionar inmobiliaria</option>
                      {inmobiliariaOptions.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={!existingInmobiliariaId}
                      onClick={continueWithExistingInmobiliaria}
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-white disabled:opacity-60"
                    >
                      Continuar tenant existente
                    </button>
                  </div>
                </div>
              ) : null}

              <InmobiliariaForm
                mode="create"
                allowUserBootstrap
                redirectOnSuccess={false}
                onSuccess={handleInmobiliariaCreated}
              />
            </CardSection>
          </CardBody>
        </Card>
      ) : null}

      {step === "advisor" ? (
        <Card>
          <CardBody>
            <CardSection
              title="Paso 2. Asesor"
              description="Crea el asesor, déjalo independiente o asígnalo al tenant creado. También puedes generar su usuario desde aquí."
            >
              {workflow.inmobiliariaId ? (
                <div className="mb-5">
                  <InlineAlert
                    type="success"
                    message={`El tenant ${selectedInmobiliariaLabel ?? "seleccionado"} ya quedó listo. El asesor se puede asociar a esa inmobiliaria o mantenerse independiente.`}
                  />
                </div>
              ) : (
                <div className="mb-5">
                  <InlineAlert
                    type="info"
                    message="Estás creando un asesor sin tenant previo. Puedes dejarlo independiente o elegir una inmobiliaria existente."
                  />
                </div>
              )}

              {advisorOptions.length ? (
                <div className="mb-5 rounded-[1.25rem] border border-[rgba(24,39,63,0.08)] bg-zinc-50/80 p-4">
                  <div className="text-sm font-semibold text-zinc-900">
                    Retomar con un asesor existente
                  </div>
                  <p className="mt-1 text-sm leading-6 text-zinc-600">
                    Si el asesor ya existe, puedes saltar este alta y continuar
                    directo con la propiedad.
                  </p>
                  <div className="mt-3 flex flex-col gap-3 lg:flex-row">
                    <select
                      value={existingAdvisorId}
                      onChange={(e) => setExistingAdvisorId(e.target.value)}
                      className="h-11 flex-1 rounded-xl border border-zinc-200 bg-white px-3"
                    >
                      <option value="">Seleccionar asesor</option>
                      {advisorOptions.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                          {item.inmobiliariaId ? " · Con inmobiliaria" : " · Independiente"}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={!existingAdvisorId}
                      onClick={continueWithExistingAdvisor}
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-white disabled:opacity-60"
                    >
                      Continuar asesor existente
                    </button>
                  </div>
                </div>
              ) : null}

              <AdvisorForm
                mode="create"
                canEditInmobiliariaId
                allowUserBootstrap
                redirectOnSuccess={false}
                initialData={{
                  inmobiliariaId: workflow.inmobiliariaId,
                }}
                inmobiliariaOptions={inmobiliariaOptions}
                onSuccess={handleAdvisorCreated}
              />
            </CardSection>
          </CardBody>
        </Card>
      ) : null}

      {step === "property" ? (
        <Card>
          <CardBody>
            <CardSection
              title="Paso 3. Propiedad"
              description="Crea la primera propiedad del asesor. La inmobiliaria se asigna automáticamente según el asesor seleccionado."
            >
              <div className="mb-5">
                <InlineAlert
                  type="info"
                  message={`La propiedad quedará vinculada a ${selectedAdvisorLabel ?? "el asesor"} y heredará su inmobiliaria si existe. Esta relación no se edita manualmente.`}
                />
              </div>

              <PropertyForm
                mode="create"
                canManageAssignments
                canManageFeatured
                redirectOnSuccess={false}
                advisors={advisorOptions}
                inmobiliarias={inmobiliariaOptions}
                initialData={{
                  advisorId: workflow.advisorId ?? "",
                }}
                onSuccess={handlePropertyCreated}
              />
            </CardSection>
          </CardBody>
        </Card>
      ) : null}

      {step === "done" ? (
        <Card>
          <CardBody>
            <CardSection
              title="Workflow completado"
              description="El tenant, el asesor y la primera propiedad ya quedaron creados. Desde aquí puedes seguir operando o iniciar un nuevo onboarding."
            >
              <div className="space-y-5">
                <InlineAlert
                  type="success"
                  message="El flujo principal de alta operativa quedó completo. Ahora puedes profundizar datos, landing pages y usuarios secundarios."
                />

                <div className="grid gap-3 lg:grid-cols-2">
                  <Link
                    href={
                      workflow.inmobiliariaId
                        ? `/virtual-office/inmobiliaria/${workflow.inmobiliariaId}/edit`
                        : "/virtual-office/inmobiliaria"
                    }
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
                  >
                    {workflow.inmobiliariaId
                      ? "Completar inmobiliaria"
                      : "Ver inmobiliarias"}
                  </Link>

                  <Link
                    href={
                      workflow.advisorId
                        ? `/virtual-office/asesores/${workflow.advisorId}/edit`
                        : "/virtual-office/asesores"
                    }
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    {workflow.advisorId ? "Completar asesor" : "Ver asesores"}
                  </Link>

                  <Link
                    href={
                      workflow.propertyId
                        ? `/virtual-office/propiedades/${workflow.propertyId}/edit`
                        : "/virtual-office/propiedades"
                    }
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    {workflow.propertyId ? "Completar propiedad" : "Ver propiedades"}
                  </Link>

                  <button
                    type="button"
                    onClick={restart}
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-4 text-sm font-medium text-amber-800 hover:bg-amber-100"
                  >
                    Iniciar otro onboarding
                  </button>
                </div>

                <div className="rounded-[1.25rem] border border-[rgba(24,39,63,0.08)] bg-zinc-50/80 p-4">
                  <div className="text-sm font-semibold text-zinc-900">
                    Checklist de cierre operativo
                  </div>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-600">
                    <li>
                      {workflow.inmobiliariaId ? "✓" : "•"} Tenant creado o confirmado.
                    </li>
                    <li>
                      {workflow.advisorId ? "✓" : "•"} Asesor creado o confirmado.
                    </li>
                    <li>
                      {workflow.propertyId ? "✓" : "•"} Primera propiedad creada.
                    </li>
                    <li>• Revisar landing pública, datos de contacto y destacados.</li>
                    <li>• Verificar login del usuario creado si aplicó en el flujo.</li>
                  </ul>
                  <p className="mt-4 text-sm text-zinc-500">
                    Checklist formal disponible en{" "}
                    <code>docs/virtual-office-p1-checklist.md</code>.
                  </p>
                </div>
              </div>
            </CardSection>
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}
