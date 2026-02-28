import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Authentication | UniSocial",
  description: "Connectez-vous ou inscrivez-vous pour rejoindre la communaute universitaire",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
