import type { Metadata } from "next";
import { Figtree, Roboto_Slab } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/layouts/LenisProvider";

import { Providers } from "@/components/providers/Providers";

// Roboto Slab : la même slab serif que le logo IN-CUBATOR et les titres du
// catalogue IN NETWORK. Figtree porte le texte courant et les interfaces.
const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "IN-CUBATOR — De l'idée au projet concret, à Alger",
    template: "%s — IN-CUBATOR",
  },
  description:
    "IN-CUBATOR, l'incubateur de La Maison IN Groupe à Hydra (Alger) : un programme en six étapes, des mentors, des investisseurs et l'écosystème IN NETWORK pour lancer votre startup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${robotoSlab.variable} ${figtree.variable} antialiased`}>
      <body className="flex flex-col font-sans">
        <Providers>
          <LenisProvider>{children}</LenisProvider>
        </Providers>
      </body>
    </html>
  );
}
