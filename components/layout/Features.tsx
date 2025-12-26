export const Features = () => {
    return (
        <section className="w-full bg-white dark:bg-[#111618] py-24 border-t border-gray-100 dark:border-[#1c2427]">
            <div className="layout-container flex justify-center px-6">
            <div className="max-w-[1024px] w-full">
                <div className="flex flex-col gap-4 mb-16">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight dark:text-white max-w-[720px]">
                    Create Your Cocoon
                </h2>
                <p className="text-lg md:text-xl text-gray-600 dark:text-[#9db2b9] max-w-[600px] leading-relaxed">
                    Designed for flow, built for peace of mind. Every feature is crafted to help you detach and focus.
                </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Feature 1 - Layer Sounds */}
                <div className="group flex flex-col p-8 rounded-2xl bg-gray-50 dark:bg-[#1c2427] border border-gray-100 dark:border-[#3b4d54] hover:border-primary/50 transition-all hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                    <div className="mb-6 w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-[32px]">layers</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 dark:text-white">Layer Sounds</h3>
                    <p className="text-gray-500 dark:text-[#9db2b9] leading-relaxed">
                    Combine rain, white noise, and lo-fi beats to build your perfect soundscape. Adjust volume for each layer independently.
                    </p>
                </div>

                {/* Feature 2 - Discover Moods */}
                <div className="group flex flex-col p-8 rounded-2xl bg-gray-50 dark:bg-[#1c2427] border border-gray-100 dark:border-[#3b4d54] hover:border-primary/50 transition-all hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                    <div className="mb-6 w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-[32px]">explore</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 dark:text-white">Discover Moods</h3>
                    <p className="text-gray-500 dark:text-[#9db2b9] leading-relaxed">
                    Explore a curated library of ambient textures designed to enhance deep work, reading, or meditation.
                    </p>
                </div>

                {/* Feature 3 - Save Your Mixes */}
                <div className="group flex flex-col p-8 rounded-2xl bg-gray-50 dark:bg-[#1c2427] border border-gray-100 dark:border-[#3b4d54] hover:border-primary/50 transition-all hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                    <div className="mb-6 w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-[32px]">bookmark</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 dark:text-white">Save Your Mixes</h3>
                    <p className="text-gray-500 dark:text-[#9db2b9] leading-relaxed">
                    Bookmark your favorite frequency combinations for instant access next time you enter the zone.
                    </p>
                </div>
                </div>
            </div>
            </div>
        </section>
    )
}