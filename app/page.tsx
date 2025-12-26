import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { CTAButtons } from '@/components/landing/CTAButtons'

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* CTA Section */}
      <CTAButtons />
    </div>
  )
}
