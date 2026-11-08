import type {
  ArticleDefinition,
  ArticleSource,
  LocalizedArticle,
} from "@/lib/content/articles/types";

// Artículo de actualidad: revisar los datos cada vez que cambie la situación
// y actualizar UPDATED + updatedLabel en los tres idiomas.
const SLUG = "caso-ueno-bank-que-significa-para-invertir";
const PUBLISHED = "2026-11-04";
const UPDATED = "2026-11-08";
const J = "/blog/juicio-politico-santiago-pena-que-paso-y-repercusiones";

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
  abcAvisos: "https://www.abc.com.py/economia/2026/11/04/atencion-clientes-de-ueno-a-partir-de-manana-clientes-recibiran-avisos-para-cobrar-hasta-g-121760000/",
  abcAcosta: "https://www.abc.com.py/economia/2026/11/04/bcp-designa-nuevo-presidente-interino-y-detalla-como-devolvera-la-plata-a-ahorristas-de-ueno/",
  ultimahoraAnticipo: "https://www.ultimahora.com/el-bcp-anuncia-el-pago-del-anticipo-a-ahorristas-de-ueno-bank-desde-este-jueves",
  lanacionPago: "https://www.lanacion.com.py/negocios/2026/11/04/el-bcp-explica-sistema-de-pago-a-ahorristas-de-ueno-bank/",
  hoyPago: "https://www.hoy.com.py/nacionales/2026/11/04/bcp-anuncia-como-y-cuando-pagara-a-los-ahorristas-de-ueno-bank",
  milNoticias: "https://1000noticias.com.py/2026/11/04/el-fondo-de-garantia-arrancara-desembolsos-a-depositantes-de-ueno-bank-tras-promulgarse-la-ley/",
  lnPagados: "https://www.lanacion.com.py/politica_edicion_impresa/2026/11/08/bcp-ya-devolvio-ahorros-a-casi-12-millones-de-clientes-de-ueno/",
  lnLunes: "https://www.lanacion.com.py/negocios/2026/11/07/ueno-bank-desde-el-lunes-pagaran-a-ahorristas-con-deudas-y-cuentas-bloqueadas-anuncio-el-bcp/",
  abcJuicio: "https://www.abc.com.py/politica/2026/11/06/en-vivo-juicio-politico-a-pena-senado-retoma-proceso-en-medio-de-renuncia-trabada-y-pedido-de-prorroga/",
  abcPreso: "https://www.abc.com.py/nacionales/2026/11/07/santiago-pena-queda-preso-en-el-regimiento-escolta-presidencial/",
  infobaeCarvallo: "https://www.infobae.com/america/america-latina/2026/11/07/la-fiscalia-de-paraguay-pidio-la-prision-preventiva-del-ex-presidente-santiago-pena-por-el-colapso-del-ueno-bank/",
  plus: "https://revistaplus.com.py/2026/11/04/crisis-de-ueno-frena-obras-de-viviendas-y-deja-a-familias-sin-respuestas/",
  observador: "https://diarioelobservador.com.ar/moodys-advierte-sobre-la-crisis-de-ueno-bank-impacto-negativo-pero-manejable-para-paraguay/",
};

const SOURCES: ArticleSource[] = [
  { label: "La Nación — El BCP ya devolvió ahorros a casi 1,2 millones de clientes de ueno (8 nov 2026)", url: U.lnPagados },
  { label: "La Nación — Desde el lunes pagarán a ahorristas con deudas y cuentas bloqueadas (7 nov 2026)", url: U.lnLunes },
  { label: "ABC Color — Cronología del juicio político: destitución de Peña y asunción de Alliana (6 nov 2026)", url: U.abcJuicio },
  { label: "ABC Color — Santiago Peña queda preso en el Regimiento Escolta Presidencial (7 nov 2026)", url: U.abcPreso },
  { label: "Infobae — La Fiscalía pidió la prisión preventiva de Peña y de Carvallo (7 nov 2026)", url: U.infobaeCarvallo },
  { label: "ABC Color — Desde el 5 de noviembre, avisos para cobrar hasta Gs. 121.760.000 (4 nov 2026)", url: U.abcAvisos },
  { label: "ABC Color — Nuevo presidente interino del BCP y cómo devolverá la plata (4 nov 2026)", url: U.abcAcosta },
  { label: "Última Hora — El BCP anuncia el pago del anticipo desde el jueves (4 nov 2026)", url: U.ultimahoraAnticipo },
  { label: "La Nación — El BCP explica el sistema de pago a ahorristas (4 nov 2026)", url: U.lanacionPago },
  { label: "Diario HOY — Cómo y cuándo pagará el BCP a los ahorristas (4 nov 2026)", url: U.hoyPago },
  { label: "1000 Noticias — El Fondo de Garantía arranca los desembolsos tras promulgarse la ley (4 nov 2026)", url: U.milNoticias },
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
    "Cómo cobrar el anticipo de hasta Gs. 121.760.000 desde el 5 de noviembre, qué pasa con los créditos y qué revisar antes de comprar un inmueble.",
  lead:
    "El Banco Central del Paraguay (BCP) inició la resolución de ueno bank, el quinto banco privado del país, porque su solvencia cayó por debajo de la mitad del mínimo legal. Te cuento qué se sabe hasta hoy, qué pasa con los depósitos y los créditos, y qué cambia (y qué no) para quien está por comprar un inmueble.",
  readingTime: "7 min de lectura",
  updatedLabel: "Actualizado: 8 nov 2026",
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
      text: "Datos actualizados al 8 de noviembre de 2026. El BCP ya pagó el anticipo a casi 1,2 millones de cuentas y desde el lunes 9 sigue con quienes tienen deudas, varias cuentas o cuentas bloqueadas.",
    },
    { type: "h2", id: "novedades", text: "Novedades al 8 de noviembre" },
    {
      type: "ul",
      items: [
        `**Pagos:** el BCP ya acreditó el anticipo a unas **1.197.000 cuentas**, por **Gs. 996.000 millones** (unos USD 168 millones), en dos tandas. De 1.867.000 cuentas con saldo que califican, quedan unas 670.000 por pagar ([La Nación](${U.lnPagados})).`,
        `**Desde el lunes 9 de noviembre:** se paga a quienes tienen **deudas con ueno** (préstamos, sobregiros y tarjetas vencidas se descuentan antes de acreditar), a quienes tienen **varias cuentas** que hay que unificar y a quienes quedaron afuera por **cuentas bloqueadas** u otras verificaciones, como tarde el martes ([La Nación](${U.lnLunes}), [La Nación](${U.lnPagados})).`,
        `**Consultas sobre montos o pagos:** por correo a **pagosacreditadosfgd@bcp.gov.py**; los reclamos se atienden por orden de llegada ([La Nación](${U.lnLunes})).`,
        `**Crisis política:** el 6 de noviembre el Senado destituyó al presidente Santiago Peña por mal desempeño de funciones y asumió Pedro Alliana. El 7, un juez ordenó la prisión preventiva de Peña ([ABC](${U.abcJuicio}), [ABC](${U.abcPreso})). Lo explico en detalle en [Juicio político a Santiago Peña: qué pasó y qué puede cambiar](${J}).`,
      ],
    },
    { type: "h2", id: "como-cobrar", text: "Cómo cobrar el anticipo (desde el 5 de noviembre)" },
    {
      type: "p",
      text: `El 4 de noviembre se promulgó la **Ley 7.755/26**, que permite adelantar el pago del Fondo de Garantía de Depósitos. Con esa ley, el BCP empieza a pagar a unos 1,9 millones de clientes de ueno un anticipo de **hasta 40 salarios mínimos: Gs. 121.760.000 por persona**, menos las deudas vencidas que tengas con el banco ([ABC](${U.abcAvisos}), [1000 Noticias](${U.milNoticias})).`,
    },
    {
      type: "ol",
      items: [
        "**Esperá el email del BCP.** Desde el 5 de noviembre, cada ahorrista recibe un correo de **fgdpagos@bcp.gov.py** con el monto, los descuentos por deudas y el banco donde se acredita el dinero.",
        "**Si tenés cuenta en otro banco o financiera,** el anticipo se deposita en la cuenta con mayor saldo disponible.",
        "**Si solo tenías cuenta en ueno** (unos 280.000 clientes), se abre una caja de ahorro a tu nombre en un banco asignado. Según ABC, es una cuenta temporal de 90 días abierta junto con la Asociación de Bancos.",
        "**Descargá la app del banco asignado** para mover o retirar el dinero.",
        `**Si a las 24 horas no te llegó el email,** consultá en la sección FGD pagos de la web del BCP: [bcp.gov.py/web/institucional/fgd-pagos](https://www.bcp.gov.py/web/institucional/fgd-pagos).`,
      ],
    },
    {
      type: "p",
      text: `Las acreditaciones empiezan dentro de las 24 horas de la notificación y el proceso no puede pasar de **cinco días hábiles** ([Última Hora](${U.ultimahoraAnticipo}), [Diario HOY](${U.hoyPago})). Lo que supere el anticipo, hasta el tope de 75 salarios mínimos (Gs. 228.300.000), se pagaría después de la conciliación de cuentas que hace la intervención; todavía no hay fecha para ese saldo ([ABC](${U.abcAvisos})).`,
    },
    {
      type: "callout",
      title: "Cuidado con las estafas",
      text: "El aviso oficial llega solo desde fgdpagos@bcp.gov.py. No respondas mensajes, llamadas ni links que te pidan claves, códigos o un pago para \"agilizar\" el cobro.",
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
        ["6–7 nov 2026", `El Senado destituye a Peña por mal desempeño de funciones (44 votos) y Pedro Alliana jura como presidente; Antonio Barrios es electo vicepresidente ([ABC](${U.abcJuicio})). La Fiscalía imputa a Peña y al expresidente del BCP Carlos Carvallo y pide su prisión preventiva; el 7, el juez Humberto Otazú la ordena para Peña. Miguel Vásquez, fundador de ueno, y cinco directivos son trasladados a un penal ([ABC](${U.abcPreso}), [Infobae](${U.infobaeCarvallo})).`],
        ["4–5 nov 2026", `Se promulga la Ley 7.755/26 de anticipos y el BCP anuncia el pago desde el 5 de noviembre. Pedro de Jesús Acosta asume como presidente interino del BCP ([ABC](${U.abcAcosta})). El juez de Garantías admite la imputación contra 27 personas; la audiencia de medidas cautelares de los ocho detenidos está fijada para el 5 de noviembre ([Diario HOY](${U.hoyPago})).`],
        ["3–4 nov 2026", `La Fiscalía detiene a ocho directivos, entre ellos el CEO, en una causa iniciada por denuncia del BCP por presunta lesión de confianza y otros delitos ([Infobae](${U.infobaeDetenidos})).`],
        ["3 nov 2026", `El BCP anuncia la resolución, designa interventores y la entidad deja de operar. El presidente del BCP, Carlos Carvallo, renuncia a pedido del presidente Santiago Peña; asume de forma provisoria Liana Caballero ([Infobae/EFE](${U.infobaeRenuncia})).`],
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
      text: `El caso también abrió un debate político. Carvallo había dirigido antes la Financiera Ueno, y la prensa señaló en 2024 que Peña fue accionista de Ueno Holding; según ABC, vendió esas inversiones en abril de 2025. Peña negó cualquier conflicto de intereses, respaldó al BCP y calificó lo ocurrido como "un caso particular". El 5 de noviembre, Diputados aprobó por unanimidad acusar a Peña en juicio político y el 6 el Senado lo destituyó ([ABC](${U.abcJuicio})). Todos los detalles, en [este artículo](${J}).`,
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
        ["Depósitos hasta 75 salarios mínimos", "Cubiertos por el Fondo de Garantía: hasta **Gs. 228.300.000** por persona y por entidad. Desde el 5 de noviembre se paga un anticipo de hasta **Gs. 121.760.000** (40 salarios mínimos); el resto, después de la conciliación de cuentas, sin fecha todavía."],
        ["Depósitos por encima del tope", "Se atenderán con el proceso de resolución: los activos y pasivos se transferirían a otras entidades por un proceso competitivo. El balance de exclusión tiene un plazo máximo de 15 días."],
        ["Deudas con ueno (préstamos, tarjetas)", "Siguen vigentes: no se anulan. El BCP va a informar dónde pagarlas. Antes de pagar la garantía, se descuentan las deudas del titular con el banco."],
        ["App, transferencias y tarjetas", "Fuera de servicio hasta que termine el balance de exclusión."],
        ["Fondos mutuos con colocaciones en ueno", "Rescates suspendidos; la reanudación paulatina está prevista desde el jueves 5 de noviembre."],
      ],
      note: "Fuentes: comunicados del BCP según ABC Color y Diario HOY.",
    },
    {
      type: "p",
      text: `El anticipo más rápido que discutía el Congreso ya es ley: la **Ley 7.755/26** se promulgó el 4 de noviembre y es la que permite el pago desde el 5 ([ABC](${U.abcAvisos})). Los jubilados y pensionados del IPS que cobraban por ueno tienen garantizados el haber de noviembre y el aguinaldo, que cobrarán de forma transitoria en otro banco asignado por el IPS ([Diario HOY](${U.hoyPago})).`,
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
        "**Informate por canales oficiales.** El aviso de pago llega solo desde fgdpagos@bcp.gov.py. Desconfiá de cadenas y de quien te ofrezca \"cobrar antes\" a cambio de un pago o te pida tus claves.",
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
    "How to collect the advance of up to PYG 121,760,000 from November 5, what happens to loans and what to check before buying property.",
  lead:
    "The Central Bank of Paraguay (BCP) started the resolution of ueno bank, the country's fifth-largest private bank, because its solvency fell below half the legal minimum. Here is what we know so far, what happens to deposits and loans, and what changes (and what does not) for anyone about to buy property.",
  readingTime: "7 min read",
  updatedLabel: "Updated: Nov 8, 2026",
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
      text: "Figures as of November 8, 2026. The BCP has already paid the advance to almost 1.2 million accounts and, from Monday the 9th, continues with savers who have debts, several accounts or blocked accounts.",
    },
    { type: "h2", id: "novedades", text: "Updates as of November 8" },
    {
      type: "ul",
      items: [
        `**Payments:** the BCP has credited the advance to about **1,197,000 accounts**, totaling **PYG 996 billion** (about USD 168 million), in two batches. Of the 1,867,000 eligible accounts with balances, about 670,000 are still pending ([La Nación](${U.lnPagados})).`,
        `**From Monday, November 9:** payouts go to savers with **debts to ueno** (overdue loans, overdrafts and cards are deducted first), to those with **several accounts** that must be merged, and to those left out because of **blocked accounts** or other checks, by Tuesday at the latest ([La Nación](${U.lnLunes}), [La Nación](${U.lnPagados})).`,
        `**Questions about amounts or payments:** email **pagosacreditadosfgd@bcp.gov.py**; claims are handled in order of arrival ([La Nación](${U.lnLunes})).`,
        `**Political crisis:** on November 6 the Senate removed President Santiago Peña for poor performance of his duties and Pedro Alliana took office. On the 7th, a judge ordered Peña's pretrial detention ([ABC](${U.abcJuicio}), [ABC](${U.abcPreso})). Full details in [The impeachment of Santiago Peña: what happened and what may change](${J}).`,
      ],
    },
    { type: "h2", id: "como-cobrar", text: "How to collect the advance (from November 5)" },
    {
      type: "p",
      text: `On November 4, **Law 7.755/26** was enacted, allowing the Deposit Guarantee Fund payment to be advanced. Under that law, the BCP is paying some 1.9 million ueno clients an advance of **up to 40 minimum wages: PYG 121,760,000 per person**, minus any overdue debts owed to the bank ([ABC](${U.abcAvisos}), [1000 Noticias](${U.milNoticias})).`,
    },
    {
      type: "ol",
      items: [
        "**Wait for the BCP email.** From November 5, each saver receives an email from **fgdpagos@bcp.gov.py** with the amount, any debt deductions and the bank where the money is credited.",
        "**If you have an account at another bank or finance company,** the advance is deposited into the account with the highest available balance.",
        "**If you only had an account at ueno** (about 280,000 clients), a savings account is opened in your name at an assigned bank. According to ABC, it is a temporary 90-day account opened together with the Banking Association.",
        "**Download the assigned bank's app** to move or withdraw the money.",
        `**If the email has not arrived after 24 hours,** check the FGD pagos section of the BCP website: [bcp.gov.py/web/institucional/fgd-pagos](https://www.bcp.gov.py/web/institucional/fgd-pagos).`,
      ],
    },
    {
      type: "p",
      text: `Credits start within 24 hours of the notification and the process cannot exceed **five business days** ([Última Hora](${U.ultimahoraAnticipo}), [Diario HOY](${U.hoyPago})). Any amount above the advance, up to the 75-minimum-wage cap (PYG 228,300,000), would be paid after the administrators reconcile the accounts; there is no date yet for that balance ([ABC](${U.abcAvisos})).`,
    },
    {
      type: "callout",
      title: "Watch out for scams",
      text: "The official notice only comes from fgdpagos@bcp.gov.py. Do not answer messages, calls or links asking for passwords, codes or a payment to \"speed up\" your payout.",
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
        ["Nov 6–7, 2026", `The Senate removes Peña for poor performance of his duties (44 votes) and Pedro Alliana is sworn in as president; Antonio Barrios is elected vice president ([ABC](${U.abcJuicio})). Prosecutors charge Peña and former BCP president Carlos Carvallo and request pretrial detention; on the 7th, Judge Humberto Otazú orders it for Peña. ueno founder Miguel Vásquez and five executives are moved to prison ([ABC](${U.abcPreso}), [Infobae](${U.infobaeCarvallo})).`],
        ["Nov 4–5, 2026", `Law 7.755/26 on advance payments is enacted and the BCP announces payouts from November 5. Pedro de Jesús Acosta becomes interim BCP president ([ABC](${U.abcAcosta})). A judge admits charges against 27 people; the hearing on precautionary measures for the eight detainees is set for November 5 ([Diario HOY](${U.hoyPago})).`],
        ["Nov 3–4, 2026", `Prosecutors detain eight executives, including the CEO, in a case opened on a BCP complaint for alleged breach of trust and other offenses ([Infobae](${U.infobaeDetenidos})).`],
        ["Nov 3, 2026", `The BCP announces the resolution, appoints administrators and the bank stops operating. BCP president Carlos Carvallo resigns at the request of President Santiago Peña; Liana Caballero takes over provisionally ([Infobae/EFE](${U.infobaeRenuncia})).`],
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
      text: `The case has also sparked a political debate. Carvallo had previously run Financiera Ueno, and the press reported in 2024 that Peña had been a shareholder of Ueno Holding; according to ABC, he sold those holdings in April 2025. Peña denied any conflict of interest, backed the BCP and called it "a particular case". On November 5 the Chamber of Deputies unanimously voted to impeach Peña, and on the 6th the Senate removed him ([ABC](${U.abcJuicio})). Full details in [this article](${J}).`,
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
        ["Deposits up to 75 minimum wages", "Covered by the Guarantee Fund: up to **PYG 228,300,000** per person and per institution. From November 5, an advance of up to **PYG 121,760,000** (40 minimum wages) is paid; the rest after account reconciliation, with no date yet."],
        ["Deposits above the cap", "Handled through the resolution process: assets and liabilities would be transferred to other institutions through a competitive process. The exclusion balance sheet has a maximum deadline of 15 days."],
        ["Debts with ueno (loans, cards)", "Still owed: they are not cancelled. The BCP will announce where to pay them. Any debts the holder owes the bank are deducted before the guarantee is paid."],
        ["App, transfers and cards", "Out of service until the exclusion balance sheet is completed."],
        ["Mutual funds with placements in ueno", "Redemptions suspended; a gradual restart is planned from Thursday, November 5."],
      ],
      note: "Sources: BCP announcements as reported by ABC Color and Diario HOY.",
    },
    {
      type: "p",
      text: `The faster advance payment Congress was debating is now law: **Law 7.755/26** was enacted on November 4 and is what allows payouts from the 5th ([ABC](${U.abcAvisos})). IPS retirees and pensioners who were paid through ueno are guaranteed their November payment and year-end bonus, which they will temporarily collect at another bank assigned by IPS ([Diario HOY](${U.hoyPago})).`,
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
        "**Use official channels.** The payment notice only comes from fgdpagos@bcp.gov.py. Be wary of chain messages and of anyone offering to \"get you paid sooner\" for a fee or asking for your passwords.",
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
    "Como receber o adiantamento de até PYG 121.760.000 a partir de 5 de novembro, o que acontece com os créditos e o que conferir antes de comprar um imóvel.",
  lead:
    "O Banco Central do Paraguai (BCP) iniciou a resolução do ueno bank, o quinto maior banco privado do país, porque sua solvência caiu abaixo da metade do mínimo legal. Conto o que se sabe até hoje, o que acontece com depósitos e créditos e o que muda (e o que não muda) para quem vai comprar um imóvel.",
  readingTime: "7 min de leitura",
  updatedLabel: "Atualizado: 8 nov 2026",
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
      text: "Dados atualizados em 8 de novembro de 2026. O BCP já pagou o adiantamento a quase 1,2 milhão de contas e, a partir de segunda-feira, 9, continua com quem tem dívidas, várias contas ou contas bloqueadas.",
    },
    { type: "h2", id: "novedades", text: "Novidades em 8 de novembro" },
    {
      type: "ul",
      items: [
        `**Pagamentos:** o BCP já creditou o adiantamento a cerca de **1.197.000 contas**, somando **PYG 996 bilhões** (cerca de USD 168 milhões), em dois lotes. Das 1.867.000 contas com saldo que se qualificam, faltam cerca de 670.000 ([La Nación](${U.lnPagados})).`,
        `**A partir de segunda-feira, 9 de novembro:** recebem os poupadores com **dívidas com o ueno** (empréstimos, cheque especial e cartões vencidos são descontados antes), os que têm **várias contas** a unificar e os que ficaram de fora por **contas bloqueadas** ou outras verificações, no mais tardar na terça-feira ([La Nación](${U.lnLunes}), [La Nación](${U.lnPagados})).`,
        `**Dúvidas sobre valores ou pagamentos:** pelo e-mail **pagosacreditadosfgd@bcp.gov.py**; as reclamações são atendidas por ordem de chegada ([La Nación](${U.lnLunes})).`,
        `**Crise política:** em 6 de novembro o Senado destituiu o presidente Santiago Peña por mau desempenho de funções e Pedro Alliana assumiu. No dia 7, um juiz ordenou a prisão preventiva de Peña ([ABC](${U.abcJuicio}), [ABC](${U.abcPreso})). Os detalhes estão em [Julgamento político de Santiago Peña: o que aconteceu e o que pode mudar](${J}).`,
      ],
    },
    { type: "h2", id: "como-cobrar", text: "Como receber o adiantamento (a partir de 5 de novembro)" },
    {
      type: "p",
      text: `Em 4 de novembro foi promulgada a **Lei 7.755/26**, que permite adiantar o pagamento do Fundo de Garantia de Depósitos. Com essa lei, o BCP começa a pagar a cerca de 1,9 milhão de clientes do ueno um adiantamento de **até 40 salários mínimos: PYG 121.760.000 por pessoa**, descontadas as dívidas vencidas com o banco ([ABC](${U.abcAvisos}), [1000 Noticias](${U.milNoticias})).`,
    },
    {
      type: "ol",
      items: [
        "**Aguarde o e-mail do BCP.** A partir de 5 de novembro, cada poupador recebe um e-mail de **fgdpagos@bcp.gov.py** com o valor, os descontos por dívidas e o banco onde o dinheiro é creditado.",
        "**Se você tem conta em outro banco ou financeira,** o adiantamento é depositado na conta com maior saldo disponível.",
        "**Se você só tinha conta no ueno** (cerca de 280.000 clientes), é aberta uma conta poupança em seu nome em um banco designado. Segundo o ABC, é uma conta temporária de 90 dias aberta junto com a Associação de Bancos.",
        "**Baixe o app do banco designado** para movimentar ou sacar o dinheiro.",
        `**Se o e-mail não chegar em 24 horas,** consulte a seção FGD pagos do site do BCP: [bcp.gov.py/web/institucional/fgd-pagos](https://www.bcp.gov.py/web/institucional/fgd-pagos).`,
      ],
    },
    {
      type: "p",
      text: `Os créditos começam em até 24 horas após a notificação e o processo não pode passar de **cinco dias úteis** ([Última Hora](${U.ultimahoraAnticipo}), [Diario HOY](${U.hoyPago})). O que ultrapassar o adiantamento, até o teto de 75 salários mínimos (PYG 228.300.000), seria pago depois da conciliação de contas feita pela intervenção; ainda não há data para esse saldo ([ABC](${U.abcAvisos})).`,
    },
    {
      type: "callout",
      title: "Cuidado com golpes",
      text: "O aviso oficial chega apenas de fgdpagos@bcp.gov.py. Não responda mensagens, ligações ou links que peçam senhas, códigos ou um pagamento para \"agilizar\" o recebimento.",
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
        ["6–7 nov 2026", `O Senado destitui Peña por mau desempenho de funções (44 votos) e Pedro Alliana assume como presidente; Antonio Barrios é eleito vice-presidente ([ABC](${U.abcJuicio})). O Ministério Público imputa Peña e o ex-presidente do BCP Carlos Carvallo e pede sua prisão preventiva; no dia 7, o juiz Humberto Otazú a ordena para Peña. Miguel Vásquez, fundador do ueno, e cinco diretores são transferidos para um presídio ([ABC](${U.abcPreso}), [Infobae](${U.infobaeCarvallo})).`],
        ["4–5 nov 2026", `É promulgada a Lei 7.755/26 de adiantamentos e o BCP anuncia o pagamento a partir de 5 de novembro. Pedro de Jesús Acosta assume como presidente interino do BCP ([ABC](${U.abcAcosta})). O juiz de Garantias admite a imputação contra 27 pessoas; a audiência de medidas cautelares dos oito detidos está marcada para 5 de novembro ([Diario HOY](${U.hoyPago})).`],
        ["3–4 nov 2026", `O Ministério Público detém oito diretores, entre eles o CEO, em um caso aberto por denúncia do BCP por suposta lesão de confiança e outros crimes ([Infobae](${U.infobaeDetenidos})).`],
        ["3 nov 2026", `O BCP anuncia a resolução, nomeia interventores e o banco deixa de operar. O presidente do BCP, Carlos Carvallo, renuncia a pedido do presidente Santiago Peña; Liana Caballero assume provisoriamente ([Infobae/EFE](${U.infobaeRenuncia})).`],
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
      text: `O caso também abriu um debate político. Carvallo havia dirigido antes a Financiera Ueno, e a imprensa apontou em 2024 que Peña foi acionista da Ueno Holding; segundo o ABC, ele vendeu essas participações em abril de 2025. Peña negou qualquer conflito de interesses, apoiou o BCP e chamou o ocorrido de "um caso particular". Em 5 de novembro, a Câmara dos Deputados aprovou por unanimidade a acusação de Peña em julgamento político e, no dia 6, o Senado o destituiu ([ABC](${U.abcJuicio})). Todos os detalhes [neste artigo](${J}).`,
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
        ["Depósitos até 75 salários mínimos", "Cobertos pelo Fundo de Garantia: até **PYG 228.300.000** por pessoa e por instituição. A partir de 5 de novembro é pago um adiantamento de até **PYG 121.760.000** (40 salários mínimos); o restante, depois da conciliação de contas, ainda sem data."],
        ["Depósitos acima do teto", "Serão tratados no processo de resolução: ativos e passivos seriam transferidos a outras instituições por um processo competitivo. O balanço de exclusão tem prazo máximo de 15 dias."],
        ["Dívidas com o ueno (empréstimos, cartões)", "Continuam valendo: não são anuladas. O BCP vai informar onde pagá-las. Antes de pagar a garantia, são descontadas as dívidas do titular com o banco."],
        ["App, transferências e cartões", "Fora de serviço até concluir o balanço de exclusão."],
        ["Fundos de investimento com aplicações no ueno", "Resgates suspensos; a retomada gradual está prevista a partir de quinta-feira, 5 de novembro."],
      ],
      note: "Fontes: comunicados do BCP segundo ABC Color e Diario HOY.",
    },
    {
      type: "p",
      text: `O adiantamento mais rápido que o Congresso discutia já é lei: a **Lei 7.755/26** foi promulgada em 4 de novembro e é ela que permite o pagamento a partir do dia 5 ([ABC](${U.abcAvisos})). Os aposentados e pensionistas do IPS que recebiam pelo ueno têm garantidos o pagamento de novembro e o 13º, que receberão temporariamente em outro banco designado pelo IPS ([Diario HOY](${U.hoyPago})).`,
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
        "**Informe-se por canais oficiais.** O aviso de pagamento chega apenas de fgdpagos@bcp.gov.py. Desconfie de correntes e de quem ofereça \"receber antes\" em troca de um pagamento ou peça suas senhas.",
      ],
    },
    { type: "cta" },
  ],
};

export const uenoBankArticle: ArticleDefinition = {
  slug: SLUG,
  cover: {
    src: "/blog/caso-ueno-bank-hero.webp",
    og: "/blog/caso-ueno-bank-og.jpg",
    width: 1672,
    height: 941,
    alt: {
      es: "Bloque verde con el logo de ueno bank junto a una carpeta del BCP y la maqueta de un edificio de departamentos",
      en: "Green block with the ueno bank logo next to a BCP folder and a scale model of an apartment building",
      pt: "Bloco verde com o logo do ueno bank ao lado de uma pasta do BCP e a maquete de um prédio de apartamentos",
    },
  },
  published: PUBLISHED,
  updated: UPDATED,
  category: "market",
  sources: SOURCES,
  content: { es, en, pt },
};
