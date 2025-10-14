import Script from "next/script";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iddeass - Inteligencia Digital",
  description: "Asistentes de IA especializados en tributación, contabilidad y automatización empresarial",
  keywords: "IA, tributación, contabilidad, BOICAC, automatización, N8N, despachos",
  authors: [{ name: "Iddeass" }],
  creator: "Iddeass",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Iddeass - Inteligencia Digital",
    description: "Asistentes de IA especializados en tributación, contabilidad y automatización empresarial",
    type: "website",
    locale: "es_ES",
  },
  icons: {
    icon: [
      { url: "/imagotiponegro_iddeass.v3.png", type: "image/png" },
    ],
    apple: [
      { url: "/imagotiponegro_iddeass.v3.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
          as="script"
        />
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
