import type {
  ArticleDefinition,
  ArticleSource,
  LocalizedArticle,
} from "@/lib/content/articles/types";

// Guía evergreen para las búsquedas con más impresiones en Search Console:
// "asuncion real estate investment", "invest in paraguay", "inversión
// inmobiliaria paraguay". Usa los mismos datos (y fuentes) de la landing de
// Asunción y del artículo para extranjeros: si cambian allá, cambiar acá.
//
// Rentabilidad bruta estimada = alquiler mensual por m² × 12 / precio por m²
//   USD 6 × 12 / 1.923 = 3,7 %  ·  USD 10 × 12 / 1.923 = 6,2 %
// Ejemplo de 40 m²: 40 × 1.923 = USD 76.920; alquiler 40 × 6–10 = USD 240–400.
const SLUG = "asuncion-real-estate-investment-guide";
const PUBLISHED = "2026-11-09";
const UPDATED = "2026-11-09";

const L = {
  asuncion: "/invertir-en/asuncion",
  mra: "/invertir-en/mariano-roque-alonso",
  luque: "/invertir-en/luque",
  foreigners: "/blog/invertir-en-paraguay-siendo-extranjero",
  ueno: "/blog/caso-ueno-bank-que-significa-para-invertir",
  impeachment: "/blog/juicio-politico-santiago-pena-que-paso-y-repercusiones",
  properties: "/bienes-raices",
};

const U = {
  censo: "https://www.ultimahora.com/top-10-de-las-ciudades-mas-pobladas-del-paraguay-segun-el-censo-2022",
  ubicaprop: "https://ubicaprop.com.py/precio-m2-asuncion-barrios/",
  alquileres: "https://www.lanacion.com.py/negocios/2026/04/13/alquileres-en-asuncion-precios-demanda-y-nuevas-reglas-del-mercado-en-barrios-exclusivos/",
  rioTimes: "https://www.riotimesonline.com/buying-property-paraguay-foreigners-2026/",
  ley2532: "https://www.bacn.gov.py/leyes-paraguayas/4025/ley-n-2532-establece-la-zona-de-seguridad-fronteriza-de-la-republica-del-paraguay",
  infonegocios: "https://infonegocios.com.py/infolegal/invertir-en-departamentos-en-paraguay-introduccion-general-para-el-inversionista",
  impuestos: "https://www.ultimahora.com/paraguay-ofrece-5-ventajas-impositivas-a-inversionistas",
  investorPass: "https://www.lanacion.com.py/negocios/2026/04/17/paraguay-lanza-investor-pass-para-otorgar-residencia-a-extranjeros-que-inviertan-desde-usd-150000/",
  bonos: "https://www.abc.com.py/negocios/2026/11/06/en-medio-de-la-crisis-de-ueno-bank-precios-de-bonos-soberanos-de-paraguay-se-desploman/",
};

const SOURCES: ArticleSource[] = [
  { label: "UbicaProp — Precio por m² en Asunción por barrio (octubre 2026)", url: U.ubicaprop },
  { label: "La Nación — Alquileres en Asunción: precios y demanda (abril 2026)", url: U.alquileres },
  { label: "Última Hora / INE — Ciudades más pobladas, Censo 2022", url: U.censo },
  { label: "The Rio Times — Buying property in Paraguay as a foreigner (2026)", url: U.rioTimes },
  { label: "Ley N° 2532/05 — Zona de seguridad fronteriza (BACN)", url: U.ley2532 },
  { label: "InfoNegocios — Invertir en departamentos en Paraguay", url: U.infonegocios },
  { label: "Última Hora — Paraguay ofrece 5 ventajas impositivas a inversionistas (abril 2026)", url: U.impuestos },
  { label: "La Nación — Paraguay lanza Investor Pass (abril 2026)", url: U.investorPass },
  { label: "ABC Color — Bonos soberanos, riesgo país y calificación de Paraguay (6 nov 2026)", url: U.bonos },
];

const en: LocalizedArticle = {
  title: "Asunción real estate investment guide (2026): prices, rents and how to invest in Paraguay",
  metaTitle: "Asunción Real Estate Investment Guide 2026",
  description:
    "Price per m², rents, estimated yields, the buying process for foreigners, costs, taxes and residency for investing in Asunción, Paraguay.",
  excerpt:
    "Prices, rents and estimated yields in Asunción, how foreigners buy, what it costs and the current context, in one guide.",
  lead:
    "Asunción is where most real estate investment in Paraguay happens: it has the most tenants, the most buyers and the most new developments. This guide brings together what you need to decide: what an apartment costs, how much it rents for, what yield to expect, how a foreigner buys and what is happening in the country right now.",
  readingTime: "9 min read",
  updatedLabel: "Updated: Nov 9, 2026",
  authorRole: "Real estate advisor at SkyOne",
  tocTitle: "In this guide",
  sourcesTitle: "Sources",
  disclaimer:
    "This guide is for information only and does not replace advice from a notary, lawyer or accountant. Prices, rules and amounts change: check every figure before deciding.",
  cta: {
    title: "Want to see apartments that fit these numbers?",
    text: "In 20 minutes I will show you 2 or 3 options in Asunción with their price, expected rent and costs. No commitment.",
    guide: "Download the free guide",
    call: "Book a call",
    whatsapp: "Message on WhatsApp",
    whatsappMessage:
      "Hi Julia, I read your Asunción investment guide and I would like to see some options.",
  },
  blocks: [
    { type: "h2", id: "why-asuncion", text: "Why Asunción" },
    {
      type: "ul",
      items: [
        `**It is the largest market.** Asunción is the country's most populated city, with 462,241 residents, and concentrates offices, services and universities ([INE, 2022 Census](${U.censo})).`,
        "**More tenants and more buyers.** That means a vacant unit rents out sooner and selling takes less time than in smaller cities.",
        `**Established neighborhoods.** Villa Morra, Las Lomas and Recoleta concentrate demand from professionals and executives. I cover them in [Investing in Asunción](${L.asuncion}).`,
        `**Investment grade.** Moody's and S&P rate Paraguay at investment grade, at the lowest rung ([ABC](${U.bonos})).`,
      ],
    },
    { type: "h2", id: "prices-and-rents", text: "Prices, rents and yields in numbers" },
    {
      type: "table",
      head: ["Indicator", "Value"],
      rows: [
        ["Median asking price, apartments for sale", `USD 1,923/m² ([UbicaProp](${U.ubicaprop}))`],
        ["Average monthly rent", `USD 6–10/m², more in premium areas ([La Nación / Capadei](${U.alquileres}))`],
        ["Estimated gross yield", "3.7%–6.2% a year"],
        ["Example: 40 m² apartment", "Price about USD 76,900 · rent USD 240–400 a month"],
      ],
      note: "The gross yield and the example are my own estimates, calculated from these two medians: monthly rent per m² × 12 ÷ price per m².",
    },
    {
      type: "p",
      text: "Net yield is lower: building fees, property tax, income tax, furnishing, management and vacant months all come out of the rent. Studios and 1-bedroom units in demand areas tend to sit at the top of the range; large units, at the bottom. **Always compare a unit with the median of its exact neighborhood**, not the city average: price per m² varies a lot from one area to another.",
    },
    { type: "h2", id: "where", text: "Where to buy: Asunción or Greater Asunción" },
    {
      type: "ul",
      items: [
        `**Asunción:** more liquidity and appreciation, with a higher entry ticket. [See the area](${L.asuncion}).`,
        `**Mariano Roque Alonso:** a lower entry ticket and rental demand from university students. [See the area](${L.mra}).`,
        `**Luque:** close to the airport, with new infrastructure and developments. [See the area](${L.luque}).`,
      ],
    },
    { type: "h2", id: "foreigners", text: "Can foreigners buy property in Paraguay?" },
    {
      type: "p",
      text: `Yes. Foreigners can buy houses and apartments **with the same rights as Paraguayans**, without residency, without a local company and without traveling, by power of attorney ([The Rio Times](${U.rioTimes})). The one relevant restriction: people born in Argentina, Brazil or Bolivia cannot own **rural land** within 50 km of the border; it does not affect urban apartments such as those in Asunción ([Law 2532/05](${U.ley2532})).`,
    },
    {
      type: "ol",
      items: [
        "**Reservation:** a deposit takes the unit off the market (10–20% on resales; USD 1,000–5,000 off-plan).",
        "**Title check:** your notary checks ownership, liens and that property tax is paid.",
        "**Contract or deed:** off-plan you sign a contract with installments; for a finished unit, the public deed.",
        "**Registration** with the Public Registry. Only then is the property yours.",
      ],
    },
    {
      type: "p",
      text: `It usually takes **60 to 120 days** from accepted offer to registered title ([The Rio Times](${U.rioTimes})). Documents, buying without traveling and common mistakes are covered step by step in [How to invest in Paraguay as a foreigner](${L.foreigners}).`,
    },
    { type: "cta" },
    { type: "h2", id: "costs-taxes", text: "Costs and taxes" },
    {
      type: "table",
      head: ["Item", "Reference"],
      rows: [
        ["Deed and transfer", `Up to ~3% of the deed value, paid once ([InfoNegocios](${U.infonegocios}))`],
        ["Legal title check", "USD 300–600"],
        ["Property tax", "Annual and municipal; Paraguay has no wealth tax"],
        ["VAT on residential rent", `5% instead of the general 10% ([Última Hora](${U.impuestos}))`],
        ["Tax on rental income", `Residents: IRP of up to 8%. Non-residents: INR, 4.5% or 7.5% effective ([Última Hora](${U.impuestos}))`],
      ],
      note: "Indicative amounts. Ask the notary for a written quote and an accountant for your tax case.",
    },
    { type: "h2", id: "residency", text: "Does buying property get you residency?" },
    {
      type: "p",
      text: `Not automatically. Since April 2026 the **Investor Pass** grants direct permanent residency to investors; for real estate, the reported minimum is **USD 200,000** ([La Nación](${U.investorPass})). A smaller apartment does not qualify on its own, but you can apply through the general routes.`,
    },
    {
      type: "callout",
      title: "Current context (November 2026)",
      text: `In early November the central bank took over ueno bank and Congress removed President Santiago Peña; Pedro Alliana completes the term. Country risk rose and the rating is being watched. A deeded property stays registered in your name. I explain it in [The ueno bank case](${L.ueno}) and [The impeachment of Santiago Peña](${L.impeachment}).`,
    },
    { type: "h2", id: "checklist", text: "Checklist before you buy" },
    {
      type: "ol",
      items: [
        "Compare the price per m² with the median of the exact neighborhood.",
        "Calculate the net rent: subtract building fees, taxes, furnishing, management and at least one empty month a year.",
        "Off-plan, check how many buildings the developer has delivered, whether on time, and which bank the project works with.",
        "Use your own notary, not the seller's or the developer's.",
        "Keep proof of where your money comes from: the notary has to document it.",
        "Check which currency the contract is in and how much room you have if the exchange rate moves.",
      ],
    },
    {
      type: "p",
      text: `Want to see what is available today? [Browse properties](${L.properties}) or book a call and I will walk you through the options that pass this checklist.`,
    },
    { type: "cta" },
  ],
};

const es: LocalizedArticle = {
  title: "Guía de inversión inmobiliaria en Asunción (2026): precios, alquileres y cómo invertir en Paraguay",
  metaTitle: "Inversión inmobiliaria en Asunción: guía 2026",
  description:
    "Precio por m², alquileres, rentabilidad estimada, cómo compra un extranjero, costos, impuestos y residencia para invertir en Asunción, Paraguay.",
  excerpt:
    "Precios, alquileres y rentabilidad estimada en Asunción, cómo compra un extranjero, cuánto cuesta y el contexto actual, en una sola guía.",
  lead:
    "Asunción es donde se concentra la inversión inmobiliaria en Paraguay: tiene más inquilinos, más compradores y más proyectos nuevos. En esta guía junto lo que necesitás para decidir: cuánto cuesta un departamento, cuánto se alquila, qué rentabilidad esperar, cómo compra un extranjero y qué está pasando hoy en el país.",
  readingTime: "9 min de lectura",
  updatedLabel: "Actualizado: 9 nov 2026",
  authorRole: "Asesora inmobiliaria en SkyOne",
  tocTitle: "En esta guía",
  sourcesTitle: "Fuentes",
  disclaimer:
    "Esta guía es informativa y no reemplaza el asesoramiento de un escribano, abogado o contador. Los precios, las reglas y los montos cambian: verificá cada dato antes de decidir.",
  cta: {
    title: "¿Querés ver departamentos que cierren con estos números?",
    text: "En 20 minutos te muestro 2 o 3 opciones en Asunción con su precio, el alquiler esperado y los costos. Sin compromiso.",
    guide: "Descargar la guía gratuita",
    call: "Agendar una llamada",
    whatsapp: "Escribir por WhatsApp",
    whatsappMessage:
      "Hola Julia, leí tu guía para invertir en Asunción y quiero ver algunas opciones.",
  },
  blocks: [
    { type: "h2", id: "why-asuncion", text: "Por qué Asunción" },
    {
      type: "ul",
      items: [
        `**Es el mercado más grande.** Asunción es la ciudad más poblada del país, con 462.241 habitantes, y concentra oficinas, servicios y universidades ([INE, Censo 2022](${U.censo})).`,
        "**Más inquilinos y más compradores.** Una unidad vacía se alquila antes y vender lleva menos tiempo que en ciudades más chicas.",
        `**Barrios consolidados.** Villa Morra, Las Lomas y Recoleta concentran la demanda de profesionales y ejecutivos. Los detallo en [Invertir en Asunción](${L.asuncion}).`,
        `**Grado de inversión.** Moody's y S&P califican a Paraguay con grado de inversión, en el escalón más bajo ([ABC](${U.bonos})).`,
      ],
    },
    { type: "h2", id: "prices-and-rents", text: "Precios, alquileres y rentabilidad en números" },
    {
      type: "table",
      head: ["Indicador", "Valor"],
      rows: [
        ["Precio pedido mediano, departamentos en venta", `USD 1.923/m² ([UbicaProp](${U.ubicaprop}))`],
        ["Alquiler mensual promedio", `USD 6–10/m², más en barrios premium ([La Nación / Capadei](${U.alquileres}))`],
        ["Rentabilidad bruta estimada", "3,7 %–6,2 % anual"],
        ["Ejemplo: departamento de 40 m²", "Precio de unos USD 76.900 · alquiler de USD 240–400 por mes"],
      ],
      note: "La rentabilidad bruta y el ejemplo son estimaciones propias, calculadas con esas dos medianas: alquiler mensual por m² × 12 ÷ precio por m².",
    },
    {
      type: "p",
      text: "La rentabilidad neta es menor: expensas, impuesto inmobiliario, impuesto a la renta, amoblamiento, administración y meses vacíos salen del alquiler. Los monoambientes y 1 dormitorio en zonas con demanda suelen quedar en la parte alta del rango; las unidades grandes, en la baja. **Compará siempre con la mediana del barrio exacto**, no con el promedio de la ciudad: el precio por m² cambia mucho de una zona a otra.",
    },
    { type: "h2", id: "where", text: "Dónde comprar: Asunción o Gran Asunción" },
    {
      type: "ul",
      items: [
        `**Asunción:** más liquidez y plusvalía, con un ticket de entrada más alto. [Ver la zona](${L.asuncion}).`,
        `**Mariano Roque Alonso:** ticket de entrada más bajo y demanda de alquiler de estudiantes universitarios. [Ver la zona](${L.mra}).`,
        `**Luque:** cerca del aeropuerto, con obras de infraestructura y proyectos nuevos. [Ver la zona](${L.luque}).`,
      ],
    },
    { type: "h2", id: "foreigners", text: "¿Un extranjero puede comprar un inmueble en Paraguay?" },
    {
      type: "p",
      text: `Sí. Los extranjeros pueden comprar casas y departamentos **con los mismos derechos que un paraguayo**, sin residencia, sin empresa local y sin viajar, por poder ([The Rio Times](${U.rioTimes})). La única restricción relevante: quienes nacieron en Argentina, Brasil o Bolivia no pueden ser dueños de **tierras rurales** a menos de 50 km de la frontera; no afecta a departamentos urbanos como los de Asunción ([Ley 2532/05](${U.ley2532})).`,
    },
    {
      type: "ol",
      items: [
        "**Reserva:** una seña saca la unidad del mercado (10–20 % en reventas; USD 1.000–5.000 en pozo).",
        "**Estudio de títulos:** tu escribano revisa titularidad, gravámenes y que el impuesto inmobiliario esté pagado.",
        "**Contrato o escritura:** en pozo firmás un contrato con cuotas; en una unidad terminada, la escritura pública.",
        "**Inscripción** en los Registros Públicos. Recién ahí la propiedad es tuya.",
      ],
    },
    {
      type: "p",
      text: `De la oferta aceptada al título inscripto suelen pasar **60 a 120 días** ([The Rio Times](${U.rioTimes})). Los documentos, cómo comprar sin viajar y los errores más comunes están paso a paso en [Cómo invertir en Paraguay siendo extranjero](${L.foreigners}).`,
    },
    { type: "cta" },
    { type: "h2", id: "costs-taxes", text: "Costos e impuestos" },
    {
      type: "table",
      head: ["Concepto", "Referencia"],
      rows: [
        ["Escritura y transferencia", `Hasta ~3 % del valor escriturado, una sola vez ([InfoNegocios](${U.infonegocios}))`],
        ["Estudio de títulos", "USD 300–600"],
        ["Impuesto inmobiliario", "Anual y municipal; Paraguay no tiene impuesto al patrimonio"],
        ["IVA sobre alquiler residencial", `5 % en lugar del 10 % general ([Última Hora](${U.impuestos}))`],
        ["Impuesto a la renta del alquiler", `Residentes: IRP de hasta 8 %. No residentes: INR, 4,5 % o 7,5 % efectivo ([Última Hora](${U.impuestos}))`],
      ],
      note: "Montos orientativos. Pedile al escribano un presupuesto por escrito y a un contador que revise tu caso impositivo.",
    },
    { type: "h2", id: "residency", text: "¿Comprar un inmueble da residencia?" },
    {
      type: "p",
      text: `No automáticamente. Desde abril de 2026, el **Investor Pass** otorga residencia permanente directa a inversionistas; para inmuebles, el mínimo informado es de **USD 200.000** ([La Nación](${U.investorPass})). Un departamento más chico no alcanza por sí solo, pero podés tramitar la residencia por las vías generales.`,
    },
    {
      type: "callout",
      title: "Contexto actual (noviembre de 2026)",
      text: `A principios de noviembre el BCP intervino ueno bank y el Congreso destituyó al presidente Santiago Peña; Pedro Alliana completa el mandato. Subió el riesgo país y la calificación está en observación. Un inmueble escriturado sigue inscripto a tu nombre. Lo explico en [Caso ueno bank](${L.ueno}) y en [Juicio político a Santiago Peña](${L.impeachment}).`,
    },
    { type: "h2", id: "checklist", text: "Checklist antes de comprar" },
    {
      type: "ol",
      items: [
        "Compará el precio por m² con la mediana del barrio exacto.",
        "Calculá el alquiler neto: restá expensas, impuestos, amoblamiento, administración y al menos un mes vacío al año.",
        "En pozo, revisá cuántos edificios entregó la desarrolladora, si fue a tiempo y con qué banco trabaja el proyecto.",
        "Usá tu propio escribano, no el del vendedor ni el de la desarrolladora.",
        "Tené a mano el respaldo del origen de tus fondos: el escribano tiene que documentarlo.",
        "Revisá en qué moneda está el contrato y cuánto margen tenés si cambia el tipo de cambio.",
      ],
    },
    {
      type: "p",
      text: `¿Querés ver qué hay disponible hoy? [Mirá las propiedades](${L.properties}) o agendá una llamada y te muestro las opciones que pasan este checklist.`,
    },
    { type: "cta" },
  ],
};

const pt: LocalizedArticle = {
  title: "Guia de investimento imobiliário em Assunção (2026): preços, aluguéis e como investir no Paraguai",
  metaTitle: "Investimento imobiliário em Assunção: guia 2026",
  description:
    "Preço por m², aluguéis, rentabilidade estimada, como um estrangeiro compra, custos, impostos e residência para investir em Assunção, Paraguai.",
  excerpt:
    "Preços, aluguéis e rentabilidade estimada em Assunção, como um estrangeiro compra, quanto custa e o contexto atual, em um só guia.",
  lead:
    "Assunção é onde se concentra o investimento imobiliário no Paraguai: tem mais inquilinos, mais compradores e mais lançamentos. Neste guia reúno o que você precisa para decidir: quanto custa um apartamento, quanto rende de aluguel, que rentabilidade esperar, como um estrangeiro compra e o que está acontecendo hoje no país.",
  readingTime: "9 min de leitura",
  updatedLabel: "Atualizado: 9 nov 2026",
  authorRole: "Consultora imobiliária na SkyOne",
  tocTitle: "Neste guia",
  sourcesTitle: "Fontes",
  disclaimer:
    "Este guia é informativo e não substitui a orientação de um tabelião, advogado ou contador. Preços, regras e valores mudam: confira cada dado antes de decidir.",
  cta: {
    title: "Quer ver apartamentos que fechem com esses números?",
    text: "Em 20 minutos mostro 2 ou 3 opções em Assunção com preço, aluguel esperado e custos. Sem compromisso.",
    guide: "Baixar o guia gratuito",
    call: "Agendar uma ligação",
    whatsapp: "Falar pelo WhatsApp",
    whatsappMessage:
      "Olá Julia, li seu guia para investir em Assunção e quero ver algumas opções.",
  },
  blocks: [
    { type: "h2", id: "why-asuncion", text: "Por que Assunção" },
    {
      type: "ul",
      items: [
        `**É o maior mercado.** Assunção é a cidade mais populosa do país, com 462.241 habitantes, e concentra escritórios, serviços e universidades ([INE, Censo 2022](${U.censo})).`,
        "**Mais inquilinos e mais compradores.** Uma unidade vazia aluga mais rápido e vender leva menos tempo do que em cidades menores.",
        `**Bairros consolidados.** Villa Morra, Las Lomas e Recoleta concentram a demanda de profissionais e executivos. Detalho em [Investir em Assunção](${L.asuncion}).`,
        `**Grau de investimento.** Moody's e S&P classificam o Paraguai com grau de investimento, no degrau mais baixo ([ABC](${U.bonos})).`,
      ],
    },
    { type: "h2", id: "prices-and-rents", text: "Preços, aluguéis e rentabilidade em números" },
    {
      type: "table",
      head: ["Indicador", "Valor"],
      rows: [
        ["Preço pedido mediano, apartamentos à venda", `USD 1.923/m² ([UbicaProp](${U.ubicaprop}))`],
        ["Aluguel mensal médio", `USD 6–10/m², mais nos bairros premium ([La Nación / Capadei](${U.alquileres}))`],
        ["Rentabilidade bruta estimada", "3,7%–6,2% ao ano"],
        ["Exemplo: apartamento de 40 m²", "Preço de cerca de USD 76.900 · aluguel de USD 240–400 por mês"],
      ],
      note: "A rentabilidade bruta e o exemplo são estimativas próprias, calculadas com essas duas medianas: aluguel mensal por m² × 12 ÷ preço por m².",
    },
    {
      type: "p",
      text: "A rentabilidade líquida é menor: condomínio, imposto imobiliário, imposto de renda, mobília, administração e meses vagos saem do aluguel. Studios e unidades de 1 quarto em regiões com demanda costumam ficar na parte alta da faixa; unidades grandes, na baixa. **Compare sempre com a mediana do bairro exato**, não com a média da cidade: o preço por m² muda muito de uma região para outra.",
    },
    { type: "h2", id: "where", text: "Onde comprar: Assunção ou Grande Assunção" },
    {
      type: "ul",
      items: [
        `**Assunção:** mais liquidez e valorização, com ticket de entrada mais alto. [Ver a região](${L.asuncion}).`,
        `**Mariano Roque Alonso:** ticket de entrada mais baixo e demanda de aluguel de estudantes universitários. [Ver a região](${L.mra}).`,
        `**Luque:** perto do aeroporto, com obras de infraestrutura e novos empreendimentos. [Ver a região](${L.luque}).`,
      ],
    },
    { type: "h2", id: "foreigners", text: "Um estrangeiro pode comprar imóvel no Paraguai?" },
    {
      type: "p",
      text: `Sim. Estrangeiros podem comprar casas e apartamentos **com os mesmos direitos de um paraguaio**, sem residência, sem empresa local e sem viajar, por procuração ([The Rio Times](${U.rioTimes})). A única restrição relevante: quem nasceu na Argentina, no Brasil ou na Bolívia não pode ser dono de **terras rurais** a menos de 50 km da fronteira; isso não afeta apartamentos urbanos como os de Assunção ([Lei 2532/05](${U.ley2532})).`,
    },
    {
      type: "ol",
      items: [
        "**Reserva:** um sinal tira a unidade do mercado (10–20% em revendas; USD 1.000–5.000 na planta).",
        "**Análise de títulos:** seu tabelião verifica a titularidade, ônus e se o imposto imobiliário está pago.",
        "**Contrato ou escritura:** na planta você assina um contrato com parcelas; em uma unidade pronta, a escritura pública.",
        "**Registro** nos Registros Públicos. Só então o imóvel é seu.",
      ],
    },
    {
      type: "p",
      text: `Da oferta aceita ao título registrado costumam passar **60 a 120 dias** ([The Rio Times](${U.rioTimes})). Documentos, como comprar sem viajar e os erros mais comuns estão passo a passo em [Como investir no Paraguai sendo estrangeiro](${L.foreigners}).`,
    },
    { type: "cta" },
    { type: "h2", id: "costs-taxes", text: "Custos e impostos" },
    {
      type: "table",
      head: ["Item", "Referência"],
      rows: [
        ["Escritura e transferência", `Até ~3% do valor escriturado, uma única vez ([InfoNegocios](${U.infonegocios}))`],
        ["Análise de títulos", "USD 300–600"],
        ["Imposto imobiliário", "Anual e municipal; o Paraguai não tem imposto sobre patrimônio"],
        ["IVA sobre aluguel residencial", `5% em vez dos 10% gerais ([Última Hora](${U.impuestos}))`],
        ["Imposto de renda sobre aluguel", `Residentes: IRP de até 8%. Não residentes: INR, 4,5% ou 7,5% efetivo ([Última Hora](${U.impuestos}))`],
      ],
      note: "Valores indicativos. Peça ao tabelião um orçamento por escrito e a um contador que revise seu caso tributário.",
    },
    { type: "h2", id: "residency", text: "Comprar imóvel dá residência?" },
    {
      type: "p",
      text: `Não automaticamente. Desde abril de 2026, o **Investor Pass** concede residência permanente direta a investidores; para imóveis, o mínimo informado é de **USD 200.000** ([La Nación](${U.investorPass})). Um apartamento menor não basta sozinho, mas você pode pedir residência pelas vias gerais.`,
    },
    {
      type: "callout",
      title: "Contexto atual (novembro de 2026)",
      text: `No início de novembro o BCP interveio no ueno bank e o Congresso destituiu o presidente Santiago Peña; Pedro Alliana completa o mandato. O risco-país subiu e a classificação está sendo observada. Um imóvel escriturado continua registrado em seu nome. Explico em [Caso ueno bank](${L.ueno}) e em [Julgamento político de Santiago Peña](${L.impeachment}).`,
    },
    { type: "h2", id: "checklist", text: "Checklist antes de comprar" },
    {
      type: "ol",
      items: [
        "Compare o preço por m² com a mediana do bairro exato.",
        "Calcule o aluguel líquido: desconte condomínio, impostos, mobília, administração e pelo menos um mês vago por ano.",
        "Na planta, verifique quantos prédios a incorporadora entregou, se foi no prazo e com qual banco o projeto trabalha.",
        "Use seu próprio tabelião, não o do vendedor nem o da incorporadora.",
        "Tenha em mãos o comprovante da origem dos recursos: o tabelião precisa documentá-la.",
        "Verifique a moeda do contrato e quanta margem você tem se o câmbio mudar.",
      ],
    },
    {
      type: "p",
      text: `Quer ver o que está disponível hoje? [Veja os imóveis](${L.properties}) ou agende uma ligação e mostro as opções que passam por este checklist.`,
    },
    { type: "cta" },
  ],
};

export const asuncionGuideArticle: ArticleDefinition = {
  slug: SLUG,
  cover: {
    src: "/blog/guia-asuncion-hero.webp",
    og: "/blog/guia-asuncion-og.jpg",
    width: 1672,
    height: 941,
    alt: {
      es: "Libro \"Asunción Investment Guide\" junto a un pasaporte, una llave y la maqueta de un edificio de departamentos",
      en: "\"Asunción Investment Guide\" book next to a passport, a key and a scale model of an apartment building",
      pt: "Livro \"Asunción Investment Guide\" ao lado de um passaporte, uma chave e a maquete de um prédio de apartamentos",
    },
  },
  published: PUBLISHED,
  updated: UPDATED,
  category: "guides",
  sources: SOURCES,
  content: { es, en, pt },
};
