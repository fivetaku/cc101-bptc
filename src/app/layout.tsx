import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://bptc.axwith.com'),
  title: 'CC101 — 클로드코드 가이드',
  description:
    '클로드코드 가이드 강의 수강생을 위한 한국어 학습 가이드. Part 1~3 17 클립 + 보조 레퍼런스. 영상 보면서 옆에 켜두고 따라하세요.',
  keywords: 'Claude Code, 클로드코드, 한국어, 강의, 가이드, AI, Anthropic',
  authors: [{ name: 'CC101' }],
  openGraph: {
    title: 'CC101 — 클로드코드 가이드',
    description: '클로드코드 강의 학습 가이드',
    url: 'https://bptc.axwith.com',
    siteName: 'CC101',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CC101 — 클로드코드 가이드',
    description: '클로드코드 강의 학습 가이드',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
