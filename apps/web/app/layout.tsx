import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CIPFARO E‑Learning",
  description: "Plateforme de formation professionnelle nouvelle génération",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans bg-slate-50 text-slate-800 antialiased">
        {children}
        <script dangerouslySetInnerHTML={{__html: `window.__API_BASE__='${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10002'}'`}} />
      </body>
    </html>
  );
}
