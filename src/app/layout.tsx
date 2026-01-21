import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FacturaPYME | Facturación Inteligente para Clínicas",
  description: "Sistema de facturación y análisis financiero para clínicas y pequeñas empresas. Genera facturas profesionales, controla cobros pendientes y visualiza KPIs en tiempo real.",
  keywords: "facturación, pymes, clínicas, facturas, gestión financiera, cobros, análisis",
  authors: [{ name: "FacturaPYME" }],
  openGraph: {
    title: "FacturaPYME | Facturación Inteligente",
    description: "Sistema de facturación y análisis financiero para clínicas y pequeñas empresas",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="main-wrapper">
            <Header />
            <main className="flex-1 p-4 pt-16 md:p-6 lg:p-8 lg:pt-8 bg-gray-50 overflow-x-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

