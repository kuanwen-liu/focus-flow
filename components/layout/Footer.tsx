export const Footer = () => {
  return (
    <footer className="w-full py-10 px-6 border-t border-gray-200 dark:border-[#283539] bg-background-light dark:bg-background">
      <div className="layout-container flex flex-col md:flex-row justify-between items-center max-w-[1280px] mx-auto gap-6">
        <div className="flex items-center gap-2 text-gray-900 dark:text-white">
          <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
          <span className="font-bold">Focus Mixer</span>
        </div>
        <div className="flex gap-8 text-sm text-gray-500 dark:text-[#9db2b9]">
          <a className="hover:text-primary transition-colors" href="#">
            About
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Sounds
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Privacy
          </a>
        </div>
        <p className="text-sm text-gray-400 dark:text-[#5e767e]">
          © {new Date().getFullYear()} Focus Mixer
        </p>
      </div>
    </footer>
  )
}
