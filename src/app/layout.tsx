import type { Metadata } from "next";
import "./globals.css";
import { Providers } from '@/components/Providers';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: "Apartments12 — Бутик-отель",
  description: "Уникальный бутик-отель с 10 тематическими апартаментами. Каждый номер — это путешествие в новый мир. Забронируйте незабываемый отдых.",
  keywords: "бутик-отель, апартаменты, отдых, бронирование, тематические номера",
  openGraph: {
    title: "Apartments12 — Бутик-отель",
    description: "Уникальный бутик-отель с 10 тематическими апартаментами",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
