import type { Metadata } from "next";
import { Cinzel_Decorative, Roboto_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import ParticleBackground from "@/components/ParticleBackground";
import ClockworkGears from "@/components/ClockworkGears";

const cinzelDecorative = Cinzel_Decorative({ 
  subsets: ["latin"],
  weight: "700",
  variable: "--font-cinzel-decorative",
  display: "swap"
});

const robotoMono = Roboto_Mono({ 
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "System Chronos - Creative Challenge App",
  description: "The Digital Engine Comes to Life. Submit your artwork and compete in creative challenges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${cinzelDecorative.variable} ${robotoMono.variable} clockwork-neon-bg`}>
        <ClockworkGears />
        <ParticleBackground />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
