import type React from "react"
import type { Metadata } from "next"
import "../src/index.css"
import "../src/globals.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

export const metadata: Metadata = {
  title: "Enfermería ESCOM - Sistema de Inventario",
  description: "Sistema de Gestión de Inventario - Enfermería ESCOM IPN",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  )
}
