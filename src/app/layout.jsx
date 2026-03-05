import { DM_Sans } from "next/font/google";
import Script from "next/script";
import { CSS, W } from "../lib/constants";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

const LCP_IMAGE = "/banner-hero.jpg";

export const metadata = {
  title: "Compare. — Réparer, occasion ou neuf ?",
  description: "Comparez réparation, achat reconditionné et neuf pour faire le meilleur choix. Estimations de coût, verdict et alternatives.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preload" as="image" href={LCP_IMAGE} fetchPriority="high" />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </head>
      <body className={dmSans.className} style={{ background: W, margin: 0, minHeight: "100vh" }}>
        {children}
        {/* Google Analytics (GA4) - chargement après interaction */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-3QHNEN9NGX" strategy="afterInteractive" />
        <Script id="ga-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3QHNEN9NGX');
          `}
        </Script>
      </body>
    </html>
  );
}
