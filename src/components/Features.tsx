type Feature = {
  title: string
  body: string
  icon: React.ReactNode
}

const features: Feature[] = [
  {
    title: 'Structured task lifecycle',
    body: 'Every task flows todo → in_progress → review → merging → done, with an audit log, cancellation paths, and optimistic concurrency.',
    icon: <FlowIcon />,
  },
  {
    title: 'Isolated git worktrees',
    body: 'Each task gets its own checkout with file-locking and path guards. Agents can\'t step on each other — and you can throw work away cleanly.',
    icon: <TreeIcon />,
  },
  {
    title: 'CI review gates',
    body: 'Declare ci_steps per task; the review runner blocks merge until they pass. Combine with auditor-style execution checks for human-in-the-loop.',
    icon: <ShieldIcon />,
  },
  {
    title: 'BYO agent',
    body: 'First-class adapters for Claude Code, Codex, Gemini, opencode, and a generic shell executor. Add your own with a tiny trait impl.',
    icon: <PlugIcon />,
  },
  {
    title: 'Four surfaces, one binary',
    body: 'REST API, MCP JSON-RPC, forge-ctl CLI, and a React web UI — all served from a single Rust binary bound to 127.0.0.1:8080.',
    icon: <StackIcon />,
  },
  {
    title: 'Local-first, MIT-licensed',
    body: 'SQLite + WAL, no accounts, no telemetry, no SaaS. Your code never leaves your machine. Fork it, ship it, sell it.',
    icon: <LockIcon />,
  },
]

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-flame-400">
            Why Forge
          </p>
          <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Most agents can edit files.{' '}
            <span className="text-zinc-400">Forge operates them safely.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-6 transition hover:border-white/10 hover:from-flame-500/[0.04]"
            >
              <div
                className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-flame-500/10 opacity-0 blur-3xl transition group-hover:opacity-100"
                aria-hidden
              />
              <div className="relative">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-ink-3 text-flame-400">
                  {f.icon}
                </div>
                <h3 className="mt-5 text-base font-semibold tracking-tight text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  )
}

function FlowIcon() {
  return (
    <Svg>
      <circle cx="5" cy="6" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="12" r="2" />
      <path d="M7 6h6a4 4 0 0 1 4 4v0M7 18h6a4 4 0 0 0 4-4v0" />
    </Svg>
  )
}
function TreeIcon() {
  return (
    <Svg>
      <circle cx="6" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="12" r="2" />
      <path d="M6 8v8M6 12h6a4 4 0 0 0 4-4" />
    </Svg>
  )
}
function ShieldIcon() {
  return (
    <Svg>
      <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  )
}
function PlugIcon() {
  return (
    <Svg>
      <path d="M9 2v6M15 2v6M7 8h10v3a5 5 0 0 1-5 5 5 5 0 0 1-5-5V8zM12 16v6" />
    </Svg>
  )
}
function StackIcon() {
  return (
    <Svg>
      <path d="m12 3 9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 18l9 5 9-5" />
    </Svg>
  )
}
function LockIcon() {
  return (
    <Svg>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </Svg>
  )
}
