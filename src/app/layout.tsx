import { Geist, Geist_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { server } from '@/mocks/node'
import GlobalProvider from '@/providers/global-provider'
import localFont from 'next/font/local'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Toaster } from '@/components/ui/toaster'

// 개발 환경에서만 MSW 서버를 시작합니다.
if (process.env.NODE_ENV === 'development') {
  server.listen()
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const pretendard = localFont({
  src: '../static/fonts/PretendardVariable.woff2',
  display: 'swap', // 폰트 로딩 중 시스템 폰트로 대체(디폴트 swap)
  preload: true, // 폰트 미리 로드(디폴트 true)
  fallback: [
    // 폰트 로드 실패시 대체 폰트
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  weight: '45 920', // Pretendard 가변 폰트 weight 범위
  variable: '--font-pretendard',
  adjustFontFallback: 'Arial', // 폰트 메트릭 조정을 위한 기준 폰트(디폴트 Arial)
})

// Google Analytics ID
const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pretendard.variable} font-pretendard antialiased`}
      >
        <GoogleAnalytics gaId={GA_ID} />
        <GlobalProvider>{children}</GlobalProvider>
        <Toaster />
      </body>
    </html>
  )
}
