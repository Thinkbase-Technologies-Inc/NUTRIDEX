import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileBottomNavigation } from "@/components/layout/MobileBottomNavigation";
import { SiteFooter } from "@/components/layout/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NutriDex — Equivalencias claras. Nutrición inteligente.",
    template: "%s · NutriDex",
  },
  description:
    "Consulta alimentos, descubre sus equivalencias y organiza tus porciones desde una sola plataforma.",
  manifest: "/manifest.webmanifest",
  applicationName: "NutriDex",
  appleWebApp: { capable: true, title: "NutriDex", statusBarStyle: "default" },
  icons: {
    icon: "/icons/nutridex.svg",
    apple: "/icons/nutridex.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#147D64",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-nutridex-background text-nutridex-text-primary">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:rounded-md focus:bg-nutridex-primary focus:px-4 focus:py-2 focus:text-white"
          >
            Saltar al contenido
          </a>
          <div className="flex min-h-dvh w-full">
            <AppSidebar />
            <div className="flex min-h-dvh min-w-0 flex-1 flex-col md:pl-[260px]">
              <main id="main-content" className="flex-1 min-w-0 pb-24 md:pb-0">
                {children}
              </main>
              <SiteFooter />
            </div>
          </div>
          <MobileBottomNavigation />
        </ThemeProvider>
      </body>
    </html>
  );
}
