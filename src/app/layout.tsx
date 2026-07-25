import type { Metadata } from "next";
import { Lexend, Source_Sans_3 } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { getLang } from "@/lib/get-lang";
import "./globals.css";

const fontDisplay = Lexend({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const fontBody = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Kıbrıs'ta Hızlı Taksi Bulun`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "KKTC genelinde güvenilir taksileri tek dokunuşla arayın veya WhatsApp'tan yazın.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Kıbrıs'ta Hızlı Taksi Bulun`,
    description:
      "Lefkoşa, Girne, Gazimağusa ve tüm KKTC'de taksiye tek dokunuşla ulaşın.",
  },
  formatDetection: { telephone: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLang();

  return (
    <html
      lang={lang}
      className={`${fontDisplay.variable} ${fontBody.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:font-semibold"
        >
          İçeriğe geç
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
