import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const siteUrl = "https://atlasglobalcore.com";

export const metadata: Metadata = {
  title: "Atlas Global Core | Context-Aware Orchestration Layer for the Agentic Economy",
  description:
    "The Context-Aware Orchestration Layer for the Global Agentic Economy. AI-driven liquidity routing, real-time dynamic compliance, and seamless B2B settlement across Fiat and Crypto networks.",
  keywords: [
    "Atlas Global Core",
    "Payment Orchestration",
    "B2B Infrastructure",
    "CRM",
    "NeXFlowX",
    "Commerce OS",
    "Agentic Economy",
    "AI Orchestration",
    "Fiat Crypto Settlement",
    "Viva.com",
    "Onramp.money",
    "GPU Reselling",
    "Stripe",
    "TSP",
    "Technical Service Provider",
  ],
  authors: [{ name: "Sergio Monteiro", url: "https://atlasglobalcore.com" }],
  creator: "Sergio Monteiro (EI) in cooperation with IAHUB360 LTD — SIREN 790 155 006 — SIRET 79015500600014",
  publisher: "Atlas Global Core",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48 64x64 128x128 256x256", type: "image/x-icon" },
      { url: "/logo-atlas.png", sizes: "1254x1254", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Atlas Global Core",
    title: "Atlas Global Core | Context-Aware Orchestration Layer",
    description:
      "The Context-Aware Orchestration Layer for the Global Agentic Economy. AI-driven liquidity routing and B2B settlement across Fiat and Crypto networks.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Atlas Global Core — Context-Aware Orchestration Layer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas Global Core | Context-Aware Orchestration Layer",
    description:
      "The Context-Aware Orchestration Layer for the Global Agentic Economy. AI-driven liquidity routing and B2B settlement.",
    images: ["/og-image.png"],
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#050505" />
        <meta name="msapplication-TileColor" content="#050505" />
      </head>
      <body className="antialiased bg-obsidian text-steel-silver font-sans min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
