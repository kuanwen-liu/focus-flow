import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'FocusFlow - Find Your Frequency | Ambient Sound Mixer',
  description: 'Mix ambient layers to block out the world and deepen your focus. Create custom soundscapes with rain, white noise, lo-fi beats, and more. Your personal cocoon of sound awaits.',
  keywords: ['ambient sounds', 'focus music', 'white noise', 'productivity', 'concentration', 'sound mixer', 'meditation', 'deep work'],
  authors: [{ name: 'FocusFlow' }],
  openGraph: {
    title: 'FocusFlow - Find Your Frequency',
    description: 'Mix ambient layers to block out the world and deepen your focus.',
    type: 'website',
    locale: 'en_US',
    siteName: 'FocusFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FocusFlow - Find Your Frequency',
    description: 'Mix ambient layers to block out the world and deepen your focus.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <ErrorBoundary>
          <ThemeProvider>
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
