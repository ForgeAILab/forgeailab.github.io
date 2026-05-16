import { useEffect, useState } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/5 bg-ink/70 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="" className="h-7 w-7" />
          <span className="text-[17px] font-medium tracking-tight">forge</span>
          <span className="ml-2 hidden rounded-full border border-flame-500/30 bg-flame-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-flame-300 sm:inline-block">
            Public Beta
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          <a href="#features" className="transition hover:text-white">Features</a>
          <a href="#lifecycle" className="transition hover:text-white">Lifecycle</a>
          <a href="#quickstart" className="transition hover:text-white">Quickstart</a>
          <a
            href="https://github.com/mai1015/forge/tree/main/docs"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            Docs
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/mai1015/forge"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/10 sm:flex"
          >
            <GithubIcon />
            <span>Star on GitHub</span>
          </a>
          <a
            href="#quickstart"
            className="rounded-full bg-flame-500 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,107,26,0.6)] transition hover:bg-flame-400"
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  )
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0016 8c0-4.42-3.58-8-8-8z"/>
    </svg>
  )
}
