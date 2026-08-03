import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { AIChatbot } from "@/components/shared/ai-chatbot";
import { CartProvider } from "@/store/cart";
import { Toaster } from "react-hot-toast";
import { StructuredData } from "@/components/seo/structured-data";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "VitaHub - Dorixona Platformasi | O'zbekiston",
    template: "%s | VitaHub",
  },
  description:
    "10,000+ dori vositalarini 152+ dorixonada solishtiring. Yetkazib berish, shifokor bilan maslahat, retsept tizimi — barchasi bir platformada. O'zbekiston bo'ylab.",
  keywords: [
    "dorixona",
    "dori vositalari",
    "online dorixona",
    "shifokor bilan maslahat",
    "dori yetkazib berish",
    "pharmacy",
    "medicine",
    "online pharmacy",
    "doctor consultation",
    "medicine delivery",
    "Uzbekistan pharmacy",
    "Tashkent pharmacy",
  ],
  authors: [{ name: "VitaHub" }],
  creator: "VitaHub",
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: "https://pharma-ph-orn-pe1d.vercel.app",
    siteName: "VitaHub",
    title: "VitaHub - O'zbekiston Yetakchi Dorixona Platformasi",
    description: "10,000+ dori vositalari, 152+ dorixona, 30 daqiqada yetkazib berish",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VitaHub - Online Pharmacy Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VitaHub - Online Pharmacy Platform",
    description: "Compare medicine prices, order online, fast delivery",
    images: ["/og-image.png"],
  },
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
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <StructuredData />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
          <CartProvider>
            <div className="relative min-h-screen flex flex-col">
              <Navbar />
              <div className="noise-bg" />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <CartSidebar />
            <AIChatbot />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: "12px",
                  background: "hsl(var(--card))",
                  color: "hsl(var(--foreground))",
                  border: "1px solid hsl(var(--border))",
                },
              }}
            />
          </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
