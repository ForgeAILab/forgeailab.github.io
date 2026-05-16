export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/5 bg-ink-2/40">
      {/* Big call-to-action band */}
      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-50"
          style={{
            background:
              'radial-gradient(800px 300px at 50% 0%, rgba(255,107,26,0.25), transparent 70%)',
          }}
          aria-hidden
        />
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Give every agent a workflow.
          </h2>
          <p className="max-w-xl text-balance text-base text-zinc-400 sm:text-lg">
            Forge runs locally, ships as one binary, and is MIT-licensed. Start in
            five minutes and take one task from chat to merge.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#quickstart"
              className="inline-flex items-center gap-2 rounded-full bg-flame-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(255,107,26,0.7)] transition hover:bg-flame-400"
            >
              Install Forge
            </a>
            <a
              href="https://github.com/ForgeAILab/forge"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-zinc-200 backdrop-blur transition hover:border-white/20 hover:bg-white/5"
            >
              Star on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Link rows */}
      <div className="mx-auto max-w-6xl px-6 pb-12 pt-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="" className="h-6 w-6" />
              <span className="text-base font-medium tracking-tight">forge</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              Local-first workflow for coding agents. No accounts, no telemetry, no SaaS.
            </p>
          </div>

          <FooterCol title="Product">
            <FooterLink href="#features">Features</FooterLink>
            <FooterLink href="#lifecycle">Lifecycle</FooterLink>
            <FooterLink href="#quickstart">Quickstart</FooterLink>
            <FooterLink href="/docs/release-plan/">Roadmap</FooterLink>
          </FooterCol>

          <FooterCol title="Docs">
            <FooterLink href="/docs/getting-started/">Getting started</FooterLink>
            <FooterLink href="/docs/architecture/">Architecture</FooterLink>
            <FooterLink href="/docs/api/">API reference</FooterLink>
            <FooterLink href="/docs/cli/">forge-ctl CLI</FooterLink>
          </FooterCol>

          <FooterCol title="Community">
            <FooterLink href="https://github.com/ForgeAILab/forge">GitHub</FooterLink>
            <FooterLink href="https://github.com/ForgeAILab/forge/issues">Issues</FooterLink>
            <FooterLink href="https://github.com/ForgeAILab/forge/blob/main/CONTRIBUTING.md">Contributing</FooterLink>
            <FooterLink href="https://github.com/ForgeAILab/forge/blob/main/LICENSE">License (MIT)</FooterLink>
          </FooterCol>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Forge contributors.</p>
          <p className="font-mono">
            v0.1.x · public beta
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith('http')
  return (
    <li>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        className="text-zinc-400 transition hover:text-white"
      >
        {children}
      </a>
    </li>
  )
}
