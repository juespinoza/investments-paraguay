import type { SupportedLocale } from "@/lib/i18n";

// Artículo fijo, traducido a es/en/pt. El texto admite **negrita** y
// [enlaces](https://...). Bloques "cta" muestran el llamado a la acción
// intermedio (guía + llamada).

export type ArticleBlock =
  | { type: "h2"; id: string; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][]; note?: string }
  | { type: "callout"; title: string; text: string }
  | { type: "cta" };

export type ArticleSource = { label: string; url: string };

export type LocalizedArticle = {
  title: string;
  metaTitle: string;
  description: string;
  excerpt: string;
  lead: string;
  readingTime: string;
  updatedLabel: string;
  authorRole: string;
  tocTitle: string;
  sourcesTitle: string;
  disclaimer: string;
  cta: {
    title: string;
    text: string;
    guide: string;
    call: string;
    whatsapp: string;
    whatsappMessage: string;
  };
  blocks: ArticleBlock[];
};

export const ARTICLE_SLUG = "invertir-en-paraguay-siendo-extranjero";
export const ARTICLE_PUBLISHED = "2026-11-04";
export const ARTICLE_UPDATED = "2026-11-04";

const SOURCES: ArticleSource[] = [
  {
    label: "The Rio Times — Buying property in Paraguay as a foreigner (2026)",
    url: "https://www.riotimesonline.com/buying-property-paraguay-foreigners-2026/",
  },
  {
    label: "Ley N° 2532/05 — Zona de seguridad fronteriza (BACN)",
    url: "https://www.bacn.gov.py/leyes-paraguayas/4025/ley-n-2532-establece-la-zona-de-seguridad-fronteriza-de-la-republica-del-paraguay",
  },
  {
    label: "Extranjeros en Paraguay — Comprar una propiedad desde el exterior (2026)",
    url: "https://extranjeros.com.py/comprar-una-propiedad-en-paraguay-desde-el-exterior-en-2026-guia-paso-a-paso-con-respaldo-legal",
  },
  {
    label: "InfoNegocios — Invertir en departamentos en Paraguay",
    url: "https://infonegocios.com.py/infolegal/invertir-en-departamentos-en-paraguay-introduccion-general-para-el-inversionista",
  },
  {
    label: "Última Hora — Paraguay ofrece 5 ventajas impositivas a inversionistas (abril 2026)",
    url: "https://www.ultimahora.com/paraguay-ofrece-5-ventajas-impositivas-a-inversionistas",
  },
  {
    label: "La Nación — Paraguay lanza Investor Pass (abril 2026)",
    url: "https://www.lanacion.com.py/negocios/2026/04/17/paraguay-lanza-investor-pass-para-otorgar-residencia-a-extranjeros-que-inviertan-desde-usd-150000/",
  },
];

export function getArticleSources() {
  return SOURCES;
}

const es: LocalizedArticle = {
  title: "Cómo invertir en Paraguay siendo extranjero: guía práctica 2026",
  metaTitle: "Invertir en Paraguay siendo extranjero: guía 2026",
  description:
    "Qué podés comprar, qué documentos pide el escribano, cuánto cuesta, qué impuestos pagás y si comprar te da residencia. Con números de una compra real.",
  excerpt:
    "Derechos, documentos, costos, impuestos y residencia para comprar un inmueble en Paraguay desde el exterior, con números de una compra real.",
  lead:
    "Un extranjero puede comprar casas y departamentos en Paraguay con los mismos derechos que un paraguayo, sin residencia y sin viajar. Te cuento qué pide el proceso, cuánto cuesta y dónde se equivoca la mayoría.",
  readingTime: "8 min de lectura",
  updatedLabel: "Actualizado: 4 nov 2026",
  authorRole: "Asesora inmobiliaria en SkyOne",
  tocTitle: "En este artículo",
  sourcesTitle: "Fuentes",
  disclaimer:
    "Este artículo es informativo y no reemplaza el asesoramiento de un escribano, abogado o contador. Las normas y montos cambian: verificá cada dato antes de decidir.",
  cta: {
    title: "¿Querés ver opciones concretas?",
    text: "En 20 minutos te muestro 2 o 3 departamentos que hoy pasan mi checklist, con sus números. Sin compromiso.",
    guide: "Descargar la guía gratuita",
    call: "Agendar una llamada",
    whatsapp: "Escribir por WhatsApp",
    whatsappMessage:
      "Hola Julia, leí tu artículo sobre invertir en Paraguay siendo extranjero y quiero hacerte una consulta.",
  },
  blocks: [
    { type: "h2", id: "que-podes-comprar", text: "Qué podés comprar" },
    {
      type: "p",
      text: "Los extranjeros pueden comprar casas, departamentos, locales y la mayoría de los terrenos con **los mismos derechos de propiedad que un ciudadano paraguayo**. No hace falta un permiso especial, una empresa local ni un testaferro, y no hay un límite de propiedades por persona ([The Rio Times](https://www.riotimesonline.com/buying-property-paraguay-foreigners-2026/)).",
    },
    {
      type: "p",
      text: "**Tampoco necesitás residencia para comprar.** La residencia es un trámite aparte que podés iniciar después, si te interesa.",
    },
    {
      type: "callout",
      title: "La única restricción importante",
      text: "La Ley 2532/05 prohíbe que personas nacidas en países limítrofes (Argentina, Brasil y Bolivia) sean dueñas de **inmuebles rurales** dentro de los 50 km de la frontera. No afecta a departamentos ni casas urbanas, como los de Asunción y Gran Asunción ([Ley 2532/05](https://www.bacn.gov.py/leyes-paraguayas/4025/ley-n-2532-establece-la-zona-de-seguridad-fronteriza-de-la-republica-del-paraguay)).",
    },
    { type: "h2", id: "documentos", text: "Qué documentos te van a pedir" },
    {
      type: "ul",
      items: [
        "**Pasaporte vigente.** Es tu documento de identidad para la compra.",
        "**RUC** (número de contribuyente paraguayo). El escribano puede tramitarlo durante la compra, aunque no seas residente.",
        "**Estado civil.** Puede pedirse, porque el régimen de bienes del matrimonio afecta la escritura.",
        "**Origen de los fondos.** El escribano está obligado a documentarlo por las normas contra el lavado de dinero. Tené a mano extractos y el respaldo de dónde sale el dinero.",
      ],
    },
    { type: "h2", id: "proceso", text: "El proceso, paso a paso" },
    {
      type: "ol",
      items: [
        "**Reserva.** Se firma un boleto de reserva y se paga una seña que saca la unidad del mercado. En reventas suele ser del 10 al 20 % del precio; en obras nuevas, de USD 1.000 a 5.000.",
        "**Verificación del inmueble.** Antes de pagar el saldo, un escribano o abogado revisa el dominio, que no haya hipotecas ni embargos, el catastro y que el impuesto inmobiliario esté al día.",
        "**Contrato o escritura.** En pozo se firma un contrato con la entrega inicial, las cuotas y la fecha de entrega. En una unidad terminada se firma directamente la escritura pública ante escribano y se paga el saldo.",
        "**Inscripción.** El escribano inscribe la escritura en la Dirección General de los Registros Públicos. Recién ahí la propiedad es tuya ante la ley.",
      ],
    },
    {
      type: "p",
      text: "Desde que se acepta la oferta hasta que el título queda inscripto, el proceso suele llevar **entre 60 y 120 días** ([The Rio Times](https://www.riotimesonline.com/buying-property-paraguay-foreigners-2026/)).",
    },
    {
      type: "callout",
      title: "Usá tu propio escribano",
      text: "Elegí un escribano que trabaje para vos, no el del vendedor ni el de la desarrolladora. Es quien verifica que el inmueble esté limpio y que tu dinero llegue donde tiene que llegar.",
    },
    { type: "cta" },
    { type: "h2", id: "sin-viajar", text: "Cómo comprar sin viajar" },
    {
      type: "ul",
      items: [
        "**Recorridos por videollamada.** Podés ver la unidad, el edificio y la zona en vivo antes de reservar.",
        "**Firma con poder.** Un apoderado en Paraguay firma por vos. El poder tiene que estar en español o traducido por traductor público, con **Apostilla de La Haya** o legalización consular ([Extranjeros en Paraguay](https://extranjeros.com.py/comprar-una-propiedad-en-paraguay-desde-el-exterior-en-2026-guia-paso-a-paso-con-respaldo-legal)).",
        "**Pago por transferencia internacional.** Se puede pagar directamente desde el exterior. Para usar una cuenta bancaria local necesitás cédula paraguaya, que requiere residencia.",
      ],
    },
    { type: "h2", id: "costos", text: "Cuánto cuesta comprar" },
    {
      type: "p",
      text: "Además del precio, contá con los gastos de escrituración y transferencia, que **en general no superan el 3 % del valor escriturado** y se pagan una sola vez ([InfoNegocios](https://infonegocios.com.py/infolegal/invertir-en-departamentos-en-paraguay-introduccion-general-para-el-inversionista)). Pedile siempre al escribano un presupuesto por escrito antes de reservar.",
    },
    {
      type: "table",
      head: ["Concepto", "Referencia"],
      rows: [
        ["Seña de reserva", "10–20 % en reventas · USD 1.000–5.000 en pozo"],
        ["Escrituración y transferencia", "Hasta ~3 % del valor escriturado"],
        ["Verificación legal del inmueble", "USD 300–600"],
        ["Mi caso: monoambiente de USD 60.000", "Escritura Gs. 7.322.160 (~USD 1.225, cerca del 2 %)"],
      ],
      note: "Montos orientativos según las fuentes citadas. Cada operación se cotiza aparte.",
    },
    { type: "h2", id: "impuestos", text: "Qué impuestos pagás después" },
    {
      type: "ul",
      items: [
        "**Impuesto inmobiliario.** Anual y municipal. Es el único impuesto sobre la propiedad: Paraguay no tiene impuesto al patrimonio.",
        "**IVA del 5 %** sobre el alquiler de vivienda, en lugar del 10 % general.",
        "**Renta del alquiler.** Las personas físicas tributan IRP con tasas de hasta 8 % sobre rentas y ganancias de capital. Para no residentes rige el INR, con una tasa nominal del 15 % y efectiva del 4,5 % o 7,5 % según el caso ([Última Hora](https://www.ultimahora.com/paraguay-ofrece-5-ventajas-impositivas-a-inversionistas)).",
      ],
    },
    {
      type: "p",
      text: "Cómo te toca a vos depende de si sos residente, de si alquilás a largo plazo o por temporada y de los tratados de tu país. Antes de alquilar, hablalo con un contador.",
    },
    { type: "h2", id: "residencia", text: "¿Comprar te da la residencia?" },
    {
      type: "p",
      text: "No automáticamente. Desde abril de 2026 existe el **Investor Pass**, que da residencia permanente directa a quien invierte. Para el sector inmobiliario, el monto mínimo informado es de **USD 200.000** ([La Nación](https://www.lanacion.com.py/negocios/2026/04/17/paraguay-lanza-investor-pass-para-otorgar-residencia-a-extranjeros-que-inviertan-desde-usd-150000/)).",
    },
    {
      type: "p",
      text: "Un departamento de USD 50.000 no alcanza por sí solo, pero podés tramitar la residencia por las vías generales. Los requisitos cambian seguido: consultá con un especialista migratorio antes de decidir por ese motivo.",
    },
    { type: "h2", id: "errores", text: "Los errores que más veo en extranjeros" },
    {
      type: "ol",
      items: [
        "**Firmar con el escribano del vendedor.** Nadie verifica a tu favor.",
        "**Transferir sin el respaldo del origen de los fondos.** La operación se frena en el escribano o en el banco.",
        "**Comprar por el render.** En pozo, el desarrollador importa tanto como el precio: preguntá cuántos edificios entregó y si los entregó a tiempo.",
        "**Mirar el precio y no la renta neta.** Expensas, amueblado, administración y meses vacíos cambian el número final.",
        "**Comprar tierra rural cerca de la frontera** siendo de un país limítrofe, sin revisar la Ley 2532/05.",
      ],
    },
  ],
};

const en: LocalizedArticle = {
  title: "How to invest in Paraguay as a foreigner: a practical 2026 guide",
  metaTitle: "Investing in Paraguay as a foreigner: 2026 guide",
  description:
    "What you can buy, what the notary asks for, what it costs, which taxes apply and whether it gets you residency. With numbers from a real purchase.",
  excerpt:
    "Rights, documents, costs, taxes and residency for buying property in Paraguay from abroad, with numbers from a real purchase.",
  lead:
    "Foreigners can buy houses and apartments in Paraguay with the same rights as Paraguayans, without residency and without traveling. Here is what the process requires, what it costs and where most buyers go wrong.",
  readingTime: "8 min read",
  updatedLabel: "Updated: Nov 4, 2026",
  authorRole: "Real estate advisor at SkyOne",
  tocTitle: "In this article",
  sourcesTitle: "Sources",
  disclaimer:
    "This article is for information only and does not replace advice from a notary, lawyer or accountant. Rules and amounts change: check every figure before deciding.",
  cta: {
    title: "Want to see concrete options?",
    text: "In 20 minutes I will show you 2 or 3 apartments that pass my checklist today, with their numbers. No commitment.",
    guide: "Download the free guide",
    call: "Book a call",
    whatsapp: "Message on WhatsApp",
    whatsappMessage:
      "Hi Julia, I read your article about investing in Paraguay as a foreigner and I have a question.",
  },
  blocks: [
    { type: "h2", id: "que-podes-comprar", text: "What you can buy" },
    {
      type: "p",
      text: "Foreigners can buy houses, apartments, commercial units and most land with **the same ownership rights as a Paraguayan citizen**. You do not need a special permit, a local company or a nominee, and there is no cap on the number of properties ([The Rio Times](https://www.riotimesonline.com/buying-property-paraguay-foreigners-2026/)).",
    },
    {
      type: "p",
      text: "**You do not need residency to buy either.** Residency is a separate process you can start later if you want it.",
    },
    {
      type: "callout",
      title: "The one restriction that matters",
      text: "Law 2532/05 bars people born in neighboring countries (Argentina, Brazil and Bolivia) from owning **rural land** within 50 km of the border. It does not affect urban apartments or houses, such as those in Asunción and Greater Asunción ([Law 2532/05](https://www.bacn.gov.py/leyes-paraguayas/4025/ley-n-2532-establece-la-zona-de-seguridad-fronteriza-de-la-republica-del-paraguay)).",
    },
    { type: "h2", id: "documentos", text: "Documents you will be asked for" },
    {
      type: "ul",
      items: [
        "**A valid passport.** It is your ID for the purchase.",
        "**RUC** (Paraguayan taxpayer number). The notary can arrange it during the purchase, even if you are not a resident.",
        "**Marital status.** It may be requested, because marital property rules affect the deed.",
        "**Source of funds.** The notary must document it under anti-money-laundering rules. Keep bank statements and proof of where the money comes from at hand.",
      ],
    },
    { type: "h2", id: "proceso", text: "The process, step by step" },
    {
      type: "ol",
      items: [
        "**Reservation.** You sign a reservation agreement and pay a deposit that takes the unit off the market. For resales it is usually 10 to 20% of the price; for new builds, USD 1,000 to 5,000.",
        "**Title check.** Before you pay the balance, a notary or lawyer checks ownership, that there are no mortgages or liens, the land registry and that property tax is paid.",
        "**Contract or deed.** For off-plan units you sign a contract with the down payment, installments and delivery date. For a finished unit you sign the public deed before a notary and pay the balance.",
        "**Registration.** The notary registers the deed with the Dirección General de los Registros Públicos. Only then is the property legally yours.",
      ],
    },
    {
      type: "p",
      text: "From accepted offer to registered title, the process usually takes **60 to 120 days** ([The Rio Times](https://www.riotimesonline.com/buying-property-paraguay-foreigners-2026/)).",
    },
    {
      type: "callout",
      title: "Use your own notary",
      text: "Choose a notary who works for you, not the seller's or the developer's. They are the one checking that the property is clean and that your money goes where it should.",
    },
    { type: "cta" },
    { type: "h2", id: "sin-viajar", text: "How to buy without traveling" },
    {
      type: "ul",
      items: [
        "**Video call viewings.** You can see the unit, the building and the area live before you reserve.",
        "**Signing by power of attorney.** A representative in Paraguay signs for you. The power of attorney must be in Spanish or translated by a sworn translator, with a **Hague Apostille** or consular legalization ([Extranjeros en Paraguay](https://extranjeros.com.py/comprar-una-propiedad-en-paraguay-desde-el-exterior-en-2026-guia-paso-a-paso-con-respaldo-legal)).",
        "**International wire transfer.** You can pay directly from abroad. To use a local bank account you need a Paraguayan ID card (cédula), which requires residency.",
      ],
    },
    { type: "h2", id: "costos", text: "What buying costs" },
    {
      type: "p",
      text: "On top of the price, budget for deed and transfer costs, which **usually do not exceed 3% of the deed value** and are paid once ([InfoNegocios](https://infonegocios.com.py/infolegal/invertir-en-departamentos-en-paraguay-introduccion-general-para-el-inversionista)). Always ask the notary for a written quote before you reserve.",
    },
    {
      type: "table",
      head: ["Item", "Reference"],
      rows: [
        ["Reservation deposit", "10–20% on resales · USD 1,000–5,000 off-plan"],
        ["Deed and transfer", "Up to ~3% of the deed value"],
        ["Legal title check", "USD 300–600"],
        ["My case: USD 60,000 studio", "Deed PYG 7,322,160 (~USD 1,225, about 2%)"],
      ],
      note: "Indicative amounts from the sources cited. Every deal is quoted separately.",
    },
    { type: "h2", id: "impuestos", text: "Taxes after you buy" },
    {
      type: "ul",
      items: [
        "**Property tax.** Annual and municipal. It is the only tax on the property: Paraguay has no wealth tax.",
        "**5% VAT** on residential rent, instead of the general 10%.",
        "**Tax on rental income.** Individuals pay IRP at rates of up to 8% on capital income and gains. Non-residents fall under INR, with a 15% nominal rate and an effective rate of 4.5% or 7.5% depending on the case ([Última Hora](https://www.ultimahora.com/paraguay-ofrece-5-ventajas-impositivas-a-inversionistas)).",
      ],
    },
    {
      type: "p",
      text: "How this applies to you depends on whether you are a resident, whether you rent long-term or short-term and on your country's tax treaties. Talk to an accountant before you rent out.",
    },
    { type: "h2", id: "residencia", text: "Does buying get you residency?" },
    {
      type: "p",
      text: "Not automatically. Since April 2026 there is the **Investor Pass**, which grants direct permanent residency to investors. For real estate, the reported minimum is **USD 200,000** ([La Nación](https://www.lanacion.com.py/negocios/2026/04/17/paraguay-lanza-investor-pass-para-otorgar-residencia-a-extranjeros-que-inviertan-desde-usd-150000/)).",
    },
    {
      type: "p",
      text: "A USD 50,000 apartment does not qualify on its own, but you can apply for residency through the general routes. Requirements change often: check with an immigration specialist before you decide for that reason.",
    },
    { type: "h2", id: "errores", text: "The mistakes I see most from foreign buyers" },
    {
      type: "ol",
      items: [
        "**Signing with the seller's notary.** Nobody checks on your behalf.",
        "**Wiring money without proof of where it comes from.** The deal stalls at the notary or the bank.",
        "**Buying the render.** Off-plan, the developer matters as much as the price: ask how many buildings they delivered and whether they delivered on time.",
        "**Looking at the price instead of the net rent.** Building fees, furnishing, management and empty months change the final number.",
        "**Buying rural land near the border** as a citizen of a neighboring country, without checking Law 2532/05.",
      ],
    },
  ],
};

const pt: LocalizedArticle = {
  title: "Como investir no Paraguai sendo estrangeiro: guia prático 2026",
  metaTitle: "Investir no Paraguai sendo estrangeiro: guia 2026",
  description:
    "O que você pode comprar, o que o tabelião pede, quanto custa, quais impostos pagar e se comprar dá residência. Com números de uma compra real.",
  excerpt:
    "Direitos, documentos, custos, impostos e residência para comprar um imóvel no Paraguai a partir do exterior, com números de uma compra real.",
  lead:
    "Um estrangeiro pode comprar casas e apartamentos no Paraguai com os mesmos direitos de um paraguaio, sem residência e sem viajar. Conto o que o processo exige, quanto custa e onde a maioria erra.",
  readingTime: "8 min de leitura",
  updatedLabel: "Atualizado: 4 nov 2026",
  authorRole: "Consultora imobiliária na SkyOne",
  tocTitle: "Neste artigo",
  sourcesTitle: "Fontes",
  disclaimer:
    "Este artigo é informativo e não substitui a orientação de um tabelião, advogado ou contador. Normas e valores mudam: confira cada dado antes de decidir.",
  cta: {
    title: "Quer ver opções concretas?",
    text: "Em 20 minutos te mostro 2 ou 3 apartamentos que hoje passam no meu checklist, com os números. Sem compromisso.",
    guide: "Baixar o guia gratuito",
    call: "Agendar uma ligação",
    whatsapp: "Falar pelo WhatsApp",
    whatsappMessage:
      "Olá Julia, li seu artigo sobre investir no Paraguai sendo estrangeiro e quero tirar uma dúvida.",
  },
  blocks: [
    { type: "h2", id: "que-podes-comprar", text: "O que você pode comprar" },
    {
      type: "p",
      text: "Estrangeiros podem comprar casas, apartamentos, salas comerciais e a maioria dos terrenos com **os mesmos direitos de propriedade de um cidadão paraguaio**. Não é preciso licença especial, empresa local nem laranja, e não há limite de imóveis por pessoa ([The Rio Times](https://www.riotimesonline.com/buying-property-paraguay-foreigners-2026/)).",
    },
    {
      type: "p",
      text: "**Também não é preciso ter residência para comprar.** A residência é um processo à parte, que você pode iniciar depois se quiser.",
    },
    {
      type: "callout",
      title: "A única restrição importante",
      text: "A Lei 2532/05 proíbe que pessoas nascidas em países vizinhos (Argentina, Brasil e Bolívia) sejam donas de **imóveis rurais** a menos de 50 km da fronteira. Não afeta apartamentos nem casas urbanas, como os de Assunção e Grande Assunção ([Lei 2532/05](https://www.bacn.gov.py/leyes-paraguayas/4025/ley-n-2532-establece-la-zona-de-seguridad-fronteriza-de-la-republica-del-paraguay)).",
    },
    { type: "h2", id: "documentos", text: "Quais documentos vão pedir" },
    {
      type: "ul",
      items: [
        "**Passaporte válido.** É seu documento de identidade para a compra.",
        "**RUC** (número de contribuinte paraguaio). O tabelião pode providenciá-lo durante a compra, mesmo que você não seja residente.",
        "**Estado civil.** Pode ser pedido, porque o regime de bens do casamento afeta a escritura.",
        "**Origem dos recursos.** O tabelião é obrigado a documentá-la pelas normas contra lavagem de dinheiro. Tenha extratos e comprovantes de onde vem o dinheiro.",
      ],
    },
    { type: "h2", id: "proceso", text: "O processo, passo a passo" },
    {
      type: "ol",
      items: [
        "**Reserva.** Assina-se um contrato de reserva e paga-se um sinal que tira a unidade do mercado. Em revendas costuma ser de 10 a 20% do preço; em lançamentos, de USD 1.000 a 5.000.",
        "**Verificação do imóvel.** Antes de pagar o saldo, um tabelião ou advogado confere a matrícula, se não há hipotecas nem penhoras, o cadastro e se o imposto imobiliário está em dia.",
        "**Contrato ou escritura.** Na planta, assina-se um contrato com a entrada, as parcelas e a data de entrega. Numa unidade pronta, assina-se a escritura pública diante do tabelião e paga-se o saldo.",
        "**Registro.** O tabelião registra a escritura na Dirección General de los Registros Públicos. Só então o imóvel é seu perante a lei.",
      ],
    },
    {
      type: "p",
      text: "Da oferta aceita até o título registrado, o processo costuma levar **de 60 a 120 dias** ([The Rio Times](https://www.riotimesonline.com/buying-property-paraguay-foreigners-2026/)).",
    },
    {
      type: "callout",
      title: "Use seu próprio tabelião",
      text: "Escolha um tabelião que trabalhe para você, não o do vendedor nem o da construtora. É ele quem confere se o imóvel está limpo e se o seu dinheiro chega aonde deve.",
    },
    { type: "cta" },
    { type: "h2", id: "sin-viajar", text: "Como comprar sem viajar" },
    {
      type: "ul",
      items: [
        "**Visitas por videochamada.** Você vê a unidade, o prédio e o bairro ao vivo antes de reservar.",
        "**Assinatura por procuração.** Um procurador no Paraguai assina por você. A procuração precisa estar em espanhol ou traduzida por tradutor juramentado, com **Apostila de Haia** ou legalização consular ([Extranjeros en Paraguay](https://extranjeros.com.py/comprar-una-propiedad-en-paraguay-desde-el-exterior-en-2026-guia-paso-a-paso-con-respaldo-legal)).",
        "**Pagamento por transferência internacional.** Dá para pagar direto do exterior. Para usar uma conta bancária local é preciso cédula paraguaia, que exige residência.",
      ],
    },
    { type: "h2", id: "costos", text: "Quanto custa comprar" },
    {
      type: "p",
      text: "Além do preço, considere os custos de escritura e transferência, que **em geral não passam de 3% do valor escriturado** e são pagos uma vez ([InfoNegocios](https://infonegocios.com.py/infolegal/invertir-en-departamentos-en-paraguay-introduccion-general-para-el-inversionista)). Peça sempre ao tabelião um orçamento por escrito antes de reservar.",
    },
    {
      type: "table",
      head: ["Item", "Referência"],
      rows: [
        ["Sinal de reserva", "10–20% em revendas · USD 1.000–5.000 na planta"],
        ["Escritura e transferência", "Até ~3% do valor escriturado"],
        ["Verificação jurídica do imóvel", "USD 300–600"],
        ["Meu caso: studio de USD 60.000", "Escritura PYG 7.322.160 (~USD 1.225, cerca de 2%)"],
      ],
      note: "Valores de referência segundo as fontes citadas. Cada operação é orçada à parte.",
    },
    { type: "h2", id: "impuestos", text: "Quais impostos você paga depois" },
    {
      type: "ul",
      items: [
        "**Imposto imobiliário.** Anual e municipal. É o único imposto sobre o imóvel: o Paraguai não tem imposto sobre patrimônio.",
        "**IVA de 5%** sobre o aluguel residencial, em vez dos 10% gerais.",
        "**Imposto sobre o aluguel.** Pessoas físicas pagam IRP com alíquotas de até 8% sobre rendas e ganhos de capital. Para não residentes vale o INR, com alíquota nominal de 15% e efetiva de 4,5% ou 7,5% conforme o caso ([Última Hora](https://www.ultimahora.com/paraguay-ofrece-5-ventajas-impositivas-a-inversionistas)).",
      ],
    },
    {
      type: "p",
      text: "Como isso se aplica a você depende de ser residente ou não, de alugar por longo prazo ou por temporada e dos tratados do seu país. Antes de alugar, fale com um contador.",
    },
    { type: "h2", id: "residencia", text: "Comprar dá residência?" },
    {
      type: "p",
      text: "Não automaticamente. Desde abril de 2026 existe o **Investor Pass**, que concede residência permanente direta a quem investe. Para o setor imobiliário, o valor mínimo informado é de **USD 200.000** ([La Nación](https://www.lanacion.com.py/negocios/2026/04/17/paraguay-lanza-investor-pass-para-otorgar-residencia-a-extranjeros-que-inviertan-desde-usd-150000/)).",
    },
    {
      type: "p",
      text: "Um apartamento de USD 50.000 sozinho não basta, mas você pode pedir residência pelas vias gerais. Os requisitos mudam com frequência: consulte um especialista em imigração antes de decidir por esse motivo.",
    },
    { type: "h2", id: "errores", text: "Os erros que mais vejo em estrangeiros" },
    {
      type: "ol",
      items: [
        "**Assinar com o tabelião do vendedor.** Ninguém confere a seu favor.",
        "**Transferir sem comprovar a origem do dinheiro.** A operação trava no tabelião ou no banco.",
        "**Comprar pelo render.** Na planta, a construtora importa tanto quanto o preço: pergunte quantos prédios ela entregou e se entregou no prazo.",
        "**Olhar o preço e não a renda líquida.** Condomínio, mobília, administração e meses vazios mudam o número final.",
        "**Comprar terra rural perto da fronteira** sendo de um país vizinho, sem checar a Lei 2532/05.",
      ],
    },
  ],
};

const ARTICLES: Record<SupportedLocale, LocalizedArticle> = { es, en, pt };

export function getLocalizedArticle(locale: SupportedLocale) {
  return ARTICLES[locale];
}

export const ARTICLE_LOCALES = Object.keys(ARTICLES) as SupportedLocale[];
