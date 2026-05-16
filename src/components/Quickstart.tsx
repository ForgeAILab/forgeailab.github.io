import { useState } from 'react'

type Tab = {
  id: string
  label: string
  code: string
}

const INSTALL_TABS: Tab[] = [
  {
    id: 'brew',
    label: 'Homebrew',
    code: `# macOS / Linux
brew install forgeailab/tap/forge

# Start the server with seeded demo data
forge --demo

# Open the web UI
open http://localhost:8080`,
  },
  {
    id: 'curl',
    label: 'curl',
    code: `# One-line installer
curl -fsSL https://raw.githubusercontent.com/mai1015/forge/main/install.sh | bash

# Or grab a tarball from GitHub releases
# https://github.com/mai1015/forge/releases`,
  },
  {
    id: 'cargo',
    label: 'From source',
    code: `git clone https://github.com/mai1015/forge.git
cd forge
cargo run -p forge-cli -- --demo`,
  },
  {
    id: 'docker',
    label: 'Docker',
    code: `docker compose up -d
# Forge available at http://localhost:8080
# Data persists in the forge-data volume.`,
  },
]

const WALKTHROUGH = `# 1. Create a project + repo
PROJECT_ID=$(curl -sS -X POST :8080/api/v1/projects \\
  -H 'content-type: application/json' \\
  -d '{"name":"demo"}' | jq -r .id)

curl -sS -X POST :8080/api/v1/projects/$PROJECT_ID/repos \\
  -d '{"name":"my-repo","url":"/abs/path/to/repo","default_branch":"main"}'

# 2. Register a shell agent against the auto-detected daemon
DAEMON_ID=$(curl -sS :8080/api/v1/daemons | jq -r '.items[0].id')
AGENT_ID=$(curl -sS -X POST :8080/api/v1/agents \\
  -d "{\\"name\\":\\"demo\\",\\"executor_type\\":\\"shell\\",\\"daemon_id\\":\\"$DAEMON_ID\\"}" \\
  | jq -r .id)

# 3. Create a task with inline CI steps
TASK_ID=$(curl -sS -X POST :8080/api/v1/projects/$PROJECT_ID/tasks \\
  -d '{"title":"greet","description":"echo hi > greeting.txt && git add . && git commit -m hi",
       "review_config":{"ci_steps":["test -f greeting.txt"]}}' | jq -r .id)

# 4. Claim — the executor auto-dispatches
curl -sS -X POST :8080/api/v1/tasks/$TASK_ID/claim \\
  -d "{\\"agent_id\\":\\"$AGENT_ID\\"}"

# 5. Drive it through review → merging → done
curl -sS -X POST :8080/api/v1/tasks/$TASK_ID/transition -d '{"status":"review","version":2}'
curl -sS -X POST :8080/api/v1/tasks/$TASK_ID/transition -d '{"status":"merging","version":3}'`

export default function Quickstart() {
  const [tab, setTab] = useState(INSTALL_TABS[0].id)
  const active = INSTALL_TABS.find((t) => t.id === tab) ?? INSTALL_TABS[0]

  return (
    <section id="quickstart" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-flame-400">
            5-minute quickstart
          </p>
          <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Install, claim a task, watch it merge.
          </h2>
          <p className="mt-4 text-balance text-base leading-relaxed text-zinc-400 sm:text-lg">
            One binary. Binds <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[13px] text-flame-200">127.0.0.1:8080</code>{' '}
            by default. No accounts, no telemetry, no SaaS.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          {/* Install panel */}
          <div className="lg:col-span-2">
            <SectionHeader step="01" title="Install" />
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-ink-2/80 shadow-xl">
              <div className="flex flex-wrap items-center gap-1 border-b border-white/5 bg-ink-3/60 px-2 py-1.5">
                {INSTALL_TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                      t.id === tab
                        ? 'bg-flame-500/15 text-flame-200'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <CodeBlock code={active.code} />
            </div>

            <ul className="mt-6 space-y-3 text-sm text-zinc-400">
              <Bullet>Embedded daemon auto-detects Claude Code, Codex, opencode on <code className="font-mono text-flame-200">PATH</code>.</Bullet>
              <Bullet>SQLite + WAL — data lives at <code className="font-mono text-flame-200">~/.forge/forge.db</code>.</Bullet>
              <Bullet>Use <code className="font-mono text-flame-200">--demo</code> to seed a labelled task you can drive end-to-end.</Bullet>
            </ul>
          </div>

          {/* Walkthrough panel */}
          <div className="lg:col-span-3">
            <SectionHeader step="02" title="Drive a task end-to-end" />
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-ink-2/80 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/5 bg-ink-3/60 px-4 py-2.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  bash · localhost:8080
                </span>
                <a
                  href="https://github.com/mai1015/forge/blob/main/docs/getting-started.md#end-to-end-walkthrough"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[10px] uppercase tracking-wider text-flame-400 hover:text-flame-200"
                >
                  Full guide →
                </a>
              </div>
              <CodeBlock code={WALKTHROUGH} tall />
            </div>

            <p className="mt-6 text-sm text-zinc-500">
              Prefer a CLI? <code className="font-mono text-flame-200">forge-ctl run --project … --agent … --title "fix bug"</code> claims a task and follows the SSE stream until terminal state.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionHeader({ step, title }: { step: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="rounded-md border border-flame-500/30 bg-flame-500/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-flame-300">
        {step}
      </span>
      <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
    </div>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-1 shrink-0 text-flame-400">
        <path d="m5 12 5 5L20 7" />
      </svg>
      <span>{children}</span>
    </li>
  )
}

function CodeBlock({ code, tall = false }: { code: string; tall?: boolean }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="relative">
      <button
        onClick={copy}
        className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-ink-3/90 px-2 py-1 text-[11px] font-medium text-zinc-300 backdrop-blur transition hover:border-white/20 hover:bg-white/5"
        aria-label="Copy code"
      >
        {copied ? (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
              <path d="m5 12 5 5L20 7" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15V5a2 2 0 0 1 2-2h10" />
            </svg>
            Copy
          </>
        )}
      </button>
      <pre
        className={`overflow-x-auto px-5 py-5 text-[12.5px] leading-relaxed text-zinc-200 ${
          tall ? 'max-h-[28rem] overflow-y-auto' : ''
        }`}
      >
        <code className="font-mono">
          {highlight(code)}
        </code>
      </pre>
    </div>
  )
}

function highlight(code: string): React.ReactNode {
  // Light-touch shell-ish highlighter: comments, strings, common cmds.
  return code.split('\n').map((line, i) => {
    let parts: React.ReactNode[] = []
    if (line.trim().startsWith('#')) {
      parts = [<span key="c" className="text-zinc-500">{line}</span>]
    } else {
      let remaining = line
      const tokens: React.ReactNode[] = []
      const cmdRe = /^(\s*)(curl|brew|forge-ctl|forge|cd|git|cargo|docker|jq|open|echo|test|PROJECT_ID|DAEMON_ID|AGENT_ID|TASK_ID)\b/
      const m = remaining.match(cmdRe)
      if (m) {
        tokens.push(<span key="ws">{m[1]}</span>)
        tokens.push(<span key="cmd" className="text-flame-300">{m[2]}</span>)
        remaining = remaining.slice(m[0].length)
      }
      // strings
      const strSplit = remaining.split(/('[^']*'|"[^"]*")/g)
      strSplit.forEach((s, j) => {
        if (s.startsWith("'") || s.startsWith('"')) {
          tokens.push(<span key={`s${j}`} className="text-emerald-300/80">{s}</span>)
        } else {
          // flags
          const flagSplit = s.split(/(\s-{1,2}[\w-]+)/g)
          flagSplit.forEach((p, k) => {
            if (/^\s-{1,2}[\w-]+$/.test(p)) {
              tokens.push(<span key={`f${j}-${k}`} className="text-sky-300/80">{p}</span>)
            } else {
              tokens.push(<span key={`t${j}-${k}`}>{p}</span>)
            }
          })
        }
      })
      parts = tokens
    }
    return (
      <span key={i}>
        {parts}
        {'\n'}
      </span>
    )
  })
}
