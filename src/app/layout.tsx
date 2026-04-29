import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Event Check-In",
  description:
    "iPad-optimized event check-in kiosk with live networking slides and badge printing",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Check-In",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F5F5F3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-paper text-ink antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
