import type { AppLocale } from "@/lib/i18n";

type Section = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type PageContent = {
  eyebrow: string;
  title: string;
  description: string;
  asideTitle?: string;
  asideLines?: string[];
  cards?: Array<{ title: string; description: string }>;
  sections: Section[];
};

type ContactContent = PageContent & {
  channels: Array<{
    label: string;
    value: string;
    href?: string;
    description: string;
  }>;
  formTitle: string;
  formDescription: string;
  formLabels: {
    fullName: string;
    email: string;
    whatsapp: string;
    sending: string;
    send: string;
    receiveGuide: string;
    error: string;
    success: string;
  };
};

export const EFFECTIVE_DATE = "March 12, 2026";

export function resolveLocale(locale: string): AppLocale {
  return locale === "es" || locale === "pt" || locale === "de" ? locale : "en";
}

export const legalPageContent: Record<AppLocale, PageContent> = {
  en: {
    eyebrow: "Legal",
    title: "Legal Notice",
    description:
      "This site provides information about real estate, business opportunities and advisory services related to Paraguay. These terms define the basic conditions for using the public website and its content.",
    asideTitle: "Regulatory basis",
    asideLines: [
      "Prepared in reference to Law 4868/2013 on electronic commerce.",
      "Aligned with consumer information duties under Law 1334/1998.",
      "Data handling reviewed against Paraguayan private and credit-data rules, including Law 6534/2020.",
      "Updated on March 12, 2026.",
    ],
    cards: [
      {
        title: "Informational use",
        description:
          "The website is informational and commercial. It does not replace legal, tax or investment advice tailored to a user.",
      },
      {
        title: "Transparency",
        description:
          "We seek to present opportunities, contact channels and service scope clearly and without misleading claims.",
      },
      {
        title: "Intellectual property",
        description:
          "Texts, design, branding and original materials are protected and may not be reused without authorization.",
      },
      {
        title: "Applicable law",
        description:
          "Any use of the website is interpreted under Paraguayan law, without prejudice to mandatory consumer protections.",
      },
    ],
    sections: [
      {
        title: "Site purpose and scope",
        paragraphs: [
          "Investments Paraguay operates this public website to share information about investment opportunities, real estate listings, advisors, market analysis and contact channels.",
          "Website content is general in nature. Investment, contractual, tax and regulatory decisions should be reviewed with qualified professionals according to the user’s specific situation.",
        ],
      },
      {
        title: "User obligations",
        paragraphs: [
          "Users must access and use the website lawfully, in good faith and without affecting availability, integrity or security.",
          "It is not permitted to copy, automate extraction, alter, redistribute or commercially exploit content from the site without prior authorization.",
        ],
      },
      {
        title: "Accuracy and liability limits",
        paragraphs: [
          "We make reasonable efforts to keep information updated, but listings, availability, prices, legal conditions, profitability estimates and market data may change.",
          "Investments Paraguay does not guarantee that every published item will remain current, error-free or available at all times. Final verification must occur before any transaction or reliance decision.",
        ],
      },
      {
        title: "Third-party services and links",
        paragraphs: [
          "The website may link to third-party services such as WhatsApp, Instagram, Google Maps or other external platforms. Each external service operates under its own policies and terms.",
          "Investments Paraguay is not responsible for the content, availability or data practices of third-party websites that are outside its direct control.",
        ],
      },
      {
        title: "Personal data and privacy",
        paragraphs: [
          "When a user submits contact information, the website processes only the data reasonably necessary to respond, register the lead and continue the requested commercial conversation.",
          "Data handling is performed under Paraguayan privacy and consumer rules, and with international good practices of transparency, proportionality, security and limited purpose.",
        ],
      },
      {
        title: "Contact and legal notices",
        paragraphs: [
          "For legal notices, correction requests or formal communications related to public content, users may use the available contact channels published on the site.",
          "If any clause becomes invalid or unenforceable, the remaining provisions shall continue in effect to the maximum extent permitted by law.",
        ],
      },
    ],
  },
  es: {
    eyebrow: "Legal",
    title: "Aviso legal",
    description:
      "Este sitio informa sobre oportunidades inmobiliarias, ideas de negocio y servicios de asesoría vinculados con Paraguay. Estas condiciones establecen el marco básico de uso del sitio público y de su contenido.",
    asideTitle: "Base regulatoria",
    asideLines: [
      "Redactado con referencia a la Ley 4868/2013 de comercio electrónico.",
      "Alineado con deberes de información al consumidor de la Ley 1334/1998.",
      "Tratamiento de datos revisado a la luz del marco paraguayo sobre datos privados y crediticios, incluida la Ley 6534/2020.",
      "Actualizado el 12 de marzo de 2026.",
    ],
    cards: [
      {
        title: "Uso informativo",
        description:
          "El sitio tiene finalidad informativa y comercial. No reemplaza asesoría legal, tributaria ni de inversión adaptada a un caso particular.",
      },
      {
        title: "Transparencia",
        description:
          "Buscamos presentar oportunidades, canales de contacto y alcance de servicios de forma clara y sin afirmaciones engañosas.",
      },
      {
        title: "Propiedad intelectual",
        description:
          "Los textos, diseño, marca y materiales originales están protegidos y no pueden reutilizarse sin autorización.",
      },
      {
        title: "Ley aplicable",
        description:
          "El uso del sitio se interpreta bajo la legislación paraguaya, sin perjuicio de las protecciones imperativas al consumidor.",
      },
    ],
    sections: [
      {
        title: "Objeto y alcance del sitio",
        paragraphs: [
          "Investments Paraguay opera este sitio público para compartir información sobre oportunidades de inversión, propiedades, asesores, análisis de mercado y canales de contacto.",
          "El contenido del sitio es general. Toda decisión de inversión, contratación, fiscalidad o cumplimiento regulatorio debe revisarse con profesionales idóneos según la situación específica del usuario.",
        ],
      },
      {
        title: "Obligaciones del usuario",
        paragraphs: [
          "El usuario debe acceder y utilizar el sitio de manera lícita, de buena fe y sin afectar su disponibilidad, integridad o seguridad.",
          "No está permitido copiar, automatizar la extracción, alterar, redistribuir ni explotar comercialmente el contenido del sitio sin autorización previa.",
        ],
      },
      {
        title: "Exactitud y limitación de responsabilidad",
        paragraphs: [
          "Se realizan esfuerzos razonables para mantener la información actualizada, pero las propiedades, disponibilidades, precios, condiciones legales, estimaciones de rentabilidad y datos de mercado pueden cambiar.",
          "Investments Paraguay no garantiza que cada elemento publicado permanezca vigente, libre de errores o disponible en todo momento. La validación final debe hacerse antes de cualquier transacción o decisión de confianza.",
        ],
      },
      {
        title: "Enlaces y servicios de terceros",
        paragraphs: [
          "El sitio puede enlazar servicios de terceros como WhatsApp, Instagram, Google Maps u otras plataformas externas. Cada servicio externo se rige por sus propias políticas y condiciones.",
          "Investments Paraguay no es responsable por el contenido, disponibilidad o prácticas de datos de sitios de terceros fuera de su control directo.",
        ],
      },
      {
        title: "Datos personales y privacidad",
        paragraphs: [
          "Cuando un usuario envía información de contacto, el sitio trata únicamente los datos razonablemente necesarios para responder, registrar el lead y continuar la conversación comercial solicitada.",
          "El tratamiento se realiza conforme al marco paraguayo de privacidad y consumo, y con buenas prácticas internacionales de transparencia, proporcionalidad, seguridad y finalidad limitada.",
        ],
      },
      {
        title: "Comunicaciones y notificaciones",
        paragraphs: [
          "Para avisos legales, solicitudes de corrección o comunicaciones formales relacionadas con contenido público, el usuario puede utilizar los canales de contacto publicados en el sitio.",
          "Si alguna cláusula resulta inválida o inaplicable, las demás disposiciones continuarán vigentes en la máxima medida permitida por la ley.",
        ],
      },
    ],
  },
  pt: {
    eyebrow: "Legal",
    title: "Aviso legal",
    description:
      "Este site apresenta informações sobre oportunidades imobiliárias, negócios e serviços de assessoria relacionados ao Paraguai. Estes termos definem as condições básicas de uso do site público e do seu conteúdo.",
    asideTitle: "Base regulatória",
    asideLines: [
      "Redigido com referência à Lei 4868/2013 de comércio eletrônico.",
      "Alinhado aos deveres de informação ao consumidor da Lei 1334/1998.",
      "Tratamento de dados revisado à luz do marco paraguaio sobre dados privados e creditícios, incluindo a Lei 6534/2020.",
      "Atualizado em 12 de março de 2026.",
    ],
    cards: [
      {
        title: "Uso informativo",
        description:
          "O site tem finalidade informativa e comercial. Não substitui assessoria jurídica, tributária ou de investimento sob medida.",
      },
      {
        title: "Transparência",
        description:
          "Buscamos apresentar oportunidades, canais de contato e escopo de serviço com clareza e sem alegações enganosas.",
      },
      {
        title: "Propriedade intelectual",
        description:
          "Textos, design, marca e materiais originais são protegidos e não podem ser reutilizados sem autorização.",
      },
      {
        title: "Lei aplicável",
        description:
          "O uso do site é interpretado sob a legislação paraguaia, sem prejuízo das proteções obrigatórias ao consumidor.",
      },
    ],
    sections: [
      {
        title: "Objeto e alcance do site",
        paragraphs: [
          "A Investments Paraguay opera este site público para compartilhar informações sobre oportunidades de investimento, propriedades, consultores, análises de mercado e canais de contato.",
          "O conteúdo do site é geral. Toda decisão de investimento, contratação, tributação ou conformidade regulatória deve ser revista com profissionais adequados conforme o caso do usuário.",
        ],
      },
      {
        title: "Obrigações do usuário",
        paragraphs: [
          "O usuário deve acessar e utilizar o site de forma lícita, de boa-fé e sem afetar sua disponibilidade, integridade ou segurança.",
          "Não é permitido copiar, automatizar extração, alterar, redistribuir ou explorar comercialmente o conteúdo do site sem autorização prévia.",
        ],
      },
      {
        title: "Exatidão e limitação de responsabilidade",
        paragraphs: [
          "São feitos esforços razoáveis para manter as informações atualizadas, mas propriedades, disponibilidade, preços, condições legais, estimativas de rentabilidade e dados de mercado podem mudar.",
          "A Investments Paraguay não garante que cada item publicado permanecerá atual, livre de erros ou disponível permanentemente. A validação final deve ocorrer antes de qualquer transação ou decisão de confiança.",
        ],
      },
      {
        title: "Links e serviços de terceiros",
        paragraphs: [
          "O site pode encaminhar para serviços de terceiros como WhatsApp, Instagram, Google Maps e outras plataformas externas. Cada serviço externo opera segundo suas próprias políticas e termos.",
          "A Investments Paraguay não é responsável pelo conteúdo, disponibilidade ou práticas de dados de sites de terceiros fora do seu controle direto.",
        ],
      },
      {
        title: "Dados pessoais e privacidade",
        paragraphs: [
          "Quando um usuário envia informações de contato, o site processa apenas os dados razoavelmente necessários para responder, registrar o lead e continuar a conversa comercial solicitada.",
          "Esse tratamento é realizado sob o marco paraguaio de privacidade e consumo, e com boas práticas internacionais de transparência, proporcionalidade, segurança e finalidade limitada.",
        ],
      },
      {
        title: "Comunicações e notificações",
        paragraphs: [
          "Para notificações legais, pedidos de correção ou comunicações formais relacionadas ao conteúdo público, o usuário pode utilizar os canais de contato publicados no site.",
          "Se alguma cláusula for inválida ou inexequível, as demais disposições continuarão em vigor na máxima extensão permitida por lei.",
        ],
      },
    ],
  },
  de: {
    eyebrow: "Rechtliches",
    title: "Rechtlicher Hinweis",
    description:
      "Diese Website informiert über Immobilienchancen, Geschäftsmöglichkeiten und Beratungsleistungen mit Bezug zu Paraguay. Diese Bedingungen legen den grundlegenden Rahmen für die Nutzung der öffentlichen Website und ihrer Inhalte fest.",
    asideTitle: "Rechtsgrundlage",
    asideLines: [
      "Erstellt unter Bezug auf Gesetz 4868/2013 zum elektronischen Geschäftsverkehr.",
      "Ausgerichtet an Informationspflichten nach Gesetz 1334/1998 zum Verbraucherschutz.",
      "Datenverarbeitung geprüft im paraguayischen Rahmen zu privaten und kreditbezogenen Daten, einschließlich Gesetz 6534/2020.",
      "Aktualisiert am 12. März 2026.",
    ],
    cards: [
      {
        title: "Informationszweck",
        description:
          "Die Website dient Informations- und Geschäftszwecken. Sie ersetzt keine individuelle Rechts-, Steuer- oder Anlageberatung.",
      },
      {
        title: "Transparenz",
        description:
          "Wir bemühen uns, Chancen, Kontaktwege und Leistungsumfang klar und ohne irreführende Angaben darzustellen.",
      },
      {
        title: "Geistiges Eigentum",
        description:
          "Texte, Design, Marke und Originalmaterialien sind geschützt und dürfen nicht ohne Genehmigung weiterverwendet werden.",
      },
      {
        title: "Anwendbares Recht",
        description:
          "Die Nutzung der Website wird nach paraguayischem Recht ausgelegt, unbeschadet zwingender Verbraucherschutzrechte.",
      },
    ],
    sections: [
      {
        title: "Zweck und Umfang der Website",
        paragraphs: [
          "Investments Paraguay betreibt diese öffentliche Website, um Informationen über Investitionsmöglichkeiten, Immobilien, Berater, Marktanalysen und Kontaktwege bereitzustellen.",
          "Die Inhalte sind allgemeiner Natur. Investitions-, Vertrags-, Steuer- und Compliance-Entscheidungen sollten anhand des konkreten Falls mit geeigneten Fachleuten geprüft werden.",
        ],
      },
      {
        title: "Pflichten der Nutzer",
        paragraphs: [
          "Nutzer müssen die Website rechtmäßig, nach Treu und Glauben sowie ohne Beeinträchtigung von Verfügbarkeit, Integrität oder Sicherheit verwenden.",
          "Ohne vorherige Genehmigung ist es nicht erlaubt, Inhalte der Website zu kopieren, automatisiert auszulesen, zu verändern, weiterzuverbreiten oder kommerziell zu verwerten.",
        ],
      },
      {
        title: "Genauigkeit und Haftungsbegrenzung",
        paragraphs: [
          "Es werden angemessene Anstrengungen unternommen, um Informationen aktuell zu halten, jedoch können Immobilien, Verfügbarkeiten, Preise, rechtliche Bedingungen, Renditeannahmen und Marktdaten Änderungen unterliegen.",
          "Investments Paraguay garantiert nicht, dass jeder veröffentlichte Inhalt jederzeit aktuell, fehlerfrei oder verfügbar bleibt. Eine abschließende Prüfung muss vor jeder Transaktion oder Vertrauensentscheidung erfolgen.",
        ],
      },
      {
        title: "Drittanbieter und externe Links",
        paragraphs: [
          "Die Website kann auf Dienste Dritter wie WhatsApp, Instagram, Google Maps oder andere externe Plattformen verweisen. Jeder externe Dienst unterliegt seinen eigenen Richtlinien und Bedingungen.",
          "Investments Paraguay ist nicht verantwortlich für Inhalte, Verfügbarkeit oder Datenpraktiken von Websites Dritter außerhalb seiner unmittelbaren Kontrolle.",
        ],
      },
      {
        title: "Personenbezogene Daten und Privatsphäre",
        paragraphs: [
          "Wenn ein Nutzer Kontaktdaten übermittelt, verarbeitet die Website nur die Daten, die vernünftigerweise erforderlich sind, um zu antworten, den Lead zu registrieren und das gewünschte Geschäftsgespräch fortzuführen.",
          "Die Verarbeitung erfolgt nach paraguayischem Datenschutz- und Verbraucherschutzrahmen sowie nach internationalen Grundsätzen von Transparenz, Verhältnismäßigkeit, Sicherheit und Zweckbindung.",
        ],
      },
      {
        title: "Mitteilungen und Hinweise",
        paragraphs: [
          "Für rechtliche Mitteilungen, Korrekturanfragen oder formelle Kommunikation zu öffentlichen Inhalten können die auf der Website veröffentlichten Kontaktkanäle genutzt werden.",
          "Sollte eine Bestimmung unwirksam oder nicht durchsetzbar sein, bleiben die übrigen Regelungen im größtmöglichen gesetzlich zulässigen Umfang wirksam.",
        ],
      },
    ],
  },
};

export const cookiesPageContent: Record<AppLocale, PageContent> = {
  en: {
    eyebrow: "Cookies",
    title: "Cookie Policy",
    description:
      "This policy explains what technical cookies may be used on the public website, why they are used, and how users can manage them in a transparent way.",
    asideTitle: "Current approach",
    asideLines: [
      "The public site primarily relies on technical and preference cookies.",
      "A locale cookie is used to remember the selected language.",
      "If analytics or advertising cookies are added in the future, this notice should be updated.",
      "Updated on March 12, 2026.",
    ],
    cards: [
      {
        title: "Essential cookies",
        description:
          "Needed for basic functionality, security and continuity of the browsing session when applicable.",
      },
      {
        title: "Preference cookies",
        description:
          "Used to remember the language selected by the user and improve consistency across visits.",
      },
      {
        title: "Control",
        description:
          "Users can manage or delete cookies directly from their browser settings.",
      },
      {
        title: "Transparency",
        description:
          "Non-essential categories should not be activated silently. Any relevant change must be reflected in this policy.",
      },
    ],
    sections: [
      {
        title: "What cookies are",
        paragraphs: [
          "Cookies are small text files stored in the browser that help a website remember information related to a visit, a preference or a technical session.",
          "On this site, cookies are understood as a technical support tool and not as a hidden profiling mechanism.",
        ],
      },
      {
        title: "Cookies used on this website",
        paragraphs: [
          "At the time of this notice, the public website uses mainly technical and preference cookies that support navigation, language selection and essential platform behavior.",
          "When the virtual office or authenticated areas are involved, additional technical session cookies may be required for secure access control.",
        ],
        bullets: [
          "Language preference cookies, such as the locale selection.",
          "Technical session or security cookies when access-restricted areas are used.",
          "Operational cookies strictly necessary for rendering and server responses.",
        ],
      },
      {
        title: "Cookies not deployed by default",
        paragraphs: [
          "This policy does not assume the permanent use of advertising, behavioral profiling or advanced analytics cookies unless they are expressly implemented and disclosed.",
          "If new categories are incorporated, the website should present the corresponding notice, update this policy and distinguish between essential and optional processing.",
        ],
      },
      {
        title: "How users can manage cookies",
        paragraphs: [
          "Users can block, delete or limit cookies from their browser configuration. Doing so may affect some display, preference or session features.",
          "If a browser rejects all cookies, certain language, security or continuity functions may not behave as expected.",
        ],
      },
      {
        title: "Principles applied to cookies",
        paragraphs: [
          "Cookie use should remain proportionate, limited to a clear purpose and transparent to the user.",
          "This policy is drafted with reference to Paraguayan digital and consumer rules, and informed by international good practices of notice, user control, minimization and security.",
        ],
      },
    ],
  },
  es: {
    eyebrow: "Cookies",
    title: "Política de cookies",
    description:
      "Esta política explica qué cookies técnicas puede utilizar el sitio público, con qué finalidad se usan y cómo el usuario puede gestionarlas de forma transparente.",
    asideTitle: "Enfoque actual",
    asideLines: [
      "El sitio público depende principalmente de cookies técnicas y de preferencia.",
      "Se utiliza una cookie de idioma para recordar la selección del usuario.",
      "Si en el futuro se incorporan cookies analíticas o publicitarias, este aviso debe actualizarse.",
      "Actualizado el 12 de marzo de 2026.",
    ],
    cards: [
      {
        title: "Cookies esenciales",
        description:
          "Necesarias para el funcionamiento básico, la seguridad y la continuidad de la sesión cuando corresponda.",
      },
      {
        title: "Cookies de preferencia",
        description:
          "Permiten recordar el idioma seleccionado por el usuario y mejorar la consistencia entre visitas.",
      },
      {
        title: "Control",
        description:
          "El usuario puede gestionar o eliminar cookies directamente desde la configuración de su navegador.",
      },
      {
        title: "Transparencia",
        description:
          "Las categorías no esenciales no deben activarse silenciosamente. Todo cambio relevante debe reflejarse en esta política.",
      },
    ],
    sections: [
      {
        title: "Qué son las cookies",
        paragraphs: [
          "Las cookies son pequeños archivos de texto almacenados en el navegador que ayudan a un sitio web a recordar información vinculada a una visita, una preferencia o una sesión técnica.",
          "En este sitio, las cookies se entienden como una herramienta de soporte técnico y no como un mecanismo oculto de perfilamiento.",
        ],
      },
      {
        title: "Cookies utilizadas en este sitio",
        paragraphs: [
          "A la fecha de este aviso, el sitio público utiliza principalmente cookies técnicas y de preferencia que respaldan la navegación, la selección de idioma y el comportamiento esencial de la plataforma.",
          "Cuando intervienen la oficina virtual o áreas autenticadas, pueden requerirse cookies técnicas adicionales de sesión para gestionar el acceso de forma segura.",
        ],
        bullets: [
          "Cookies de preferencia de idioma, como la selección de locale.",
          "Cookies técnicas de sesión o seguridad cuando se usan áreas con acceso restringido.",
          "Cookies operativas estrictamente necesarias para renderizado y respuesta del servidor.",
        ],
      },
      {
        title: "Cookies no desplegadas por defecto",
        paragraphs: [
          "Esta política no presume el uso permanente de cookies publicitarias, de perfilado conductual o de analítica avanzada, salvo que sean implementadas y comunicadas expresamente.",
          "Si se incorporan nuevas categorías, el sitio deberá presentar el aviso correspondiente, actualizar esta política y distinguir entre tratamientos esenciales y opcionales.",
        ],
      },
      {
        title: "Cómo puede gestionarlas el usuario",
        paragraphs: [
          "El usuario puede bloquear, eliminar o limitar cookies desde la configuración de su navegador. Ello puede afectar algunas funciones de visualización, preferencias o continuidad de sesión.",
          "Si el navegador rechaza todas las cookies, ciertas funciones de idioma, seguridad o continuidad pueden no comportarse como se espera.",
        ],
      },
      {
        title: "Principios aplicados",
        paragraphs: [
          "El uso de cookies debe mantenerse proporcionado, limitado a una finalidad clara y comunicado con transparencia al usuario.",
          "Esta política se redacta con referencia a reglas paraguayas sobre entorno digital y consumo, e informada por buenas prácticas internacionales de aviso, control por el usuario, minimización y seguridad.",
        ],
      },
    ],
  },
  pt: {
    eyebrow: "Cookies",
    title: "Política de cookies",
    description:
      "Esta política explica quais cookies técnicas podem ser utilizadas no site público, por que são usadas e como o usuário pode gerenciá-las com transparência.",
    asideTitle: "Abordagem atual",
    asideLines: [
      "O site público depende principalmente de cookies técnicas e de preferência.",
      "Uma cookie de idioma é usada para lembrar a escolha do usuário.",
      "Se no futuro forem adicionadas cookies analíticas ou publicitárias, este aviso deverá ser atualizado.",
      "Atualizado em 12 de março de 2026.",
    ],
    cards: [
      {
        title: "Cookies essenciais",
        description:
          "Necessárias para funcionamento básico, segurança e continuidade de sessão quando aplicável.",
      },
      {
        title: "Cookies de preferência",
        description:
          "Permitem lembrar o idioma escolhido e melhorar a consistência entre visitas.",
      },
      {
        title: "Controle",
        description:
          "O usuário pode gerenciar ou remover cookies diretamente nas configurações do navegador.",
      },
      {
        title: "Transparência",
        description:
          "Categorias não essenciais não devem ser ativadas sem aviso. Toda mudança relevante deve aparecer nesta política.",
      },
    ],
    sections: [
      {
        title: "O que são cookies",
        paragraphs: [
          "Cookies são pequenos arquivos de texto armazenados no navegador que ajudam o site a lembrar informações ligadas a uma visita, preferência ou sessão técnica.",
          "Neste site, as cookies são tratadas como ferramenta de suporte técnico, e não como mecanismo oculto de perfilamento.",
        ],
      },
      {
        title: "Cookies usadas neste site",
        paragraphs: [
          "Na data deste aviso, o site público utiliza principalmente cookies técnicas e de preferência que suportam navegação, escolha de idioma e comportamento essencial da plataforma.",
          "Quando a área autenticada ou o escritório virtual entram em uso, cookies técnicas adicionais de sessão podem ser necessárias para acesso seguro.",
        ],
        bullets: [
          "Cookies de preferência de idioma, como a seleção de locale.",
          "Cookies técnicas de sessão ou segurança em áreas restritas.",
          "Cookies operacionais estritamente necessárias para renderização e resposta do servidor.",
        ],
      },
      {
        title: "Cookies não implantadas por padrão",
        paragraphs: [
          "Esta política não presume uso permanente de cookies publicitárias, de perfil comportamental ou de analítica avançada, salvo se forem implementadas e divulgadas expressamente.",
          "Se novas categorias forem incorporadas, o site deverá apresentar o aviso correspondente, atualizar esta política e distinguir entre tratamentos essenciais e opcionais.",
        ],
      },
      {
        title: "Como o usuário pode gerenciá-las",
        paragraphs: [
          "O usuário pode bloquear, excluir ou limitar cookies nas configurações do navegador. Isso pode afetar certas funções de exibição, preferência ou continuidade de sessão.",
          "Se o navegador rejeitar todas as cookies, algumas funções de idioma, segurança ou continuidade podem não funcionar como esperado.",
        ],
      },
      {
        title: "Princípios aplicados",
        paragraphs: [
          "O uso de cookies deve ser proporcional, limitado a finalidade clara e comunicado com transparência ao usuário.",
          "Esta política é redigida com referência às regras paraguaias sobre ambiente digital e consumo, e informada por boas práticas internacionais de aviso, controle pelo usuário, minimização e segurança.",
        ],
      },
    ],
  },
  de: {
    eyebrow: "Cookies",
    title: "Cookie-Richtlinie",
    description:
      "Diese Richtlinie erklärt, welche technischen Cookies auf der öffentlichen Website verwendet werden können, zu welchem Zweck sie dienen und wie Nutzer sie transparent verwalten können.",
    asideTitle: "Aktueller Ansatz",
    asideLines: [
      "Die öffentliche Website nutzt vor allem technische und Präferenz-Cookies.",
      "Ein Sprach-Cookie merkt sich die Auswahl des Nutzers.",
      "Falls künftig Analyse- oder Werbe-Cookies eingebunden werden, muss dieser Hinweis aktualisiert werden.",
      "Aktualisiert am 12. März 2026.",
    ],
    cards: [
      {
        title: "Erforderliche Cookies",
        description:
          "Notwendig für Grundfunktion, Sicherheit und Sitzungsfortsetzung, sofern anwendbar.",
      },
      {
        title: "Präferenz-Cookies",
        description:
          "Sie speichern die gewählte Sprache und verbessern die Konsistenz bei späteren Besuchen.",
      },
      {
        title: "Kontrolle",
        description:
          "Nutzer können Cookies direkt in den Einstellungen ihres Browsers verwalten oder löschen.",
      },
      {
        title: "Transparenz",
        description:
          "Nicht notwendige Kategorien dürfen nicht stillschweigend aktiviert werden. Jede relevante Änderung muss in dieser Richtlinie erscheinen.",
      },
    ],
    sections: [
      {
        title: "Was Cookies sind",
        paragraphs: [
          "Cookies sind kleine Textdateien, die im Browser gespeichert werden und einer Website helfen, Informationen zu einem Besuch, einer Präferenz oder einer technischen Sitzung zu merken.",
          "Auf dieser Website werden Cookies als technisches Hilfsmittel verstanden und nicht als verborgenes Profiling-Instrument.",
        ],
      },
      {
        title: "Auf dieser Website verwendete Cookies",
        paragraphs: [
          "Zum Zeitpunkt dieses Hinweises verwendet die öffentliche Website hauptsächlich technische und Präferenz-Cookies, die Navigation, Sprachauswahl und essentielles Plattformverhalten unterstützen.",
          "Wenn virtuelle Bürobereiche oder authentifizierte Zonen genutzt werden, können zusätzliche technische Sitzungs-Cookies für den sicheren Zugriff erforderlich sein.",
        ],
        bullets: [
          "Sprachpräferenz-Cookies, etwa für die Auswahl der Locale.",
          "Technische Sitzungs- oder Sicherheits-Cookies bei geschützten Bereichen.",
          "Betriebsnotwendige Cookies für Rendering und Serverantworten.",
        ],
      },
      {
        title: "Nicht standardmäßig eingesetzte Cookies",
        paragraphs: [
          "Diese Richtlinie geht nicht von einer dauerhaften Nutzung von Werbe-, Verhaltensprofil- oder erweiterten Analyse-Cookies aus, sofern diese nicht ausdrücklich implementiert und offengelegt werden.",
          "Werden neue Kategorien eingeführt, muss die Website den entsprechenden Hinweis anzeigen, diese Richtlinie aktualisieren und zwischen erforderlichen und optionalen Verarbeitungen unterscheiden.",
        ],
      },
      {
        title: "Wie Nutzer Cookies verwalten können",
        paragraphs: [
          "Nutzer können Cookies in ihren Browsereinstellungen blockieren, löschen oder einschränken. Dies kann bestimmte Anzeige-, Präferenz- oder Sitzungsfunktionen beeinträchtigen.",
          "Wenn ein Browser sämtliche Cookies ablehnt, funktionieren einzelne Sprach-, Sicherheits- oder Kontinuitätsfunktionen möglicherweise nicht wie erwartet.",
        ],
      },
      {
        title: "Angewandte Grundsätze",
        paragraphs: [
          "Der Einsatz von Cookies sollte verhältnismäßig bleiben, einem klaren Zweck dienen und dem Nutzer transparent mitgeteilt werden.",
          "Diese Richtlinie orientiert sich an paraguayischen Regeln für digitale Umgebungen und Verbraucherschutz sowie an internationalen Grundsätzen zu Hinweis, Nutzerkontrolle, Datenminimierung und Sicherheit.",
        ],
      },
    ],
  },
};

export const aboutPageContent: Record<AppLocale, PageContent> = {
  en: {
    eyebrow: "About",
    title: "A clearer way to evaluate Paraguay",
    description:
      "Investments Paraguay is a public-facing platform focused on presenting real estate opportunities, market context and direct contact channels for investors interested in Paraguay.",
    asideTitle: "How we work",
    asideLines: [
      "We prioritize clarity over volume.",
      "We favor local context over generic sales language.",
      "We connect users with advisors and concrete opportunities.",
    ],
    cards: [
      {
        title: "Curated opportunities",
        description:
          "We aim to present listings and opportunities with enough context to start a serious conversation.",
      },
      {
        title: "Local view",
        description:
          "The site is designed around Paraguayan market reality, not imported assumptions from other regions.",
      },
      {
        title: "Direct access",
        description:
          "The objective is to shorten the path between discovery, contact and qualified guidance.",
      },
      {
        title: "Practical content",
        description:
          "We combine editorial analysis, advisor pages and property detail to support better first decisions.",
      },
    ],
    sections: [
      {
        title: "What Investments Paraguay is",
        paragraphs: [
          "The site works as a commercial and editorial front focused on investment opportunities linked to Paraguay, especially in real estate and business discovery.",
          "Its role is to organize information, help users understand the landscape and facilitate contact with the right advisor or opportunity.",
        ],
      },
      {
        title: "Who the site is for",
        paragraphs: [
          "It is built for local and foreign investors, families evaluating relocation or acquisition, and users who need a more structured first look at Paraguay’s opportunity set.",
          "The public site is not limited to listings. It also seeks to explain market logic, process considerations and practical decision factors.",
        ],
      },
      {
        title: "How we approach trust",
        paragraphs: [
          "Trust is built through clarity, not excess claims. For that reason, the site aims to communicate scope, limits, contact paths and expected next steps in a straightforward way.",
          "Whenever possible, pages prioritize actionable information, direct contact and transparent framing over ornamental marketing language.",
        ],
      },
    ],
  },
  es: {
    eyebrow: "Nosotros",
    title: "Una forma más clara de evaluar Paraguay",
    description:
      "Investments Paraguay es una plataforma pública orientada a presentar oportunidades inmobiliarias, contexto de mercado y canales de contacto directo para inversores interesados en Paraguay.",
    asideTitle: "Cómo trabajamos",
    asideLines: [
      "Priorizamos claridad antes que volumen.",
      "Preferimos contexto local antes que discurso genérico.",
      "Conectamos usuarios con asesores y oportunidades concretas.",
    ],
    cards: [
      {
        title: "Oportunidades curadas",
        description:
          "Buscamos mostrar propiedades y oportunidades con el contexto suficiente para iniciar una conversación seria.",
      },
      {
        title: "Lectura local",
        description:
          "El sitio está pensado desde la realidad del mercado paraguayo, no desde supuestos importados.",
      },
      {
        title: "Acceso directo",
        description:
          "El objetivo es acortar la distancia entre descubrimiento, contacto y orientación calificada.",
      },
      {
        title: "Contenido práctico",
        description:
          "Combinamos análisis editorial, perfiles de asesores y detalle de propiedades para apoyar mejores primeras decisiones.",
      },
    ],
    sections: [
      {
        title: "Qué es Investments Paraguay",
        paragraphs: [
          "El sitio funciona como una vitrina comercial y editorial enfocada en oportunidades de inversión vinculadas con Paraguay, especialmente en bienes raíces y exploración de negocios.",
          "Su función es ordenar información, ayudar a entender el contexto y facilitar contacto con el asesor o la oportunidad correcta.",
        ],
      },
      {
        title: "Para quién está pensado",
        paragraphs: [
          "Está diseñado para inversores locales y extranjeros, familias que evalúan relocalización o compra, y usuarios que necesitan una primera lectura más estructurada del país y sus oportunidades.",
          "El sitio público no se limita a publicar propiedades. También busca explicar lógica de mercado, consideraciones de proceso y factores prácticos para decidir mejor.",
        ],
      },
      {
        title: "Cómo entendemos la confianza",
        paragraphs: [
          "La confianza se construye con claridad, no con exceso de promesas. Por eso el sitio intenta comunicar alcance, límites, canales de contacto y próximos pasos esperables de manera directa.",
          "Siempre que es posible, las páginas priorizan información accionable, contacto directo y contexto transparente antes que lenguaje ornamental.",
        ],
      },
    ],
  },
  pt: {
    eyebrow: "Sobre nós",
    title: "Uma forma mais clara de avaliar o Paraguai",
    description:
      "Investments Paraguay é uma plataforma pública voltada a apresentar oportunidades imobiliárias, contexto de mercado e canais de contato direto para investidores interessados no Paraguai.",
    asideTitle: "Como trabalhamos",
    asideLines: [
      "Priorizamos clareza antes de volume.",
      "Preferimos contexto local a discurso genérico.",
      "Conectamos usuários com consultores e oportunidades concretas.",
    ],
    cards: [
      {
        title: "Oportunidades curadas",
        description:
          "Buscamos mostrar propriedades e oportunidades com contexto suficiente para iniciar uma conversa séria.",
      },
      {
        title: "Leitura local",
        description:
          "O site é pensado a partir da realidade do mercado paraguaio, não de suposições importadas.",
      },
      {
        title: "Acesso direto",
        description:
          "O objetivo é encurtar a distância entre descoberta, contato e orientação qualificada.",
      },
      {
        title: "Conteúdo prático",
        description:
          "Combinamos análise editorial, perfis de consultores e detalhes de imóveis para apoiar melhores primeiras decisões.",
      },
    ],
    sections: [
      {
        title: "O que é Investments Paraguay",
        paragraphs: [
          "O site funciona como uma vitrine comercial e editorial focada em oportunidades de investimento ligadas ao Paraguai, especialmente em imóveis e exploração de negócios.",
          "Seu papel é organizar informações, ajudar o usuário a entender o contexto e facilitar contato com o consultor ou a oportunidade correta.",
        ],
      },
      {
        title: "Para quem foi pensado",
        paragraphs: [
          "Foi desenhado para investidores locais e estrangeiros, famílias avaliando mudança ou compra, e usuários que precisam de uma primeira leitura mais estruturada do país e das oportunidades.",
          "O site público não se limita a listar propriedades. Ele também busca explicar lógica de mercado, considerações de processo e fatores práticos de decisão.",
        ],
      },
      {
        title: "Como entendemos confiança",
        paragraphs: [
          "Confiança se constrói com clareza, e não com excesso de promessas. Por isso o site procura comunicar alcance, limites, canais de contato e próximos passos de forma direta.",
          "Sempre que possível, as páginas priorizam informação acionável, contato direto e contexto transparente antes de linguagem ornamental.",
        ],
      },
    ],
  },
  de: {
    eyebrow: "Über uns",
    title: "Ein klarerer Weg, Paraguay zu bewerten",
    description:
      "Investments Paraguay ist eine öffentliche Plattform, die Immobilienchancen, Marktüberblick und direkte Kontaktwege für Investoren mit Interesse an Paraguay präsentiert.",
    asideTitle: "So arbeiten wir",
    asideLines: [
      "Wir priorisieren Klarheit vor Masse.",
      "Wir bevorzugen lokalen Kontext statt generischer Verkaufssprache.",
      "Wir verbinden Nutzer mit Beratern und konkreten Chancen.",
    ],
    cards: [
      {
        title: "Kuratiertes Angebot",
        description:
          "Wir möchten Immobilien und Chancen mit ausreichend Kontext zeigen, um ein ernsthaftes Gespräch zu ermöglichen.",
      },
      {
        title: "Lokaler Blick",
        description:
          "Die Website ist aus der paraguayischen Marktrealität heraus konzipiert, nicht aus importierten Annahmen.",
      },
      {
        title: "Direkter Zugang",
        description:
          "Das Ziel ist, den Weg zwischen Entdeckung, Kontakt und qualifizierter Orientierung zu verkürzen.",
      },
      {
        title: "Praktische Inhalte",
        description:
          "Wir kombinieren redaktionelle Analysen, Beraterprofile und Immobiliendetails, um bessere erste Entscheidungen zu unterstützen.",
      },
    ],
    sections: [
      {
        title: "Was Investments Paraguay ist",
        paragraphs: [
          "Die Website dient als kommerzielle und redaktionelle Oberfläche für Investitionsmöglichkeiten mit Bezug zu Paraguay, insbesondere in Immobilien und Geschäftserkundung.",
          "Ihre Aufgabe ist es, Informationen zu ordnen, den Kontext verständlicher zu machen und den Kontakt mit dem richtigen Berater oder Angebot zu erleichtern.",
        ],
      },
      {
        title: "Für wen die Website gedacht ist",
        paragraphs: [
          "Sie richtet sich an lokale und ausländische Investoren, Familien mit Umzugs- oder Kaufabsicht sowie Nutzer, die einen strukturierteren ersten Blick auf Paraguay und seine Chancen benötigen.",
          "Die öffentliche Website beschränkt sich nicht auf Inserate. Sie soll auch Marktlogik, Prozessfragen und praktische Entscheidungsfaktoren verständlich machen.",
        ],
      },
      {
        title: "Wie wir Vertrauen verstehen",
        paragraphs: [
          "Vertrauen entsteht durch Klarheit, nicht durch übertriebene Versprechen. Deshalb versucht die Website, Umfang, Grenzen, Kontaktwege und nächste Schritte direkt zu kommunizieren.",
          "Wo immer möglich, priorisieren die Seiten umsetzbare Informationen, direkten Kontakt und transparenten Kontext statt dekorativer Sprache.",
        ],
      },
    ],
  },
};

export const contactPageContent: Record<AppLocale, ContactContent> = {
  en: {
    eyebrow: "Contact",
    title: "Start the conversation with real context",
    description:
      "If you are evaluating Paraguay for real estate, relocation or an investment conversation, the fastest path is direct contact with enough context from the start.",
    asideTitle: "Response scope",
    asideLines: [
      "Real estate opportunities and first filtering.",
      "Advisor matching according to profile or interest.",
      "General guidance on next steps before a deeper conversation.",
    ],
    channels: [
      {
        label: "WhatsApp",
        value: "+595 985 444 801",
        href: "https://wa.me/595985444801",
        description: "Primary direct channel for commercial follow-up.",
      },
      {
        label: "Instagram",
        value: "@investmentsparaguay",
        href: "https://www.instagram.com/investmentsparaguay",
        description: "Public channel for updates, contact and brand visibility.",
      },
      {
        label: "Website",
        value: "www.investmentsparaguay.com",
        description: "Public landing, listings and market content.",
      },
    ],
    cards: [
      {
        title: "Direct response",
        description:
          "Share the type of opportunity or property you are evaluating to make the first reply more useful.",
      },
      {
        title: "Lead registration",
        description:
          "Data sent through the form is used to identify the inquiry and continue the requested contact.",
      },
      {
        title: "Scope",
        description:
          "The contact form is intended for commercial orientation and first qualification, not for emergency or formal legal notices.",
      },
      {
        title: "Clarity first",
        description:
          "The more context you provide, the easier it is to route your inquiry correctly.",
      },
    ],
    formTitle: "Send your inquiry",
    formDescription:
      "Leave your details and a contact channel. We will use them only to continue the conversation you requested.",
    formLabels: {
      fullName: "Full name",
      email: "Email",
      whatsapp: "WhatsApp",
      sending: "Sending...",
      send: "Send",
      receiveGuide: "Receive guide",
      error: "Your request could not be sent.",
      success: "Request sent. We will contact you shortly.",
    },
    sections: [
      {
        title: "Best way to contact us",
        paragraphs: [
          "For the fastest response, WhatsApp is usually the most direct channel. It is appropriate for first contact, filtering opportunities and requesting a follow-up conversation.",
          "If you prefer to leave your details first, the website form is available to register your inquiry and continue the conversation through the appropriate channel.",
        ],
      },
    ],
  },
  es: {
    eyebrow: "Contacto",
    title: "Iniciá la conversación con contexto real",
    description:
      "Si estás evaluando Paraguay para invertir, comprar una propiedad o explorar oportunidades, el camino más rápido es un contacto directo con contexto suficiente desde el inicio.",
    asideTitle: "Alcance de respuesta",
    asideLines: [
      "Oportunidades inmobiliarias y filtrado inicial.",
      "Derivación con asesor según perfil o interés.",
      "Orientación general sobre siguientes pasos antes de una conversación más profunda.",
    ],
    channels: [
      {
        label: "WhatsApp",
        value: "+595 985 444 801",
        href: "https://wa.me/595985444801",
        description: "Canal principal de contacto directo para seguimiento comercial.",
      },
      {
        label: "Instagram",
        value: "@investmentsparaguay",
        href: "https://www.instagram.com/investmentsparaguay",
        description: "Canal público para novedades, contacto y presencia de marca.",
      },
      {
        label: "Sitio web",
        value: "www.investmentsparaguay.com",
        description: "Landing pública, propiedades y contenido de mercado.",
      },
    ],
    cards: [
      {
        title: "Respuesta directa",
        description:
          "Indicá qué tipo de oportunidad o propiedad estás evaluando para que la primera respuesta sea más útil.",
      },
      {
        title: "Registro del lead",
        description:
          "Los datos enviados por formulario se usan para identificar la consulta y continuar el contacto solicitado.",
      },
      {
        title: "Alcance",
        description:
          "El formulario está pensado para orientación comercial y calificación inicial, no para emergencias ni notificaciones legales formales.",
      },
      {
        title: "Claridad primero",
        description:
          "Cuanto más contexto compartas, más fácil será derivar tu consulta correctamente.",
      },
    ],
    formTitle: "Enviá tu consulta",
    formDescription:
      "Dejá tus datos y un canal de contacto. Serán utilizados únicamente para continuar la conversación que solicitaste.",
    formLabels: {
      fullName: "Nombre completo",
      email: "Email",
      whatsapp: "WhatsApp",
      sending: "Enviando...",
      send: "Enviar",
      receiveGuide: "Recibir guía",
      error: "No se pudo enviar tu solicitud.",
      success: "Solicitud enviada. Te contactaremos en breve.",
    },
    sections: [
      {
        title: "La mejor forma de escribirnos",
        paragraphs: [
          "Para una respuesta más rápida, WhatsApp suele ser el canal más directo. Es útil para primer contacto, filtrado de oportunidades y coordinación de una conversación posterior.",
          "Si preferís dejar primero tus datos, el formulario del sitio está disponible para registrar tu consulta y continuar por el canal correspondiente.",
        ],
      },
    ],
  },
  pt: {
    eyebrow: "Contato",
    title: "Comece a conversa com contexto real",
    description:
      "Se você está avaliando o Paraguai para investir, comprar um imóvel ou explorar oportunidades, o caminho mais rápido é um contato direto com contexto suficiente desde o início.",
    asideTitle: "Escopo de resposta",
    asideLines: [
      "Oportunidades imobiliárias e filtragem inicial.",
      "Encaminhamento com consultor conforme perfil ou interesse.",
      "Orientação geral sobre próximos passos antes de uma conversa mais profunda.",
    ],
    channels: [
      {
        label: "WhatsApp",
        value: "+595 985 444 801",
        href: "https://wa.me/595985444801",
        description: "Canal principal de contato direto para acompanhamento comercial.",
      },
      {
        label: "Instagram",
        value: "@investmentsparaguay",
        href: "https://www.instagram.com/investmentsparaguay",
        description: "Canal público para novidades, contato e presença de marca.",
      },
      {
        label: "Site",
        value: "www.investmentsparaguay.com",
        description: "Landing pública, imóveis e conteúdo de mercado.",
      },
    ],
    cards: [
      {
        title: "Resposta direta",
        description:
          "Informe que tipo de oportunidade ou imóvel está avaliando para que a primeira resposta seja mais útil.",
      },
      {
        title: "Registro do lead",
        description:
          "Os dados enviados pelo formulário são usados para identificar a consulta e continuar o contato solicitado.",
      },
      {
        title: "Escopo",
        description:
          "O formulário é destinado à orientação comercial e qualificação inicial, não a emergências ou notificações legais formais.",
      },
      {
        title: "Clareza primeiro",
        description:
          "Quanto mais contexto você compartilhar, mais fácil será encaminhar sua consulta corretamente.",
      },
    ],
    formTitle: "Envie sua consulta",
    formDescription:
      "Deixe seus dados e um canal de contato. Eles serão usados apenas para continuar a conversa que você solicitou.",
    formLabels: {
      fullName: "Nome completo",
      email: "Email",
      whatsapp: "WhatsApp",
      sending: "Enviando...",
      send: "Enviar",
      receiveGuide: "Receber guia",
      error: "Não foi possível enviar sua solicitação.",
      success: "Solicitação enviada. Entraremos em contato em breve.",
    },
    sections: [
      {
        title: "A melhor forma de falar conosco",
        paragraphs: [
          "Para uma resposta mais rápida, o WhatsApp costuma ser o canal mais direto. Ele é útil para primeiro contato, filtragem de oportunidades e coordenação de uma conversa posterior.",
          "Se preferir deixar seus dados primeiro, o formulário do site está disponível para registrar sua consulta e seguir pelo canal mais adequado.",
        ],
      },
    ],
  },
  de: {
    eyebrow: "Kontakt",
    title: "Starten Sie die Anfrage mit echtem Kontext",
    description:
      "Wenn Sie Paraguay für eine Investition, einen Immobilienkauf oder die erste Marktsondierung prüfen, ist direkter Kontakt mit ausreichend Kontext der schnellste Weg.",
    asideTitle: "Antwortumfang",
    asideLines: [
      "Immobilienchancen und erste Filterung.",
      "Zuordnung zu einem passenden Berater nach Profil oder Interesse.",
      "Allgemeine Orientierung zu nächsten Schritten vor einem tieferen Gespräch.",
    ],
    channels: [
      {
        label: "WhatsApp",
        value: "+595 985 444 801",
        href: "https://wa.me/595985444801",
        description: "Primärer direkter Kanal für die geschäftliche Nachverfolgung.",
      },
      {
        label: "Instagram",
        value: "@investmentsparaguay",
        href: "https://www.instagram.com/investmentsparaguay",
        description: "Öffentlicher Kanal für Neuigkeiten, Kontakt und Markenpräsenz.",
      },
      {
        label: "Website",
        value: "www.investmentsparaguay.com",
        description: "Öffentliche Landingpage, Immobilien und Marktinhalte.",
      },
    ],
    cards: [
      {
        title: "Direkte Antwort",
        description:
          "Teilen Sie mit, welche Art von Gelegenheit oder Immobilie Sie prüfen, damit die erste Rückmeldung nützlicher ist.",
      },
      {
        title: "Lead-Erfassung",
        description:
          "Die über das Formular gesendeten Daten werden verwendet, um die Anfrage zu identifizieren und den gewünschten Kontakt fortzuführen.",
      },
      {
        title: "Umfang",
        description:
          "Das Formular dient der geschäftlichen Erstorientierung und Qualifizierung, nicht für Notfälle oder formelle Rechtsmitteilungen.",
      },
      {
        title: "Klarheit zuerst",
        description:
          "Je mehr Kontext Sie angeben, desto leichter kann Ihre Anfrage richtig weitergeleitet werden.",
      },
    ],
    formTitle: "Anfrage senden",
    formDescription:
      "Hinterlassen Sie Ihre Daten und einen Kontaktweg. Diese werden nur verwendet, um die von Ihnen gewünschte Kommunikation fortzuführen.",
    formLabels: {
      fullName: "Vollständiger Name",
      email: "E-Mail",
      whatsapp: "WhatsApp",
      sending: "Wird gesendet...",
      send: "Senden",
      receiveGuide: "Leitfaden erhalten",
      error: "Ihre Anfrage konnte nicht gesendet werden.",
      success: "Anfrage gesendet. Wir melden uns in Kürze.",
    },
    sections: [
      {
        title: "Der beste Weg, uns zu kontaktieren",
        paragraphs: [
          "Für die schnellste Antwort ist WhatsApp in der Regel der direkteste Kanal. Er eignet sich für den ersten Kontakt, die Filterung von Chancen und die Koordination eines weiteren Gesprächs.",
          "Wenn Sie zunächst lieber Ihre Daten hinterlassen möchten, steht das Website-Formular zur Verfügung, um Ihre Anfrage zu registrieren und über den passenden Kanal weiterzuführen.",
        ],
      },
    ],
  },
};
