import { CSS, W } from "../lib/constants";
import "./globals.css";

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
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        {/* Google Analytics (GA4) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-3QHNEN9NGX" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-3QHNEN9NGX');
            `,
          }}
        />
      </head>
      <body style={{ background: W, margin: 0, minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
