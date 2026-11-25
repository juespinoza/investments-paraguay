import type {
  ArticleDefinition,
  ArticleSource,
  LocalizedArticle,
} from "@/lib/content/articles/types";

// Educación para el inversor extranjero: calificaciones, grado de inversión y
// riesgo país, con el estado de Paraguay al 25 de noviembre de 2026.
// Revisar cuando Fitch cierre la revisión negativa o cambie otra calificadora.
const SLUG = "grado-de-inversion-riesgo-pais-paraguay";
const PUBLISHED = "2026-11-25";
const UPDATED = "2026-11-25";

const L = {
  ueno: "/blog/caso-ueno-bank-que-significa-para-invertir",
  impeachment: "/blog/juicio-politico-santiago-pena-que-paso-y-repercusiones",
  guide: "/blog/asuncion-real-estate-investment-guide",
  foreigners: "/blog/invertir-en-paraguay-siendo-extranjero",
};

const U = {
  moodys2024: "https://www.abc.com.py/economia/2024/07/26/moodys-otorgo-al-pais-el-grado-de-inversion/",
  moodys2026: "https://www.ultimahora.com/moodys-mantiene-grado-de-inversion-a-paraguay-por-tercer-ano-consecutivo",
  sp2025: "https://www.abc.com.py/economia/2025/12/17/luz-verde-de-sp-en-calificacion-y-paraguay-obtiene-segundo-grado-de-inversion/",
  sp2026: "https://www.lanacion.com.py/negocios/2026/11/07/transicion-politica-no-altera-la-calificacion-de-paraguay-segun-sp-global-ratings/",
  fitchSep: "https://www.abc.com.py/negocios/2026/09/30/fitch-mantiene-calificacion-de-paraguay-en-bb-y-posterga-el-grado-de-inversion/",
  fitchNov: "https://www.abc.com.py/economia/2026/11/11/efecto-ueno-fitch-pone-a-paraguay-en-revision-negativa-lejos-del-grado-de-inversion/",
  bonos: "https://www.abc.com.py/negocios/2026/11/06/en-medio-de-la-crisis-de-ueno-bank-precios-de-bonos-soberanos-de-paraguay-se-desploman/",
  riesgoRegion: "https://www.lanacion.com.ar/economia/paradoja-por-que-paraguay-tiene-un-riesgo-pais-seis-veces-menor-que-la-argentina-pese-a-su-crisis-nid09112026/",
  oportunidades: "https://www.abc.com.py/negocios/2024/10/25/paraguay-con-grado-de-inversion-oportunidades-y-desafios/",
};

const SOURCES: ArticleSource[] = [
  { label: "ABC Color — Efecto ueno: Fitch pone a Paraguay en revisión negativa (11 nov 2026)", url: U.fitchNov },
  { label: "La Nación — S&P: la transición política no altera la calificación de Paraguay (7 nov 2026)", url: U.sp2026 },
  { label: "ABC Color — Bonos soberanos y riesgo país en medio de la crisis de ueno (6 nov 2026)", url: U.bonos },
  { label: "La Nación (Argentina) — Riesgo país de Paraguay y de la región (9 nov 2026)", url: U.riesgoRegion },
  { label: "ABC Color — Fitch ratifica BB+ y posterga el grado de inversión (30 sep 2026)", url: U.fitchSep },
  { label: "Última Hora — Moody's mantiene el grado de inversión de Paraguay (jul 2026)", url: U.moodys2026 },
  { label: "ABC Color — S&P otorga a Paraguay su segundo grado de inversión (17 dic 2025)", url: U.sp2025 },
  { label: "ABC Color — Paraguay con grado de inversión: oportunidades y desafíos (25 oct 2024)", url: U.oportunidades },
  { label: "ABC Color — Moody's otorga a Paraguay el grado de inversión (26 jul 2024)", url: U.moodys2024 },
];

const es: LocalizedArticle = {
  title: "Grado de inversión, riesgo país y calificaciones: qué significan para tu inversión en Paraguay",
  metaTitle: "Grado de inversión y riesgo país en Paraguay: qué significan",
  description:
    "Qué son las calificaciones, el grado de inversión y el riesgo país, dónde está Paraguay después de ueno y qué cambia para quien invierte en inmuebles.",
  excerpt:
    "Moody's, S&P y Fitch, grado de inversión y riesgo país explicados en simple, con el estado de Paraguay después de ueno y qué mirar como inversor.",
  lead:
    "Después de la caída de ueno bank y el juicio político, los titulares se llenaron de siglas: BBB-, Baa3, BB+, \"revisión negativa\", riesgo país en 143 puntos. Si estás invirtiendo o pensando invertir en Paraguay desde afuera, estas palabras importan, pero no por las razones que parecen. Acá te explico qué significa cada una, dónde está el país hoy y qué cambia (y qué no) para alguien que compra un departamento.",
  readingTime: "8 min de lectura",
  updatedLabel: "Actualizado: 25 nov 2026",
  authorRole: "Asesora inmobiliaria en SkyOne",
  tocTitle: "En este artículo",
  sourcesTitle: "Fuentes",
  disclaimer:
    "Este artículo es informativo y no es una recomendación de inversión. Las calificaciones y el riesgo país cambian: verificá los datos actualizados antes de decidir.",
  cta: {
    title: "¿Querés entender cómo afecta esto a tu inversión?",
    text: "Contame desde dónde invertís y qué estás evaluando, y en 20 minutos lo bajamos a tu caso concreto.",
    guide: "Descargar la guía gratuita",
    call: "Agendar una llamada",
    whatsapp: "Escribir por WhatsApp",
    whatsappMessage:
      "Hola Julia, leí tu artículo sobre grado de inversión y riesgo país y quiero consultarte por mi inversión.",
  },
  blocks: [
    {
      type: "callout",
      title: "Datos al 25 de noviembre de 2026",
      text: "Fitch tiene a Paraguay en revisión negativa y todavía no tomó una decisión final. Voy a actualizar este artículo cuando la tome.",
    },
    { type: "h2", id: "conceptos", text: "Tres conceptos en simple" },
    {
      type: "ul",
      items: [
        "**Calificación soberana.** Es la opinión de una agencia (Moody's, S&P o Fitch) sobre la capacidad del Estado de pagar su deuda. No califica inmuebles, bancos ni empresas privadas: califica al país como deudor.",
        "**Grado de inversión.** Es el escalón a partir del cual la deuda de un país se considera de riesgo bajo: **BBB- o más** en S&P y Fitch, **Baa3 o más** en Moody's. Muchos fondos y bancos internacionales solo pueden comprar deuda de países que estén en ese grupo.",
        "**Riesgo país.** Es el interés extra que el mercado le pide a un país por sobre los bonos de Estados Unidos, medido en puntos básicos por el índice EMBI de JP Morgan. 143 puntos significan 1,43 puntos porcentuales más de interés. Cambia todos los días, a diferencia de las calificaciones.",
      ],
    },
    {
      type: "p",
      text: "Una forma de pensarlo: la calificación es la nota del boletín, que se revisa pocas veces al año; el riesgo país es la cotización del día. Las dos miden lo mismo (qué tan probable es que el Estado pague), desde ángulos distintos.",
    },
    { type: "h2", id: "donde-esta-paraguay", text: "Dónde está Paraguay hoy" },
    {
      type: "table",
      head: ["Calificadora", "Nota y perspectiva", "Qué pasó"],
      rows: [
        ["Moody's", "**Baa3**, estable (grado de inversión)", `Le dio el grado de inversión en julio de 2024, el primero en la historia del país ([ABC](${U.moodys2024})), y lo ratificó en julio de 2026 ([Última Hora](${U.moodys2026})). No anunció cambios después de ueno.`],
        ["S&P", "**BBB-**, estable (grado de inversión)", `Lo subió a grado de inversión en diciembre de 2025 ([ABC](${U.sp2025})). El 7 de noviembre de 2026 dijo que la asunción de Alliana no cambia su evaluación, aunque advirtió riesgos fiscales por los depósitos públicos en ueno ([La Nación](${U.sp2026})).`],
        ["Fitch", "**BB+**, en revisión negativa (un escalón debajo del grado)", `En septiembre tenía perspectiva positiva ([ABC](${U.fitchSep})). El 11 de noviembre se la quitó y puso a Paraguay en revisión negativa por la caída de ueno, el juicio político y el deterioro fiscal ([ABC](${U.fitchNov})).`],
      ],
      note: "Revisión negativa no es una baja: significa que la calificadora está evaluando bajar la nota y lo decidirá más adelante.",
    },
    {
      type: "table",
      head: ["Riesgo país (EMBI)", "Puntos básicos"],
      rows: [
        ["Paraguay, 2 de noviembre (antes de la crisis)", `125 ([ABC](${U.bonos}))`],
        ["Paraguay, 5 de noviembre (pico durante el día)", `157 ([ABC](${U.bonos}))`],
        ["Paraguay, después de la destitución", `143 ([La Nación](${U.riesgoRegion}))`],
        ["Uruguay · Chile · Perú", "85 · 104 · 121"],
        ["Brasil · Argentina", "202 · 939"],
      ],
      note: `Comparación regional al 9 de noviembre de 2026 ([La Nación](${U.riesgoRegion})).`,
    },
    {
      type: "p",
      text: `Lo que dicen estos números: la crisis movió el riesgo país, pero Paraguay sigue entre los países menos riesgosos de la región, debajo de Brasil y muy lejos de Argentina. El punto delicado es otro: Moody's y S&P lo tienen en el **último escalón** del grado de inversión. Si cualquiera de las dos lo baja, Paraguay sale del grado de inversión en los índices internacionales ([ABC](${U.bonos})).`,
    },
    { type: "h2", id: "por-que-fitch", text: "Por qué Fitch puso a Paraguay en revisión negativa" },
    {
      type: "ul",
      items: [
        `**Depósitos sin garantía en ueno.** El Fondo de Garantía cubre a cerca del 97 % de los ahorristas, pero quedan unos **USD 2.100 millones** sin cobertura, de los cuales unos USD 900 millones son del sector público y la mitad, del IPS. Fitch advierte que el Estado podría verse presionado a cubrirlos, por alrededor del 1,5 % del PIB ([ABC](${U.fitchNov})).`,
        `**Déficit fiscal.** Proyecta un déficit de 3,2 % del PIB en 2026 y 3,9 % en 2027, y ve improbable la meta de 1,5 % para 2028 ([ABC](${U.fitchNov})).`,
        `**Financiamiento más caro.** Estima que Paraguay tendrá que salir a los mercados internacionales a principios de 2027, a tasas más altas por el mayor riesgo país ([ABC](${U.fitchNov})).`,
        `**Instituciones.** Señala debilidades en control de la corrupción, Estado de derecho y supervisión bancaria, y menciona el juicio político y el cambio de gobierno ([ABC](${U.fitchNov})). Lo explico en [Juicio político a Santiago Peña](${L.impeachment}).`,
      ],
    },
    { type: "cta" },
    { type: "h2", id: "que-cambia", text: "Qué cambia para vos si invertís en inmuebles" },
    {
      type: "p",
      text: "**Lo que no cambia:** tu departamento está inscripto a tu nombre en los Registros Públicos. Ninguna calificación, ni un cambio de gobierno, ni la caída de un banco cambian esa titularidad. La calificación evalúa al Estado como deudor, no al mercado inmobiliario.",
    },
    {
      type: "p",
      text: "**Lo que puede cambiar, de forma indirecta:**",
    },
    {
      type: "ul",
      items: [
        `**El costo del crédito.** Cuando el riesgo país sube, al Estado y a los bancos les cuesta más financiarse afuera, y eso tiende a trasladarse a las tasas de los préstamos, incluidos los hipotecarios. Si vas a financiar la compra, pedí la aprobación antes de reservar y compará bancos.`,
        `**La llegada de capital extranjero.** Alrededor del 80 % de la inversión extranjera directa del mundo va a países con grado de inversión ([ABC](${U.oportunidades})). Mantenerlo sostiene la demanda de quienes compran desde afuera; perderlo la enfriaría.`,
        `**El tipo de cambio.** La mayoría de los departamentos se pagan en dólares. Si ganás en guaraníes y el dólar sube, la cuota te cuesta más; si ganás en dólares o euros, un guaraní más débil abarata tus gastos locales.`,
      ],
    },
    {
      type: "p",
      text: `**Lo que la calificación no te dice:** si un barrio está caro o barato, cuánto renta un departamento concreto, ni si una desarrolladora es confiable. Para eso están los datos de precios y alquileres de la [guía de inversión en Asunción](${L.guide}) y la lista de revisiones de [cómo invertir en Paraguay siendo extranjero](${L.foreigners}).`,
    },
    { type: "h2", id: "como-leer-titulares", text: "Cómo leer los titulares sin asustarte de más" },
    {
      type: "ul",
      items: [
        "**\"Revisión negativa\" no es \"baja\".** Es un aviso de que la calificadora puede bajar la nota. Puede terminar en una baja, en una perspectiva negativa o en nada.",
        "**Perspectiva no es nota.** \"BB+ con perspectiva positiva\" y \"BB+ en revisión negativa\" tienen la misma nota; cambia hacia dónde podría moverse.",
        "**Fitch no saca a Paraguay del grado de inversión.** Fitch nunca se lo dio. Lo que importa para el grado de inversión en los índices es lo que hagan Moody's y S&P.",
        "**El riesgo país es ruidoso.** Sube y baja todos los días. Mirá la tendencia de semanas, no el pico de una tarde.",
      ],
    },
    { type: "h2", id: "que-mirar", text: "Qué mirar en los próximos meses" },
    {
      type: "ol",
      items: [
        "La decisión de Fitch al cerrar la revisión negativa.",
        "Cualquier cambio de perspectiva de Moody's o de S&P: es la señal más importante para el grado de inversión.",
        "Si el riesgo país vuelve hacia los 125 puntos de antes de la crisis o se queda más arriba.",
        `Cómo se resuelven los depósitos públicos y del IPS en ueno: es el riesgo fiscal que más pesa. Lo sigo en [Caso ueno bank](${L.ueno}).`,
        "El déficit fiscal de 2026 y el presupuesto 2027.",
      ],
    },
    { type: "cta" },
  ],
};

const en: LocalizedArticle = {
  title: "Investment grade, country risk and credit ratings: what they mean for your investment in Paraguay",
  metaTitle: "Paraguay investment grade and country risk explained",
  description:
    "What credit ratings, investment grade and country risk are, where Paraguay stands after ueno, and what changes for anyone investing in property.",
  excerpt:
    "Moody's, S&P and Fitch, investment grade and country risk in plain language, with where Paraguay stands after ueno and what to watch as an investor.",
  lead:
    "After the collapse of ueno bank and the impeachment, headlines filled up with acronyms: BBB-, Baa3, BB+, \"negative watch\", country risk at 143 points. If you are investing, or thinking of investing, in Paraguay from abroad, these words matter, but not for the reasons they seem to. Here is what each one means, where the country stands today and what changes (and what does not) for someone buying an apartment.",
  readingTime: "8 min read",
  updatedLabel: "Updated: Nov 25, 2026",
  authorRole: "Real estate advisor at SkyOne",
  tocTitle: "In this article",
  sourcesTitle: "Sources",
  disclaimer:
    "This article is for information only and is not investment advice. Ratings and country risk change: check current figures before deciding.",
  cta: {
    title: "Want to understand how this affects your investment?",
    text: "Tell me where you invest from and what you are considering, and in 20 minutes we will apply it to your case.",
    guide: "Download the free guide",
    call: "Book a call",
    whatsapp: "Message on WhatsApp",
    whatsappMessage:
      "Hi Julia, I read your article on investment grade and country risk and want to ask about my investment.",
  },
  blocks: [
    {
      type: "callout",
      title: "Figures as of November 25, 2026",
      text: "Fitch has Paraguay on negative watch and has not made a final decision yet. I will update this article when it does.",
    },
    { type: "h2", id: "conceptos", text: "Three concepts in plain language" },
    {
      type: "ul",
      items: [
        "**Sovereign rating.** An agency's opinion (Moody's, S&P or Fitch) of the government's ability to repay its debt. It does not rate property, banks or private companies: it rates the country as a borrower.",
        "**Investment grade.** The threshold above which a country's debt is considered low risk: **BBB- or higher** at S&P and Fitch, **Baa3 or higher** at Moody's. Many international funds and banks can only buy debt from countries in that group.",
        "**Country risk.** The extra interest the market demands from a country over US Treasury bonds, measured in basis points by JP Morgan's EMBI index. 143 points means 1.43 percentage points more interest. It moves every day, unlike ratings.",
      ],
    },
    {
      type: "p",
      text: "One way to think about it: the rating is the report card, reviewed a few times a year; country risk is the daily quote. Both measure the same thing (how likely the government is to pay) from different angles.",
    },
    { type: "h2", id: "donde-esta-paraguay", text: "Where Paraguay stands today" },
    {
      type: "table",
      head: ["Agency", "Rating and outlook", "What happened"],
      rows: [
        ["Moody's", "**Baa3**, stable (investment grade)", `It granted investment grade in July 2024, the first in the country's history ([ABC](${U.moodys2024})), and affirmed it in July 2026 ([Última Hora](${U.moodys2026})). No changes announced after ueno.`],
        ["S&P", "**BBB-**, stable (investment grade)", `It upgraded Paraguay to investment grade in December 2025 ([ABC](${U.sp2025})). On November 7, 2026 it said Alliana taking office does not change its assessment, while flagging fiscal risks from public deposits at ueno ([La Nación](${U.sp2026})).`],
        ["Fitch", "**BB+**, on negative watch (one notch below investment grade)", `In September it had a positive outlook ([ABC](${U.fitchSep})). On November 11 it removed it and placed Paraguay on negative watch over the ueno collapse, the impeachment and fiscal deterioration ([ABC](${U.fitchNov})).`],
      ],
      note: "Negative watch is not a downgrade: it means the agency is considering a downgrade and will decide later.",
    },
    {
      type: "table",
      head: ["Country risk (EMBI)", "Basis points"],
      rows: [
        ["Paraguay, November 2 (before the crisis)", `125 ([ABC](${U.bonos}))`],
        ["Paraguay, November 5 (intraday peak)", `157 ([ABC](${U.bonos}))`],
        ["Paraguay, after the removal", `143 ([La Nación](${U.riesgoRegion}))`],
        ["Uruguay · Chile · Peru", "85 · 104 · 121"],
        ["Brazil · Argentina", "202 · 939"],
      ],
      note: `Regional comparison as of November 9, 2026 ([La Nación](${U.riesgoRegion})).`,
    },
    {
      type: "p",
      text: `What these numbers say: the crisis moved country risk, but Paraguay is still among the least risky countries in the region, below Brazil and far from Argentina. The sensitive point is elsewhere: Moody's and S&P have it on the **lowest rung** of investment grade. If either one downgrades it, Paraguay drops out of investment grade in international indices ([ABC](${U.bonos})).`,
    },
    { type: "h2", id: "por-que-fitch", text: "Why Fitch put Paraguay on negative watch" },
    {
      type: "ul",
      items: [
        `**Uninsured deposits at ueno.** The Guarantee Fund covers about 97% of savers, but some **USD 2.1 billion** remains uninsured, of which about USD 900 million belongs to the public sector and half of that to IPS. Fitch warns the government could come under pressure to cover them, at about 1.5% of GDP ([ABC](${U.fitchNov})).`,
        `**Fiscal deficit.** It projects deficits of 3.2% of GDP in 2026 and 3.9% in 2027, and sees the 1.5% target for 2028 as unlikely ([ABC](${U.fitchNov})).`,
        `**More expensive financing.** It expects Paraguay to tap international markets in early 2027 at higher rates because of higher country risk ([ABC](${U.fitchNov})).`,
        `**Institutions.** It points to weaknesses in corruption control, rule of law and bank supervision, and cites the impeachment and change of government ([ABC](${U.fitchNov})). I explain it in [The impeachment of Santiago Peña](${L.impeachment}).`,
      ],
    },
    { type: "cta" },
    { type: "h2", id: "que-cambia", text: "What changes for you if you invest in property" },
    {
      type: "p",
      text: "**What does not change:** your apartment is registered in your name in the Public Registry. No rating, change of government or bank failure changes that title. The rating assesses the government as a borrower, not the property market.",
    },
    {
      type: "p",
      text: "**What may change, indirectly:**",
    },
    {
      type: "ul",
      items: [
        "**The cost of credit.** When country risk rises, it costs the government and banks more to borrow abroad, and that tends to feed into loan rates, including mortgages. If you will finance your purchase, get approval before you reserve and compare banks.",
        `**Foreign capital inflows.** About 80% of the world's foreign direct investment goes to investment-grade countries ([ABC](${U.oportunidades})). Keeping that status supports demand from buyers abroad; losing it would cool it.`,
        "**The exchange rate.** Most apartments are paid in US dollars. If you earn in guaraníes and the dollar rises, installments cost you more; if you earn in dollars or euros, a weaker guaraní makes your local costs cheaper.",
      ],
    },
    {
      type: "p",
      text: `**What the rating does not tell you:** whether a neighborhood is expensive or cheap, how much a specific apartment rents for, or whether a developer is reliable. For that, use the price and rent data in the [Asunción investment guide](${L.guide}) and the checklist in [how to invest in Paraguay as a foreigner](${L.foreigners}).`,
    },
    { type: "h2", id: "como-leer-titulares", text: "How to read the headlines without overreacting" },
    {
      type: "ul",
      items: [
        "**\"Negative watch\" is not a \"downgrade\".** It is a warning that the agency may lower the rating. It can end in a downgrade, a negative outlook or nothing.",
        "**Outlook is not the rating.** \"BB+ with a positive outlook\" and \"BB+ on negative watch\" are the same rating; what changes is where it might move.",
        "**Fitch does not take Paraguay out of investment grade.** Fitch never granted it. What matters for investment grade in the indices is what Moody's and S&P do.",
        "**Country risk is noisy.** It moves up and down every day. Watch the trend over weeks, not one afternoon's peak.",
      ],
    },
    { type: "h2", id: "que-mirar", text: "What to watch in the coming months" },
    {
      type: "ol",
      items: [
        "Fitch's decision when it closes the negative watch.",
        "Any outlook change from Moody's or S&P: the most important signal for investment grade.",
        "Whether country risk returns toward the pre-crisis 125 points or stays higher.",
        `How public and IPS deposits at ueno are resolved: the fiscal risk that weighs most. I track it in [The ueno bank case](${L.ueno}).`,
        "The 2026 fiscal deficit and the 2027 budget.",
      ],
    },
    { type: "cta" },
  ],
};

const pt: LocalizedArticle = {
  title: "Grau de investimento, risco-país e classificações: o que significam para seu investimento no Paraguai",
  metaTitle: "Grau de investimento e risco-país no Paraguai: o que significam",
  description:
    "O que são as classificações, o grau de investimento e o risco-país, onde está o Paraguai depois do ueno e o que muda para quem investe em imóveis.",
  excerpt:
    "Moody's, S&P e Fitch, grau de investimento e risco-país explicados de forma simples, com a situação do Paraguai depois do ueno e o que observar.",
  lead:
    "Depois da quebra do ueno bank e do julgamento político, as manchetes se encheram de siglas: BBB-, Baa3, BB+, \"revisão negativa\", risco-país em 143 pontos. Se você investe ou pensa em investir no Paraguai a partir do exterior, essas palavras importam, mas não pelos motivos que parecem. Aqui explico o que cada uma significa, onde o país está hoje e o que muda (e o que não muda) para quem compra um apartamento.",
  readingTime: "8 min de leitura",
  updatedLabel: "Atualizado: 25 nov 2026",
  authorRole: "Consultora imobiliária na SkyOne",
  tocTitle: "Neste artigo",
  sourcesTitle: "Fontes",
  disclaimer:
    "Este artigo é informativo e não é uma recomendação de investimento. As classificações e o risco-país mudam: confira os dados atualizados antes de decidir.",
  cta: {
    title: "Quer entender como isso afeta seu investimento?",
    text: "Me conte de onde você investe e o que está avaliando, e em 20 minutos aplicamos isso ao seu caso.",
    guide: "Baixar o guia gratuito",
    call: "Agendar uma ligação",
    whatsapp: "Falar pelo WhatsApp",
    whatsappMessage:
      "Olá Julia, li seu artigo sobre grau de investimento e risco-país e quero tirar uma dúvida sobre meu investimento.",
  },
  blocks: [
    {
      type: "callout",
      title: "Dados de 25 de novembro de 2026",
      text: "A Fitch colocou o Paraguai em revisão negativa e ainda não tomou uma decisão final. Vou atualizar este artigo quando tomar.",
    },
    { type: "h2", id: "conceptos", text: "Três conceitos de forma simples" },
    {
      type: "ul",
      items: [
        "**Classificação soberana.** É a opinião de uma agência (Moody's, S&P ou Fitch) sobre a capacidade do Estado de pagar sua dívida. Não classifica imóveis, bancos nem empresas privadas: classifica o país como devedor.",
        "**Grau de investimento.** É o patamar a partir do qual a dívida de um país é considerada de baixo risco: **BBB- ou mais** na S&P e na Fitch, **Baa3 ou mais** na Moody's. Muitos fundos e bancos internacionais só podem comprar dívida de países desse grupo.",
        "**Risco-país.** É o juro extra que o mercado cobra de um país acima dos títulos dos Estados Unidos, medido em pontos-base pelo índice EMBI do JP Morgan. 143 pontos significam 1,43 ponto percentual a mais de juros. Muda todos os dias, ao contrário das classificações.",
      ],
    },
    {
      type: "p",
      text: "Uma forma de pensar: a classificação é o boletim, revisado poucas vezes por ano; o risco-país é a cotação do dia. Os dois medem a mesma coisa (qual a probabilidade de o Estado pagar), de ângulos diferentes.",
    },
    { type: "h2", id: "donde-esta-paraguay", text: "Onde o Paraguai está hoje" },
    {
      type: "table",
      head: ["Agência", "Nota e perspectiva", "O que aconteceu"],
      rows: [
        ["Moody's", "**Baa3**, estável (grau de investimento)", `Concedeu o grau de investimento em julho de 2024, o primeiro da história do país ([ABC](${U.moodys2024})), e o confirmou em julho de 2026 ([Última Hora](${U.moodys2026})). Não anunciou mudanças depois do ueno.`],
        ["S&P", "**BBB-**, estável (grau de investimento)", `Elevou o Paraguai ao grau de investimento em dezembro de 2025 ([ABC](${U.sp2025})). Em 7 de novembro de 2026 disse que a posse de Alliana não muda sua avaliação, mas alertou para riscos fiscais pelos depósitos públicos no ueno ([La Nación](${U.sp2026})).`],
        ["Fitch", "**BB+**, em revisão negativa (um degrau abaixo do grau)", `Em setembro tinha perspectiva positiva ([ABC](${U.fitchSep})). Em 11 de novembro a retirou e colocou o Paraguai em revisão negativa pela quebra do ueno, o julgamento político e a piora fiscal ([ABC](${U.fitchNov})).`],
      ],
      note: "Revisão negativa não é rebaixamento: significa que a agência está avaliando rebaixar a nota e vai decidir mais adiante.",
    },
    {
      type: "table",
      head: ["Risco-país (EMBI)", "Pontos-base"],
      rows: [
        ["Paraguai, 2 de novembro (antes da crise)", `125 ([ABC](${U.bonos}))`],
        ["Paraguai, 5 de novembro (pico durante o dia)", `157 ([ABC](${U.bonos}))`],
        ["Paraguai, depois da destituição", `143 ([La Nación](${U.riesgoRegion}))`],
        ["Uruguai · Chile · Peru", "85 · 104 · 121"],
        ["Brasil · Argentina", "202 · 939"],
      ],
      note: `Comparação regional em 9 de novembro de 2026 ([La Nación](${U.riesgoRegion})).`,
    },
    {
      type: "p",
      text: `O que esses números dizem: a crise mexeu no risco-país, mas o Paraguai continua entre os países menos arriscados da região, abaixo do Brasil e muito longe da Argentina. O ponto delicado é outro: Moody's e S&P o mantêm no **último degrau** do grau de investimento. Se qualquer uma das duas rebaixar, o Paraguai sai do grau de investimento nos índices internacionais ([ABC](${U.bonos})).`,
    },
    { type: "h2", id: "por-que-fitch", text: "Por que a Fitch colocou o Paraguai em revisão negativa" },
    {
      type: "ul",
      items: [
        `**Depósitos sem garantia no ueno.** O Fundo de Garantia cobre cerca de 97% dos poupadores, mas restam cerca de **USD 2,1 bilhões** sem cobertura, dos quais uns USD 900 milhões são do setor público e metade disso do IPS. A Fitch alerta que o Estado pode ser pressionado a cobri-los, em cerca de 1,5% do PIB ([ABC](${U.fitchNov})).`,
        `**Déficit fiscal.** Projeta déficit de 3,2% do PIB em 2026 e 3,9% em 2027, e considera improvável a meta de 1,5% para 2028 ([ABC](${U.fitchNov})).`,
        `**Financiamento mais caro.** Estima que o Paraguai precisará ir aos mercados internacionais no início de 2027, a juros mais altos pelo maior risco-país ([ABC](${U.fitchNov})).`,
        `**Instituições.** Aponta fragilidades no controle da corrupção, no Estado de direito e na supervisão bancária, e cita o julgamento político e a troca de governo ([ABC](${U.fitchNov})). Explico em [Julgamento político de Santiago Peña](${L.impeachment}).`,
      ],
    },
    { type: "cta" },
    { type: "h2", id: "que-cambia", text: "O que muda para você se investe em imóveis" },
    {
      type: "p",
      text: "**O que não muda:** seu apartamento está registrado em seu nome nos Registros Públicos. Nenhuma classificação, troca de governo ou quebra de banco muda essa titularidade. A classificação avalia o Estado como devedor, não o mercado imobiliário.",
    },
    {
      type: "p",
      text: "**O que pode mudar, de forma indireta:**",
    },
    {
      type: "ul",
      items: [
        "**O custo do crédito.** Quando o risco-país sobe, fica mais caro para o Estado e os bancos se financiarem no exterior, e isso tende a chegar aos juros dos empréstimos, inclusive os imobiliários. Se você vai financiar a compra, peça a aprovação antes de reservar e compare bancos.",
        `**A entrada de capital estrangeiro.** Cerca de 80% do investimento estrangeiro direto do mundo vai para países com grau de investimento ([ABC](${U.oportunidades})). Mantê-lo sustenta a demanda de quem compra do exterior; perdê-lo a esfriaria.`,
        "**O câmbio.** A maioria dos apartamentos é paga em dólares. Se você ganha em guaranis e o dólar sobe, a parcela custa mais; se ganha em dólares, euros ou reais, um guarani mais fraco barateia seus gastos locais.",
      ],
    },
    {
      type: "p",
      text: `**O que a classificação não diz:** se um bairro está caro ou barato, quanto rende um apartamento específico, nem se uma incorporadora é confiável. Para isso, use os dados de preços e aluguéis do [guia de investimento em Assunção](${L.guide}) e o checklist de [como investir no Paraguai sendo estrangeiro](${L.foreigners}).`,
    },
    { type: "h2", id: "como-leer-titulares", text: "Como ler as manchetes sem se assustar demais" },
    {
      type: "ul",
      items: [
        "**\"Revisão negativa\" não é \"rebaixamento\".** É um aviso de que a agência pode baixar a nota. Pode terminar em rebaixamento, em perspectiva negativa ou em nada.",
        "**Perspectiva não é nota.** \"BB+ com perspectiva positiva\" e \"BB+ em revisão negativa\" têm a mesma nota; muda para onde ela pode se mover.",
        "**A Fitch não tira o Paraguai do grau de investimento.** A Fitch nunca o concedeu. O que importa para o grau de investimento nos índices é o que fizerem a Moody's e a S&P.",
        "**O risco-país é volátil.** Sobe e desce todos os dias. Observe a tendência de semanas, não o pico de uma tarde.",
      ],
    },
    { type: "h2", id: "que-mirar", text: "O que observar nos próximos meses" },
    {
      type: "ol",
      items: [
        "A decisão da Fitch ao encerrar a revisão negativa.",
        "Qualquer mudança de perspectiva da Moody's ou da S&P: é o sinal mais importante para o grau de investimento.",
        "Se o risco-país volta para os 125 pontos de antes da crise ou fica mais alto.",
        `Como se resolvem os depósitos públicos e do IPS no ueno: é o risco fiscal que mais pesa. Acompanho em [Caso ueno bank](${L.ueno}).`,
        "O déficit fiscal de 2026 e o orçamento de 2027.",
      ],
    },
    { type: "cta" },
  ],
};

export const investmentGradeArticle: ArticleDefinition = {
  slug: SLUG,
  published: PUBLISHED,
  updated: UPDATED,
  category: "guides",
  sources: SOURCES,
  cover: {
    src: "/blog/grado-de-inversion-hero.webp",
    og: "/blog/grado-de-inversion-og.jpg",
    width: 1672,
    height: 941,
    alt: {
      es: "Libro azul con el mapa de Paraguay, una escala de calificación dorada y la maqueta de un edificio de departamentos",
      en: "Blue book with a map of Paraguay, a gold rating scale and a scale model of an apartment building",
      pt: "Livro azul com o mapa do Paraguai, uma escala de classificação dourada e a maquete de um prédio de apartamentos",
    },
  },
  content: { es, en, pt },
};
