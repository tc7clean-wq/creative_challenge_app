import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import LiveTicker from "@/components/ui/LiveTicker";

const inter = Inter({ subsets: ["latin"] });
const bebasNeue = Bebas_Neue({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue"
});

export const metadata: Metadata = {
  title: "Creative Challenge App",
  description: "Submit your artwork and compete in creative challenges",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${bebasNeue.variable}`}>
        <ErrorBoundary>
          <LiveTicker />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
