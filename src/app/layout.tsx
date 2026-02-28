import "./globals.css";
import type { Metadata, Viewport } from "next";
import Sidebar from "@/components/Sidebar";
import RightPanel from "@/components/RightPanel";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { uploadRouter } from "@/lib/uploadthing/core";

export const metadata: Metadata = {
  title: "UniSocial - Reseau Social Universitaire",
  description: "Connectez-vous avec vos camarades et partagez votre experience universitaire",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1829" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider>
          <NextSSRPlugin routerConfig={extractRouterConfig(uploadRouter)} />
          <div className="min-h-screen bg-background">
            <div className="max-w-[1360px] mx-auto flex gap-6 px-4 lg:px-6 py-6">
              {/* Left Sidebar */}
              <aside className="hidden md:block w-[240px] flex-shrink-0">
                <div className="sticky top-6 card-elevated p-4 h-[calc(100vh-48px)] overflow-y-auto">
                  <Sidebar />
                </div>
              </aside>

              {/* Center Content */}
              <main className="flex-1 min-w-0">
                {children}
              </main>

              {/* Right Panel */}
              <aside className="hidden lg:block w-[280px] flex-shrink-0">
                <div className="sticky top-6 overflow-y-auto max-h-[calc(100vh-48px)] pr-1">
                  <RightPanel />
                </div>
              </aside>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
