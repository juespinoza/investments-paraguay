import type {
  ArticleDefinition,
  ArticleSource,
  LocalizedArticle,
} from "@/lib/content/articles/types";

// Artículo de actualidad: revisar los datos cada vez que cambie la situación
// y actualizar UPDATED + updatedLabel en los tres idiomas.
const SLUG = "caso-ueno-bank-que-significa-para-invertir";
const PUBLISHED = "2026-11-04";
const UPDATED = "2026-11-04";

const U = {
  abcComunicados: "https://www.abc.com.py/economia/2026/11/04/todos-los-comunicados-del-bcp-sobre-ueno-bank/",
  abcQuePasa: "https://www.abc.com.py/economia/2026/11/03/ueno-bank-bcp-explica-la-resolucion-y-que-va-a-pasar-ahora/",
  lanacion: "https://www.lanacion.com.py/negocios/2026/11/03/banco-central-detallo-las-irregularidades-que-definieron-la-disolucion-de-ueno-bank/",
  ultimahora: "https://www.ultimahora.com/bcp-estima-que-el-fondo-de-garantia-cubriria-al-97-de-los-ahorristas-de-ueno-bank",
  hoy: "https://www.hoy.com.py/nacionales/2026/11/03/te-explicamos-que-paso-con-ueno-bank",
  cronista: "https://www.cronista.com/finanzas-mercados/paraguay-interviene-ueno-bank-el-quinto-banco-privado-del-pais-con-3-millones-de-clientes-entra-en-resolucion-por-falta-de-solvencia/",
  infobaeRenuncia: "https://www.infobae.com/america/agencias/2026/11/04/renuncia-el-jefe-del-banco-central-de-paraguay-en-medio-del-escandalo-de-ueno-bank/",
  infobaePolitica: "https://www.infobae.com/america/agencias/2026/11/04/la-sonada-intervencion-en-paraguay-de-ueno-bank-que-ha-desatado-una-tormenta-politica/",
  infobaeDetenidos: "https://www.infobae.com/america/america-latina/2026/11/04/escandalo-de-ueno-bank-en-paraguay-ya-son-ocho-los-directivos-detenidos/",
  plus: "https://revistaplus.com.py/2026/11/04/crisis-de-ueno-frena-obras-de-viviendas-y-deja-a-familias-sin-respuestas/",
  observador: "https://diarioelobservador.com.ar/moodys-advierte-sobre-la-crisis-de-ueno-bank-impacto-negativo-pero-manejable-para-paraguay/",
};

const SOURCES: ArticleSource[] = [
  { label: "ABC Color — Todos los comunicados del BCP sobre ueno bank (4 nov 2026)", url: U.abcComunicados },
  { label: "ABC Color — El BCP explica la resolución y qué va a pasar ahora (3 nov 2026)", url: U.abcQuePasa },
  { label: "La Nación — El BCP detalló las irregularidades (3 nov 2026)", url: U.lanacion },
  { label: "Última Hora — El Fondo de Garantía cubriría al 97 % de los ahorristas (3 nov 2026)", url: U.ultimahora },
  { label: "Diario HOY — Te explicamos qué pasó con ueno bank (3 nov 2026)", url: U.hoy },
  { label: "El Cronista — Paraguay interviene ueno bank (3 nov 2026)", url: U.cronista },
  { label: "Infobae/EFE — Renuncia el jefe del Banco Central (4 nov 2026)", url: U.infobaeRenuncia },
  { label: "Infobae/EFE — La intervención que desató una tormenta política (4 nov 2026)", url: U.infobaePolitica },
  { label: "Infobae — Ya son ocho los directivos detenidos (4 nov 2026)", url: U.infobaeDetenidos },
  { label: "Revista PLUS — La crisis de ueno frena obras de viviendas (4 nov 2026)", url: U.plus },
  { label: "El Observador — Moody's: impacto negativo pero manejable (4 nov 2026)", url: U.observador },
];

const es: LocalizedArticle = {
  title: "Caso ueno bank: qué pasó y qué significa si estás por invertir en un inmueble",
  metaTitle: "Caso ueno bank: qué significa para invertir en inmuebles",
  description:
    "Qué pasó con ueno bank, qué pasa con los depósitos y los créditos, cómo afecta al mercado inmobiliario y qué conviene hacer si estás por invertir.",
  excerpt:
    "La resolución de ueno bank explicada: depósitos, créditos, obras frenadas y qué revisar antes de comprar un inmueble.",
  lead:
    "El Banco Central del Paraguay (BCP) inició la resolución de ueno bank, el quinto banco privado del país, porque su solvencia cayó por debajo de la mitad del mínimo legal. Te cuento qué se sabe hasta hoy, qué pasa con los depósitos y los créditos, y qué cambia (y qué no) para quien está por comprar un inmueble.",
  readingTime: "6 min de lectura",
  updatedLabel: "Actualizado: 4 nov 2026",
  authorRole: "Asesora inmobiliaria en SkyOne",
  tocTitle: "En este artículo",
  sourcesTitle: "Fuentes",
  disclaimer:
    "Este artículo es informativo y no reemplaza el asesoramiento de un abogado, contador o asesor financiero. La situación cambia día a día: verificá cada dato en los comunicados del BCP.",
  cta: {
    title: "¿Estás por invertir y no sabés si te afecta?",
    text: "Contame en qué etapa estás (reserva, pozo, crédito) y lo revisamos juntos en 20 minutos.",
    guide: "Descargar la guía gratuita",
    call: "Agendar una llamada",
    whatsapp: "Escribir por WhatsApp",
    whatsappMessage:
      "Hola Julia, leí tu artículo sobre el caso ueno bank y quiero consultarte si afecta mi inversión.",
  },
  blocks: [
    {
      type: "callout",
      title: "Situación en desarrollo",
      text: "Datos actualizados al 4 de noviembre de 2026. Los cronogramas de pago y las decisiones del Congreso pueden cambiar.",
    },
    { type: "h2", id: "que-paso", text: "Qué pasó" },
    {
      type: "p",
      text: `El 3 de noviembre de 2026 el BCP comunicó que inició el procedimiento de resolución de ueno bank, previsto en la Ley 2.334/03, porque su índice de solvencia quedó por debajo del 50 % del mínimo exigido ([ABC](${U.abcComunicados})). No es un banco chico: tiene cerca de 3 millones de clientes y, a diciembre de 2025, concentraba el 8,9 % de los depósitos y el 5,9 % de los créditos del sistema ([El Cronista](${U.cronista})).`,
    },
    {
      type: "table",
      head: ["Fecha", "Qué pasó"],
      rows: [
        ["3–4 nov 2026", `La Fiscalía detiene a ocho directivos, entre ellos el CEO, en una causa iniciada por denuncia del BCP por presunta lesión de confianza y otros delitos. Todavía no hay imputación formal ([Infobae](${U.infobaeDetenidos})).`],
        ["3 nov 2026", `El BCP anuncia la resolución, designa interventores y la entidad deja de operar. El presidente del BCP, Carlos Carvallo, renuncia a pedido del presidente Santiago Peña; asume como interina Liana Caballero ([Infobae/EFE](${U.infobaeRenuncia})).`],
        ["Octubre 2026", `Se filtra un informe interno de la Superintendencia de Bancos sobre presuntos excesos en préstamos a empresas del mismo grupo. El banco niega irregularidades y sus accionistas anuncian una capitalización de USD 100 millones ([Diario HOY](${U.hoy})).`],
        ["5 jun 2026", `El BCP empieza a analizar la entidad. Los créditos a empresas vinculadas fueron la primera alerta ([La Nación](${U.lanacion})).`],
      ],
    },
    {
      type: "p",
      text: `Según el BCP, además de los créditos vinculados, se deterioraron los indicadores de liquidez y hubo que constituir previsiones adicionales. Carvallo atribuyó parte de la caída de liquidez a la filtración de información sensible ([La Nación](${U.lanacion})).`,
    },
    {
      type: "p",
      text: `El caso también abrió un debate político. Carvallo había dirigido antes la Financiera Ueno, y la prensa señaló en 2024 que Peña fue accionista de Ueno Holding; según ABC, vendió esas inversiones en abril de 2025. Peña negó cualquier conflicto de intereses, respaldó al BCP y calificó lo ocurrido como "un caso particular". Un grupo de senadores anunció que impulsará un juicio político contra Peña y el vicepresidente Pedro Alliana ([Infobae/EFE](${U.infobaePolitica})).`,
    },
    { type: "h2", id: "depositos-y-creditos", text: "Qué pasa con los depósitos y los créditos" },
    {
      type: "p",
      text: `La gran mayoría de los ahorristas va a recuperar su dinero por el Fondo de Garantía de Depósitos, pero no de inmediato. Según el BCP, alrededor del **97 % de las cuentas de ahorro** quedarían completamente cubiertas, porque la mayoría tiene saldos por debajo del tope ([Última Hora](${U.ultimahora})).`,
    },
    {
      type: "table",
      head: ["Situación", "Qué pasa, según el BCP"],
      rows: [
        ["Depósitos hasta 75 salarios mínimos", "Cubiertos por el Fondo de Garantía: hasta **Gs. 228.300.000** por persona y por entidad. Un primer pago de hasta Gs. 10.000.000 se hará \"a la brevedad\"; el resto, en un calendario que todavía no se publicó."],
        ["Depósitos por encima del tope", "Se atenderán con el proceso de resolución: los activos y pasivos se transferirían a otras entidades por un proceso competitivo. El balance de exclusión tiene un plazo máximo de 15 días."],
        ["Deudas con ueno (préstamos, tarjetas)", "Siguen vigentes: no se anulan. El BCP va a informar dónde pagarlas. Antes de pagar la garantía, se descuentan las deudas del titular con el banco."],
        ["App, transferencias y tarjetas", "Fuera de servicio hasta que termine el balance de exclusión."],
        ["Fondos mutuos con colocaciones en ueno", "Rescates suspendidos; la reanudación paulatina está prevista desde el jueves 5 de noviembre."],
      ],
      note: "Fuentes: comunicados del BCP según ABC Color y Diario HOY.",
    },
    {
      type: "p",
      text: `El Congreso también está discutiendo un anticipo más rápido para los ahorristas: el Senado aprobó un proyecto que Diputados tiene que corregir, así que todavía no está vigente ([Diario HOY](${U.hoy})).`,
    },
    { type: "h2", id: "mercado-inmobiliario", text: "Qué cambia para el mercado inmobiliario" },
    { type: "p", text: "El primer golpe ya se ve en obras financiadas a través de ueno, no en el resto del sistema." },
    {
      type: "ul",
      items: [
        `**Obras de vivienda frenadas.** La constructora Ógaite informa que no le llegan los desembolsos de créditos del programa Che Róga Porã otorgados por ueno, y que tiene entre Gs. 700 y 800 millones de sus clientes inmovilizados ahí. Según su gerente comercial, el problema alcanza a "cientos de constructoras y desarrolladoras" del país. Sus créditos con otros bancos siguen avanzando con normalidad ([Revista PLUS](${U.plus})).`,
        "**Desarrolladoras con fondos en ueno.** Una obra en pozo vive del flujo de cuotas. Si una desarrolladora tenía su caja o las cuotas de sus compradores en ueno, puede tener que frenar o financiar la obra con fondos propios mientras dura la resolución.",
        `**El resto del sistema, por ahora, estable.** La Asociación de Bancos afirma que el sistema opera con normalidad y descarta contagio ([Infobae/EFE](${U.infobaePolitica})). Moody's califica el impacto como negativo pero manejable si la resolución es rápida y ordenada, y destaca un capital regulatorio del sistema del 17,1 % ([El Observador, citando a La Nación](${U.observador})).`,
        "**Crédito posiblemente más cauto.** Moody's anticipa que el BCP podría endurecer los requisitos de capital. Si eso pasa, los bancos podrían prestar con más cuidado, también para vivienda.",
      ],
    },
    {
      type: "p",
      text: "Lo que **no** cambia: tu propiedad está inscripta en los Registros Públicos a tu nombre, no en un banco. La caída de un banco no afecta la titularidad de un inmueble ya escriturado. Sobre precios y demanda, todavía es temprano: no hay datos que permitan decir si van a subir, bajar o quedarse igual.",
    },
    { type: "h2", id: "que-hacer", text: "Qué conviene hacer si estás por invertir" },
    {
      type: "ol",
      items: [
        "**Si comprás en pozo, preguntá por el banco de la obra.** Pedile a la desarrolladora que te diga por escrito con qué bancos opera, si tenía fondos o financiación en ueno y si eso cambia el cronograma de entrega.",
        "**Pagá señas y cuotas solo a cuentas documentadas.** Que estén a nombre de la desarrolladora, contra recibo y con el contrato revisado por tu escribano.",
        "**Si tenés un crédito con ueno, seguí pagando.** La deuda no se anula. Esperá el canal que informe el BCP y guardá todos los comprobantes.",
        "**Si tu crédito de vivienda estaba en trámite con ueno,** consultá con tu constructora o con el programa de vivienda cómo sigue el desembolso antes de firmar nada nuevo.",
        "**Repartí los ahorros grandes entre bancos.** La garantía es por persona y por entidad: el mismo monto en dos bancos queda cubierto dos veces hasta el tope.",
        "**Informate por canales oficiales.** Los cronogramas de pago los comunica el BCP. Desconfiá de cadenas y de quien te ofrezca \"cobrar antes\" a cambio de un pago.",
      ],
    },
    { type: "cta" },
  ],
};

const en: LocalizedArticle = {
  title: "The ueno bank case: what happened and what it means if you are about to invest in property",
  metaTitle: "The ueno bank case: what it means for property investors",
  description:
    "What happened to ueno bank, what happens to deposits and loans, how it affects the real estate market and what to do if you are about to invest.",
  excerpt:
    "The ueno bank resolution explained: deposits, loans, stalled construction and what to check before buying property.",
  lead:
    "The Central Bank of Paraguay (BCP) started the resolution of ueno bank, the country's fifth-largest private bank, because its solvency fell below half the legal minimum. Here is what we know so far, what happens to deposits and loans, and what changes (and what does not) for anyone about to buy property.",
  readingTime: "6 min read",
  updatedLabel: "Updated: Nov 4, 2026",
  authorRole: "Real estate advisor at SkyOne",
  tocTitle: "In this article",
  sourcesTitle: "Sources",
  disclaimer:
    "This article is for information only and does not replace advice from a lawyer, accountant or financial advisor. The situation changes daily: check every figure against the BCP's announcements.",
  cta: {
    title: "About to invest and not sure if this affects you?",
    text: "Tell me what stage you are at (reservation, off-plan, loan) and we will review it together in 20 minutes.",
    guide: "Download the free guide",
    call: "Book a call",
    whatsapp: "Message on WhatsApp",
    whatsappMessage:
      "Hi Julia, I read your article about the ueno bank case and want to ask whether it affects my investment.",
  },
  blocks: [
    {
      type: "callout",
      title: "Developing story",
      text: "Figures as of November 4, 2026. Payment schedules and Congress decisions may change.",
    },
    { type: "h2", id: "que-paso", text: "What happened" },
    {
      type: "p",
      text: `On November 3, 2026, the BCP announced it had started the resolution procedure for ueno bank under Law 2.334/03, because its solvency ratio fell below 50% of the required minimum ([ABC](${U.abcComunicados})). It is not a small bank: it has nearly 3 million clients and, as of December 2025, held 8.9% of the system's deposits and 5.9% of its loans ([El Cronista](${U.cronista})).`,
    },
    {
      type: "table",
      head: ["Date", "What happened"],
      rows: [
        ["Nov 3–4, 2026", `Prosecutors detain eight executives, including the CEO, in a case opened on a BCP complaint for alleged breach of trust and other offenses. No formal charges have been filed yet ([Infobae](${U.infobaeDetenidos})).`],
        ["Nov 3, 2026", `The BCP announces the resolution, appoints administrators and the bank stops operating. BCP president Carlos Carvallo resigns at the request of President Santiago Peña; Liana Caballero takes over on an interim basis ([Infobae/EFE](${U.infobaeRenuncia})).`],
        ["October 2026", `An internal Banking Superintendency report on alleged excess lending to companies in the same group is leaked. The bank denies wrongdoing and its shareholders announce a USD 100 million capital injection ([Diario HOY](${U.hoy})).`],
        ["Jun 5, 2026", `The BCP starts reviewing the bank. Loans to related companies were the first warning sign ([La Nación](${U.lanacion})).`],
      ],
    },
    {
      type: "p",
      text: `According to the BCP, besides the related-party loans, liquidity indicators deteriorated and additional provisions were needed. Carvallo attributed part of the liquidity drop to the leak of sensitive information ([La Nación](${U.lanacion})).`,
    },
    {
      type: "p",
      text: `The case has also sparked a political debate. Carvallo had previously run Financiera Ueno, and the press reported in 2024 that Peña had been a shareholder of Ueno Holding; according to ABC, he sold those holdings in April 2025. Peña denied any conflict of interest, backed the BCP and called it "a particular case". A group of senators announced they will push for impeachment proceedings against Peña and Vice President Pedro Alliana ([Infobae/EFE](${U.infobaePolitica})).`,
    },
    { type: "h2", id: "depositos-y-creditos", text: "What happens to deposits and loans" },
    {
      type: "p",
      text: `The vast majority of savers will get their money back through the Deposit Guarantee Fund, but not right away. According to the BCP, around **97% of savings accounts** would be fully covered, because most balances are below the cap ([Última Hora](${U.ultimahora})).`,
    },
    {
      type: "table",
      head: ["Situation", "What happens, according to the BCP"],
      rows: [
        ["Deposits up to 75 minimum wages", "Covered by the Guarantee Fund: up to **PYG 228,300,000** per person and per institution. A first payment of up to PYG 10,000,000 will be made \"as soon as possible\"; the rest on a schedule not yet published."],
        ["Deposits above the cap", "Handled through the resolution process: assets and liabilities would be transferred to other institutions through a competitive process. The exclusion balance sheet has a maximum deadline of 15 days."],
        ["Debts with ueno (loans, cards)", "Still owed: they are not cancelled. The BCP will announce where to pay them. Any debts the holder owes the bank are deducted before the guarantee is paid."],
        ["App, transfers and cards", "Out of service until the exclusion balance sheet is completed."],
        ["Mutual funds with placements in ueno", "Redemptions suspended; a gradual restart is planned from Thursday, November 5."],
      ],
      note: "Sources: BCP announcements as reported by ABC Color and Diario HOY.",
    },
    {
      type: "p",
      text: `Congress is also debating a faster advance payment for savers: the Senate passed a bill that the Chamber of Deputies must amend, so it is not in force yet ([Diario HOY](${U.hoy})).`,
    },
    { type: "h2", id: "mercado-inmobiliario", text: "What changes for the real estate market" },
    { type: "p", text: "The first impact is already visible in construction financed through ueno, not in the rest of the system." },
    {
      type: "ul",
      items: [
        `**Stalled housing construction.** The builder Ógaite reports that disbursements of Che Róga Porã program loans granted by ueno are not arriving, and that PYG 700 to 800 million of its clients' money is frozen there. According to its commercial manager, the problem affects "hundreds of builders and developers" across the country. Its loans with other banks are proceeding normally ([Revista PLUS](${U.plus})).`,
        "**Developers with funds in ueno.** An off-plan project lives on installment cash flow. If a developer kept its cash or its buyers' installments at ueno, it may have to pause the project or fund it out of pocket while the resolution lasts.",
        `**The rest of the system, stable for now.** The Banking Association says the system is operating normally and rules out contagion ([Infobae/EFE](${U.infobaePolitica})). Moody's rates the impact as negative but manageable if the resolution is quick and orderly, and highlights the system's 17.1% regulatory capital ([El Observador, citing La Nación](${U.observador})).`,
        "**Possibly more cautious lending.** Moody's expects the BCP could tighten capital requirements. If that happens, banks might lend more carefully, including for housing.",
      ],
    },
    {
      type: "p",
      text: "What does **not** change: your property is registered in the Public Registry in your name, not at a bank. A bank failure does not affect the ownership of property that has already been deeded. As for prices and demand, it is too early: there is no data yet to say whether they will rise, fall or stay the same.",
    },
    { type: "h2", id: "que-hacer", text: "What to do if you are about to invest" },
    {
      type: "ol",
      items: [
        "**If you are buying off-plan, ask about the project's bank.** Ask the developer to confirm in writing which banks it works with, whether it had funds or financing at ueno and whether that changes the delivery schedule.",
        "**Pay deposits and installments only into documented accounts.** They should be in the developer's name, against a receipt and with the contract reviewed by your notary.",
        "**If you have a loan with ueno, keep paying.** The debt is not cancelled. Wait for the channel the BCP announces and keep every receipt.",
        "**If your housing loan was in process with ueno,** ask your builder or the housing program how the disbursement will proceed before you sign anything new.",
        "**Spread large savings across banks.** The guarantee is per person and per institution: the same amount split between two banks is covered twice up to the cap.",
        "**Use official channels.** Payment schedules are announced by the BCP. Be wary of chain messages and of anyone offering to \"get you paid sooner\" for a fee.",
      ],
    },
    { type: "cta" },
  ],
};

const pt: LocalizedArticle = {
  title: "Caso ueno bank: o que aconteceu e o que significa se você vai investir em um imóvel",
  metaTitle: "Caso ueno bank: o que significa para investir em imóveis",
  description:
    "O que aconteceu com o ueno bank, o que acontece com depósitos e créditos, como afeta o mercado imobiliário e o que fazer se você vai investir.",
  excerpt:
    "A resolução do ueno bank explicada: depósitos, créditos, obras paradas e o que conferir antes de comprar um imóvel.",
  lead:
    "O Banco Central do Paraguai (BCP) iniciou a resolução do ueno bank, o quinto maior banco privado do país, porque sua solvência caiu abaixo da metade do mínimo legal. Conto o que se sabe até hoje, o que acontece com depósitos e créditos e o que muda (e o que não muda) para quem vai comprar um imóvel.",
  readingTime: "6 min de leitura",
  updatedLabel: "Atualizado: 4 nov 2026",
  authorRole: "Consultora imobiliária na SkyOne",
  tocTitle: "Neste artigo",
  sourcesTitle: "Fontes",
  disclaimer:
    "Este artigo é informativo e não substitui a orientação de um advogado, contador ou consultor financeiro. A situação muda dia a dia: confira cada dado nos comunicados do BCP.",
  cta: {
    title: "Vai investir e não sabe se isso te afeta?",
    text: "Me conte em que etapa você está (reserva, na planta, financiamento) e revisamos juntos em 20 minutos.",
    guide: "Baixar o guia gratuito",
    call: "Agendar uma ligação",
    whatsapp: "Falar pelo WhatsApp",
    whatsappMessage:
      "Olá Julia, li seu artigo sobre o caso ueno bank e quero saber se afeta meu investimento.",
  },
  blocks: [
    {
      type: "callout",
      title: "Situação em andamento",
      text: "Dados atualizados em 4 de novembro de 2026. Os cronogramas de pagamento e as decisões do Congresso podem mudar.",
    },
    { type: "h2", id: "que-paso", text: "O que aconteceu" },
    {
      type: "p",
      text: `Em 3 de novembro de 2026, o BCP comunicou que iniciou o procedimento de resolução do ueno bank, previsto na Lei 2.334/03, porque seu índice de solvência ficou abaixo de 50% do mínimo exigido ([ABC](${U.abcComunicados})). Não é um banco pequeno: tem cerca de 3 milhões de clientes e, em dezembro de 2025, concentrava 8,9% dos depósitos e 5,9% dos créditos do sistema ([El Cronista](${U.cronista})).`,
    },
    {
      type: "table",
      head: ["Data", "O que aconteceu"],
      rows: [
        ["3–4 nov 2026", `O Ministério Público detém oito diretores, entre eles o CEO, em um caso aberto por denúncia do BCP por suposta lesão de confiança e outros crimes. Ainda não há denúncia formal ([Infobae](${U.infobaeDetenidos})).`],
        ["3 nov 2026", `O BCP anuncia a resolução, nomeia interventores e o banco deixa de operar. O presidente do BCP, Carlos Carvallo, renuncia a pedido do presidente Santiago Peña; Liana Caballero assume interinamente ([Infobae/EFE](${U.infobaeRenuncia})).`],
        ["Outubro 2026", `Vaza um relatório interno da Superintendência de Bancos sobre supostos excessos em empréstimos a empresas do mesmo grupo. O banco nega irregularidades e seus acionistas anunciam uma capitalização de USD 100 milhões ([Diario HOY](${U.hoy})).`],
        ["5 jun 2026", `O BCP começa a analisar o banco. Os créditos a empresas vinculadas foram o primeiro alerta ([La Nación](${U.lanacion})).`],
      ],
    },
    {
      type: "p",
      text: `Segundo o BCP, além dos créditos vinculados, os indicadores de liquidez pioraram e foi preciso constituir provisões adicionais. Carvallo atribuiu parte da queda de liquidez ao vazamento de informações sensíveis ([La Nación](${U.lanacion})).`,
    },
    {
      type: "p",
      text: `O caso também abriu um debate político. Carvallo havia dirigido antes a Financiera Ueno, e a imprensa apontou em 2024 que Peña foi acionista da Ueno Holding; segundo o ABC, ele vendeu essas participações em abril de 2025. Peña negou qualquer conflito de interesses, apoiou o BCP e chamou o ocorrido de "um caso particular". Um grupo de senadores anunciou que vai promover um julgamento político contra Peña e o vice-presidente Pedro Alliana ([Infobae/EFE](${U.infobaePolitica})).`,
    },
    { type: "h2", id: "depositos-y-creditos", text: "O que acontece com depósitos e créditos" },
    {
      type: "p",
      text: `A grande maioria dos poupadores vai recuperar o dinheiro pelo Fundo de Garantia de Depósitos, mas não de imediato. Segundo o BCP, cerca de **97% das contas de poupança** ficariam totalmente cobertas, porque a maioria tem saldos abaixo do teto ([Última Hora](${U.ultimahora})).`,
    },
    {
      type: "table",
      head: ["Situação", "O que acontece, segundo o BCP"],
      rows: [
        ["Depósitos até 75 salários mínimos", "Cobertos pelo Fundo de Garantia: até **PYG 228.300.000** por pessoa e por instituição. Um primeiro pagamento de até PYG 10.000.000 será feito \"o quanto antes\"; o restante, em um calendário ainda não publicado."],
        ["Depósitos acima do teto", "Serão tratados no processo de resolução: ativos e passivos seriam transferidos a outras instituições por um processo competitivo. O balanço de exclusão tem prazo máximo de 15 dias."],
        ["Dívidas com o ueno (empréstimos, cartões)", "Continuam valendo: não são anuladas. O BCP vai informar onde pagá-las. Antes de pagar a garantia, são descontadas as dívidas do titular com o banco."],
        ["App, transferências e cartões", "Fora de serviço até concluir o balanço de exclusão."],
        ["Fundos de investimento com aplicações no ueno", "Resgates suspensos; a retomada gradual está prevista a partir de quinta-feira, 5 de novembro."],
      ],
      note: "Fontes: comunicados do BCP segundo ABC Color e Diario HOY.",
    },
    {
      type: "p",
      text: `O Congresso também discute um adiantamento mais rápido para os poupadores: o Senado aprovou um projeto que a Câmara dos Deputados precisa corrigir, então ainda não está em vigor ([Diario HOY](${U.hoy})).`,
    },
    { type: "h2", id: "mercado-inmobiliario", text: "O que muda para o mercado imobiliário" },
    { type: "p", text: "O primeiro impacto já aparece em obras financiadas pelo ueno, não no resto do sistema." },
    {
      type: "ul",
      items: [
        `**Obras de moradia paradas.** A construtora Ógaite informa que não chegam os desembolsos de créditos do programa Che Róga Porã concedidos pelo ueno, e que tem entre PYG 700 e 800 milhões de seus clientes bloqueados lá. Segundo seu gerente comercial, o problema atinge "centenas de construtoras e incorporadoras" do país. Seus créditos com outros bancos seguem normalmente ([Revista PLUS](${U.plus})).`,
        "**Incorporadoras com recursos no ueno.** Uma obra na planta vive do fluxo de parcelas. Se uma incorporadora tinha seu caixa ou as parcelas dos compradores no ueno, pode ter que parar ou financiar a obra com recursos próprios enquanto durar a resolução.",
        `**O resto do sistema, por enquanto, estável.** A Associação de Bancos afirma que o sistema opera normalmente e descarta contágio ([Infobae/EFE](${U.infobaePolitica})). A Moody's classifica o impacto como negativo, mas administrável se a resolução for rápida e ordenada, e destaca um capital regulatório do sistema de 17,1% ([El Observador, citando La Nación](${U.observador})).`,
        "**Crédito possivelmente mais cauteloso.** A Moody's prevê que o BCP poderia endurecer os requisitos de capital. Se isso acontecer, os bancos podem emprestar com mais cuidado, inclusive para moradia.",
      ],
    },
    {
      type: "p",
      text: "O que **não** muda: seu imóvel está registrado nos Registros Públicos em seu nome, não em um banco. A quebra de um banco não afeta a propriedade de um imóvel já escriturado. Sobre preços e demanda, ainda é cedo: não há dados para dizer se vão subir, cair ou ficar iguais.",
    },
    { type: "h2", id: "que-hacer", text: "O que fazer se você vai investir" },
    {
      type: "ol",
      items: [
        "**Se você compra na planta, pergunte pelo banco da obra.** Peça à incorporadora que informe por escrito com quais bancos trabalha, se tinha recursos ou financiamento no ueno e se isso muda o cronograma de entrega.",
        "**Pague sinais e parcelas só em contas documentadas.** Que estejam em nome da incorporadora, contra recibo e com o contrato revisado pelo seu tabelião.",
        "**Se você tem um crédito com o ueno, continue pagando.** A dívida não é anulada. Aguarde o canal que o BCP informar e guarde todos os comprovantes.",
        "**Se seu financiamento de moradia estava em andamento com o ueno,** pergunte à construtora ou ao programa habitacional como segue o desembolso antes de assinar algo novo.",
        "**Divida poupanças grandes entre bancos.** A garantia é por pessoa e por instituição: o mesmo valor dividido em dois bancos fica coberto duas vezes até o teto.",
        "**Informe-se por canais oficiais.** Os cronogramas de pagamento são comunicados pelo BCP. Desconfie de correntes e de quem ofereça \"receber antes\" em troca de um pagamento.",
      ],
    },
    { type: "cta" },
  ],
};

export const uenoBankArticle: ArticleDefinition = {
  slug: SLUG,
  published: PUBLISHED,
  updated: UPDATED,
  category: "market",
  sources: SOURCES,
  content: { es, en, pt },
};
