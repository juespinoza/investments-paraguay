import type {
  ArticleDefinition,
  ArticleSource,
  LocalizedArticle,
} from "@/lib/content/articles/types";

// Artículo de actualidad política con foco económico. Criterio editorial:
// solo hechos con fuente, las posturas de la acusación y de la defensa, y
// repercusiones atribuidas a datos o analistas (sin pronósticos propios).
const SLUG = "juicio-politico-santiago-pena-que-paso-y-repercusiones";
const PUBLISHED = "2026-11-08";
const UPDATED = "2026-11-14";
const UENO = "/blog/caso-ueno-bank-que-significa-para-invertir";

const U = {
  diputados: "https://diputados.gov.py/noticias/noticias/3243",
  abcJuicio: "https://www.abc.com.py/politica/2026/11/06/en-vivo-juicio-politico-a-pena-senado-retoma-proceso-en-medio-de-renuncia-trabada-y-pedido-de-prorroga/",
  infobaeRenuncia: "https://www.infobae.com/america/america-latina/2026/11/05/santiago-pena-renuncio-a-la-presidencia-de-paraguay-por-el-escandalo-del-ueno-bank/",
  ultimahora: "https://www.ultimahora.com/live/escandalo-de-ueno-bank-juicio-politico-a-santiago-pena-paso-a-paso",
  abcPreso: "https://www.abc.com.py/nacionales/2026/11/07/santiago-pena-queda-preso-en-el-regimiento-escolta-presidencial/",
  infobaePreventiva: "https://www.infobae.com/america/america-latina/2026/11/07/la-fiscalia-de-paraguay-pidio-la-prision-preventiva-del-ex-presidente-santiago-pena-por-el-colapso-del-ueno-bank/",
  abcBonos: "https://www.abc.com.py/negocios/2026/11/06/en-medio-de-la-crisis-de-ueno-bank-precios-de-bonos-soberanos-de-paraguay-se-desploman/",
  bloomberg: "https://bloomberglinea.com/latinoamerica/como-se-movio-el-riesgo-pais-en-paraguay-luego-de-la-crisis-de-ueno-bank-y-la-renuncia-de-pena",
  abc11: "https://www.abc.com.py/economia/2026/11/11/ahorristas-de-ueno-bcp-dice-que-culmino-el-proceso-de-acreditacion-al-100-de-beneficiarios-pero-persisten-bloqueos/",
  elTiempo: "https://eltiempo.com/mundo/latinoamerica/crisis-en-paraguay-fiscalia-pide-ampliar-la-imputacion-contra-el-expresidente-santiago-pena-y-lo-acusa-de-liderar-una-asociacion-criminal-3600892",
  infobae15: "https://infobae.com/america/america-latina/2026/11/11/la-fiscalia-de-paraguay-estimo-que-santiago-pena-podria-recibir-hasta-15-anos-de-carcel-por-el-caso-ueno-bank",
  lnPagados: "https://www.lanacion.com.py/politica_edicion_impresa/2026/11/08/bcp-ya-devolvio-ahorros-a-casi-12-millones-de-clientes-de-ueno/",
};

const SOURCES: ArticleSource[] = [
  { label: "ABC Color — El BCP culminó la acreditación del anticipo al 100 % de beneficiarios (11 nov 2026)", url: U.abc11 },
  { label: "El Tiempo — La Fiscalía pide ampliar la imputación contra Peña por asociación criminal (13 nov 2026)", url: U.elTiempo },
  { label: "Infobae — La Fiscalía estima hasta 15 años de cárcel para Peña (11 nov 2026)", url: U.infobae15 },
  { label: "Cámara de Diputados — Diputados aprueba juicio político al presidente Santiago Peña (5 nov 2026)", url: U.diputados },
  { label: "ABC Color — Cronología del juicio político: destitución de Peña y asunción de Alliana (6 nov 2026)", url: U.abcJuicio },
  { label: "Infobae — Santiago Peña renunció, pero el Congreso no la aceptó (5 nov 2026)", url: U.infobaeRenuncia },
  { label: "Última Hora — Juicio político a Santiago Peña, paso a paso (5–6 nov 2026)", url: U.ultimahora },
  { label: "ABC Color — Santiago Peña queda preso en el Regimiento Escolta Presidencial (7 nov 2026)", url: U.abcPreso },
  { label: "Infobae — La Fiscalía pidió la prisión preventiva de Peña y de Carvallo (7 nov 2026)", url: U.infobaePreventiva },
  { label: "ABC Color — Precios de bonos soberanos de Paraguay se desploman (6 nov 2026)", url: U.abcBonos },
  { label: "Bloomberg Línea — Cómo se movió el riesgo país de Paraguay (6 nov 2026)", url: U.bloomberg },
  { label: "La Nación — El BCP ya devolvió ahorros a casi 1,2 millones de clientes de ueno (8 nov 2026)", url: U.lnPagados },
];

const es: LocalizedArticle = {
  title: "Juicio político a Santiago Peña: qué pasó y qué puede cambiar para la economía y los inversores",
  metaTitle: "Juicio político a Santiago Peña: qué pasó y repercusiones",
  description:
    "Cómo fue la destitución de Santiago Peña, qué dicen la acusación y la defensa, qué cambia en el gobierno y qué repercusiones económicas se observan.",
  excerpt:
    "Renuncia, acusación, destitución y prisión preventiva en tres días. Los hechos, las dos posturas y qué miran los mercados y los inversores.",
  lead:
    "En tres días, Paraguay pasó de la caída de ueno bank a la destitución de su presidente. Santiago Peña presentó su renuncia, el Congreso siguió adelante con el juicio político y el Senado lo destituyó el 6 de noviembre. Pedro Alliana asumió la presidencia y, un día después, un juez ordenó la prisión preventiva de Peña. Acá ordeno los hechos, las posturas de la acusación y de la defensa, y las primeras repercusiones económicas que ya se pueden medir.",
  readingTime: "8 min de lectura",
  updatedLabel: "Actualizado: 14 nov 2026",
  authorRole: "Asesora inmobiliaria en SkyOne",
  tocTitle: "En este artículo",
  sourcesTitle: "Fuentes",
  disclaimer:
    "Este artículo es informativo y no expresa una posición política. Una imputación o una prisión preventiva no son una condena: rige la presunción de inocencia. Tampoco reemplaza el asesoramiento de un abogado, contador o asesor financiero.",
  cta: {
    title: "¿Tenés dudas sobre cómo afecta esto a tu inversión?",
    text: "Contame qué estás evaluando (compra, pozo, crédito o inversión desde el exterior) y lo revisamos juntos en 20 minutos.",
    guide: "Descargar la guía gratuita",
    call: "Agendar una llamada",
    whatsapp: "Escribir por WhatsApp",
    whatsappMessage:
      "Hola Julia, leí tu artículo sobre el juicio político y quiero consultarte cómo puede afectar mi inversión.",
  },
  blocks: [
    {
      type: "callout",
      title: "Situación en desarrollo",
      text: "Hechos confirmados al 14 de noviembre de 2026, con fuentes al final. Las causas judiciales siguen abiertas.",
    },
    { type: "h2", id: "que-paso", text: "Qué pasó, día por día" },
    {
      type: "table",
      head: ["Fecha", "Qué pasó"],
      rows: [
        ["3 nov", `El BCP inicia la resolución de ueno bank por falta de solvencia. Te lo explico en [Caso ueno bank](${UENO}).`],
        ["5 nov", `Peña anuncia su renuncia por video mientras Diputados trata el juicio político. La Cámara aprueba la acusación con 78 votos, la unanimidad de los presentes, con base en el artículo 225 de la Constitución, y la envía al Senado ([Cámara de Diputados](${U.diputados}), [Última Hora](${U.ultimahora})). El pedido contra el vicepresidente Pedro Alliana se trató en otra sesión, sin el apoyo de la ANR, y no avanzó.`],
        ["5 nov", `La renuncia no se procesa: la sesión conjunta que debía tratarla pierde quórum. Quienes impulsaban el juicio argumentaron que aceptarla le daría a Peña la banca de senador vitalicio y sus fueros ([Infobae](${U.infobaeRenuncia})).`],
        ["6 nov", `El Senado rechaza el pedido de prórroga de la defensa (39 en contra, 3 a favor y 2 abstenciones), admite las pruebas (41 a 0) y destituye a Peña por mal desempeño de funciones con 44 votos. A las 19:45, Alliana jura como presidente y el Congreso elige vicepresidente al senador Antonio Barrios ([ABC](${U.abcJuicio})).`],
        ["6 nov", `La Fiscalía ordena la detención de Peña, que se cumple en su residencia, y la del expresidente del BCP Carlos Carvallo, que se presenta ([ABC](${U.abcJuicio}), [Infobae](${U.infobaePreventiva})).`],
        ["11–13 nov", `La fiscal Verónica Valdez estima que Peña podría enfrentar hasta 15 años de prisión con las imputaciones actuales; es la estimación de la acusación ([Infobae](${U.infobae15})). El 13, la Fiscalía pide ampliar la imputación por asociación criminal: sostiene que Peña habría actuado "como jefe de la estructura" junto con Carvallo y exmiembros del directorio del BCP. Un juez todavía debe decidir. Son detenidos el superintendente de bancos, Holger Insfrán, y cuatro exmiembros del directorio del BCP; Carvallo está en prisión preventiva. La Fiscalía dice que pedirá congelar fondos vinculados hallados en otros países ([El Tiempo](${U.elTiempo})).`],
        ["7 nov", `Peña es imputado por lesión de confianza, como instigador, y administración en provecho propio, como autor. El juez Humberto Otazú ordena su prisión preventiva por peligro de fuga, en el Regimiento Escolta Presidencial. La Fiscalía también pide prisión preventiva para Carvallo; en la causa hay 27 imputados ([ABC](${U.abcPreso}), [Infobae](${U.infobaePreventiva})).`],
      ],
    },
    { type: "h2", id: "acusacion-y-defensa", text: "Qué dice la acusación y qué dice la defensa" },
    {
      type: "p",
      text: `**La acusación**, presentada por 35 legisladores, sostiene cuatro puntos ([Cámara de Diputados](${U.diputados})):`,
    },
    {
      type: "ul",
      items: [
        "Conflicto de intereses por la participación de Peña en Ueno Holding.",
        "La designación de Carlos Carvallo, expresidente de Financiera Ueno, al frente del BCP.",
        "El impulso de cambios a la ley de conflicto de intereses.",
        `Haber permitido que fondos del IPS se concentraran en ueno por encima de los límites legales. En el Senado, la acusación mostró que esos depósitos pasaron de Gs. 70.000 millones en septiembre de 2023 a Gs. 2,15 billones en abril de 2026 ([ABC](${U.abcJuicio})).`,
      ],
    },
    {
      type: "p",
      text: `**La defensa**, a cargo de Adolfo Ferreiro y Ricardo Preda, sostuvo que no hubo debido proceso: pidió 72 horas de prórroga porque tuvo unas 12 horas para revisar una acusación de 300 páginas, cuestionó las pruebas y anunció que recurrirá al sistema interamericano de derechos humanos. Peña dijo que había renunciado "para evitar más daño al país"; en su mensaje de renuncia habló de preservar la estabilidad, la paz social y las instituciones, y pidió disculpas si había fallado a la confianza de la ciudadanía ([ABC](${U.abcJuicio}), [Infobae](${U.infobaeRenuncia})).`,
    },
    {
      type: "p",
      text: `El juicio tuvo apoyo de casi todo el arco político, incluido el Partido Colorado, al que pertenece Peña: su presidente, Horacio Cartes, anunció el acompañamiento del partido antes de la votación ([Infobae](${U.infobaeRenuncia})). La parte penal recién empieza: la imputación y la prisión preventiva son medidas del proceso y no una condena.`,
    },
    { type: "h2", id: "gobierno", text: "Qué cambia en el gobierno" },
    {
      type: "ul",
      items: [
        `**Presidencia:** Pedro Alliana asumió por sucesión constitucional y completa el mandato 2023–2028. Al jurar dijo que se enfocará en la racionalización del gasto y en los ahorristas ([ABC](${U.abcJuicio})).`,
        `**Vicepresidencia:** el Congreso eligió a Antonio Barrios, que dejó su banca en el Senado ([ABC](${U.abcJuicio})).`,
        `**Banco Central:** sigue como presidente interino Pedro de Jesús Acosta ([La Nación](${U.lnPagados})).`,
        `**Gabinete:** antes de la votación renunciaron el jefe de gabinete, Javier Giménez, el ministro del Interior, Enrique Riera, y el asesor jurídico Roberto Moreno, para volver a sus bancas en el Senado ([ABC](${U.abcJuicio})).`,
      ],
    },
    { type: "h2", id: "repercusiones", text: "Repercusiones económicas: lo que ya se ve" },
    {
      type: "p",
      text: "Estas son las señales que ya se pueden medir y lo que dicen los analistas. No son pronósticos: el efecto final va a depender de cómo sigan la resolución de ueno y la transición.",
    },
    {
      type: "table",
      head: ["Indicador", "Qué pasó"],
      rows: [
        ["Riesgo país (EMBI)", `Pasó de 125 puntos el 2 de noviembre a 137 el 4; el 5 tocó 157 durante el día y cerró en 143–144. Como referencia, ese día Uruguay cerró en 85, Chile en 104 y Perú en 121 ([ABC](${U.abcBonos})).`],
        ["Bonos soberanos", `Los bonos de largo plazo perdieron entre 1,5 y 1,8 centavos ([ABC](${U.abcBonos})).`],
        ["Calificación", `Moody's y S&P mantienen a Paraguay en el límite inferior del grado de inversión; Fitch, en BB+. Una baja de Moody's o de S&P lo sacaría del grado de inversión en los índices internacionales ([ABC](${U.abcBonos})).`],
        ["Ahorristas de ueno", `El BCP terminó de pagar el anticipo a 1.812.348 ahorristas, por unos Gs. 3,9 billones; el saldo hasta 75 salarios mínimos tiene fecha tentativa desde el 16 de noviembre ([ABC](${U.abc11})).`],
      ],
    },
    {
      type: "p",
      text: `Según Jonathan Fortun, del Institute of International Finance (IIF), los inversores van a exigir una prima de riesgo mayor hasta que se aclaren las responsabilidades por la caída del banco. La perspectiva podría volverse negativa si el costo de la resolución obliga a emitir deuda nueva, si la meta de déficit de 1,5 % del PIB se corre más allá de 2028 o si la transición política se complica ([ABC](${U.abcBonos}), [Bloomberg Línea](${U.bloomberg})).`,
    },
    {
      type: "p",
      text: `FrontierView (Oxford Economics) considera poco probable que la crisis frene el crecimiento, que fue de 6,6 % en 2025 y de 5,7 % interanual en el primer semestre de 2026, pero prevé presión sobre el tipo de cambio y un crédito más restrictivo en el corto plazo ([ABC](${U.abcBonos})).`,
    },
    { type: "h2", id: "inversion-inmobiliaria", text: "Qué significa para quien invierte en inmuebles" },
    {
      type: "ul",
      items: [
        "**La propiedad no cambia.** Un inmueble escriturado está inscripto a tu nombre en los Registros Públicos; ni el cambio de gobierno ni la caída de un banco afectan esa titularidad.",
        "**Mirá la moneda de tu compra.** Muchos inmuebles se pagan en dólares. Si tus ingresos son en guaraníes y el dólar sube, cada cuota te cuesta más guaraníes. Antes de firmar, revisá en qué moneda está el contrato y cuánto margen tenés.",
        "**Si dependés de un crédito, pedí la aprobación antes.** Si los bancos se vuelven más cautos, como anticipan los analistas, los plazos de aprobación pueden alargarse. Compará más de un banco.",
        "**Sobre los precios, todavía no hay datos.** Ninguna fuente muestra por ahora cambios en los precios de los inmuebles. Desconfiá de quien te apure con que \"van a subir\" o \"van a bajar\".",
        "**Si invertís desde el exterior,** las señales a seguir son el riesgo país y las decisiones de las calificadoras, que son las que miran los fondos y los bancos internacionales.",
      ],
    },
    { type: "h2", id: "que-seguir", text: "Qué seguir en las próximas semanas" },
    {
      type: "ol",
      items: [
        "La decisión del juez sobre el pedido de ampliar la imputación de Peña por asociación criminal, y las audiencias de los demás detenidos.",
        "La presentación de la defensa de Peña ante el sistema interamericano de derechos humanos.",
        "Las primeras medidas económicas del gobierno de Alliana y el nombramiento definitivo de la presidencia del BCP.",
        "Cualquier comunicado de Moody's, S&P o Fitch sobre la calificación de Paraguay.",
        `El pago a las cuentas de ueno que faltan y el calendario del saldo hasta 75 salarios mínimos. Lo voy actualizando en [Caso ueno bank](${UENO}).`,
      ],
    },
    { type: "cta" },
  ],
};

const en: LocalizedArticle = {
  title: "The impeachment of Santiago Peña: what happened and what may change for the economy and investors",
  metaTitle: "Santiago Peña's impeachment: what happened and the impact",
  description:
    "How Santiago Peña was removed, what the prosecution and the defense argue, what changes in government and the economic effects seen so far.",
  excerpt:
    "Resignation, impeachment, removal and pretrial detention in three days. The facts, both sides and what markets and investors are watching.",
  lead:
    "In three days, Paraguay went from the collapse of ueno bank to the removal of its president. Santiago Peña submitted his resignation, Congress pressed ahead with the impeachment and the Senate removed him on November 6. Pedro Alliana took office and, a day later, a judge ordered Peña's pretrial detention. Here are the facts, the arguments of the prosecution and the defense, and the first measurable economic effects.",
  readingTime: "8 min read",
  updatedLabel: "Updated: Nov 14, 2026",
  authorRole: "Real estate advisor at SkyOne",
  tocTitle: "In this article",
  sourcesTitle: "Sources",
  disclaimer:
    "This article is for information only and takes no political position. A criminal charge or pretrial detention is not a conviction: the presumption of innocence applies. It does not replace advice from a lawyer, accountant or financial advisor.",
  cta: {
    title: "Not sure how this affects your investment?",
    text: "Tell me what you are considering (a purchase, off-plan, a loan or investing from abroad) and we will review it together in 20 minutes.",
    guide: "Download the free guide",
    call: "Book a call",
    whatsapp: "Message on WhatsApp",
    whatsappMessage:
      "Hi Julia, I read your article about the impeachment and want to ask how it may affect my investment.",
  },
  blocks: [
    {
      type: "callout",
      title: "Developing story",
      text: "Facts confirmed as of November 14, 2026, with sources at the end. The criminal cases are still open.",
    },
    { type: "h2", id: "que-paso", text: "What happened, day by day" },
    {
      type: "table",
      head: ["Date", "What happened"],
      rows: [
        ["Nov 3", `The BCP starts the resolution of ueno bank over insufficient solvency. I explain it in [The ueno bank case](${UENO}).`],
        ["Nov 5", `Peña announces his resignation by video while the Chamber of Deputies debates the impeachment. The Chamber approves the charges with 78 votes, every member present, under Article 225 of the Constitution, and sends them to the Senate ([Chamber of Deputies](${U.diputados}), [Última Hora](${U.ultimahora})). The request against Vice President Pedro Alliana was taken up in a separate session, without the ruling Colorado Party's support, and did not move forward.`],
        ["Nov 5", `The resignation is not processed: the joint session that was to consider it loses its quorum. Supporters of the impeachment argued that accepting it would give Peña a lifetime Senate seat and its immunity ([Infobae](${U.infobaeRenuncia})).`],
        ["Nov 6", `The Senate rejects the defense's request for more time (39 against, 3 in favor, 2 abstentions), admits the evidence (41 to 0) and removes Peña for poor performance of his duties with 44 votes. At 7:45 p.m., Alliana is sworn in as president and Congress elects Senator Antonio Barrios as vice president ([ABC](${U.abcJuicio})).`],
        ["Nov 6", `Prosecutors order the arrest of Peña, carried out at his residence, and of former BCP president Carlos Carvallo, who turns himself in ([ABC](${U.abcJuicio}), [Infobae](${U.infobaePreventiva})).`],
        ["Nov 11–13", `Prosecutor Verónica Valdez estimates Peña could face up to 15 years in prison under the current charges; this is the prosecution's estimate ([Infobae](${U.infobae15})). On the 13th, prosecutors ask to expand the charges to criminal association, arguing Peña acted "as head of the structure" with Carvallo and former BCP board members. A judge has yet to rule. Bank superintendent Holger Insfrán and four former BCP board members are detained; Carvallo is in pretrial detention. Prosecutors say they will seek to freeze linked funds found in other countries ([El Tiempo](${U.elTiempo})).`],
        ["Nov 7", `Peña is charged with breach of trust, as instigator, and self-serving administration, as perpetrator. Judge Humberto Otazú orders his pretrial detention over flight risk, at the Presidential Escort Regiment. Prosecutors also request pretrial detention for Carvallo; 27 people have been charged in the case ([ABC](${U.abcPreso}), [Infobae](${U.infobaePreventiva})).`],
      ],
    },
    { type: "h2", id: "acusacion-y-defensa", text: "What the prosecution and the defense argue" },
    {
      type: "p",
      text: `**The charges**, filed by 35 legislators, rest on four points ([Chamber of Deputies](${U.diputados})):`,
    },
    {
      type: "ul",
      items: [
        "A conflict of interest arising from Peña's stake in Ueno Holding.",
        "Appointing Carlos Carvallo, former head of Financiera Ueno, to lead the BCP.",
        "Pushing changes to the conflict-of-interest law.",
        `Allowing IPS social security funds to concentrate at ueno above legal limits. In the Senate, the prosecution showed those deposits grew from PYG 70 billion in September 2023 to PYG 2.15 trillion in April 2026 ([ABC](${U.abcJuicio})).`,
      ],
    },
    {
      type: "p",
      text: `**The defense**, led by Adolfo Ferreiro and Ricardo Preda, argued there was no due process: it asked for 72 more hours because it had about 12 hours to review a 300-page indictment, challenged the evidence and said it will turn to the inter-American human rights system. Peña said he had resigned "to avoid further harm to the country"; in his resignation message he spoke of preserving stability, social peace and institutions, and apologized if he had let citizens down ([ABC](${U.abcJuicio}), [Infobae](${U.infobaeRenuncia})).`,
    },
    {
      type: "p",
      text: `The impeachment had support from almost the entire political spectrum, including Peña's own Colorado Party: its president, Horacio Cartes, announced the party's backing before the vote ([Infobae](${U.infobaeRenuncia})). The criminal case is only beginning: the charges and pretrial detention are procedural measures, not a conviction.`,
    },
    { type: "h2", id: "gobierno", text: "What changes in government" },
    {
      type: "ul",
      items: [
        `**Presidency:** Pedro Alliana took office through constitutional succession and will complete the 2023–2028 term. When sworn in, he said he will focus on rationalizing spending and on savers ([ABC](${U.abcJuicio})).`,
        `**Vice presidency:** Congress elected Antonio Barrios, who gave up his Senate seat ([ABC](${U.abcJuicio})).`,
        `**Central bank:** Pedro de Jesús Acosta remains interim president ([La Nación](${U.lnPagados})).`,
        `**Cabinet:** before the vote, chief of staff Javier Giménez, Interior Minister Enrique Riera and legal adviser Roberto Moreno resigned to return to their Senate seats ([ABC](${U.abcJuicio})).`,
      ],
    },
    { type: "h2", id: "repercusiones", text: "Economic effects: what we can already see" },
    {
      type: "p",
      text: "These are the signals that can already be measured and what analysts are saying. They are not forecasts: the final effect will depend on how the ueno resolution and the transition unfold.",
    },
    {
      type: "table",
      head: ["Indicator", "What happened"],
      rows: [
        ["Country risk (EMBI)", `It rose from 125 basis points on November 2 to 137 on the 4th; on the 5th it hit 157 intraday and closed at 143–144. For reference, that day Uruguay closed at 85, Chile at 104 and Peru at 121 ([ABC](${U.abcBonos})).`],
        ["Sovereign bonds", `Long-dated bonds lost between 1.5 and 1.8 cents ([ABC](${U.abcBonos})).`],
        ["Credit rating", `Moody's and S&P keep Paraguay at the lowest investment-grade rung; Fitch rates it BB+. A downgrade by Moody's or S&P would push it out of investment grade in international indices ([ABC](${U.abcBonos})).`],
        ["ueno savers", `The BCP has finished paying the advance to 1,812,348 savers, about PYG 3.9 trillion; the balance up to 75 minimum wages is tentatively due from November 16 ([ABC](${U.abc11})).`],
      ],
    },
    {
      type: "p",
      text: `According to Jonathan Fortun of the Institute of International Finance (IIF), investors will demand a higher risk premium until responsibility for the bank's collapse is clarified. The outlook could turn negative if resolution costs require new debt, if the 1.5%-of-GDP deficit target slips beyond 2028 or if the political transition becomes more difficult ([ABC](${U.abcBonos}), [Bloomberg Línea](${U.bloomberg})).`,
    },
    {
      type: "p",
      text: `FrontierView (Oxford Economics) considers it unlikely that the crisis will halt growth, which was 6.6% in 2025 and 5.7% year on year in the first half of 2026, but expects pressure on the exchange rate and tighter credit in the short term ([ABC](${U.abcBonos})).`,
    },
    { type: "h2", id: "inversion-inmobiliaria", text: "What it means for property investors" },
    {
      type: "ul",
      items: [
        "**Ownership does not change.** A deeded property is registered in your name in the Public Registry; neither a change of government nor a bank failure affects that title.",
        "**Check the currency of your purchase.** Many properties are paid in US dollars. If you earn in guaraníes and the dollar rises, each installment costs you more guaraníes. Before signing, check the contract currency and how much room you have.",
        "**If you need a loan, get approval first.** If banks become more cautious, as analysts expect, approvals may take longer. Compare more than one bank.",
        "**There is no data on prices yet.** No source shows any change in property prices so far. Be wary of anyone rushing you because prices \"will go up\" or \"will go down\".",
        "**If you invest from abroad,** the signals to watch are country risk and rating agency decisions, which are what international funds and banks look at.",
      ],
    },
    { type: "h2", id: "que-seguir", text: "What to watch in the coming weeks" },
    {
      type: "ol",
      items: [
        "The judge's ruling on the request to expand Peña's charges to criminal association, and hearings for the other detainees.",
        "The Peña defense's filing with the inter-American human rights system.",
        "The Alliana government's first economic measures and the permanent appointment at the head of the BCP.",
        "Any statement from Moody's, S&P or Fitch on Paraguay's rating.",
        `Payment to the remaining ueno accounts and the schedule for the balance up to 75 minimum wages. I keep it updated in [The ueno bank case](${UENO}).`,
      ],
    },
    { type: "cta" },
  ],
};

const pt: LocalizedArticle = {
  title: "Julgamento político de Santiago Peña: o que aconteceu e o que pode mudar para a economia e os investidores",
  metaTitle: "Julgamento político de Santiago Peña: fatos e impactos",
  description:
    "Como foi a destituição de Santiago Peña, o que dizem a acusação e a defesa, o que muda no governo e quais efeitos econômicos já se observam.",
  excerpt:
    "Renúncia, acusação, destituição e prisão preventiva em três dias. Os fatos, os dois lados e o que mercados e investidores observam.",
  lead:
    "Em três dias, o Paraguai passou da quebra do ueno bank à destituição do seu presidente. Santiago Peña apresentou sua renúncia, o Congresso seguiu com o julgamento político e o Senado o destituiu em 6 de novembro. Pedro Alliana assumiu a presidência e, um dia depois, um juiz ordenou a prisão preventiva de Peña. Aqui organizo os fatos, os argumentos da acusação e da defesa, e os primeiros efeitos econômicos que já podem ser medidos.",
  readingTime: "8 min de leitura",
  updatedLabel: "Atualizado: 14 nov 2026",
  authorRole: "Consultora imobiliária na SkyOne",
  tocTitle: "Neste artigo",
  sourcesTitle: "Fontes",
  disclaimer:
    "Este artigo é informativo e não expressa posição política. Uma imputação ou uma prisão preventiva não são uma condenação: vale a presunção de inocência. Também não substitui a orientação de um advogado, contador ou consultor financeiro.",
  cta: {
    title: "Tem dúvidas sobre como isso afeta seu investimento?",
    text: "Me conte o que você está avaliando (compra, na planta, financiamento ou investimento do exterior) e revisamos juntos em 20 minutos.",
    guide: "Baixar o guia gratuito",
    call: "Agendar uma ligação",
    whatsapp: "Falar pelo WhatsApp",
    whatsappMessage:
      "Olá Julia, li seu artigo sobre o julgamento político e quero saber como pode afetar meu investimento.",
  },
  blocks: [
    {
      type: "callout",
      title: "Situação em andamento",
      text: "Fatos confirmados até 14 de novembro de 2026, com fontes no final. Os processos judiciais continuam abertos.",
    },
    { type: "h2", id: "que-paso", text: "O que aconteceu, dia a dia" },
    {
      type: "table",
      head: ["Data", "O que aconteceu"],
      rows: [
        ["3 nov", `O BCP inicia a resolução do ueno bank por falta de solvência. Explico em [Caso ueno bank](${UENO}).`],
        ["5 nov", `Peña anuncia sua renúncia por vídeo enquanto a Câmara dos Deputados debate o julgamento político. A Câmara aprova a acusação com 78 votos, a unanimidade dos presentes, com base no artigo 225 da Constituição, e a envia ao Senado ([Câmara dos Deputados](${U.diputados}), [Última Hora](${U.ultimahora})). O pedido contra o vice-presidente Pedro Alliana foi tratado em outra sessão, sem o apoio do Partido Colorado, e não avançou.`],
        ["5 nov", `A renúncia não é processada: a sessão conjunta que deveria tratá-la perde o quórum. Os defensores do julgamento argumentaram que aceitá-la daria a Peña uma cadeira vitalícia no Senado e sua imunidade ([Infobae](${U.infobaeRenuncia})).`],
        ["6 nov", `O Senado rejeita o pedido de prorrogação da defesa (39 contra, 3 a favor e 2 abstenções), admite as provas (41 a 0) e destitui Peña por mau desempenho de funções com 44 votos. Às 19h45, Alliana assume como presidente e o Congresso elege o senador Antonio Barrios como vice-presidente ([ABC](${U.abcJuicio})).`],
        ["6 nov", `O Ministério Público ordena a detenção de Peña, cumprida em sua residência, e a do ex-presidente do BCP Carlos Carvallo, que se apresenta ([ABC](${U.abcJuicio}), [Infobae](${U.infobaePreventiva})).`],
        ["11–13 nov", `A promotora Verónica Valdez estima que Peña poderia enfrentar até 15 anos de prisão com as imputações atuais; é a estimativa da acusação ([Infobae](${U.infobae15})). No dia 13, o Ministério Público pede ampliar a imputação para associação criminosa, sustentando que Peña teria agido "como chefe da estrutura" com Carvallo e ex-membros da diretoria do BCP. Um juiz ainda deve decidir. São detidos o superintendente de bancos, Holger Insfrán, e quatro ex-membros da diretoria do BCP; Carvallo está em prisão preventiva. O Ministério Público diz que pedirá o bloqueio de recursos vinculados encontrados em outros países ([El Tiempo](${U.elTiempo})).`],
        ["7 nov", `Peña é imputado por lesão de confiança, como instigador, e administração em proveito próprio, como autor. O juiz Humberto Otazú ordena sua prisão preventiva por risco de fuga, no Regimento Escolta Presidencial. O Ministério Público também pede prisão preventiva para Carvallo; há 27 imputados no caso ([ABC](${U.abcPreso}), [Infobae](${U.infobaePreventiva})).`],
      ],
    },
    { type: "h2", id: "acusacion-y-defensa", text: "O que dizem a acusação e a defesa" },
    {
      type: "p",
      text: `**A acusação**, apresentada por 35 parlamentares, se apoia em quatro pontos ([Câmara dos Deputados](${U.diputados})):`,
    },
    {
      type: "ul",
      items: [
        "Conflito de interesses pela participação de Peña na Ueno Holding.",
        "A nomeação de Carlos Carvallo, ex-presidente da Financiera Ueno, para o comando do BCP.",
        "O impulso a mudanças na lei de conflito de interesses.",
        `Ter permitido que recursos do IPS (previdência social) se concentrassem no ueno acima dos limites legais. No Senado, a acusação mostrou que esses depósitos passaram de PYG 70 bilhões em setembro de 2023 para PYG 2,15 trilhões em abril de 2026 ([ABC](${U.abcJuicio})).`,
      ],
    },
    {
      type: "p",
      text: `**A defesa**, a cargo de Adolfo Ferreiro e Ricardo Preda, sustentou que não houve devido processo: pediu 72 horas de prorrogação porque teve cerca de 12 horas para revisar uma acusação de 300 páginas, questionou as provas e anunciou que recorrerá ao sistema interamericano de direitos humanos. Peña disse que havia renunciado "para evitar mais danos ao país"; em sua mensagem de renúncia, falou em preservar a estabilidade, a paz social e as instituições, e pediu desculpas se falhou com a confiança dos cidadãos ([ABC](${U.abcJuicio}), [Infobae](${U.infobaeRenuncia})).`,
    },
    {
      type: "p",
      text: `O julgamento teve apoio de quase todo o espectro político, inclusive do Partido Colorado, ao qual Peña pertence: seu presidente, Horacio Cartes, anunciou o apoio do partido antes da votação ([Infobae](${U.infobaeRenuncia})). O processo penal está apenas começando: a imputação e a prisão preventiva são medidas processuais, não uma condenação.`,
    },
    { type: "h2", id: "gobierno", text: "O que muda no governo" },
    {
      type: "ul",
      items: [
        `**Presidência:** Pedro Alliana assumiu por sucessão constitucional e completa o mandato 2023–2028. Ao tomar posse, disse que vai se concentrar na racionalização dos gastos e nos poupadores ([ABC](${U.abcJuicio})).`,
        `**Vice-presidência:** o Congresso elegeu Antonio Barrios, que deixou sua cadeira no Senado ([ABC](${U.abcJuicio})).`,
        `**Banco Central:** Pedro de Jesús Acosta continua como presidente interino ([La Nación](${U.lnPagados})).`,
        `**Gabinete:** antes da votação, renunciaram o chefe de gabinete, Javier Giménez, o ministro do Interior, Enrique Riera, e o assessor jurídico Roberto Moreno, para voltar às suas cadeiras no Senado ([ABC](${U.abcJuicio})).`,
      ],
    },
    { type: "h2", id: "repercusiones", text: "Efeitos econômicos: o que já se vê" },
    {
      type: "p",
      text: "Estes são os sinais que já podem ser medidos e o que dizem os analistas. Não são previsões: o efeito final vai depender de como seguirem a resolução do ueno e a transição.",
    },
    {
      type: "table",
      head: ["Indicador", "O que aconteceu"],
      rows: [
        ["Risco-país (EMBI)", `Passou de 125 pontos em 2 de novembro para 137 no dia 4; no dia 5 chegou a 157 durante o pregão e fechou em 143–144. Como referência, nesse dia o Uruguai fechou em 85, o Chile em 104 e o Peru em 121 ([ABC](${U.abcBonos})).`],
        ["Títulos soberanos", `Os títulos de longo prazo perderam entre 1,5 e 1,8 centavos ([ABC](${U.abcBonos})).`],
        ["Classificação de risco", `Moody's e S&P mantêm o Paraguai no limite inferior do grau de investimento; a Fitch, em BB+. Um rebaixamento da Moody's ou da S&P o tiraria do grau de investimento nos índices internacionais ([ABC](${U.abcBonos})).`],
        ["Poupadores do ueno", `O BCP terminou de pagar o adiantamento a 1.812.348 poupadores, cerca de PYG 3,9 trilhões; o saldo até 75 salários mínimos tem data provisória a partir de 16 de novembro ([ABC](${U.abc11})).`],
      ],
    },
    {
      type: "p",
      text: `Segundo Jonathan Fortun, do Institute of International Finance (IIF), os investidores vão exigir um prêmio de risco maior até que se esclareçam as responsabilidades pela quebra do banco. A perspectiva poderia ficar negativa se o custo da resolução exigir nova dívida, se a meta de déficit de 1,5% do PIB passar de 2028 ou se a transição política se complicar ([ABC](${U.abcBonos}), [Bloomberg Línea](${U.bloomberg})).`,
    },
    {
      type: "p",
      text: `A FrontierView (Oxford Economics) considera improvável que a crise freie o crescimento, que foi de 6,6% em 2025 e de 5,7% em termos anuais no primeiro semestre de 2026, mas prevê pressão sobre o câmbio e crédito mais restrito no curto prazo ([ABC](${U.abcBonos})).`,
    },
    { type: "h2", id: "inversion-inmobiliaria", text: "O que significa para quem investe em imóveis" },
    {
      type: "ul",
      items: [
        "**A propriedade não muda.** Um imóvel escriturado está registrado em seu nome nos Registros Públicos; nem a troca de governo nem a quebra de um banco afetam essa titularidade.",
        "**Confira a moeda da sua compra.** Muitos imóveis são pagos em dólares. Se sua renda é em guaranis e o dólar sobe, cada parcela custa mais guaranis. Antes de assinar, verifique a moeda do contrato e quanta margem você tem.",
        "**Se depende de financiamento, peça a aprovação antes.** Se os bancos ficarem mais cautelosos, como preveem os analistas, os prazos de aprovação podem aumentar. Compare mais de um banco.",
        "**Sobre preços, ainda não há dados.** Nenhuma fonte mostra até agora mudanças nos preços dos imóveis. Desconfie de quem pressionar dizendo que \"vão subir\" ou \"vão cair\".",
        "**Se você investe do exterior,** os sinais a acompanhar são o risco-país e as decisões das agências de classificação, que são o que fundos e bancos internacionais observam.",
      ],
    },
    { type: "h2", id: "que-seguir", text: "O que acompanhar nas próximas semanas" },
    {
      type: "ol",
      items: [
        "A decisão do juiz sobre o pedido de ampliar a imputação de Peña para associação criminosa, e as audiências dos demais detidos.",
        "A apresentação da defesa de Peña ao sistema interamericano de direitos humanos.",
        "As primeiras medidas econômicas do governo Alliana e a nomeação definitiva para a presidência do BCP.",
        "Qualquer comunicado da Moody's, S&P ou Fitch sobre a classificação do Paraguai.",
        `O pagamento às contas do ueno que faltam e o calendário do saldo até 75 salários mínimos. Vou atualizando em [Caso ueno bank](${UENO}).`,
      ],
    },
    { type: "cta" },
  ],
};

export const impeachmentArticle: ArticleDefinition = {
  slug: SLUG,
  cover: {
    src: "/blog/juicio-politico-pena-hero.webp",
    og: "/blog/juicio-politico-pena-og.jpg",
    width: 1672,
    height: 941,
    alt: {
      es: "Carpeta con el título \"Juicio político, Santiago Peña\" junto a la bandera de Paraguay y la maqueta de un recinto parlamentario",
      en: "Folder titled \"Juicio político, Santiago Peña\" next to the flag of Paraguay and a scale model of a legislative chamber",
      pt: "Pasta com o título \"Juicio político, Santiago Peña\" ao lado da bandeira do Paraguai e da maquete de um plenário parlamentar",
    },
  },
  published: PUBLISHED,
  updated: UPDATED,
  category: "market",
  sources: SOURCES,
  content: { es, en, pt },
};
