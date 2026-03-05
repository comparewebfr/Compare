import { CSS, W } from "../lib/constants";
import "./globals.css";

export const metadata = {
  title: "Compare. — Réparer, occasion ou neuf ?",
  description: "Comparez réparation, achat reconditionné et neuf pour faire le meilleur choix. Estimations de coût, verdict et alternatives.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </head>
      <body style={{ background: W, margin: 0, minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
