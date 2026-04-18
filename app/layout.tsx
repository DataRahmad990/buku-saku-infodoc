import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Buku Saku Infodoc",
  description: "Portal dokumen internal OJK — akses laporan dan siaran pers terkini",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Buku Saku",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#C0001A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider>
          {/* Gradient mesh background */}
          <div className="mesh-bg" />
          <div className="max-w-[430px] mx-auto min-h-screen relative">
            {children}
            <BottomNav />
          </div>
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
