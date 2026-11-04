import type { SupportedLocale } from "@/lib/i18n";

// Landings por zona (/invertir-en/<slug>). Cada dato lleva su fuente; las
// cifras de precio "desde" se calculan con las propiedades publicadas.

export const ZONE_SLUGS = ["asuncion", "mariano-roque-alonso", "luque"] as const;
export type ZoneSlug = (typeof ZONE_SLUGS)[number];

export type ZoneFact = {
  value: string;
  label: string;
  source: { label: string; url: string };
};

export type ZoneContent = {
  name: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  facts: ZoneFact[];
  profileTitle: string;
  profile: string[];
  watchTitle: string;
  watch: string[];
  whatsappMessage: string;
};

type ZoneDefinition = {
  slug: ZoneSlug;
  // Valores de Property.city que pertenecen a la zona (sin tildes, en minúscula).
  cityAliases: string[];
  content: Record<SupportedLocale, ZoneContent>;
};

const SRC = {
  censoAsu: {
    label: "Última Hora / INE, Censo 2022",
    url: "https://www.ultimahora.com/top-10-de-las-ciudades-mas-pobladas-del-paraguay-segun-el-censo-2022",
  },
  ubicaprop: {
    label: "UbicaProp, avisos de octubre 2026",
    url: "https://ubicaprop.com.py/precio-m2-asuncion-barrios/",
  },
  lanacionAlquileres: {
    label: "La Nación, abril 2026",
    url: "https://www.lanacion.com.py/negocios/2026/04/13/alquileres-en-asuncion-precios-demanda-y-nuevas-reglas-del-mercado-en-barrios-exclusivos/",
  },
  censoMra: {
    label: "INE, Censo 2022 (City Population)",
    url: "https://www.citypopulation.de/en/paraguay/admin/central/1110__mariano_roque_alonso",
  },
  infonegociosMra: {
    label: "InfoNegocios, julio 2025",
    url: "https://infonegocios.com.py/amp/default/iman-de-inversion-mariano-roque-alonso-atrapa-us-1-500-millones-en-proyectos-y-el-40-de-sus-estudiantes-son-brasilenos",
  },
  distritoNorte: {
    label: "InfoNegocios, febrero 2025",
    url: "https://infonegocios.com.py/infomicasa/distrito-norte-un-polo-inmobiliario-en-expansion-que-proyecta-construir-5-000-viviendas-en-mariano-roque-alonso-limpio-y-luque",
  },
  lanacionLuque: {
    label: "La Nación, junio 2026",
    url: "https://www.lanacion.com.py/negocios/2026/06/21/luque-se-erige-como-polo-de-desarrollo-inmobiliario/",
  },
  abcLuque: {
    label: "ABC Color, febrero 2026",
    url: "https://www.abc.com.py/negocios/2026/02/05/el-fenomeno-luque-nuevo-iman-de-la-inversion-inmobiliaria/",
  },
};

const ZONES: ZoneDefinition[] = [
  {
    slug: "asuncion",
    cityAliases: ["asuncion"],
    content: {
      es: {
        name: "Asunción",
        metaTitle: "Invertir en Asunción: precios, alquileres y propiedades",
        metaDescription:
          "Precio por m², alquileres y demanda en Asunción con datos de 2026, para quién conviene y qué mirar antes de comprar un departamento.",
        eyebrow: "Invertir en Asunción",
        title: "Asunción: la zona con más demanda y más liquidez",
        lead: "La capital concentra oficinas, servicios y la mayor demanda de alquiler del país. Es la opción de quien prioriza liquidez y plusvalía, con un ticket de entrada más alto.",
        facts: [
          { value: "462.241", label: "habitantes en la ciudad, la más poblada del país", source: SRC.censoAsu },
          { value: "USD 1.923/m²", label: "precio pedido mediano de departamentos en venta", source: SRC.ubicaprop },
          { value: "USD 6–10/m²", label: "alquiler mensual promedio según Capadei; más en barrios premium", source: SRC.lanacionAlquileres },
        ],
        profileTitle: "Para quién conviene",
        profile: [
          "Quien busca vender sin demora cuando lo necesite: es el mercado con más compradores.",
          "Quien prioriza plusvalía en barrios consolidados como Villa Morra, Las Lomas o Recoleta.",
          "Quien quiere alquilar a profesionales y ejecutivos, el segmento de mayor demanda en monoambientes y 1 dormitorio.",
        ],
        watchTitle: "Qué mirar antes de comprar",
        watch: [
          "Sobreoferta en algunas cuadras: hay edificios nuevos casi idénticos compitiendo por los mismos inquilinos.",
          "Expensas altas en edificios con muchos amenities, que se comen parte de la renta.",
          "El precio por m² varía mucho entre barrios: compará con la mediana de la zona exacta, no de la ciudad.",
        ],
        whatsappMessage: "Hola Julia, quiero invertir en Asunción. ¿Qué opciones tenés?",
      },
      en: {
        name: "Asunción",
        metaTitle: "Investing in Asunción: prices, rents and properties",
        metaDescription:
          "Price per m², rents and demand in Asunción with 2026 data, who it suits and what to check before buying an apartment.",
        eyebrow: "Investing in Asunción",
        title: "Asunción: the area with the most demand and liquidity",
        lead: "The capital concentrates offices, services and the country's highest rental demand. It suits investors who prioritize liquidity and appreciation, with a higher entry ticket.",
        facts: [
          { value: "462,241", label: "residents, the most populated city in the country", source: SRC.censoAsu },
          { value: "USD 1,923/m²", label: "median asking price for apartments for sale", source: SRC.ubicaprop },
          { value: "USD 6–10/m²", label: "average monthly rent according to Capadei; more in premium areas", source: SRC.lanacionAlquileres },
        ],
        profileTitle: "Who it suits",
        profile: [
          "Investors who want to sell quickly when needed: it is the market with the most buyers.",
          "Investors who prioritize appreciation in established neighborhoods such as Villa Morra, Las Lomas or Recoleta.",
          "Investors who want to rent to professionals and executives, the segment with the highest demand for studios and 1-bedroom units.",
        ],
        watchTitle: "What to check before buying",
        watch: [
          "Oversupply on some blocks: nearly identical new buildings compete for the same tenants.",
          "High building fees in buildings with many amenities, which eat into the rent.",
          "Price per m² varies a lot by neighborhood: compare with the median of the exact area, not the city.",
        ],
        whatsappMessage: "Hi Julia, I want to invest in Asunción. What options do you have?",
      },
      pt: {
        name: "Assunção",
        metaTitle: "Investir em Assunção: preços, aluguéis e imóveis",
        metaDescription:
          "Preço por m², aluguéis e demanda em Assunção com dados de 2026, para quem vale a pena e o que olhar antes de comprar um apartamento.",
        eyebrow: "Investir em Assunção",
        title: "Assunção: a região com mais demanda e liquidez",
        lead: "A capital concentra escritórios, serviços e a maior demanda de aluguel do país. É a opção de quem prioriza liquidez e valorização, com um ticket de entrada mais alto.",
        facts: [
          { value: "462.241", label: "habitantes, a cidade mais populosa do país", source: SRC.censoAsu },
          { value: "USD 1.923/m²", label: "preço pedido mediano de apartamentos à venda", source: SRC.ubicaprop },
          { value: "USD 6–10/m²", label: "aluguel mensal médio segundo a Capadei; mais nos bairros premium", source: SRC.lanacionAlquileres },
        ],
        profileTitle: "Para quem vale a pena",
        profile: [
          "Quem quer vender rápido quando precisar: é o mercado com mais compradores.",
          "Quem prioriza valorização em bairros consolidados como Villa Morra, Las Lomas ou Recoleta.",
          "Quem quer alugar para profissionais e executivos, o segmento com maior demanda em studios e 1 quarto.",
        ],
        watchTitle: "O que olhar antes de comprar",
        watch: [
          "Excesso de oferta em algumas quadras: prédios novos quase iguais disputam os mesmos inquilinos.",
          "Condomínio alto em prédios com muitas amenidades, que consome parte do aluguel.",
          "O preço por m² varia muito entre bairros: compare com a mediana da região exata, não da cidade.",
        ],
        whatsappMessage: "Olá Julia, quero investir em Assunção. Que opções você tem?",
      },
    },
  },
  {
    slug: "mariano-roque-alonso",
    cityAliases: ["mariano roque alonso", "mra"],
    content: {
      es: {
        name: "Mariano Roque Alonso",
        metaTitle: "Invertir en Mariano Roque Alonso: renta universitaria",
        metaDescription:
          "Por qué Mariano Roque Alonso atrae inversión: universidades, estudiantes brasileños y Distrito Norte. Datos, riesgos y departamentos para renta.",
        eyebrow: "Invertir en Mariano Roque Alonso",
        title: "Mariano Roque Alonso: renta con estudiantes y un ticket de entrada bajo",
        lead: "Pegada a Asunción por el norte, la ciudad crece alrededor de sus universidades privadas. Es la opción de quien busca renta con un ticket de entrada más bajo que en la capital.",
        facts: [
          { value: "85.133", label: "habitantes, una ciudad 100 % urbana", source: SRC.censoMra },
          { value: "Hasta 40 %", label: "de las matrículas de sus universidades privadas son de estudiantes brasileños", source: SRC.infonegociosMra },
          { value: "USD 1.500 M", label: "de inversión proyectada en Distrito Norte, junto con Limpio y Luque", source: SRC.distritoNorte },
        ],
        profileTitle: "Para quién conviene",
        profile: [
          "Quien quiere renta con un ticket de entrada bajo: monoambientes amoblados pensados para estudiantes y jóvenes profesionales.",
          "Quien prefiere un modelo con administración incluida, como los edificios con gestión tipo hotel.",
          "Quien apuesta al crecimiento del corredor norte, con la triplicación de la ruta que la une con Luque.",
        ],
        watchTitle: "Qué mirar antes de comprar",
        watch: [
          "La demanda depende mucho del calendario universitario: calculá meses vacíos en vacaciones.",
          "En pozo, verificá cuántos edificios entregó el desarrollador y si los entregó a tiempo.",
          "Compará la renta con la de unidades ya terminadas en la misma cuadra, no con la proyección del folleto.",
        ],
        whatsappMessage: "Hola Julia, quiero invertir en Mariano Roque Alonso. ¿Qué opciones tenés?",
      },
      en: {
        name: "Mariano Roque Alonso",
        metaTitle: "Investing in Mariano Roque Alonso: student rentals",
        metaDescription:
          "Why Mariano Roque Alonso attracts investment: universities, Brazilian students and Distrito Norte. Data, risks and apartments for rent.",
        eyebrow: "Investing in Mariano Roque Alonso",
        title: "Mariano Roque Alonso: student rentals and a low entry ticket",
        lead: "Right next to Asunción to the north, the city is growing around its private universities. It suits investors looking for rental income with a lower entry ticket than in the capital.",
        facts: [
          { value: "85,133", label: "residents in a fully urban city", source: SRC.censoMra },
          { value: "Up to 40%", label: "of enrollments at its private universities are Brazilian students", source: SRC.infonegociosMra },
          { value: "USD 1.5 B", label: "of projected investment in Distrito Norte, together with Limpio and Luque", source: SRC.distritoNorte },
        ],
        profileTitle: "Who it suits",
        profile: [
          "Investors who want rental income with a low entry ticket: furnished studios designed for students and young professionals.",
          "Investors who prefer a model with management included, such as buildings with hotel-style operation.",
          "Investors betting on the growth of the northern corridor, with the tripling of the road that connects it with Luque.",
        ],
        watchTitle: "What to check before buying",
        watch: [
          "Demand depends heavily on the academic calendar: account for empty months during breaks.",
          "Off-plan, check how many buildings the developer delivered and whether they delivered on time.",
          "Compare the rent with finished units on the same block, not with the brochure projection.",
        ],
        whatsappMessage: "Hi Julia, I want to invest in Mariano Roque Alonso. What options do you have?",
      },
      pt: {
        name: "Mariano Roque Alonso",
        metaTitle: "Investir em Mariano Roque Alonso: aluguel universitário",
        metaDescription:
          "Por que Mariano Roque Alonso atrai investimento: universidades, estudantes brasileiros e Distrito Norte. Dados, riscos e apartamentos para renda.",
        eyebrow: "Investir em Mariano Roque Alonso",
        title: "Mariano Roque Alonso: renda com estudantes e ticket de entrada baixo",
        lead: "Colada a Assunção pelo norte, a cidade cresce ao redor das suas universidades particulares. É a opção de quem busca renda com um ticket de entrada menor que o da capital.",
        facts: [
          { value: "85.133", label: "habitantes, uma cidade 100% urbana", source: SRC.censoMra },
          { value: "Até 40%", label: "das matrículas das suas universidades particulares são de estudantes brasileiros", source: SRC.infonegociosMra },
          { value: "USD 1,5 bi", label: "de investimento projetado no Distrito Norte, junto com Limpio e Luque", source: SRC.distritoNorte },
        ],
        profileTitle: "Para quem vale a pena",
        profile: [
          "Quem quer renda com ticket de entrada baixo: studios mobiliados pensados para estudantes e jovens profissionais.",
          "Quem prefere um modelo com administração incluída, como os prédios com gestão tipo hotel.",
          "Quem aposta no crescimento do corredor norte, com a triplicação da rodovia que a liga a Luque.",
        ],
        watchTitle: "O que olhar antes de comprar",
        watch: [
          "A demanda depende muito do calendário universitário: conte com meses vazios nas férias.",
          "Na planta, confira quantos prédios a construtora entregou e se entregou no prazo.",
          "Compare o aluguel com o de unidades prontas na mesma quadra, não com a projeção do folheto.",
        ],
        whatsappMessage: "Olá Julia, quero investir em Mariano Roque Alonso. Que opções você tem?",
      },
    },
  },
  {
    slug: "luque",
    cityAliases: ["luque"],
    content: {
      es: {
        name: "Luque",
        metaTitle: "Invertir en Luque: el nuevo polo inmobiliario",
        metaDescription:
          "Por qué Luque atrae inversión: aeropuerto, Conmebol, obras viales y precios más accesibles que Asunción. Datos, riesgos y propiedades.",
        eyebrow: "Invertir en Luque",
        title: "Luque: precios más accesibles y obras que empujan la plusvalía",
        lead: "Sede del aeropuerto internacional y de la Conmebol, Luque se volvió el polo inmobiliario del área metropolitana. Es la opción de quien busca plusvalía con precios más accesibles que en Asunción.",
        facts: [
          { value: "259.705", label: "habitantes, con una edad promedio de 29 años", source: SRC.censoAsu },
          { value: "N.º 1", label: "en solicitudes de vivienda del programa Che Róga Porã", source: SRC.lanacionLuque },
          { value: "USD 450 M", label: "de inversión en el tren de cercanías, una de las obras que mejoran su conexión", source: SRC.lanacionLuque },
        ],
        profileTitle: "Para quién conviene",
        profile: [
          "Quien busca plusvalía: el aeropuerto, la Conmebol y nuevas obras viales empujan la demanda.",
          "Quien quiere alquilar a familias jóvenes y trabajadores del área metropolitana, con precios por debajo de Asunción.",
          "Quien prefiere casas o departamentos en complejos nuevos, con financiación propia de la desarrolladora.",
        ],
        watchTitle: "Qué mirar antes de comprar",
        watch: [
          "La infraestructura todavía va atrás del crecimiento: revisá desagüe, cloacas, agua y transporte de la zona exacta.",
          "Las obras públicas pueden demorarse: no compres contando con una fecha de inauguración.",
          "La plusvalía no es pareja: varía mucho entre barrios y según la cercanía a los accesos principales.",
        ],
        whatsappMessage: "Hola Julia, quiero invertir en Luque. ¿Qué opciones tenés?",
      },
      en: {
        name: "Luque",
        metaTitle: "Investing in Luque: the new real estate hub",
        metaDescription:
          "Why Luque attracts investment: the airport, Conmebol, road works and prices below Asunción. Data, risks and properties.",
        eyebrow: "Investing in Luque",
        title: "Luque: more accessible prices and works that drive appreciation",
        lead: "Home to the international airport and Conmebol, Luque has become the real estate hub of the metropolitan area. It suits investors seeking appreciation at more accessible prices than in Asunción.",
        facts: [
          { value: "259,705", label: "residents, with an average age of 29", source: SRC.censoAsu },
          { value: "No. 1", label: "in housing applications to the Che Róga Porã program", source: SRC.lanacionLuque },
          { value: "USD 450 M", label: "invested in the commuter train, one of the works improving its connections", source: SRC.lanacionLuque },
        ],
        profileTitle: "Who it suits",
        profile: [
          "Investors seeking appreciation: the airport, Conmebol and new road works drive demand.",
          "Investors who want to rent to young families and workers in the metro area, at prices below Asunción.",
          "Investors who prefer houses or apartments in new complexes, with developer financing.",
        ],
        watchTitle: "What to check before buying",
        watch: [
          "Infrastructure still lags behind growth: check drainage, sewage, water and transport in the exact area.",
          "Public works can be delayed: do not buy counting on an opening date.",
          "Appreciation is uneven: it varies a lot by neighborhood and by proximity to the main access roads.",
        ],
        whatsappMessage: "Hi Julia, I want to invest in Luque. What options do you have?",
      },
      pt: {
        name: "Luque",
        metaTitle: "Investir em Luque: o novo polo imobiliário",
        metaDescription:
          "Por que Luque atrai investimento: aeroporto, Conmebol, obras viárias e preços abaixo de Assunção. Dados, riscos e imóveis.",
        eyebrow: "Investir em Luque",
        title: "Luque: preços mais acessíveis e obras que puxam a valorização",
        lead: "Sede do aeroporto internacional e da Conmebol, Luque virou o polo imobiliário da região metropolitana. É a opção de quem busca valorização com preços mais acessíveis que em Assunção.",
        facts: [
          { value: "259.705", label: "habitantes, com idade média de 29 anos", source: SRC.censoAsu },
          { value: "N.º 1", label: "em pedidos de moradia do programa Che Róga Porã", source: SRC.lanacionLuque },
          { value: "USD 450 mi", label: "de investimento no trem metropolitano, uma das obras que melhoram sua conexão", source: SRC.lanacionLuque },
        ],
        profileTitle: "Para quem vale a pena",
        profile: [
          "Quem busca valorização: o aeroporto, a Conmebol e novas obras viárias puxam a demanda.",
          "Quem quer alugar para famílias jovens e trabalhadores da região metropolitana, com preços abaixo de Assunção.",
          "Quem prefere casas ou apartamentos em condomínios novos, com financiamento da construtora.",
        ],
        watchTitle: "O que olhar antes de comprar",
        watch: [
          "A infraestrutura ainda vem atrás do crescimento: confira drenagem, esgoto, água e transporte da região exata.",
          "Obras públicas podem atrasar: não compre contando com uma data de inauguração.",
          "A valorização não é uniforme: varia muito entre bairros e conforme a proximidade dos acessos principais.",
        ],
        whatsappMessage: "Olá Julia, quero investir em Luque. Que opções você tem?",
      },
    },
  },
];

export function isZoneSlug(value: string): value is ZoneSlug {
  return (ZONE_SLUGS as readonly string[]).includes(value);
}

export function getZone(slug: ZoneSlug) {
  const zone = ZONES.find((item) => item.slug === slug);
  if (!zone) throw new Error(`Zona desconocida: ${slug}`);
  return zone;
}

export function normalizeCity(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
}

export function belongsToZone(city: string | null | undefined, slug: ZoneSlug) {
  return getZone(slug).cityAliases.includes(normalizeCity(city));
}

export function listZoneNames(locale: SupportedLocale) {
  return ZONES.map((zone) => ({ slug: zone.slug, name: zone.content[locale].name }));
}
