import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import ParticleBackground from "@/components/ParticleBackground";
import ClockworkGears from "@/components/ClockworkGears";
import { Toaster } from 'react-hot-toast';

const orbitron = Orbitron({ 
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-orbitron",
  display: "swap",
  fallback: ["system-ui", "arial"]
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "arial"]
});

export const metadata: Metadata = {
  title: "AI ArtVerse - AI Art Competition Platform",
  description: "Join the future of digital art. Submit AI-generated artwork, compete in challenges, and connect with artists worldwide.",
  keywords: "AI art, digital art, art competition, artificial intelligence, creative platform",
  authors: [{ name: "AI ArtVerse Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "AI ArtVerse - AI Art Competition Platform",
    description: "Join the future of digital art. Submit AI-generated artwork, compete in challenges, and connect with artists worldwide.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI ArtVerse - AI Art Competition Platform",
    description: "Join the future of digital art. Submit AI-generated artwork, compete in challenges, and connect with artists worldwide.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${orbitron.variable} ${inter.variable} ai-art-bg antialiased`}>
        <ClockworkGears />
        <ParticleBackground />
        <ErrorBoundary>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: 'ai-toast',
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#00f7ff',
                border: '1px solid #c59d5f',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
              }
            }}
          />
        </ErrorBoundary>
      </body>
    </html>
  );
}
