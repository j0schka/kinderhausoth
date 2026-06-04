import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Kinderhaus fördern",
  description: "Jetzt das Kinderhaus unterstützen – einfach, schnell, herzlich.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={nunito.variable}>
      <body className="min-h-full" style={{ fontFamily: "var(--font-nunito), 'Nunito', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
