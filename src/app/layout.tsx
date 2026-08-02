import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apartments 12 — Бутик-отель",
  description: "Уникальный бутик-отель с 10 тематическими апартаментами. Каждый номер — это путешествие в новый мир. Забронируйте незабываемый отдых.",
  keywords: "бутик-отель, апартаменты, отдых, бронирование, тематические номера",
  openGraph: {
    title: "Apartments 12 — Бутик-отель",
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
        {children}
      </body>
    </html>
  );
}
