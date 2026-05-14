import type { Metadata } from 'next'
import { Be_Vietnam_Pro, Geist_Mono } from 'next/font/google'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-be-vietnam-pro',
  subsets: ['latin', 'vietnamese'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'How Cooked Are You? 🔥 | AI Burnout Meter for Developers',
  description:
    'Find out your burnout level with our AI-powered developer burnout meter. Answer 8 questions, get your Cooked Score, and receive a personalized AI roast.',
  openGraph: {
    title: 'How Cooked Are You? 🔥',
    description: 'The AI-powered burnout meter for developers who are definitely fine.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-orange-50/30 antialiased">{children}</body>
    </html>
  )
}
