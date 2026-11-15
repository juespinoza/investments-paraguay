import type {
  ArticleDefinition,
  ArticleSource,
  LocalizedArticle,
} from "@/lib/content/articles/types";

// Guía evergreen: qué revisar antes de comprar un departamento en pozo.
// Conecta con el caso ueno (obras frenadas por fondos en un banco intervenido).
const SLUG = "comprar-en-pozo-como-revisar-una-desarrolladora";
const PUBLISHED = "2026-11-14";
const UPDATED = "2026-11-14";

const L = {
  ueno: "/blog/caso-ueno-bank-que-significa-para-invertir",
  foreigners: "/blog/invertir-en-paraguay-siendo-extranjero",
  guide: "/blog/asuncion-real-estate-investment-guide",
  properties: "/bienes-raices",
};

const U = {
  abc: "https://www.abc.com.py/negocios/2025/08/14/5-claves-para-invertir-en-proyectos-inmobiliarios-en-pozo-en-paraguay/",
  elInmobiliario: "https://www.elinmobiliario.com.py/post/comprar-en-pozo-en-paraguay-10-controles-que-conviene-realizar-antes-de-pagar",
  holacasa: "https://holacasa.com.py/comprar-en-pozo-vs-terminado-paraguay/",
  ley921: "https://www.bacn.gov.py/leyes-paraguayas/706/ley-n-921--de-negocios-fiduciarios",
  plus: "https://revistaplus.com.py/2026/11/04/crisis-de-ueno-frena-obras-de-viviendas-y-deja-a-familias-sin-respuestas/",
};

const SOURCES: ArticleSource[] = [
  { label: "El Inmobiliario — Comprar en pozo en Paraguay: 10 controles antes de pagar (ago 2026)", url: U.elInmobiliario },
  { label: "ABC Color — 5 claves para invertir en proyectos en pozo en Paraguay (ago 2025)", url: U.abc },
  { label: "Holacasa — Comprar en pozo o terminado en Paraguay (sep 2026)", url: U.holacasa },
  { label: "Ley N° 921/96 de Negocios Fiduciarios (BACN)", url: U.ley921 },
  { label: "Revista PLUS — La crisis de ueno frena obras de viviendas (4 nov 2026)", url: U.plus },
];

const es: LocalizedArticle = {
  title: "Comprar en pozo en Paraguay: cómo revisar a una desarrolladora antes de firmar",
  metaTitle: "Comprar en pozo en Paraguay: qué revisar antes de firmar",
  description:
    "Qué revisar de la desarrolladora, el terreno, el fideicomiso y el contrato antes de comprar en pozo en Paraguay. Checklist con preguntas concretas.",
  excerpt:
    "Desarrolladora, terreno, fideicomiso, banco de la obra y contrato: las revisiones que separan un buen pozo de un problema.",
  lead:
    "Comprar en pozo es la forma más usada de entrar al mercado inmobiliario de Asunción con menos capital, y también donde más se pierde dinero cuando algo sale mal. La caída de ueno bank mostró el riesgo con obras frenadas porque los fondos estaban en el banco equivocado. Acá te dejo las revisiones que hago antes de recomendar un proyecto, con las preguntas exactas para hacerle a la desarrolladora.",
  readingTime: "8 min de lectura",
  updatedLabel: "Actualizado: 14 nov 2026",
  authorRole: "Asesora inmobiliaria en SkyOne",
  tocTitle: "En este artículo",
  sourcesTitle: "Fuentes",
  disclaimer:
    "Este artículo es informativo y no reemplaza la revisión de un escribano o abogado sobre tu contrato. Cada proyecto es distinto: usá esta lista como guía de preguntas, no como garantía.",
  cta: {
    title: "¿Estás por reservar en pozo?",
    text: "Pasame el nombre del proyecto y en 20 minutos lo recorremos juntos con esta lista: desarrolladora, terreno, fideicomiso y contrato.",
    guide: "Descargar la guía gratuita",
    call: "Agendar una llamada",
    whatsapp: "Escribir por WhatsApp",
    whatsappMessage:
      "Hola Julia, leí tu artículo sobre comprar en pozo y quiero revisar un proyecto con vos.",
  },
  blocks: [
    { type: "h2", id: "por-que-pozo", text: "Por qué se compra en pozo y qué se arriesga" },
    {
      type: "p",
      text: `En pozo pagás una entrega inicial y cuotas durante la obra, sin hipoteca, y a cambio el precio suele ser menor que el de una unidad terminada. No hay una serie pública que mida ese descuento en Paraguay: la única forma de saber si es real es comparar el precio por m² con el de unidades terminadas de la misma zona ([Holacasa](${U.holacasa})). Los datos de precios de Asunción están en la [guía de inversión](${L.guide}).`,
    },
    {
      type: "ul",
      items: [
        "**Retrasos en la entrega** y cambios en las terminaciones prometidas.",
        "**Que la obra no se termine,** por falta de ventas, de financiación o por problemas de la desarrolladora.",
        `**Años sin renta.** Mientras dura la obra no cobrás alquiler: con una rentabilidad bruta cercana al 7 %, cada año de obra equivale a resignar alrededor de un 7 % del valor de la unidad ([Holacasa](${U.holacasa})).`,
        `**El banco de la obra.** Tras la intervención de ueno, una constructora informó que tenía entre Gs. 700 y 800 millones de sus clientes inmovilizados y que el problema alcanzaba a "cientos de constructoras y desarrolladoras" ([Revista PLUS](${U.plus})). Te lo cuento en [Caso ueno bank](${L.ueno}).`,
      ],
    },
    { type: "h2", id: "desarrolladora", text: "1. La desarrolladora: trayectoria, no renders" },
    {
      type: "p",
      text: `Antes de mirar el render, mirá quién está atrás. "No basta con una marca bonita o una web bien diseñada", resume un asesor en ABC Color ([ABC](${U.abc})). Preguntá:`,
    },
    {
      type: "ol",
      items: [
        "**¿Cuántos edificios entregaron y cuándo?** Pedí direcciones y visitá al menos uno. Fijate cómo envejeció la construcción.",
        "**¿Entregaron en fecha?** Hablá con compradores de obras anteriores. Si es el primer proyecto del equipo, el riesgo es mayor.",
        "**¿Quiénes son los socios y qué capital propio tienen en la obra?** Buscá antecedentes de juicios o conflictos en proyectos anteriores.",
        `**¿Cómo se financia la obra?** Si depende solo de las preventas, es más vulnerable a un freno del mercado. Preguntá qué porcentaje está vendido y si hay respaldo bancario ([ABC](${U.abc})).`,
        "**¿Con qué bancos opera el proyecto?** Es la pregunta nueva después de ueno. Pedí por escrito dónde se depositan las cuotas y si tenían fondos en una entidad intervenida.",
      ],
    },
    { type: "h2", id: "terreno-y-permisos", text: "2. El terreno y los permisos" },
    {
      type: "ul",
      items: [
        `**El terreno tiene que estar a nombre de la sociedad o del fideicomiso que construye.** Si sigue a nombre de un tercero, un conflicto con ese dueño puede frenar la obra ([ABC](${U.abc})).`,
        `**Informe de gravámenes actualizado** del Registro Unificado Nacional: hipotecas, embargos, prohibiciones de innovar. Si hay hipoteca, el contrato debe explicar cómo se libera tu unidad ([El Inmobiliario](${U.elInmobiliario})).`,
        `**Aprobación municipal:** resolución de aprobación, planos aprobados y permiso de construcción. Un expediente "en trámite" no es una autorización ([El Inmobiliario](${U.elInmobiliario})).`,
        `**Inscripción del contrato:** la Ley Orgánica Municipal obliga al vendedor a inscribir el contrato de venta dentro de los 30 días de la firma. Pedí el comprobante ([El Inmobiliario](${U.elInmobiliario})).`,
      ],
    },
    { type: "cta" },
    { type: "h2", id: "fideicomiso", text: "3. El fideicomiso: qué garantiza y qué no" },
    {
      type: "p",
      text: `En Paraguay, los proyectos en pozo se estructuran como sociedad o como fideicomiso. El fideicomiso suele dar más seguridad porque separa el dinero de los compradores del patrimonio de la desarrolladora y lo destina solo a la obra ([ABC](${U.abc})). Pero **que diga "fideicomiso" no es una garantía automática**: la protección depende de qué bienes se transfirieron y de las reglas del contrato ([El Inmobiliario](${U.elInmobiliario})).`,
    },
    {
      type: "ol",
      items: [
        `**¿Quién es el fiduciario?** Por la Ley 921/96, solo pueden serlo bancos, financieras y empresas fiduciarias autorizadas por el BCP ([Ley 921/96](${U.ley921})). Verificalo en la lista de entidades supervisadas del BCP.`,
        "**¿Qué se transfirió al fideicomiso?** Como mínimo, el terreno. Si el terreno quedó afuera, la separación patrimonial es mucho más débil.",
        "**¿A qué cuenta pagás?** Tiene que ser la cuenta del fideicomiso, no la de la desarrolladora ni la de una persona.",
        "**¿Cuándo se libera el dinero para la obra y en qué orden se paga a los acreedores si algo falla?** Está en el contrato de fideicomiso. Pedilo y hacelo leer.",
      ],
    },
    {
      type: "callout",
      title: "Tu escribano, no el de ellos",
      text: "El escribano o abogado que revisa el contrato marco, el fideicomiso y los títulos tiene que trabajar para vos. El de la desarrolladora revisa los intereses de la desarrolladora.",
    },
    { type: "h2", id: "contrato", text: "4. El contrato: las cláusulas que importan" },
    {
      type: "table",
      head: ["Cláusula", "Qué tiene que decir"],
      rows: [
        ["Superficie", "Separar metros cubiertos, balcones, muros, cuota de áreas comunes, cochera y baulera. \"Metros totales\" puede significar cosas distintas."],
        ["Precio total", "Cuotas, impuestos, escritura e inscripción, individualización de la unidad, conexiones de servicios y fondo de reserva inicial del edificio. Si está en dólares o se ajusta, el criterio de ajuste tiene que ser objetivo."],
        ["Fecha de entrega", "Fecha verificable, prórroga máxima, qué cuenta como fuerza mayor y **penalidad para la desarrolladora** si se atrasa, no solo para vos si te atrasás."],
        ["Especificaciones", "Marcas, modelos y medidas. Si hay cláusula de sustitución, que garantice calidad igual o superior."],
        ["Salida", "Causales de rescisión, qué porcentaje retiene el vendedor, en cuánto tiempo y en qué moneda devuelve, y qué pasa si la obra nunca empieza."],
        ["Cesión", "Si podés vender tu contrato antes de la entrega y qué comisión cobra la desarrolladora por eso."],
      ],
      note: `Resumen de los controles de El Inmobiliario (ago 2026). Los porcentajes y plazos los fija cada contrato: pedilos por escrito ([El Inmobiliario](${U.elInmobiliario})).`,
    },
    { type: "h2", id: "entrega", text: "5. La entrega" },
    {
      type: "ul",
      items: [
        "**Inspección técnica antes de recibir,** con un acta firmada, fotos y plazo para reparar defectos.",
        "**Reglamento de copropiedad en borrador,** antes de firmar: define si se permite alquiler temporario, cómo se reparten las expensas y cómo se vota.",
        `**Escritura e inscripción a tu nombre.** Recién ahí la unidad es tuya. Los costos están explicados en [Cómo invertir en Paraguay siendo extranjero](${L.foreigners}).`,
      ],
    },
    { type: "h2", id: "checklist", text: "Checklist para llevar a la reunión" },
    {
      type: "ol",
      items: [
        "Direcciones de obras entregadas y fechas prometidas vs. reales.",
        "Título del terreno a nombre del fideicomiso o la sociedad, con informe de gravámenes reciente.",
        "Resolución municipal, planos aprobados y permiso de construcción.",
        "Contrato de fideicomiso, nombre del fiduciario autorizado por el BCP y cuenta de pago.",
        "Bancos con los que opera el proyecto, por escrito.",
        "Porcentaje vendido y fuente de financiación de la obra.",
        "Contrato marco con penalidad por atraso, condiciones de salida y de cesión.",
        "Presupuesto total: cuotas más todos los costos de la tabla.",
      ],
    },
    {
      type: "p",
      text: `Si la desarrolladora responde todo esto sin problema, es buena señal. Si evita alguna pregunta, también es una señal. ¿Querés comparar con lo que hay disponible hoy? [Mirá las propiedades](${L.properties}) o escribime y lo revisamos juntos.`,
    },
    { type: "cta" },
  ],
};

const en: LocalizedArticle = {
  title: "Buying off-plan in Paraguay: how to vet a developer before you sign",
  metaTitle: "Buying off-plan in Paraguay: what to check before signing",
  description:
    "What to check about the developer, the land, the trust and the contract before buying off-plan in Paraguay. A checklist with concrete questions.",
  excerpt:
    "Developer, land, trust, the project's bank and the contract: the checks that separate a good off-plan deal from a problem.",
  lead:
    "Buying off-plan is the most common way into Asunción's property market with less capital, and also where the most money is lost when something goes wrong. The collapse of ueno bank showed the risk, with construction halted because funds sat in the wrong bank. Here are the checks I run before recommending a project, with the exact questions to ask the developer.",
  readingTime: "8 min read",
  updatedLabel: "Updated: Nov 14, 2026",
  authorRole: "Real estate advisor at SkyOne",
  tocTitle: "In this article",
  sourcesTitle: "Sources",
  disclaimer:
    "This article is for information only and does not replace a notary's or lawyer's review of your contract. Every project is different: use this list as a guide to questions, not as a guarantee.",
  cta: {
    title: "About to reserve off-plan?",
    text: "Send me the project's name and in 20 minutes we will go through it together with this list: developer, land, trust and contract.",
    guide: "Download the free guide",
    call: "Book a call",
    whatsapp: "Message on WhatsApp",
    whatsappMessage:
      "Hi Julia, I read your article on buying off-plan and I would like to review a project with you.",
  },
  blocks: [
    { type: "h2", id: "por-que-pozo", text: "Why people buy off-plan and what is at risk" },
    {
      type: "p",
      text: `Off-plan, you pay a down payment and installments during construction, with no mortgage, and in return the price is usually lower than a finished unit. There is no public series measuring that discount in Paraguay: the only way to know it is real is to compare the price per m² with finished units in the same area ([Holacasa](${U.holacasa})). Asunción price data is in the [investment guide](${L.guide}).`,
    },
    {
      type: "ul",
      items: [
        "**Delivery delays** and changes to the promised finishes.",
        "**The project not being completed,** for lack of sales, financing or because of the developer's own problems.",
        `**Years without rent.** While construction lasts you collect no rent: with a gross yield close to 7%, each year of construction means giving up around 7% of the unit's value ([Holacasa](${U.holacasa})).`,
        `**The project's bank.** After ueno was taken over, one builder reported PYG 700 to 800 million of its clients' money frozen and said the problem reached "hundreds of builders and developers" ([Revista PLUS](${U.plus})). I explain it in [The ueno bank case](${L.ueno}).`,
      ],
    },
    { type: "h2", id: "desarrolladora", text: "1. The developer: track record, not renders" },
    {
      type: "p",
      text: `Before looking at the render, look at who is behind it. "A nice brand or a well-designed website is not enough", as one advisor put it in ABC Color ([ABC](${U.abc})). Ask:`,
    },
    {
      type: "ol",
      items: [
        "**How many buildings have you delivered, and when?** Ask for addresses and visit at least one. See how the construction has aged.",
        "**Did you deliver on time?** Talk to buyers from earlier projects. If this is the team's first development, the risk is higher.",
        "**Who are the partners and how much of their own capital is in the project?** Look for lawsuits or disputes in earlier developments.",
        `**How is the project financed?** If it depends only on presales, it is more vulnerable to a market slowdown. Ask what percentage is sold and whether there is bank backing ([ABC](${U.abc})).`,
        "**Which banks does the project work with?** This is the new question after ueno. Ask in writing where installments are deposited and whether they had funds at an intervened institution.",
      ],
    },
    { type: "h2", id: "terreno-y-permisos", text: "2. The land and the permits" },
    {
      type: "ul",
      items: [
        `**The land must be titled to the company or trust that is building.** If it is still in a third party's name, a dispute with that owner can halt the project ([ABC](${U.abc})).`,
        `**An up-to-date encumbrance report** from the Registro Unificado Nacional: mortgages, seizures, restraining orders. If there is a mortgage, the contract must explain how your unit is released ([El Inmobiliario](${U.elInmobiliario})).`,
        `**Municipal approval:** the approval resolution, approved plans and construction permit. A file "in process" is not an authorization ([El Inmobiliario](${U.elInmobiliario})).`,
        `**Contract registration:** the Municipal Organic Law requires the seller to register the sale contract within 30 days of signing. Ask for proof ([El Inmobiliario](${U.elInmobiliario})).`,
      ],
    },
    { type: "cta" },
    { type: "h2", id: "fideicomiso", text: "3. The trust: what it guarantees and what it does not" },
    {
      type: "p",
      text: `In Paraguay, off-plan projects are structured as a company or as a trust (fideicomiso). A trust usually offers more security because it separates buyers' money from the developer's assets and earmarks it for construction ([ABC](${U.abc})). But **the word "trust" is not an automatic guarantee**: the protection depends on which assets were transferred and on the contract's rules ([El Inmobiliario](${U.elInmobiliario})).`,
    },
    {
      type: "ol",
      items: [
        `**Who is the trustee?** Under Law 921/96, only banks, finance companies and trust companies authorized by the BCP may act as trustees ([Law 921/96](${U.ley921})). Check the BCP's list of supervised entities.`,
        "**What was transferred to the trust?** At a minimum, the land. If the land was left out, the asset separation is much weaker.",
        "**Which account do you pay into?** It must be the trust's account, not the developer's or an individual's.",
        "**When is money released for construction, and in what order are creditors paid if something fails?** It is in the trust agreement. Ask for it and have it read.",
      ],
    },
    {
      type: "callout",
      title: "Your notary, not theirs",
      text: "The notary or lawyer who reviews the master contract, the trust and the titles must work for you. The developer's reviews the developer's interests.",
    },
    { type: "h2", id: "contrato", text: "4. The contract: the clauses that matter" },
    {
      type: "table",
      head: ["Clause", "What it must say"],
      rows: [
        ["Floor area", "Separate covered area, balconies, walls, share of common areas, parking and storage. \"Total square meters\" can mean different things."],
        ["Total price", "Installments, taxes, deed and registration, unit individualization, utility connections and the building's initial reserve fund. If priced in dollars or adjustable, the adjustment criterion must be objective."],
        ["Delivery date", "A verifiable date, maximum extension, what counts as force majeure and a **penalty for the developer** if late, not only for you if you fall behind."],
        ["Specifications", "Brands, models and measurements. Any substitution clause must guarantee equal or better quality."],
        ["Exit", "Grounds for rescission, what percentage the seller keeps, how soon and in which currency it refunds, and what happens if construction never starts."],
        ["Assignment", "Whether you can sell your contract before delivery and what fee the developer charges for it."],
      ],
      note: `Summary of El Inmobiliario's controls (Aug 2026). Percentages and deadlines are set by each contract: get them in writing ([El Inmobiliario](${U.elInmobiliario})).`,
    },
    { type: "h2", id: "entrega", text: "5. Handover" },
    {
      type: "ul",
      items: [
        "**A technical inspection before you accept,** with a signed report, photos and a deadline to fix defects.",
        "**The draft condominium rules,** before signing: they define whether short-term rentals are allowed, how fees are split and how votes work.",
        `**Deed and registration in your name.** Only then is the unit yours. Costs are explained in [How to invest in Paraguay as a foreigner](${L.foreigners}).`,
      ],
    },
    { type: "h2", id: "checklist", text: "Checklist to bring to the meeting" },
    {
      type: "ol",
      items: [
        "Addresses of delivered buildings and promised vs. actual dates.",
        "Land title in the trust's or company's name, with a recent encumbrance report.",
        "Municipal resolution, approved plans and construction permit.",
        "Trust agreement, name of the BCP-authorized trustee and payment account.",
        "Banks the project works with, in writing.",
        "Percentage sold and source of construction financing.",
        "Master contract with a late-delivery penalty, exit and assignment terms.",
        "Total budget: installments plus every cost in the table.",
      ],
    },
    {
      type: "p",
      text: `If the developer answers all of this without trouble, that is a good sign. If they dodge a question, that is a sign too. Want to compare with what is available today? [Browse properties](${L.properties}) or message me and we will review it together.`,
    },
    { type: "cta" },
  ],
};

const pt: LocalizedArticle = {
  title: "Comprar na planta no Paraguai: como avaliar uma incorporadora antes de assinar",
  metaTitle: "Comprar na planta no Paraguai: o que conferir antes de assinar",
  description:
    "O que conferir sobre a incorporadora, o terreno, o fideicomisso e o contrato antes de comprar na planta no Paraguai. Checklist com perguntas.",
  excerpt:
    "Incorporadora, terreno, fideicomisso, banco da obra e contrato: as verificações que separam um bom negócio na planta de um problema.",
  lead:
    "Comprar na planta é a forma mais usada de entrar no mercado imobiliário de Assunção com menos capital, e também onde mais se perde dinheiro quando algo dá errado. A quebra do ueno bank mostrou o risco, com obras paradas porque os recursos estavam no banco errado. Aqui estão as verificações que faço antes de recomendar um empreendimento, com as perguntas exatas para fazer à incorporadora.",
  readingTime: "8 min de leitura",
  updatedLabel: "Atualizado: 14 nov 2026",
  authorRole: "Consultora imobiliária na SkyOne",
  tocTitle: "Neste artigo",
  sourcesTitle: "Fontes",
  disclaimer:
    "Este artigo é informativo e não substitui a revisão de um tabelião ou advogado sobre o seu contrato. Cada empreendimento é diferente: use esta lista como guia de perguntas, não como garantia.",
  cta: {
    title: "Vai reservar na planta?",
    text: "Me envie o nome do empreendimento e em 20 minutos passamos juntos por esta lista: incorporadora, terreno, fideicomisso e contrato.",
    guide: "Baixar o guia gratuito",
    call: "Agendar uma ligação",
    whatsapp: "Falar pelo WhatsApp",
    whatsappMessage:
      "Olá Julia, li seu artigo sobre comprar na planta e quero revisar um empreendimento com você.",
  },
  blocks: [
    { type: "h2", id: "por-que-pozo", text: "Por que se compra na planta e o que está em risco" },
    {
      type: "p",
      text: `Na planta você paga uma entrada e parcelas durante a obra, sem hipoteca, e em troca o preço costuma ser menor que o de uma unidade pronta. Não há uma série pública que meça esse desconto no Paraguai: a única forma de saber se é real é comparar o preço por m² com o de unidades prontas da mesma região ([Holacasa](${U.holacasa})). Os dados de preços de Assunção estão no [guia de investimento](${L.guide}).`,
    },
    {
      type: "ul",
      items: [
        "**Atrasos na entrega** e mudanças nos acabamentos prometidos.",
        "**A obra não ser concluída,** por falta de vendas, de financiamento ou por problemas da incorporadora.",
        `**Anos sem renda.** Enquanto dura a obra você não recebe aluguel: com uma rentabilidade bruta perto de 7%, cada ano de obra equivale a abrir mão de cerca de 7% do valor da unidade ([Holacasa](${U.holacasa})).`,
        `**O banco da obra.** Depois da intervenção no ueno, uma construtora informou ter entre PYG 700 e 800 milhões de seus clientes bloqueados e disse que o problema atingia "centenas de construtoras e incorporadoras" ([Revista PLUS](${U.plus})). Explico em [Caso ueno bank](${L.ueno}).`,
      ],
    },
    { type: "h2", id: "desarrolladora", text: "1. A incorporadora: histórico, não renders" },
    {
      type: "p",
      text: `Antes de olhar o render, olhe quem está por trás. "Uma marca bonita ou um site bem desenhado não bastam", resume um consultor no ABC Color ([ABC](${U.abc})). Pergunte:`,
    },
    {
      type: "ol",
      items: [
        "**Quantos prédios entregaram e quando?** Peça endereços e visite pelo menos um. Veja como a construção envelheceu.",
        "**Entregaram no prazo?** Converse com compradores de obras anteriores. Se é o primeiro empreendimento da equipe, o risco é maior.",
        "**Quem são os sócios e quanto capital próprio têm na obra?** Procure processos ou conflitos em empreendimentos anteriores.",
        `**Como a obra é financiada?** Se depende só das pré-vendas, é mais vulnerável a uma desaceleração do mercado. Pergunte que percentual está vendido e se há respaldo bancário ([ABC](${U.abc})).`,
        "**Com quais bancos o empreendimento opera?** É a pergunta nova depois do ueno. Peça por escrito onde as parcelas são depositadas e se tinham recursos em uma instituição sob intervenção.",
      ],
    },
    { type: "h2", id: "terreno-y-permisos", text: "2. O terreno e as licenças" },
    {
      type: "ul",
      items: [
        `**O terreno precisa estar em nome da sociedade ou do fideicomisso que constrói.** Se continua em nome de um terceiro, um conflito com esse dono pode parar a obra ([ABC](${U.abc})).`,
        `**Certidão de ônus atualizada** do Registro Unificado Nacional: hipotecas, penhoras, proibições. Se há hipoteca, o contrato deve explicar como sua unidade é liberada ([El Inmobiliario](${U.elInmobiliario})).`,
        `**Aprovação municipal:** resolução de aprovação, projetos aprovados e alvará de construção. Um processo "em andamento" não é uma autorização ([El Inmobiliario](${U.elInmobiliario})).`,
        `**Registro do contrato:** a Lei Orgânica Municipal obriga o vendedor a registrar o contrato de venda em até 30 dias da assinatura. Peça o comprovante ([El Inmobiliario](${U.elInmobiliario})).`,
      ],
    },
    { type: "cta" },
    { type: "h2", id: "fideicomiso", text: "3. O fideicomisso: o que garante e o que não garante" },
    {
      type: "p",
      text: `No Paraguai, os empreendimentos na planta são estruturados como sociedade ou como fideicomisso. O fideicomisso costuma dar mais segurança porque separa o dinheiro dos compradores do patrimônio da incorporadora e o destina só à obra ([ABC](${U.abc})). Mas **a palavra "fideicomisso" não é uma garantia automática**: a proteção depende de quais bens foram transferidos e das regras do contrato ([El Inmobiliario](${U.elInmobiliario})).`,
    },
    {
      type: "ol",
      items: [
        `**Quem é o fiduciário?** Pela Lei 921/96, só podem ser bancos, financeiras e empresas fiduciárias autorizadas pelo BCP ([Lei 921/96](${U.ley921})). Confira na lista de entidades supervisionadas do BCP.`,
        "**O que foi transferido ao fideicomisso?** No mínimo, o terreno. Se o terreno ficou de fora, a separação patrimonial é muito mais fraca.",
        "**Em qual conta você paga?** Tem que ser a conta do fideicomisso, não a da incorporadora nem a de uma pessoa.",
        "**Quando o dinheiro é liberado para a obra e em que ordem os credores são pagos se algo falhar?** Está no contrato de fideicomisso. Peça e mande ler.",
      ],
    },
    {
      type: "callout",
      title: "O seu tabelião, não o deles",
      text: "O tabelião ou advogado que revisa o contrato-quadro, o fideicomisso e os títulos precisa trabalhar para você. O da incorporadora revisa os interesses da incorporadora.",
    },
    { type: "h2", id: "contrato", text: "4. O contrato: as cláusulas que importam" },
    {
      type: "table",
      head: ["Cláusula", "O que precisa dizer"],
      rows: [
        ["Área", "Separar área coberta, varandas, paredes, fração das áreas comuns, vaga e depósito. \"Metros totais\" pode significar coisas diferentes."],
        ["Preço total", "Parcelas, impostos, escritura e registro, individualização da unidade, ligação de serviços e fundo de reserva inicial do prédio. Se está em dólares ou é reajustado, o critério de reajuste precisa ser objetivo."],
        ["Data de entrega", "Data verificável, prorrogação máxima, o que conta como força maior e **multa para a incorporadora** se atrasar, não só para você se atrasar."],
        ["Especificações", "Marcas, modelos e medidas. Se há cláusula de substituição, que garanta qualidade igual ou superior."],
        ["Saída", "Causas de rescisão, que percentual o vendedor retém, em quanto tempo e em que moeda devolve, e o que acontece se a obra nunca começar."],
        ["Cessão", "Se você pode vender seu contrato antes da entrega e que taxa a incorporadora cobra por isso."],
      ],
      note: `Resumo dos controles do El Inmobiliario (ago 2026). Percentuais e prazos são definidos por cada contrato: peça por escrito ([El Inmobiliario](${U.elInmobiliario})).`,
    },
    { type: "h2", id: "entrega", text: "5. A entrega" },
    {
      type: "ul",
      items: [
        "**Vistoria técnica antes de receber,** com ata assinada, fotos e prazo para corrigir defeitos.",
        "**Minuta da convenção de condomínio,** antes de assinar: define se aluguel por temporada é permitido, como as despesas são divididas e como se vota.",
        `**Escritura e registro em seu nome.** Só então a unidade é sua. Os custos estão explicados em [Como investir no Paraguai sendo estrangeiro](${L.foreigners}).`,
      ],
    },
    { type: "h2", id: "checklist", text: "Checklist para levar à reunião" },
    {
      type: "ol",
      items: [
        "Endereços de obras entregues e datas prometidas vs. reais.",
        "Título do terreno em nome do fideicomisso ou da sociedade, com certidão de ônus recente.",
        "Resolução municipal, projetos aprovados e alvará de construção.",
        "Contrato de fideicomisso, nome do fiduciário autorizado pelo BCP e conta de pagamento.",
        "Bancos com os quais o empreendimento opera, por escrito.",
        "Percentual vendido e fonte de financiamento da obra.",
        "Contrato-quadro com multa por atraso, condições de saída e de cessão.",
        "Orçamento total: parcelas mais todos os custos da tabela.",
      ],
    },
    {
      type: "p",
      text: `Se a incorporadora responde a tudo isso sem problema, é bom sinal. Se evita alguma pergunta, também é um sinal. Quer comparar com o que está disponível hoje? [Veja os imóveis](${L.properties}) ou me escreva e revisamos juntos.`,
    },
    { type: "cta" },
  ],
};

export const offPlanArticle: ArticleDefinition = {
  slug: SLUG,
  cover: {
    src: "/blog/comprar-en-pozo-hero.webp",
    og: "/blog/comprar-en-pozo-og.jpg",
    width: 1672,
    height: 941,
    alt: {
      es: "Checklist con lupa y planos junto a la maqueta de un edificio en construcción con una grúa",
      en: "Checklist with a magnifying glass and floor plans next to a scale model of a building under construction with a crane",
      pt: "Checklist com lupa e plantas ao lado da maquete de um prédio em construção com um guindaste",
    },
  },
  published: PUBLISHED,
  updated: UPDATED,
  category: "guides",
  sources: SOURCES,
  content: { es, en, pt },
};
