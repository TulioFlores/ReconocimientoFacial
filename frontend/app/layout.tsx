import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header"; // Asegúrate de que la ruta sea correcta

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GobID Verify | Secure Platform",
  description: "Identity Verification and Document Signing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}>
        {/* El Header se renderiza una sola vez aquí */}
        <Header />
        
        {/* Contenedor principal para el contenido de las páginas */}
        <div className="min-h-[calc(100vh-73px)]"> 
          {children}
        </div>
      </body>
    </html>
  );
}