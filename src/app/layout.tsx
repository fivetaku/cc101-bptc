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
  title: 'CC101 — BPTC 클로드코드 워크샵 활용 가이드',
  description:
    'BPTC 클로드코드 워크샵 참가자를 위한 한국어 활용 가이드. Part 1~5 32 클립 — 워크샵에서 만든 결과물·습관을 사내에서 계속 키우는 매뉴얼.',
  keywords: 'Claude Code, 클로드코드, 한국어, BPTC, 워크샵, 가이드, AI, Anthropic',
  authors: [{ name: 'CC101' }],
  openGraph: {
    title: 'CC101 — BPTC 클로드코드 워크샵 활용 가이드',
    description: 'BPTC 클로드코드 워크샵 활용 가이드',
    url: 'https://bptc.axwith.com',
    siteName: 'CC101',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CC101 — BPTC 클로드코드 워크샵 활용 가이드',
    description: 'BPTC 클로드코드 워크샵 활용 가이드',
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
