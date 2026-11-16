import type {
  ArticleDefinition,
  ArticleSource,
  LocalizedArticle,
} from "@/lib/content/articles/types";

// Guía evergreen con un presupuesto real de escrituración (julio 2026) como
// ejemplo. Sin nombre de la escribanía. Tipo de cambio de referencia:
// Gs. 5.760 por USD (USD 58.870 ≈ Gs. 339 millones).
const SLUG = "cuanto-cuesta-escriturar-un-departamento-en-paraguay";
const PUBLISHED = "2026-11-15";
const UPDATED = "2026-11-15";

const L = {
  guide: "/blog/asuncion-real-estate-investment-guide",
  foreigners: "/blog/invertir-en-paraguay-siendo-extranjero",
  offPlan: "/blog/comprar-en-pozo-como-revisar-una-desarrolladora",
  properties: "/bienes-raices",
};

const U = {
  ley1307: "https://www.bacn.gov.py/leyes-paraguayas/2419/ley-n-1307-arancel-del-notario-p-blico-br",
  buscaescribania: "https://buscaescribania.com/py/es/blog/transferencia-inmueble-paraguay",
  holacasa: "https://holacasa.com.py/transferencia-inmuebles-paraguay-costos/",
};

const SOURCES: ArticleSource[] = [
  { label: "Ley N° 1307/87 — Arancel del Notario Público (BACN)", url: U.ley1307 },
  { label: "BuscaEscribanía — Transferencia de inmueble en Paraguay 2026: costos, documentos y proceso (nov 2026)", url: U.buscaescribania },
  { label: "Holacasa — Transferencia de inmuebles en Paraguay: cuánto cuesta (nov 2026)", url: U.holacasa },
];

const es: LocalizedArticle = {
  title: "Cuánto cuesta escriturar un departamento en Paraguay: un presupuesto real, línea por línea",
  metaTitle: "Cuánto cuesta escriturar un departamento en Paraguay",
  description:
    "Presupuesto real de escrituración de un departamento de USD 58.870 en Asunción: Gs. 7.322.160 (2,2 %). Tasas, impuesto, certificados y honorarios.",
  excerpt:
    "Un presupuesto real de escrituración, línea por línea: qué es cada concepto, de dónde sale el número y cómo estimar el tuyo.",
  lead:
    "Cuando preguntás cuánto cuesta escriturar, la respuesta típica es \"entre 2 y 3 %\". Es cierto, pero no sirve para planificar. Acá te muestro un presupuesto real de una escribanía de Asunción, de julio de 2026, para escriturar un departamento: cada línea, qué es, de dónde sale el número y cómo calcular el tuyo.",
  readingTime: "7 min de lectura",
  updatedLabel: "Actualizado: 15 nov 2026",
  authorRole: "Asesora inmobiliaria en SkyOne",
  tocTitle: "En este artículo",
  sourcesTitle: "Fuentes",
  disclaimer:
    "Este artículo es informativo. Los montos son de un presupuesto real de una escribanía de Asunción, de julio de 2026 y pueden variar según la escribanía, el municipio, el valor fiscal del inmueble y el jornal mínimo vigente. Pedí siempre tu presupuesto por escrito.",
  cta: {
    title: "¿Querés saber cuánto te costaría escriturar?",
    text: "Pasame el valor del departamento y la ciudad, y te armo una estimación con esta misma estructura.",
    guide: "Descargar la guía gratuita",
    call: "Agendar una llamada",
    whatsapp: "Escribir por WhatsApp",
    whatsappMessage:
      "Hola Julia, leí tu artículo sobre el costo de escriturar y quiero una estimación para mi caso.",
  },
  blocks: [
    { type: "h2", id: "el-caso", text: "El caso: un departamento de USD 58.870 en Asunción" },
    {
      type: "p",
      text: "Compra de un departamento terminado a una desarrolladora, en Asunción, por **USD 58.870** (unos Gs. 339 millones al cambio de julio de 2026). Presupuesto total de escrituración: **Gs. 7.322.160**, es decir, unos **USD 1.270** o el **2,2 %** del precio. En este caso se paga el 50 % al iniciar el trámite y el resto al terminar.",
    },
    {
      type: "table",
      head: ["Concepto", "Monto (Gs.)", "% del total"],
      rows: [
        ["Tasas judiciales (inscripción en el Registro)", "2.885.000", "39 %"],
        ["Impuesto municipal a la transferencia", "1.017.000", "14 %"],
        ["Gastos administrativos", "640.000", "9 %"],
        ["Certificado de anotaciones personales", "255.000", "3 %"],
        ["Certificado catastral registral", "255.000", "3 %"],
        ["Certificado municipal", "255.000", "3 %"],
        ["Expedición de copia", "255.000", "3 %"],
        ["Trámite de inscripción en la DGRP", "255.000", "3 %"],
        ["Honorarios profesionales (con descuento)", "1.356.000", "19 %"],
        ["IVA sobre honorarios (10 %)", "149.160", "2 %"],
        ["**Total**", "**7.322.160**", "**100 %**"],
      ],
      note: "Presupuesto de una escribanía de Asunción, julio de 2026. No incluye la comisión inmobiliaria ni el IVA de la venta, que la desarrolladora incluye en el precio.",
    },
    { type: "h2", id: "que-es-cada-linea", text: "Qué es cada línea y de dónde sale el número" },
    {
      type: "ul",
      items: [
        `**Tasas judiciales: 2.885.000.** Es la tasa de inscripción del inmueble a tu nombre en el Registro: **0,85 %** sobre el mayor valor entre el precio y el valor fiscal (Ley 7424/2025) ([BuscaEscribanía](${U.buscaescribania})). 0,85 % de Gs. 339 millones da justo esos Gs. 2,88 millones. Es la línea más grande del presupuesto y no se negocia.`,
        `**Impuesto municipal a la transferencia: 1.017.000.** En Asunción es el **0,3 %** del valor (Ley 881/81); en el interior, 0,2 % ([BuscaEscribanía](${U.buscaescribania})). 0,3 % de Gs. 339 millones = Gs. 1,02 millones.`,
        "**Certificados: 255.000 cada uno.** Antes de firmar, la escribanía pide certificados que prueban que el vendedor no tiene inhibiciones (anotaciones personales), que el inmueble está en catastro y sin gravámenes (catastral registral) y que no debe impuesto inmobiliario (municipal). Después de la firma, la expedición de la copia y el trámite de inscripción. Cada uno viene con su tasa más la gestión.",
        "**Gastos administrativos: 640.000.** Hojas de protocolo y de seguridad, sellados, traslados y la gestión del trámite. Suele rondar los 5 jornales mínimos.",
        `**Honorarios: 1.356.000 + IVA 149.160.** El arancel notarial (Ley 1307/87) fija una escala que baja a medida que sube el valor: 2 % hasta Gs. 50 millones y **0,75 % por encima de Gs. 200 millones** ([Ley 1307/87](${U.ley1307}), [Holacasa](${U.holacasa})). Para este departamento, el 0,75 % serían unos Gs. 2,5 millones; el presupuesto tiene un descuento y queda en Gs. 1,36 millones. Los honorarios son la única línea que se puede negociar, y siempre llevan 10 % de IVA.`,
      ],
    },
    { type: "cta" },
    { type: "h2", id: "como-estimar", text: "Cómo estimar tu propio presupuesto" },
    {
      type: "p",
      text: "Con las reglas de arriba podés armar una estimación en dos minutos. Sobre el valor del inmueble en guaraníes:",
    },
    {
      type: "ol",
      items: [
        "**Tasa de inscripción:** 0,85 % del valor.",
        "**Impuesto municipal:** 0,3 % en Asunción (0,2 % en el interior).",
        "**Honorarios:** 0,75 % si el inmueble vale más de Gs. 200 millones (unos USD 35.000); más abajo, entre 1 % y 2 %. Sumale 10 % de IVA.",
        "**Certificados y gastos:** entre Gs. 1,5 y 2 millones, bastante fijos sin importar el valor.",
      ],
    },
    {
      type: "table",
      head: ["Valor del inmueble", "Estimación de escrituración", "% del valor"],
      rows: [
        ["USD 40.000 (Gs. 230 M)", "Gs. 5,9–6,4 M", "2,6–2,8 %"],
        ["USD 58.870 (el caso real)", "Gs. 7,3 M", "2,2 %"],
        ["USD 100.000 (Gs. 576 M)", "Gs. 12,1–13,5 M", "2,1–2,3 %"],
        ["USD 150.000 (Gs. 864 M)", "Gs. 17,6–20 M", "2,0–2,3 %"],
      ],
      note: "Estimación propia con 0,85 % + 0,3 % + 0,75 % (+ IVA) + Gs. 1,5–2 M de certificados y gastos, al cambio de Gs. 5.760 por USD. Cuanto más barato el inmueble, más pesan los costos fijos.",
    },
    { type: "h2", id: "quien-paga-y-cuando", text: "Quién paga y cuándo" },
    {
      type: "ul",
      items: [
        `**Lo paga el comprador** por costumbre del mercado, aunque se puede pactar otra cosa en el contrato ([Holacasa](${U.holacasa})).`,
        "**El vendedor paga lo suyo:** el impuesto a la renta por la venta, que la escribanía le retiene en la firma, y el certificado de no adeudar impuesto inmobiliario.",
        "**En dos pagos:** en este presupuesto, 50 % al iniciar el trámite (para pedir certificados y pagar tasas) y 50 % al terminar.",
        `**Plazo:** el estudio de títulos lleva de 5 a 10 días; la inscripción en el Registro, hasta 30 días hábiles desde la presentación ([BuscaEscribanía](${U.buscaescribania})).`,
        `**Si comprás desde el exterior** se suma un poder especial, de unos 5 jornales, y la apostilla de tus documentos. Lo explico en [Cómo invertir en Paraguay siendo extranjero](${L.foreigners}).`,
      ],
    },
    { type: "h2", id: "lo-que-no-esta", text: "Lo que no está en este presupuesto" },
    {
      type: "ul",
      items: [
        "**El IVA de la venta (1,5 % sobre el precio)** cuando el vendedor es una empresa, como una desarrolladora. Suele estar incluido en el precio de lista: confirmalo antes de firmar.",
        "**La comisión inmobiliaria,** que la paga quien contrató a la inmobiliaria, en general el vendedor.",
        `**Si comprás en pozo,** la escritura se firma al terminar la obra; mientras tanto firmás un contrato. Qué revisar antes está en [Comprar en pozo](${L.offPlan}).`,
        `**Los costos de tener el inmueble después:** impuesto inmobiliario anual, expensas e impuesto a la renta del alquiler. Están en la [guía de inversión en Asunción](${L.guide}).`,
      ],
    },
    {
      type: "p",
      text: `Si estás comparando departamentos, sumá un 2 a 3 % de escrituración al precio de cada uno para ver el costo real. ¿Querés ver opciones? [Mirá las propiedades](${L.properties}) o escribime y te paso la estimación de tu caso.`,
    },
    { type: "cta" },
  ],
};

const en: LocalizedArticle = {
  title: "How much it costs to deed an apartment in Paraguay: a real quote, line by line",
  metaTitle: "Cost of deeding an apartment in Paraguay (real quote)",
  description:
    "A real notary quote for deeding a USD 58,870 apartment in Asunción: PYG 7,322,160 (2.2%). Registry fees, tax, certificates and notary fees explained.",
  excerpt:
    "A real deed-and-registration quote, line by line: what each item is, where the number comes from and how to estimate yours.",
  lead:
    "When you ask how much it costs to deed a property, the usual answer is \"between 2 and 3%\". True, but useless for planning. Here is a real quote from an Asunción notary, from July 2026, for deeding an apartment: every line, what it is, where the number comes from and how to work out yours.",
  readingTime: "7 min read",
  updatedLabel: "Updated: Nov 15, 2026",
  authorRole: "Real estate advisor at SkyOne",
  tocTitle: "In this article",
  sourcesTitle: "Sources",
  disclaimer:
    "This article is for information only. The amounts come from a real quote from an Asunción notary, July 2026 and may vary by notary, municipality, the property's fiscal value and the current minimum daily wage. Always ask for your quote in writing.",
  cta: {
    title: "Want to know what deeding would cost you?",
    text: "Send me the apartment's price and city and I will put together an estimate with this same structure.",
    guide: "Download the free guide",
    call: "Book a call",
    whatsapp: "Message on WhatsApp",
    whatsappMessage:
      "Hi Julia, I read your article on deeding costs and I would like an estimate for my case.",
  },
  blocks: [
    { type: "h2", id: "el-caso", text: "The case: a USD 58,870 apartment in Asunción" },
    {
      type: "p",
      text: "Purchase of a finished apartment from a developer in Asunción for **USD 58,870** (about PYG 339 million at the July 2026 rate). Total deed-and-registration quote: **PYG 7,322,160**, about **USD 1,270** or **2.2%** of the price. In this case, 50% is paid to start the process and the rest on completion.",
    },
    {
      type: "table",
      head: ["Item", "Amount (PYG)", "% of total"],
      rows: [
        ["Court/registry fees (registration of title)", "2,885,000", "39%"],
        ["Municipal transfer tax", "1,017,000", "14%"],
        ["Administrative expenses", "640,000", "9%"],
        ["Personal annotations certificate", "255,000", "3%"],
        ["Cadastral-registry certificate", "255,000", "3%"],
        ["Municipal certificate", "255,000", "3%"],
        ["Issuance of certified copy", "255,000", "3%"],
        ["Registration filing at the DGRP", "255,000", "3%"],
        ["Notary fees (discounted)", "1,356,000", "19%"],
        ["VAT on notary fees (10%)", "149,160", "2%"],
        ["**Total**", "**7,322,160**", "**100%**"],
      ],
      note: "Quote from an Asunción notary, July 2026. It excludes the real estate commission and VAT on the sale, which the developer includes in the price.",
    },
    { type: "h2", id: "que-es-cada-linea", text: "What each line is and where the number comes from" },
    {
      type: "ul",
      items: [
        `**Court/registry fees: 2,885,000.** This is the fee for registering the property in your name: **0.85%** of the higher of the price and the fiscal value (Law 7424/2025) ([BuscaEscribanía](${U.buscaescribania})). 0.85% of PYG 339 million is exactly those PYG 2.88 million. It is the largest line and it is not negotiable.`,
        `**Municipal transfer tax: 1,017,000.** In Asunción it is **0.3%** of the value (Law 881/81); elsewhere, 0.2% ([BuscaEscribanía](${U.buscaescribania})). 0.3% of PYG 339 million = PYG 1.02 million.`,
        "**Certificates: 255,000 each.** Before signing, the notary requests certificates proving the seller has no restraining orders (personal annotations), that the property is in the cadastre and free of liens (cadastral-registry) and that no property tax is owed (municipal). After signing, the certified copy and the registration filing. Each one is the fee plus handling.",
        "**Administrative expenses: 640,000.** Protocol and security sheets, stamps, travel and processing. Usually around 5 minimum daily wages.",
        `**Notary fees: 1,356,000 + VAT 149,160.** The notarial tariff (Law 1307/87) sets a sliding scale: 2% up to PYG 50 million, down to **0.75% above PYG 200 million** ([Law 1307/87](${U.ley1307}), [Holacasa](${U.holacasa})). For this apartment, 0.75% would be about PYG 2.5 million; the quote applies a discount and comes to PYG 1.36 million. Fees are the only negotiable line, and they always carry 10% VAT.`,
      ],
    },
    { type: "cta" },
    { type: "h2", id: "como-estimar", text: "How to estimate your own quote" },
    {
      type: "p",
      text: "With the rules above you can build an estimate in two minutes. On the property's value in guaraníes:",
    },
    {
      type: "ol",
      items: [
        "**Registration fee:** 0.85% of the value.",
        "**Municipal tax:** 0.3% in Asunción (0.2% elsewhere).",
        "**Notary fees:** 0.75% if the property is worth more than PYG 200 million (about USD 35,000); below that, 1% to 2%. Add 10% VAT.",
        "**Certificates and expenses:** between PYG 1.5 and 2 million, fairly fixed regardless of value.",
      ],
    },
    {
      type: "table",
      head: ["Property value", "Estimated deeding cost", "% of value"],
      rows: [
        ["USD 40,000 (PYG 230 M)", "PYG 5.9–6.4 M", "2.6–2.8%"],
        ["USD 58,870 (the real case)", "PYG 7.3 M", "2.2%"],
        ["USD 100,000 (PYG 576 M)", "PYG 12.1–13.5 M", "2.1–2.3%"],
        ["USD 150,000 (PYG 864 M)", "PYG 17.6–20 M", "2.0–2.3%"],
      ],
      note: "My own estimate using 0.85% + 0.3% + 0.75% (+ VAT) + PYG 1.5–2 M in certificates and expenses, at PYG 5,760 per USD. The cheaper the property, the more the fixed costs weigh.",
    },
    { type: "h2", id: "quien-paga-y-cuando", text: "Who pays and when" },
    {
      type: "ul",
      items: [
        `**The buyer pays** by market custom, though the contract can say otherwise ([Holacasa](${U.holacasa})).`,
        "**The seller pays their own:** income tax on the sale, which the notary withholds at signing, and the certificate of no property tax owed.",
        "**In two payments:** in this quote, 50% to start (to request certificates and pay fees) and 50% on completion.",
        `**Timing:** the title search takes 5 to 10 days; registration, up to 30 business days from filing ([BuscaEscribanía](${U.buscaescribania})).`,
        `**If you buy from abroad,** add a special power of attorney, about 5 minimum daily wages, and the apostille of your documents. I explain it in [How to invest in Paraguay as a foreigner](${L.foreigners}).`,
      ],
    },
    { type: "h2", id: "lo-que-no-esta", text: "What this quote does not include" },
    {
      type: "ul",
      items: [
        "**VAT on the sale (1.5% of the price)** when the seller is a company, such as a developer. It is usually included in the list price: confirm before signing.",
        "**The real estate commission,** paid by whoever hired the agency, usually the seller.",
        `**If you buy off-plan,** the deed is signed when construction ends; until then you sign a contract. What to check first is in [Buying off-plan](${L.offPlan}).`,
        `**The cost of owning afterwards:** annual property tax, building fees and tax on rental income. They are in the [Asunción investment guide](${L.guide}).`,
      ],
    },
    {
      type: "p",
      text: `If you are comparing apartments, add 2 to 3% for deeding to each price to see the real cost. Want to see options? [Browse properties](${L.properties}) or message me and I will send you the estimate for your case.`,
    },
    { type: "cta" },
  ],
};

const pt: LocalizedArticle = {
  title: "Quanto custa escriturar um apartamento no Paraguai: um orçamento real, linha por linha",
  metaTitle: "Quanto custa escriturar um apartamento no Paraguai",
  description:
    "Orçamento real de escrituração de um apartamento de USD 58.870 em Assunção: PYG 7.322.160 (2,2%). Taxas, imposto municipal, certidões e honorários.",
  excerpt:
    "Um orçamento real de escrituração, linha por linha: o que é cada item, de onde sai o número e como estimar o seu.",
  lead:
    "Quando você pergunta quanto custa escriturar, a resposta típica é \"entre 2 e 3%\". É verdade, mas não serve para planejar. Aqui mostro um orçamento real de um cartório de Assunção, de julho de 2026, para escriturar um apartamento: cada linha, o que é, de onde sai o número e como calcular o seu.",
  readingTime: "7 min de leitura",
  updatedLabel: "Atualizado: 15 nov 2026",
  authorRole: "Consultora imobiliária na SkyOne",
  tocTitle: "Neste artigo",
  sourcesTitle: "Fontes",
  disclaimer:
    "Este artigo é informativo. Os valores são de um orçamento real de um cartório de Assunção, de julho de 2026 e podem variar conforme o cartório, o município, o valor fiscal do imóvel e o salário-dia mínimo vigente. Peça sempre seu orçamento por escrito.",
  cta: {
    title: "Quer saber quanto custaria escriturar no seu caso?",
    text: "Me envie o valor do apartamento e a cidade, e monto uma estimativa com esta mesma estrutura.",
    guide: "Baixar o guia gratuito",
    call: "Agendar uma ligação",
    whatsapp: "Falar pelo WhatsApp",
    whatsappMessage:
      "Olá Julia, li seu artigo sobre o custo de escriturar e quero uma estimativa para o meu caso.",
  },
  blocks: [
    { type: "h2", id: "el-caso", text: "O caso: um apartamento de USD 58.870 em Assunção" },
    {
      type: "p",
      text: "Compra de um apartamento pronto de uma incorporadora, em Assunção, por **USD 58.870** (cerca de PYG 339 milhões ao câmbio de julho de 2026). Orçamento total de escrituração: **PYG 7.322.160**, ou seja, cerca de **USD 1.270** ou **2,2%** do preço. Neste caso, paga-se 50% ao iniciar o processo e o restante ao concluir.",
    },
    {
      type: "table",
      head: ["Item", "Valor (PYG)", "% do total"],
      rows: [
        ["Taxas judiciais (registro do título)", "2.885.000", "39%"],
        ["Imposto municipal de transferência", "1.017.000", "14%"],
        ["Despesas administrativas", "640.000", "9%"],
        ["Certidão de anotações pessoais", "255.000", "3%"],
        ["Certidão cadastral-registral", "255.000", "3%"],
        ["Certidão municipal", "255.000", "3%"],
        ["Expedição de cópia", "255.000", "3%"],
        ["Protocolo de registro na DGRP", "255.000", "3%"],
        ["Honorários profissionais (com desconto)", "1.356.000", "19%"],
        ["IVA sobre honorários (10%)", "149.160", "2%"],
        ["**Total**", "**7.322.160**", "**100%**"],
      ],
      note: "Orçamento de um cartório de Assunção, julho de 2026. Não inclui a comissão imobiliária nem o IVA da venda, que a incorporadora inclui no preço.",
    },
    { type: "h2", id: "que-es-cada-linea", text: "O que é cada linha e de onde sai o número" },
    {
      type: "ul",
      items: [
        `**Taxas judiciais: 2.885.000.** É a taxa de registro do imóvel em seu nome: **0,85%** sobre o maior valor entre o preço e o valor fiscal (Lei 7424/2025) ([BuscaEscribanía](${U.buscaescribania})). 0,85% de PYG 339 milhões dá exatamente esses PYG 2,88 milhões. É a maior linha do orçamento e não é negociável.`,
        `**Imposto municipal de transferência: 1.017.000.** Em Assunção é **0,3%** do valor (Lei 881/81); no interior, 0,2% ([BuscaEscribanía](${U.buscaescribania})). 0,3% de PYG 339 milhões = PYG 1,02 milhão.`,
        "**Certidões: 255.000 cada.** Antes de assinar, o cartório pede certidões que provam que o vendedor não tem impedimentos (anotações pessoais), que o imóvel está no cadastro e sem ônus (cadastral-registral) e que não deve imposto imobiliário (municipal). Depois da assinatura, a expedição da cópia e o protocolo de registro. Cada uma inclui a taxa mais o serviço.",
        "**Despesas administrativas: 640.000.** Folhas de protocolo e de segurança, selos, deslocamentos e o acompanhamento do processo. Costuma ficar em torno de 5 salários-dia mínimos.",
        `**Honorários: 1.356.000 + IVA 149.160.** A tabela notarial (Lei 1307/87) fixa uma escala que diminui conforme o valor sobe: 2% até PYG 50 milhões e **0,75% acima de PYG 200 milhões** ([Lei 1307/87](${U.ley1307}), [Holacasa](${U.holacasa})). Para este apartamento, 0,75% seriam cerca de PYG 2,5 milhões; o orçamento tem desconto e fica em PYG 1,36 milhão. Os honorários são a única linha negociável, e sempre levam 10% de IVA.`,
      ],
    },
    { type: "cta" },
    { type: "h2", id: "como-estimar", text: "Como estimar seu próprio orçamento" },
    {
      type: "p",
      text: "Com as regras acima você monta uma estimativa em dois minutos. Sobre o valor do imóvel em guaranis:",
    },
    {
      type: "ol",
      items: [
        "**Taxa de registro:** 0,85% do valor.",
        "**Imposto municipal:** 0,3% em Assunção (0,2% no interior).",
        "**Honorários:** 0,75% se o imóvel vale mais de PYG 200 milhões (cerca de USD 35.000); abaixo disso, entre 1% e 2%. Some 10% de IVA.",
        "**Certidões e despesas:** entre PYG 1,5 e 2 milhões, bastante fixos independentemente do valor.",
      ],
    },
    {
      type: "table",
      head: ["Valor do imóvel", "Estimativa de escrituração", "% do valor"],
      rows: [
        ["USD 40.000 (PYG 230 M)", "PYG 5,9–6,4 M", "2,6–2,8%"],
        ["USD 58.870 (o caso real)", "PYG 7,3 M", "2,2%"],
        ["USD 100.000 (PYG 576 M)", "PYG 12,1–13,5 M", "2,1–2,3%"],
        ["USD 150.000 (PYG 864 M)", "PYG 17,6–20 M", "2,0–2,3%"],
      ],
      note: "Estimativa própria com 0,85% + 0,3% + 0,75% (+ IVA) + PYG 1,5–2 M de certidões e despesas, ao câmbio de PYG 5.760 por USD. Quanto mais barato o imóvel, mais pesam os custos fixos.",
    },
    { type: "h2", id: "quien-paga-y-cuando", text: "Quem paga e quando" },
    {
      type: "ul",
      items: [
        `**Paga o comprador**, por costume do mercado, embora o contrato possa dizer outra coisa ([Holacasa](${U.holacasa})).`,
        "**O vendedor paga a parte dele:** o imposto de renda sobre a venda, que o cartório retém na assinatura, e a certidão de não dever imposto imobiliário.",
        "**Em dois pagamentos:** neste orçamento, 50% ao iniciar (para pedir certidões e pagar taxas) e 50% ao concluir.",
        `**Prazo:** a análise de títulos leva de 5 a 10 dias; o registro, até 30 dias úteis a partir do protocolo ([BuscaEscribanía](${U.buscaescribania})).`,
        `**Se você compra do exterior,** soma-se uma procuração especial, de cerca de 5 salários-dia, e o apostilamento dos seus documentos. Explico em [Como investir no Paraguai sendo estrangeiro](${L.foreigners}).`,
      ],
    },
    { type: "h2", id: "lo-que-no-esta", text: "O que não está neste orçamento" },
    {
      type: "ul",
      items: [
        "**O IVA da venda (1,5% sobre o preço)** quando o vendedor é uma empresa, como uma incorporadora. Costuma estar incluído no preço de tabela: confirme antes de assinar.",
        "**A comissão imobiliária,** paga por quem contratou a imobiliária, em geral o vendedor.",
        `**Se você compra na planta,** a escritura é assinada ao fim da obra; até lá você assina um contrato. O que conferir antes está em [Comprar na planta](${L.offPlan}).`,
        `**Os custos de manter o imóvel depois:** imposto imobiliário anual, condomínio e imposto sobre o aluguel. Estão no [guia de investimento em Assunção](${L.guide}).`,
      ],
    },
    {
      type: "p",
      text: `Se você está comparando apartamentos, some 2 a 3% de escrituração ao preço de cada um para ver o custo real. Quer ver opções? [Veja os imóveis](${L.properties}) ou me escreva e envio a estimativa do seu caso.`,
    },
    { type: "cta" },
  ],
};

export const deedCostArticle: ArticleDefinition = {
  slug: SLUG,
  published: PUBLISHED,
  updated: UPDATED,
  category: "guides",
  sources: SOURCES,
  content: { es, en, pt },
};
