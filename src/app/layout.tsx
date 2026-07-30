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

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "PharmaHub - Your Trusted Pharmacy Platform",
    template: "%s | PharmaHub",
  },
  description:
    "Compare medicine prices, order online, consult with doctors, and get fast delivery from trusted pharmacies near you.",
  keywords: [
    "pharmacy",
    "medicine",
    "online pharmacy",
    "doctor consultation",
    "medicine delivery",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
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
