import type { Property } from "./types";

export const PROPERTIES: Property[] = [
  {
    slug: "oga-ciudad-jardin",
    title: "Oga - Ciudad Jardín",
    subtitle: "4 Torres de edificios, listos para entregar",
    location: "Asunción / Central",
    price: 54000,
    priceType: "USD",
    coverImageUrl: "/images/prop1.png",
    gallery: ["/images/prop1.jpg", "/images/prop2.jpg"],
    descriptionParagraphs: [
      "Descripción general de la propiedad (placeholder).",
      "Razones de inversión (placeholder).",
    ],
    advisorSlug: "julia-espinoza",
  },
  {
    slug: "campus-3",
    title: "Campus 3",
    subtitle: "Lofts universitarios equipados",
    price: 43000,
    priceType: "USD",
    coverImageUrl: "/images/prop2.jpg",
    descriptionParagraphs: ["Descripción (placeholder)."],
    advisorSlug: "julia-espinoza",
  },
  {
    slug: "casa-colonial",
    title: "Casa colonial",
    subtitle: "Casa de 3 dormitorios, 1 baño y 2 estacionamientos",
    price: 480000000,
    priceType: "GS",
    coverImageUrl: "/images/prop3.jpg",
    descriptionParagraphs: ["Descripción (placeholder)."],
    advisorSlug: "julia-espinoza",
  },
];
