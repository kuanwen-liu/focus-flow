import { Hero } from '@/components/layout/Hero'
import { Features } from '@/components/layout/Features'
import { CTAButtons } from '@/components/layout/CTAButtons'

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
