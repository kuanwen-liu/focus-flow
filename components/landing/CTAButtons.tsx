'use client'

import { ROUTES } from '@/lib/constants/routes'
import Link from 'next/link'

export const CTAButtons = () => {
    return (
        <section className="relative w-full py-32 px-6 overflow-hidden bg-background-light dark:bg-background">
        {/* Decorative background gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-primary/10 to-purple-500/10 rounded-full blur-[100px] z-0" />

        <div className="relative z-10 layout-container flex justify-center">
          <div className="flex flex-col items-center justify-center text-center max-w-[720px] gap-8">
            <h2 className="text-4xl md:text-6xl font-black dark:text-white tracking-tight">
              Ready to enter the flow state?
            </h2>
            <p className="text-xl text-gray-600 dark:text-[#9db2b9]">
              Start your session now. No sign-up required for the first mix.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
              <Link href={ROUTES.MIXER}>
                <button className="flex items-center justify-center h-14 px-10 rounded-lg bg-primary text-[#101d22] text-lg font-bold hover:bg-primary/90 hover:shadow-lg transition-all w-full sm:w-auto">
                  Start Mixing
                </button>
              </Link>
              <Link href={ROUTES.MIXER}>
                <button className="flex items-center justify-center h-14 px-10 rounded-lg bg-[#283539] hover:bg-[#3b4d54] text-white text-lg font-bold transition-all w-full sm:w-auto">
                  Skip Onboarding
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
}