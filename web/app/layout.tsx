import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  title: {
    default: "Qo'shrabotliklar — Qo'shrabot tumani hamjamiyat sayti",
    template: "%s · Qo'shrabotliklar",
  },
  description:
    "Samarqand viloyati Qo'shrabot tumani haqida: tarixi, taniqli kishilari, diqqatga sazovor joylari va yangiliklari. Hamjamiyat tomonidan to'ldiriladigan norasmiy portal.",
  keywords: ["Qoshrabot", "Qo'shrabot", "Samarqand", "Qo'shrabot tumani", "Qoshrabotliklar"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={`${inter.variable} ${manrope.variable}`}>
      <body className="flex min-h-screen flex-col font-body antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
