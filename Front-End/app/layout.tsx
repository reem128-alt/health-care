import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import  {Navigation}  from "@/components/Navigation"
import { Footer } from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Health Platform",
  description: "A modern healthcare platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Navigation />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}
