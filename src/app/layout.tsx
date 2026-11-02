import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DesktopHeader } from "@/components/layout/DesktopHeader";
import { MobileBottomNavigation } from "@/components/layout/MobileBottomNavigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AuthModal } from "@/components/auth/AuthModal";
import { AvatarModalWrapper } from "@/components/auth/AvatarModalWrapper";
import { FullscreenSearch } from "@/components/search/FullscreenSearch";
import { SplashScreen } from "@/components/ui/SplashScreen";

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
    default: "NutriDex — Plans & Food Intelligence",
    template: "%s · NutriDex",
  },
  description:
    "Consulta alimentos, descubre sus equivalencias y organiza tus porciones desde una sola plataforma.",
  manifest: "/manifest.webmanifest",
  applicationName: "NutriDex",
  appleWebApp: { capable: true, title: "NutriDex", statusBarStyle: "default" },
  icons: {
    icon: "/icons/nutridex-app-icon.png",
    apple: "/icons/nutridex-app-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#15803d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-nutridex-background text-nutridex-text-primary">
        <ToastProvider>
          <ThemeProvider>
            <div className="nx-ambient" aria-hidden />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-nutridex-primary focus:px-4 focus:py-2.5 focus:text-white focus:shadow-lg focus:outline-none"
            >
              Saltar al contenido principal
            </a>
            <div className="flex min-h-dvh w-full">
              <AppSidebar />
              <div className="flex min-h-dvh min-w-0 flex-1 flex-col md:pl-[240px]">
                <DesktopHeader />
                <main id="main-content" className="flex-1 min-w-0 pb-28 md:pb-8">
                  {children}
                </main>
                <SiteFooter />
              </div>
            </div>
            <MobileBottomNavigation />
            <AuthModal />
            <AvatarModalWrapper />
            <FullscreenSearch />
            <SplashScreen />
          </ThemeProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
