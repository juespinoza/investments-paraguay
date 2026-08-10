// src/app/fonts.ts;
import { Cormorant_Garamond, DM_Sans } from "next/font/google";

export const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-primary",
});

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-brand",
});
