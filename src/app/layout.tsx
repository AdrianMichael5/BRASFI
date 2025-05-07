import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["600", "700"],
  subsets: ["latin"], 
});

export const metadata: Metadata = {
  title: "BRASFI - Formando Líderes e Viabilizando Soluções",
  description:
    "Atuamos como catalisadores no desenvolvimento de lideranças e soluções em finanças e sustentabilidade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
