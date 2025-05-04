import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Luckiest_Guy, Pacifico } from "next/font/google";
import "./globals.css";
import { PrivyProviders } from "./providers/PrivyProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const luckiestGuy = Luckiest_Guy({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-groovy",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-accent",
});

export const metadata: Metadata = {
  title: "NFA Bears MVP",
  description: "NFA Bears MVP Application",
  icons: {
    icon: "/favicon.ico",
  },
};

const spiralBg = `
  background: url('data:image/svg+xml;utf8,<svg width="100%25" height="100%25" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="a" cx="50%" cy="50%" r="80%" fx="50%" fy="50%"><stop offset="0%25" stop-color="%23FFFFFF"/><stop offset="40%25" stop-color="%231A1AFF"/><stop offset="80%25" stop-color="%23FF2222"/></radialGradient></defs><rect width="800" height="800" fill="url(%23a)"/><g><path d="M400,400 Q600,200 800,400 T400,800 T0,400 T400,0 Z" fill="none" stroke="%23FF2222" stroke-width="40"/><path d="M400,400 Q200,600 0,400 T400,0 T800,400 T400,800 Z" fill="none" stroke="%231A1AFF" stroke-width="40"/><path d="M400,400 Q600,600 800,400 T400,0 T0,400 T400,800 Z" fill="none" stroke="%23FFFFFF" stroke-width="40"/></g></svg>');
  background-size: cover;
  background-attachment: fixed;
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${inter.variable}
          ${luckiestGuy.variable}
          ${pacifico.variable}
          antialiased
          min-h-screen
          bg-gradient-to-br from-blue-50 to-purple-50
        `}
      >
        <PrivyProviders>{children}</PrivyProviders>
      </body>
    </html>
  );
}

