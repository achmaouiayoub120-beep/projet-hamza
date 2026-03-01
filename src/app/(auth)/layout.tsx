import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Authentication | UniSocial",
  description: "Connectez-vous ou inscrivez-vous pour rejoindre la communauté universitaire",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
