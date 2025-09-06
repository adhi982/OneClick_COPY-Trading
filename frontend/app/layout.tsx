import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import { WalletProvider } from "@/components/wallet/WalletProvider"
import SiteShell from "@/components/SiteShell"
import "./globals.css"

export const metadata: Metadata = {
  title: "OneClick Copy Trading Platform",
  description: "Professional copy trading platform for cryptocurrency markets",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <WalletProvider>
              <SiteShell>{children}</SiteShell>
            </WalletProvider>
            <Toaster />
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
