"use client";
import "./globals.css";
import { AuthProvider } from "@/app/context/authContext";
import LayoutWithNavbar from "@/app/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased font-sans">
        <AuthProvider>
          <LayoutWithNavbar>
            {children}
          </LayoutWithNavbar>
        </AuthProvider>
      </body>
    </html>
  );
}
