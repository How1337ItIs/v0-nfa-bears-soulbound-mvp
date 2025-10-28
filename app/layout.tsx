import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { PrivySetup } from './providers/PrivySetup'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'NFA Bears - Not Fade Away',
  description: 'Grateful Dead-inspired Web3 community preserving authentic connections',
  generator: 'nfa-bears',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <PrivySetup>
          {children}
          <Toaster position="top-center" />
        </PrivySetup>
        <Analytics />
      </body>
    </html>
  )
}
