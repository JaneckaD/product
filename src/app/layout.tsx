import type { Metadata } from "next";
import { Bodoni_Moda, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"] });

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "prostor. — architektonický ateliér",
  description: "Navrhujeme moderní rodinné domy. Málo materiálů, hodně světla a žádné zbytečnosti.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" className={`${inter.variable} ${bodoni.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
