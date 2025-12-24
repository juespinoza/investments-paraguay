import { metadata } from "@/app/_layout";
import { title } from "process";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";

export const mockAdvisorLanding = {
  heroTitle: "Julia Espinoza",
  heroSubtitle:
    "Asegurando inversiones inmobiliarias inteligentes en Paraguay.",
  heroCtaLabel: "Contactar",
  heroCtaHref: "/bienes-raices/asesores/julia-espinoza",
  heroBg: "/backgrounds/background.png",

  metadata: {
    title: `Julia Espinoza - ${metadata.title}`,
    description:
      "Asesora inmobiliaria especializada en inversiones inteligentes en Paraguay. Conéctate con Julia para descubrir oportunidades de inversión excepcionales.",
  },

  profile: {
    imageUrl: "/images/profile.jpg",
    title: "Carrera inmobiliaria",
    years: "1 año y medio",
    company: "SkyOne Nova",
    paragraphs: [
      "Breve historia",
      "Soy ingeniera informática, inversionista inmobiliaria y emprendedora de corazón. Mi objetivo es ayudarte a encontrar lo que más te conviene.",
    ],
  },

  specialization: [
    { title: "Zonas que trabaja", lines: ["Departamento Central"] },
    {
      title: "Tipos de clientes que trabaja",
      lines: [
        "Inversionistas extranjeros y familias en busca de su primera vivienda",
      ],
    },
    {
      title: "Tipos de propiedades que trabaja",
      lines: ["Proyectos de inversión y propiedades de primera vivienda"],
    },
  ],

  featuredProperties: [
    {
      slug: "oga-ciudad-jardin",
      title: "Oga Ciudad Jardín",
      subtitle: "4 Torres de edificios, listos para entregar",
      imageUrl: "/images/prop1.png",
      badge: "Venta",
    },
    {
      slug: "campus-3",
      title: "Campus 3",
      subtitle: "Lofts universitarios equipados",
      imageUrl: "/images/prop2.jpg",
      badge: "Venta",
    },
    {
      slug: "casa-colonial",
      title: "Casa colonial",
      subtitle: "Casa 3 dormitorios, 1 baño y 2 estacionamientos",
      imageUrl: "/images/prop3.jpg",
      badge: "Venta",
    },
  ],

  testimonials: [
    {
      name: "David",
      text: "Excelente servicio de tour inmobiliario por las zonas cercanas al Lago Ypacaraí.",
    },
    {
      name: "Leticia y Lucas",
      text: "Gracias a Julia logramos encontrar la opción de inversión adecuada a nuestro presupuesto.",
    },
    {
      name: "Christopher",
      text: "Julia ha invertido el tiempo necesario para encontrar el portafolio de inversiones adecuado para cumplir mis objetivos.",
    },
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
};

export const mockAgencyLanding = {
  heroTitle: "Real Estate en Paraguay",
  heroSubtitle: "El cielo no es el límite, tu mente lo es.",
  heroCtaLabel: "Contactar",
  heroCtaHref: "#contacto",
  heroBg: "/backgrounds/background.png",
  logoUrl: "/images/skyone-logo.png",

  about: {
    imageUrl: "/images/agency.jpg",
    title: "SkyOne Paraguay",
    years: "Más de 1000 cierres",
    ops: "30+ asesores",
    paragraphs: [
      "Una inmobiliaria paraguaya consolidada en el mercado, con un enfoque en asesoría, confianza y resultados.",
      "Manejamos compraventa y alquileres de propiedades, con acompañamiento completo en el proceso.",
    ],
  },

  offices: [
    {
      name: "Central",
      city: "Asunción",
      description: "Dirección / datos",
      imageUrl: "/images/of1.jpg",
      ctaHref: "#contacto",
    },
    {
      name: "Essence",
      city: "Asunción",
      description: "Dirección / datos",
      imageUrl: "/images/of2.jpg",
      ctaHref: "#contacto",
    },
    {
      name: "Plus",
      city: "Asunción",
      description: "Dirección / datos",
      imageUrl: "/images/of3.jpg",
      ctaHref: "#contacto",
    },
    {
      name: "Empower",
      city: "Ciudad del Este",
      description: "Dirección / datos",
      imageUrl: "/images/of4.jpg",
      ctaHref: "#contacto",
    },
    {
      name: "Home",
      city: "Asunción",
      description: "Dirección / datos",
      imageUrl: "/images/of5.jpg",
      ctaHref: "#contacto",
    },
    {
      name: "Nova",
      city: "Lambaré",
      description: "Dirección / datos",
      imageUrl: "/images/of6.jpg",
      ctaHref: "#contacto",
    },
  ],

  specialization: [
    { title: "Zonas que trabaja", lines: ["Departamento Central"] },
    {
      title: "Tipos de clientes que trabaja",
      lines: [
        "Inversionistas extranjeros y familias en busca de su primera vivienda",
      ],
    },
    {
      title: "Tipos de propiedades que trabaja",
      lines: ["Proyectos de inversión y propiedades de primera vivienda"],
    },
  ],

  testimonials: [
    { name: "Cliente", text: "Testimonio de un cliente real (placeholder)." },
    { name: "Asesor", text: "Testimonio de asesor de la marca (placeholder)." },
    { name: "Equipo", text: "Testimonio de asesores colegas (placeholder)." },
  ],

  socialLinks: [
    { label: "WhatsApp", value: "+595 999 999 999", href: "#" },
    { label: "Instagram", value: "@skyoneparaguay", href: "#" },
    { label: "Facebook", value: "SkyOne Real Estate Latam", href: "#" },
    { label: "TikTok", value: "@skyone_paraguay", href: "#" },
  ],
};

export const mockPropertyLanding = {
  title: "Oga - Ciudad Jardín",
  subtitle: "Vivir con espacio real, bien pensado, en una zona con proyección.",
  heroBg: "/backgrounds/background.png",
  imageUrl: "/images/prop1.jpg",
  location: "Asunción / Central",
  price: "USD 97.900",
  paragraphs: [
    "Descripción general de la propiedad (placeholder).",
    "Detalles y razones de inversión (placeholder).",
  ],
};

export const mockPillars = [
  {
    title: "Objetivos",
    text: "4 Torres de edificios, listos para entregar desde USD 47.900.",
  },
  {
    title: "Misión",
    text: "Lofts universitarios equipados, disponibles para el 2027 desde USD 43.000.",
  },
  {
    title: "Visión",
    text: "Casa de 3 dormitorios, 1 baño y 2 estacionamientos; cochera a GS 480.000.000.",
  },
];
