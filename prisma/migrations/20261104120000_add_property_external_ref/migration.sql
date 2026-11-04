-- API del publicador: identifica cada propiedad por su sistema de origen
-- y su id en ese sistema, para que los reenvíos actualicen en vez de duplicar.
ALTER TABLE "Property" ADD COLUMN "externalSource" TEXT;
ALTER TABLE "Property" ADD COLUMN "externalId" TEXT;

-- Postgres permite varios NULL en un índice único: las propiedades cargadas
-- a mano (sin origen externo) no se ven afectadas.
CREATE UNIQUE INDEX "Property_externalSource_externalId_key" ON "Property"("externalSource", "externalId");
