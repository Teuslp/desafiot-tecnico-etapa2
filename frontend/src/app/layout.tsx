import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@uigovpe/styles";
import { GovBar, UiProvider } from "@uigovpe/components";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Desafio Tecnico - Governo de Pernambuco",
  description: "Aplicacao utilizando UI-GovPE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-screen bg-[var(--surface-page)] text-[var(--text-primary)]">
        <UiProvider>
          <div className="app-root">
            <GovBar />
            {children}
          </div>
        </UiProvider>
      </body>
    </html>
  );
}
