export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            &copy; {currentYear} Focus Flow. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-text-secondary hover:text-primary transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="text-sm text-text-secondary hover:text-primary transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-text-secondary hover:text-primary transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
