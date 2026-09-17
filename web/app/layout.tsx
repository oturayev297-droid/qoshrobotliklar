import type { Metadata, Viewport } from "next";
import { Onest, Unbounded } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SceneBackground from "@/components/SceneBackground";

const onest = Onest({ subsets: ["latin", "cyrillic"], variable: "--font-onest" });
const unbounded = Unbounded({ subsets: ["latin", "cyrillic"], variable: "--font-unbounded", weight: ["500", "700"] });

export const metadata: Metadata = {
  title: {
    default: "Qo'shrabotliklar — Qo'shrabot tumani hamjamiyat sayti",
    template: "%s · Qo'shrabotliklar",
  },
  description:
    "Samarqand viloyati Qo'shrabot tumani haqida: tarixi, taniqli kishilari, diqqatga sazovor joylari va yangiliklari. Hamjamiyat tomonidan to'ldiriladigan norasmiy portal.",
  keywords: ["Qoshrabot", "Qo'shrabot", "Samarqand", "Qo'shrabot tumani", "Qoshrabotliklar"],
};

export const viewport: Viewport = {
  themeColor: "#0b1022",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={`${onest.variable} ${unbounded.variable}`}>
      <body className="flex min-h-screen flex-col font-body text-qor-100 antialiased">
        <SceneBackground />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
