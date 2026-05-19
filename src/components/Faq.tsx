type QA = {
  q: string
  a: React.ReactNode
}

const ITEMS: QA[] = [
  {
    q: 'What is Forge?',
    a: (
      <>
        Forge is a self-hosted workflow engine for coding agents. It handles
        coding agent orchestration end-to-end: tasks, isolated git worktrees,
        CI gates, and a review and merge workflow, all from a single local
        binary.
      </>
    ),
  },
  {
    q: 'Can I use different agents for different work?',
    a: (
      <>
        Yes — that's the point. Forge lets you pick which coding agent runs
        each task, so you can match the agent to the job: one for UI work,
        another for refactors, a lighter one for routine changes.
      </>
    ),
  },
  {
    q: 'Which coding agents work with Forge?',
    a: (
      <>
        Forge ships adapters for Claude Code, Codex, Gemini, opencode, and a
        generic shell executor. More can be added with a small adapter.
      </>
    ),
  },
  {
    q: 'How do isolated git worktrees work?',
    a: (
      <>
        Every task gets its own git worktree when an agent claims it. Path
        guards keep parallel work clean, and the worktree is removed
        automatically when the task is done or cancelled.
      </>
    ),
  },
  {
    q: 'Is Forge API-first?',
    a: (
      <>
        Yes. Forge is an API-first developer tool: a REST API, MCP JSON-RPC,
        the forge-ctl CLI, and the web UI all drive the same task pipeline, so
        you can script the full review and merge workflow.
      </>
    ),
  },
  {
    q: 'Is Forge really self-hosted?',
    a: (
      <>
        Forge runs as one local Rust binary backed by SQLite. No accounts, no
        telemetry, no SaaS dependency. Your code never leaves your
        infrastructure.
      </>
    ),
  },
  {
    q: 'What license is Forge under?',
    a: <>Forge is MIT-licensed and developed in the open on GitHub.</>,
  },
]

export default function Faq() {
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-flame-400">
            FAQ
          </p>
          <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Questions, answered.
          </h2>
        </div>

        <div className="mt-14 divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-white/[0.01]">
          {ITEMS.map((item) => (
            <details
              key={item.q}
              className="group px-6 py-5 open:bg-white/[0.02] sm:px-8"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left">
                <h3 className="text-base font-medium tracking-tight text-zinc-100 sm:text-lg">
                  {item.q}
                </h3>
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-ink-3 text-zinc-400 transition group-open:rotate-45 group-open:border-flame-500/30 group-open:text-flame-300"
                  aria-hidden
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
