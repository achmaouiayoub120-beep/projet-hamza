import "./globals.css";
import type { Metadata, Viewport } from "next";
import Sidebar from "@/components/Sidebar";
import RightPanel from "@/components/RightPanel";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { uploadRouter } from "@/lib/uploadthing/core";

export const metadata: Metadata = {
  title: "UniSocial - Réseau Social Universitaire",
  description: "Connectez-vous avec vos camarades et partagez votre expérience universitaire",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f14" },
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
            <div className="max-w-[1400px] mx-auto flex gap-6 px-4 lg:px-6 py-6">
              {/* Left Sidebar */}
              <aside className="hidden md:block w-[250px] flex-shrink-0">
                <div className="sticky top-6 card-glass p-4 rounded-2xl h-[calc(100vh-48px)] overflow-y-auto">
                  <Sidebar />
                </div>
              </aside>

              {/* Center Content */}
              <main className="flex-1 min-w-0">
                {children}
              </main>

              {/* Right Panel */}
              <aside className="hidden lg:block w-[300px] flex-shrink-0">
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
