import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PomoDOC - UKMLA Pomodoro Timer",
  description:
    "Master the UKMLA with focused study sessions across all 24 subspecialties. Track your progress with the Pomodoro Technique designed for medical students.",
  keywords: "UKMLA, medical students, pomodoro timer, study tracker, medical education, UK medical licensing",
  authors: [{ name: "PomoDOC" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "PomoDOC - UKMLA Pomodoro Timer",
    description: "Master the UKMLA with focused study sessions across all 24 subspecialties",
    url: "https://pomodoc.com",
    siteName: "PomoDOC",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PomoDOC - UKMLA Pomodoro Timer",
    description: "Master the UKMLA with focused study sessions across all 24 subspecialties",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
