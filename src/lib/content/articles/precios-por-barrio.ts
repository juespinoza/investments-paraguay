import type {
  ArticleDefinition,
  ArticleSource,
  LocalizedArticle,
} from "@/lib/content/articles/types";

// Precios de departamentos por barrio en Asunción, con datos de TuLugar al
// 26 de noviembre de 2026 (precios de oferta, medianas). Revisar cada
// trimestre: TuLugar recalcula a diario.
const SLUG = "precios-departamentos-asuncion-por-barrio";
const PUBLISHED = "2026-11-26";
const UPDATED = "2026-11-26";

const L = {
  guide: "/blog/asuncion-real-estate-investment-guide",
  foreigners: "/blog/invertir-en-paraguay-siendo-extranjero",
  deedCost: "/blog/cuanto-cuesta-escriturar-un-departamento-en-paraguay",
  offPlan: "/blog/comprar-en-pozo-como-revisar-una-desarrolladora",
  rating: "/blog/grado-de-inversion-riesgo-pais-paraguay",
};

const U = {
  tulugar: "https://tulugar.com/es/mercado/paraguay/asuncion",
  tulugarAug: "https://tulugar.com/es/informes/paraguay/2026-08",
  rents: "https://www.lanacion.com.py/negocios/2026/04/13/alquileres-en-asuncion-precios-demanda-y-nuevas-reglas-del-mercado-en-barrios-exclusivos/",
};

const SOURCES: ArticleSource[] = [
  { label: "TuLugar — Mercado inmobiliario en Asunción: precios y $/m² (datos al 26 nov 2026)", url: U.tulugar },
  { label: "TuLugar — Informe del mercado inmobiliario de Paraguay (agosto 2026)", url: U.tulugarAug },
  { label: "La Nación — Alquileres en Asunción: precios y demanda en barrios exclusivos (13 abr 2026)", url: U.rents },
];

const es: LocalizedArticle = {
  title: "Precio de departamentos en Asunción por barrio (noviembre 2026)",
  metaTitle: "Precio de departamentos en Asunción por barrio (nov 2026)",
  description:
    "Precio por m² de departamentos en cada barrio de Asunción, los más caros y los más accesibles, alquileres y cómo comparar una unidad con su zona.",
  excerpt:
    "Cuánto cuesta el m² de un departamento en cada barrio de Asunción, qué zonas concentran la oferta y cómo usar estos números antes de comprar.",
  lead:
    "\"¿Está caro este departamento?\" La respuesta depende del barrio: en Asunción el metro cuadrado va de unos USD 1.000 a más de USD 2.000 según la zona. Acá están los precios por barrio con datos de noviembre de 2026, qué zonas concentran la oferta, cuánto se pide de alquiler y cómo usar estos números para comparar una unidad concreta.",
  readingTime: "7 min de lectura",
  updatedLabel: "Actualizado: 26 nov 2026",
  authorRole: "Asesora inmobiliaria en SkyOne",
  tocTitle: "En este artículo",
  sourcesTitle: "Fuentes",
  disclaimer:
    "Este artículo es informativo y no es una recomendación de inversión. Son precios de oferta que cambian a diario: verificá los datos actualizados antes de decidir.",
  cta: {
    title: "¿Querés saber si una unidad está bien de precio?",
    text: "Pasame el link o los datos del departamento y lo comparo con la mediana de su barrio.",
    guide: "Descargar la guía gratuita",
    call: "Agendar una llamada",
    whatsapp: "Escribir por WhatsApp",
    whatsappMessage:
      "Hola Julia, leí tu artículo de precios por barrio y quiero comparar un departamento con su zona.",
  },
  blocks: [
    {
      type: "callout",
      title: "De dónde salen los números",
      text: `Son medianas de precios de oferta (lo que se pide, no lo que se cierra en la escritura) de unas 80.000 publicaciones que monitorea [TuLugar](${U.tulugar}), con datos al 26 de noviembre de 2026. El precio final suele ser algo menor.`,
    },
    { type: "h2", id: "resumen", text: "Asunción en números" },
    {
      type: "p",
      text: `El índice de TuLugar ubica el m² de venta en Asunción en **USD 1.810** en noviembre de 2026; para departamentos, su tabla por tipo da **USD 1.766/m²** y una mediana de **USD 119.000** por unidad ([TuLugar](${U.tulugar})). En agosto, el m² de departamentos era USD 1.744 ([TuLugar](${U.tulugarAug})): el precio está estable.`,
    },
    {
      type: "table",
      head: ["Tipo", "Precio mediano", "USD/m²", "Publicaciones"],
      rows: [
        ["Monoambiente", "USD 79.000", "2.000", "101"],
        ["1 dormitorio", "USD 90.000", "1.810", "9.567"],
        ["2 dormitorios", "USD 148.000", "1.700", "10.087"],
        ["3 dormitorios", "USD 256.000", "1.763", "3.541"],
      ],
      note: `Departamentos en venta en Asunción, 26 nov 2026 ([TuLugar](${U.tulugar})). Los monoambientes tienen pocas publicaciones: tomá su número con cautela.`,
    },
    { type: "h2", id: "barrios-con-mas-oferta", text: "Los 10 barrios con más oferta" },
    {
      type: "p",
      text: "Son los barrios donde más se compra y se alquila, y donde las medianas son más confiables porque hay más publicaciones.",
    },
    {
      type: "table",
      head: ["Barrio", "USD/m²", "Precio mediano", "Alquiler mediano pedido"],
      rows: [
        ["Las Lomas (Carmelitas)", "2.063", "USD 129.000", "USD 1.100/mes"],
        ["San Jorge", "2.000", "USD 135.000", "USD 1.130/mes"],
        ["Madame Lynch", "2.000", "USD 126.000", "USD 1.100/mes"],
        ["Ycuá Satí", "1.979", "USD 130.000", "USD 1.200/mes"],
        ["Villa Morra", "1.918", "USD 114.000", "USD 1.031/mes"],
        ["Recoleta", "1.854", "USD 104.000", "USD 937/mes"],
        ["Mariscal Estigarribia", "1.853", "USD 124.000", "USD 1.015/mes"],
        ["Mburucuyá", "1.793", "USD 128.000", "USD 1.000/mes"],
        ["Luis Alberto de Herrera", "1.607", "USD 120.000", "USD 828/mes"],
        ["Las Mercedes", "1.600", "USD 125.000", "USD 859/mes"],
      ],
      note: `Departamentos, ordenados por USD/m². Precio y alquiler son medianas de todo el barrio, no de la misma unidad ([TuLugar](${U.tulugar})).`,
    },
    { type: "h2", id: "caros-y-accesibles", text: "Los barrios más caros y los más accesibles" },
    {
      type: "ul",
      items: [
        "**Más caros por m²:** San Juan (USD 2.300), Manorá (2.194), Santo Domingo (2.105), Las Lomas (2.063), Madame Lynch y San Jorge (2.000).",
        "**Más accesibles por m²:** San Roque (USD 1.027), Tacumbú (1.151), La Encarnación (1.163), Ricardo Brugada (1.196) y San Vicente (1.208).",
        "**Ojo con las muestras chicas.** San Juan tenía solo 37 departamentos publicados en agosto y Santo Domingo figuraba como muestra reducida: un par de unidades de lujo mueven mucho su mediana.",
      ],
    },
    {
      type: "p",
      text: `Que un barrio sea más barato no lo hace mejor inversión: los más accesibles suelen tener menos demanda de inquilinos y tardan más en venderse. Las zonas con más oferta y precios medios, como Recoleta o Mburucuyá, suelen ser el equilibrio entre precio de entrada y liquidez ([TuLugar](${U.tulugar})).`,
    },
    { type: "h2", id: "gran-asuncion", text: "Asunción frente a Gran Asunción" },
    {
      type: "table",
      head: ["Ciudad", "USD/m² departamentos", "Departamentos en venta"],
      rows: [
        ["Asunción", "1.744", "26.630"],
        ["Luque", "1.333", "2.780"],
        ["Mariano Roque Alonso", "1.271", "691"],
        ["Fernando de la Mora", "1.230", "1.281"],
        ["San Lorenzo", "1.167", "741"],
        ["Lambaré", "1.108", "382"],
      ],
      note: `Datos de agosto de 2026 ([TuLugar](${U.tulugarAug})).`,
    },
    {
      type: "p",
      text: "Fuera de Asunción el m² cuesta entre 24 % y 36 % menos, pero hay mucha menos oferta y menos demanda de alquiler. Luque y Mariano Roque Alonso son las alternativas con más movimiento.",
    },
    { type: "cta" },
    { type: "h2", id: "alquiler-y-rentabilidad", text: "Cuánto se alquila y qué rentabilidad da" },
    {
      type: "p",
      text: `Para comparar barrios conviene mirar el alquiler por m². En abril de 2026, Remax daba estos valores mensuales para las zonas premium ([La Nación](${U.rents})):`,
    },
    {
      type: "table",
      head: ["Barrio", "Alquiler por m² al mes", "Rentabilidad bruta estimada"],
      rows: [
        ["Las Lomas", "USD 13,50 (12 a 16)", "≈ 7,9 %"],
        ["Villa Morra", "≈ USD 12", "≈ 7,5 %"],
        ["Manorá", "USD 12,50", "≈ 6,8 %"],
        ["Ycuá Satí", "USD 11", "≈ 6,7 %"],
        ["Asunción, promedio (Capadei)", "USD 6 a 10", "≈ 4 % a 6,6 %"],
      ],
      note: "Rentabilidad bruta = alquiler anual por m² ÷ precio por m² de TuLugar (nov 2026). Cálculo propio con precios y alquileres de oferta: es una referencia, no un rendimiento garantizado.",
    },
    {
      type: "p",
      text: `La rentabilidad **neta** es menor: expensas, impuesto inmobiliario, impuesto a la renta, amueblado, administración y meses vacíos salen del alquiler. Los costos para extranjeros están en [cómo invertir en Paraguay siendo extranjero](${L.foreigners}) y el panorama completo, en la [guía de inversión en Asunción](${L.guide}).`,
    },
    { type: "h2", id: "como-usar", text: "Cómo usar estos números antes de comprar" },
    {
      type: "ol",
      items: [
        "**Calculá el m² de la unidad:** precio ÷ superficie cubierta. Si el anuncio suma balcones o cocheras, pedí la superficie cubierta sola.",
        "**Comparalo con la mediana de su barrio,** no con el promedio de la ciudad. Un 10 % arriba puede estar justificado por amenities o un piso alto; un 30 % arriba necesita una buena razón.",
        "**Recordá que son precios de oferta.** Hay margen para negociar, sobre todo en publicaciones con muchos meses en el mercado.",
        `**En pozo, compará con terminados de la misma zona.** El descuento por comprar antes tiene que ser real. Cómo revisar la desarrolladora está en [comprar en pozo](${L.offPlan}).`,
        `**Sumá 2 % a 3 % de escrituración** al precio para ver el costo real ([costo de escriturar](${L.deedCost})).`,
        "**Compará siempre con la misma fuente.** Cada portal mide distinto: mezclar números de dos portales da diferencias que no existen.",
      ],
    },
    {
      type: "p",
      text: `El contexto del país también pesa en el precio y en el crédito: lo explico en [grado de inversión y riesgo país](${L.rating}).`,
    },
    { type: "cta" },
  ],
};

const en: LocalizedArticle = {
  title: "Apartment prices in Asunción by neighborhood (November 2026)",
  metaTitle: "Asunción apartment prices by neighborhood (Nov 2026)",
  description:
    "Price per m² of apartments in each Asunción neighborhood, the most and least expensive areas, rents and how to compare a unit with its area.",
  excerpt:
    "What a square meter costs in each Asunción neighborhood, where most of the supply is and how to use these numbers before you buy.",
  lead:
    "\"Is this apartment expensive?\" It depends on the neighborhood: in Asunción a square meter ranges from about USD 1,000 to over USD 2,000 depending on the area. Here are prices by neighborhood with November 2026 data, where most of the supply is, what landlords ask in rent and how to use these numbers to judge a specific unit.",
  readingTime: "7 min read",
  updatedLabel: "Updated: Nov 26, 2026",
  authorRole: "Real estate advisor at SkyOne",
  tocTitle: "In this article",
  sourcesTitle: "Sources",
  disclaimer:
    "This article is for information only and is not investment advice. These are asking prices that change daily: check current figures before deciding.",
  cta: {
    title: "Want to know if a unit is fairly priced?",
    text: "Send me the link or the details of the apartment and I will compare it with its neighborhood median.",
    guide: "Download the free guide",
    call: "Book a call",
    whatsapp: "Message on WhatsApp",
    whatsappMessage:
      "Hi Julia, I read your article on prices by neighborhood and want to compare an apartment with its area.",
  },
  blocks: [
    {
      type: "callout",
      title: "Where the numbers come from",
      text: `These are medians of asking prices (what sellers ask, not what closes at the deed) across some 80,000 listings tracked by [TuLugar](${U.tulugar}), as of November 26, 2026. Final prices are usually somewhat lower.`,
    },
    { type: "h2", id: "resumen", text: "Asunción in numbers" },
    {
      type: "p",
      text: `TuLugar's index puts the sale price per m² in Asunción at **USD 1,810** in November 2026; for apartments, its table by type shows **USD 1,766/m²** and a median of **USD 119,000** per unit ([TuLugar](${U.tulugar})). In August, apartments were USD 1,744/m² ([TuLugar](${U.tulugarAug})): prices are stable.`,
    },
    {
      type: "table",
      head: ["Type", "Median price", "USD/m²", "Listings"],
      rows: [
        ["Studio", "USD 79,000", "2,000", "101"],
        ["1 bedroom", "USD 90,000", "1,810", "9,567"],
        ["2 bedrooms", "USD 148,000", "1,700", "10,087"],
        ["3 bedrooms", "USD 256,000", "1,763", "3,541"],
      ],
      note: `Apartments for sale in Asunción, Nov 26, 2026 ([TuLugar](${U.tulugar})). Studios have few listings: treat that figure with caution.`,
    },
    { type: "h2", id: "barrios-con-mas-oferta", text: "The 10 neighborhoods with the most supply" },
    {
      type: "p",
      text: "These are the neighborhoods where most buying and renting happens, and where medians are most reliable because there are more listings.",
    },
    {
      type: "table",
      head: ["Neighborhood", "USD/m²", "Median price", "Median asking rent"],
      rows: [
        ["Las Lomas (Carmelitas)", "2,063", "USD 129,000", "USD 1,100/mo"],
        ["San Jorge", "2,000", "USD 135,000", "USD 1,130/mo"],
        ["Madame Lynch", "2,000", "USD 126,000", "USD 1,100/mo"],
        ["Ycuá Satí", "1,979", "USD 130,000", "USD 1,200/mo"],
        ["Villa Morra", "1,918", "USD 114,000", "USD 1,031/mo"],
        ["Recoleta", "1,854", "USD 104,000", "USD 937/mo"],
        ["Mariscal Estigarribia", "1,853", "USD 124,000", "USD 1,015/mo"],
        ["Mburucuyá", "1,793", "USD 128,000", "USD 1,000/mo"],
        ["Luis Alberto de Herrera", "1,607", "USD 120,000", "USD 828/mo"],
        ["Las Mercedes", "1,600", "USD 125,000", "USD 859/mo"],
      ],
      note: `Apartments, sorted by USD/m². Price and rent are medians for the whole neighborhood, not for the same unit ([TuLugar](${U.tulugar})).`,
    },
    { type: "h2", id: "caros-y-accesibles", text: "The most and least expensive neighborhoods" },
    {
      type: "ul",
      items: [
        "**Most expensive per m²:** San Juan (USD 2,300), Manorá (2,194), Santo Domingo (2,105), Las Lomas (2,063), Madame Lynch and San Jorge (2,000).",
        "**Most affordable per m²:** San Roque (USD 1,027), Tacumbú (1,151), La Encarnación (1,163), Ricardo Brugada (1,196) and San Vicente (1,208).",
        "**Watch out for small samples.** San Juan had only 37 apartments listed in August and Santo Domingo was flagged as a reduced sample: a couple of luxury units move their median a lot.",
      ],
    },
    {
      type: "p",
      text: `A cheaper neighborhood is not automatically a better investment: the most affordable ones tend to have less tenant demand and take longer to sell. Areas with plenty of supply and mid-range prices, such as Recoleta or Mburucuyá, usually balance entry price and liquidity ([TuLugar](${U.tulugar})).`,
    },
    { type: "h2", id: "gran-asuncion", text: "Asunción vs. Greater Asunción" },
    {
      type: "table",
      head: ["City", "Apartments USD/m²", "Apartments for sale"],
      rows: [
        ["Asunción", "1,744", "26,630"],
        ["Luque", "1,333", "2,780"],
        ["Mariano Roque Alonso", "1,271", "691"],
        ["Fernando de la Mora", "1,230", "1,281"],
        ["San Lorenzo", "1,167", "741"],
        ["Lambaré", "1,108", "382"],
      ],
      note: `August 2026 data ([TuLugar](${U.tulugarAug})).`,
    },
    {
      type: "p",
      text: "Outside Asunción a square meter costs 24% to 36% less, but there is much less supply and less rental demand. Luque and Mariano Roque Alonso are the most active alternatives.",
    },
    { type: "cta" },
    { type: "h2", id: "alquiler-y-rentabilidad", text: "What apartments rent for and what they yield" },
    {
      type: "p",
      text: `To compare neighborhoods, look at rent per m². In April 2026, Remax gave these monthly figures for the premium areas ([La Nación](${U.rents})):`,
    },
    {
      type: "table",
      head: ["Neighborhood", "Rent per m² per month", "Estimated gross yield"],
      rows: [
        ["Las Lomas", "USD 13.50 (12 to 16)", "≈ 7.9%"],
        ["Villa Morra", "≈ USD 12", "≈ 7.5%"],
        ["Manorá", "USD 12.50", "≈ 6.8%"],
        ["Ycuá Satí", "USD 11", "≈ 6.7%"],
        ["Asunción, average (Capadei)", "USD 6 to 10", "≈ 4% to 6.6%"],
      ],
      note: "Gross yield = annual rent per m² ÷ TuLugar price per m² (Nov 2026). My own calculation from asking prices and asking rents: a reference, not a guaranteed return.",
    },
    {
      type: "p",
      text: `**Net** yield is lower: building fees, property tax, income tax, furnishing, management and empty months all come out of the rent. Costs for foreign buyers are in [how to invest in Paraguay as a foreigner](${L.foreigners}), and the full picture is in the [Asunción investment guide](${L.guide}).`,
    },
    { type: "h2", id: "como-usar", text: "How to use these numbers before you buy" },
    {
      type: "ol",
      items: [
        "**Work out the unit's price per m²:** price ÷ covered area. If the listing adds balconies or parking, ask for the covered area alone.",
        "**Compare it with its neighborhood median,** not the city average. 10% above can be justified by amenities or a high floor; 30% above needs a good reason.",
        "**Remember these are asking prices.** There is room to negotiate, especially on listings that have been on the market for months.",
        `**Off-plan, compare with finished units in the same area.** The discount for buying early has to be real. How to vet the developer is in [buying off-plan](${L.offPlan}).`,
        `**Add 2% to 3% for deeding** to the price to see the real cost ([closing costs](${L.deedCost})).`,
        "**Always compare within one source.** Each portal measures differently: mixing two portals creates differences that are not real.",
      ],
    },
    {
      type: "p",
      text: `The country's situation also affects prices and credit: I explain it in [investment grade and country risk](${L.rating}).`,
    },
    { type: "cta" },
  ],
};

const pt: LocalizedArticle = {
  title: "Preço de apartamentos em Assunção por bairro (novembro 2026)",
  metaTitle: "Preço de apartamentos em Assunção por bairro (nov 2026)",
  description:
    "Preço por m² de apartamentos em cada bairro de Assunção, os mais caros e os mais acessíveis, aluguéis e como comparar uma unidade com sua região.",
  excerpt:
    "Quanto custa o m² de um apartamento em cada bairro de Assunção, onde se concentra a oferta e como usar esses números antes de comprar.",
  lead:
    "\"Este apartamento está caro?\" Depende do bairro: em Assunção o metro quadrado vai de cerca de USD 1.000 a mais de USD 2.000 conforme a região. Aqui estão os preços por bairro com dados de novembro de 2026, onde se concentra a oferta, quanto se pede de aluguel e como usar esses números para avaliar uma unidade específica.",
  readingTime: "7 min de leitura",
  updatedLabel: "Atualizado: 26 nov 2026",
  authorRole: "Consultora imobiliária na SkyOne",
  tocTitle: "Neste artigo",
  sourcesTitle: "Fontes",
  disclaimer:
    "Este artigo é informativo e não é uma recomendação de investimento. São preços de oferta que mudam diariamente: confira os dados atualizados antes de decidir.",
  cta: {
    title: "Quer saber se uma unidade está com bom preço?",
    text: "Me envie o link ou os dados do apartamento e eu comparo com a mediana do bairro.",
    guide: "Baixar o guia gratuito",
    call: "Agendar uma ligação",
    whatsapp: "Falar pelo WhatsApp",
    whatsappMessage:
      "Olá Julia, li seu artigo de preços por bairro e quero comparar um apartamento com a região.",
  },
  blocks: [
    {
      type: "callout",
      title: "De onde vêm os números",
      text: `São medianas de preços de oferta (o que se pede, não o que se fecha na escritura) de cerca de 80.000 anúncios monitorados pelo [TuLugar](${U.tulugar}), com dados de 26 de novembro de 2026. O preço final costuma ser um pouco menor.`,
    },
    { type: "h2", id: "resumen", text: "Assunção em números" },
    {
      type: "p",
      text: `O índice do TuLugar coloca o m² de venda em Assunção em **USD 1.810** em novembro de 2026; para apartamentos, sua tabela por tipo mostra **USD 1.766/m²** e uma mediana de **USD 119.000** por unidade ([TuLugar](${U.tulugar})). Em agosto, o m² de apartamentos era USD 1.744 ([TuLugar](${U.tulugarAug})): o preço está estável.`,
    },
    {
      type: "table",
      head: ["Tipo", "Preço mediano", "USD/m²", "Anúncios"],
      rows: [
        ["Studio", "USD 79.000", "2.000", "101"],
        ["1 quarto", "USD 90.000", "1.810", "9.567"],
        ["2 quartos", "USD 148.000", "1.700", "10.087"],
        ["3 quartos", "USD 256.000", "1.763", "3.541"],
      ],
      note: `Apartamentos à venda em Assunção, 26 nov 2026 ([TuLugar](${U.tulugar})). Os studios têm poucos anúncios: use esse número com cautela.`,
    },
    { type: "h2", id: "barrios-con-mas-oferta", text: "Os 10 bairros com mais oferta" },
    {
      type: "p",
      text: "São os bairros onde mais se compra e se aluga, e onde as medianas são mais confiáveis porque há mais anúncios.",
    },
    {
      type: "table",
      head: ["Bairro", "USD/m²", "Preço mediano", "Aluguel mediano pedido"],
      rows: [
        ["Las Lomas (Carmelitas)", "2.063", "USD 129.000", "USD 1.100/mês"],
        ["San Jorge", "2.000", "USD 135.000", "USD 1.130/mês"],
        ["Madame Lynch", "2.000", "USD 126.000", "USD 1.100/mês"],
        ["Ycuá Satí", "1.979", "USD 130.000", "USD 1.200/mês"],
        ["Villa Morra", "1.918", "USD 114.000", "USD 1.031/mês"],
        ["Recoleta", "1.854", "USD 104.000", "USD 937/mês"],
        ["Mariscal Estigarribia", "1.853", "USD 124.000", "USD 1.015/mês"],
        ["Mburucuyá", "1.793", "USD 128.000", "USD 1.000/mês"],
        ["Luis Alberto de Herrera", "1.607", "USD 120.000", "USD 828/mês"],
        ["Las Mercedes", "1.600", "USD 125.000", "USD 859/mês"],
      ],
      note: `Apartamentos, ordenados por USD/m². Preço e aluguel são medianas de todo o bairro, não da mesma unidade ([TuLugar](${U.tulugar})).`,
    },
    { type: "h2", id: "caros-y-accesibles", text: "Os bairros mais caros e os mais acessíveis" },
    {
      type: "ul",
      items: [
        "**Mais caros por m²:** San Juan (USD 2.300), Manorá (2.194), Santo Domingo (2.105), Las Lomas (2.063), Madame Lynch e San Jorge (2.000).",
        "**Mais acessíveis por m²:** San Roque (USD 1.027), Tacumbú (1.151), La Encarnación (1.163), Ricardo Brugada (1.196) e San Vicente (1.208).",
        "**Cuidado com amostras pequenas.** San Juan tinha só 37 apartamentos anunciados em agosto e Santo Domingo aparecia como amostra reduzida: duas ou três unidades de luxo mexem muito na mediana.",
      ],
    },
    {
      type: "p",
      text: `Um bairro mais barato não é automaticamente um investimento melhor: os mais acessíveis costumam ter menos demanda de inquilinos e demoram mais para vender. Regiões com muita oferta e preços médios, como Recoleta ou Mburucuyá, costumam equilibrar preço de entrada e liquidez ([TuLugar](${U.tulugar})).`,
    },
    { type: "h2", id: "gran-asuncion", text: "Assunção e a Grande Assunção" },
    {
      type: "table",
      head: ["Cidade", "USD/m² apartamentos", "Apartamentos à venda"],
      rows: [
        ["Assunção", "1.744", "26.630"],
        ["Luque", "1.333", "2.780"],
        ["Mariano Roque Alonso", "1.271", "691"],
        ["Fernando de la Mora", "1.230", "1.281"],
        ["San Lorenzo", "1.167", "741"],
        ["Lambaré", "1.108", "382"],
      ],
      note: `Dados de agosto de 2026 ([TuLugar](${U.tulugarAug})).`,
    },
    {
      type: "p",
      text: "Fora de Assunção o m² custa entre 24% e 36% menos, mas há muito menos oferta e menos demanda de aluguel. Luque e Mariano Roque Alonso são as alternativas com mais movimento.",
    },
    { type: "cta" },
    { type: "h2", id: "alquiler-y-rentabilidad", text: "Quanto se aluga e qual rentabilidade dá" },
    {
      type: "p",
      text: `Para comparar bairros, vale olhar o aluguel por m². Em abril de 2026, a Remax deu estes valores mensais para as regiões premium ([La Nación](${U.rents})):`,
    },
    {
      type: "table",
      head: ["Bairro", "Aluguel por m² por mês", "Rentabilidade bruta estimada"],
      rows: [
        ["Las Lomas", "USD 13,50 (12 a 16)", "≈ 7,9%"],
        ["Villa Morra", "≈ USD 12", "≈ 7,5%"],
        ["Manorá", "USD 12,50", "≈ 6,8%"],
        ["Ycuá Satí", "USD 11", "≈ 6,7%"],
        ["Assunção, média (Capadei)", "USD 6 a 10", "≈ 4% a 6,6%"],
      ],
      note: "Rentabilidade bruta = aluguel anual por m² ÷ preço por m² do TuLugar (nov 2026). Cálculo próprio com preços e aluguéis de oferta: é uma referência, não um rendimento garantido.",
    },
    {
      type: "p",
      text: `A rentabilidade **líquida** é menor: condomínio, imposto imobiliário, imposto de renda, mobília, administração e meses vazios saem do aluguel. Os custos para estrangeiros estão em [como investir no Paraguai sendo estrangeiro](${L.foreigners}) e o panorama completo, no [guia de investimento em Assunção](${L.guide}).`,
    },
    { type: "h2", id: "como-usar", text: "Como usar esses números antes de comprar" },
    {
      type: "ol",
      items: [
        "**Calcule o m² da unidade:** preço ÷ área coberta. Se o anúncio soma varandas ou vagas, peça só a área coberta.",
        "**Compare com a mediana do bairro,** não com a média da cidade. 10% acima pode se justificar por amenities ou andar alto; 30% acima precisa de um bom motivo.",
        "**Lembre que são preços de oferta.** Há margem para negociar, sobretudo em anúncios com muitos meses no mercado.",
        `**Na planta, compare com prontos da mesma região.** O desconto por comprar antes precisa ser real. Como avaliar a incorporadora está em [comprar na planta](${L.offPlan}).`,
        `**Some 2% a 3% de escritura** ao preço para ver o custo real ([custo da escritura](${L.deedCost})).`,
        "**Compare sempre dentro da mesma fonte.** Cada portal mede de um jeito: misturar dois portais cria diferenças que não existem.",
      ],
    },
    {
      type: "p",
      text: `A situação do país também pesa no preço e no crédito: explico em [grau de investimento e risco-país](${L.rating}).`,
    },
    { type: "cta" },
  ],
};

export const neighborhoodPricesArticle: ArticleDefinition = {
  slug: SLUG,
  published: PUBLISHED,
  updated: UPDATED,
  category: "market",
  sources: SOURCES,
  content: { es, en, pt },
};
