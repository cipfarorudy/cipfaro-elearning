import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CIPFARO - Plateforme E-Learning',
  description: 'Plateforme CIPFARO pour l\'apprentissage en ligne'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <title>CIPFARO - Plateforme E-Learning</title>
      </head>
      <body style={{ fontFamily: "Inter, system-ui, Arial, sans-serif" }}>
        {children}
        <script dangerouslySetInnerHTML={{__html: `window.__API_BASE__='${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10002'}'`}} />
      </body>
    </html>
  );
}
