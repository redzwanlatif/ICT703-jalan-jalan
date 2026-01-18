import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { GamificationProvider } from "@/contexts/gamification-context";
import { TripProvider } from "@/contexts/trip-context";
import { DuoRewardModal } from "@/components/shared/duo-bottom-nav";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Jalan-Jalan | Your Travel Adventure Awaits",
  description: "A fun, gamified travel planning platform that helps you explore the world. Plan trips, earn XP, and level up your travel experience!",
  keywords: ["travel", "planning", "adventure", "trip", "vacation", "gamified"],
  authors: [{ name: "Jalan-Jalan Team" }],
  creator: "Jalan-Jalan",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Jalan-Jalan",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#131F24" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${nunito.variable} antialiased`}>
        <GamificationProvider>
          <TripProvider>
            <ScrollToTop />
            {children}
            <DuoRewardModal />
          </TripProvider>
        </GamificationProvider>
      </body>
    </html>
  );
}
