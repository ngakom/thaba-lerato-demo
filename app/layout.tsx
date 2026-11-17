import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import ScrollReveal from "@/components/ScrollReveal";
import { SITE } from "@/lib/resort";
import "./globals.css";

const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["500", "600", "700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const viewport: Viewport = {
  colorScheme: "only light",
  themeColor: "#1e2a22",
};

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | Bush Chalets, Treehouses & Camping in the ${SITE.area}`,
    template: `%s | ${SITE.short}`,
  },
  description: `A demo resort booking website by ${SITE.builtBy.name}: live availability, instant online booking, seasonal rates and an owner dashboard.`,
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name}: resort booking website demo`,
    description: "Live availability, instant booking with a deposit, and an owner dashboard.",
    images: [{ url: "/images/hero.jpg", alt: "Sunset over the bushveld" }],
    locale: "en_ZA",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the inline script adds the "js" class before React hydrates.
    <html lang="en" className={`${cormorant.variable} ${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
        <ScrollReveal />
      </body>
    </html>
  );
}
