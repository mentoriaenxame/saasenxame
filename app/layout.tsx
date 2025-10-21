import type React from "react"
import type { Metadata } from "next"

import "./globals.css"
import { CRMProvider } from "@/lib/crm-context-db"

import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "CRM Pro - Sistema de Gestão de Clientes",
  description: "Sistema completo de CRM para gerenciar leads, clientes e vendas",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`dark ${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <CRMProvider>
          {children}
        </CRMProvider>
      </body>
    </html>
  )
}
