import type { Advisor } from "./types";

export const ADVISORS: Advisor[] = [
  {
    slug: "julia-espinoza",
    fullName: "Julia Espinoza",
    headline: "Asegurando inversiones inmobiliarias inteligentes en Paraguay.",
    heroBg: "/backgrounds/office.jpg",
    heroCtaLabel: "Contactar",
    heroCtaHref: "https://wa.me/595985444801",

    about: {
      imageUrl: "/images/profile.jpg",
      title: "Mi carrera inmobiliaria",
      startDate: new Date("2024-12-15"),
      company: "SkyOne Nova",
      description:
        "Soy ingeniera informática, inversionista inmobiliaria y emprendedora de corazón, y creo profundamente en el valor de elegir bien desde el inicio. Mi objetivo es ayudarte a encontrar lo que realmente te conviene, no solo lo que está disponible. Trabajo desde la escucha, la transparencia y el compromiso, entendiendo que cada cliente tiene una historia, una meta y un momento distinto. Para mí, una buena inversión no se mide solo en números, sino también en tranquilidad, proyección y confianza a futuro.",
      paragraphs: [
        "Inicié mi carrera como asesora inmobiliaria en SkyOne Nova en diciembre de 2024, combinando análisis, estrategia y visión. Mi formación informática me permite evaluar riesgos, números y oportunidades en propiedad.",
        "Soy ingeniera informática, inversionista inmobiliaria y emprendedora. Ayudo a elegir lo que conviene mediante escucha, transparencia y compromiso, entendiendo objetivos. Creo inversiones que brindan tranquilidad, proyección y confianza a futuro.",
      ],
    },

    services: {
      propertyTypes: ["Proyectos de inversión", "Propiedades familiares"],
      clientTypes: ["Inversionistas extranjeros", "Primera vivienda"],
      areas: ["Departamento Central"],
      servicesList: [
        "Busqueda de propiedades",
        "Asesoramiento en inversiones",
        "Gestión de trámites",
      ],
      paragraphs: [
        "Trabajo principalmente con proyectos de inversión y propiedades familiares, entendiendo que cada tipo de inmueble responde a objetivos distintos, ya sea generar rentabilidad o encontrar un hogar para vivir. Acompaño tanto a inversionistas extranjeros que buscan oportunidades seguras en Paraguay como a personas que están dando el paso hacia su primera vivienda, brindando una guía clara y confiable en todo el proceso.",
        "Mi enfoque se centra en el Departamento Central, donde conozco el mercado, sus zonas estratégicas y su potencial de crecimiento. Ofrezco un servicio integral que incluye la búsqueda de propiedades, el asesoramiento en inversiones con criterio y análisis, y la gestión de trámites, para que cada operación sea ordenada, transparente y sin complicaciones innecesarias.",
      ],
    },

    featuredPropertySlugs: ["oga-ciudad-jardin", "campus-3", "casa-colonial"],

    testimonials: [
      { name: "David", text: "Excelente servicio de tour inmobiliario..." },
      { name: "Leticia y Lucas", text: "Gracias a Julia logramos..." },
      { name: "Christopher", text: "Julia invirtió el tiempo..." },
    ],

    socialLinks: [
      {
        label: "WhatsApp",
        value: "+595 985 444 801",
        href: "https://wa.me/595985444801",
        icon: "whatsapp",
      },
      {
        label: "Instagram",
        value: "@juespinoza.skyone",
        href: "https://instagram.com/juespinoza.skyone",
        icon: "instagram",
      },
      {
        label: "Facebook",
        value: "Julia Espinoza — Real Estate",
        href: "https://www.facebook.com/juespinoza.skyone",
        icon: "facebook",
      },
      {
        label: "TikTok",
        value: "@juespinoza.skyone",
        href: "https://www.tiktok.com/@juespinoza.skyone",
        icon: "tiktok",
      },
    ],
  },
];
