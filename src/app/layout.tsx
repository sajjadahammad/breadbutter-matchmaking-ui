import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { StoreProvider } from "../../store/provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BreadButter Talent Matchmaker",
  description: "A creative matchmaking platform for talent professionals.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
