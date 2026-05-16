import { useState } from 'react'

type Tab = {
  id: string
  label: string
  code: string
  hint?: string
}

const INSTALL_TABS: Tab[] = [
  {
    id: 'brew',
    label: 'Homebrew',
    code: `# macOS / Linux
brew install forgeailab/tap/forge

# Start the server (binds 127.0.0.1:8080)
forge --demo`,
  },
  {
    id: 'curl',
    label: 'curl',
    code: `curl -fsSL https://raw.githubusercontent.com/mai1015/forge/main/install.sh | bash
forge --demo`,
  },
  {
    id: 'cargo',
    label: 'From source',
    code: `git clone https://github.com/mai1015/forge.git
cd forge && cargo run -p forge-cli -- --demo`,
  },
  {
    id: 'docker',
    label: 'Docker',
    code: `docker compose up -d
# Forge available at http://localhost:8080`,
  },
]

const MCP_TABS: Tab[] = [
  {
    id: 'claude',
    label: 'Claude Code',
    hint: '~/.claude.json or project .mcp.json',
    code: `{
  "mcpServers": {
    "forge": {
      "type": "http",
      "url": "http://127.0.0.1:8080/mcp"
    }
  }
}`,
  },
  {
    id: 'codex',
    label: 'Codex',
    hint: '~/.codex/config.toml',
    code: `[mcp_servers.forge]
type = "http"
url  = "http://127.0.0.1:8080/mcp"`,
  },
  {
    id: 'cursor',
    label: 'Cursor',
    hint: '~/.cursor/mcp.json',
    code: `{
  "mcpServers": {
    "forge": {
      "url": "http://127.0.0.1:8080/mcp"
    }
  }
}`,
  },
  {
    id: 'other',
    label: 'Any MCP client',
    hint: 'Endpoint',
    code: `POST http://127.0.0.1:8080/mcp
Content-Type: application/json
(JSON-RPC 2.0 — disable with \`forge --no-mcp\`)`,
  },
]

const MCP_TOOLS = [
  'forge_create_task',
  'forge_list_tasks',
  'forge_get_task',
  'forge_assign_agent',
  'forge_cancel_task',
  'forge_get_task_diff',
  'forge_list_executions',
]

export default function Quickstart() {
  const [installTab, setInstallTab] = useState(INSTALL_TABS[0].id)
  const [mcpTab, setMcpTab] = useState(MCP_TABS[0].id)
  const install = INSTALL_TABS.find((t) => t.id === installTab) ?? INSTALL_TABS[0]
  const mcp = MCP_TABS.find((t) => t.id === mcpTab) ?? MCP_TABS[0]

  return (
    <section id="quickstart" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-flame-400">
            5-minute quickstart
          </p>
          <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Install, plug it in, ship work by talking.
          </h2>
          <p className="mt-4 text-balance text-base leading-relaxed text-zinc-400 sm:text-lg">
            Forge speaks <span className="text-flame-200">MCP</span>. Wire it into your
            agent of choice and your existing chat workflow becomes a task pipeline.
          </p>
        </div>

        {/* Step 01 — Install (compact, full-width) */}
        <div className="mt-14">
          <SectionHeader step="01" title="Install Forge" />
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-ink-2/80 shadow-xl">
            <div className="flex flex-wrap items-center gap-1 border-b border-white/5 bg-ink-3/60 px-2 py-1.5">
              {INSTALL_TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setInstallTab(t.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    t.id === installTab
                      ? 'bg-flame-500/15 text-flame-200'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <CodeBlock code={install.code} />
          </div>
        </div>

        {/* Steps 02 + 03 side by side */}
        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {/* Step 02 — MCP config */}
          <div className="lg:col-span-2">
            <SectionHeader step="02" title="Add Forge to your agent" />
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-ink-2/80 shadow-xl">
              <div className="flex flex-wrap items-center gap-1 border-b border-white/5 bg-ink-3/60 px-2 py-1.5">
                {MCP_TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setMcpTab(t.id)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                      t.id === mcpTab
                        ? 'bg-flame-500/15 text-flame-200'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              {mcp.hint && (
                <div className="border-b border-white/5 bg-ink-3/30 px-4 py-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    {mcp.hint}
                  </span>
                </div>
              )}
              <CodeBlock code={mcp.code} lang={mcpTab === 'codex' ? 'toml' : 'json'} />
            </div>

            <div className="mt-6">
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">
                Tools your agent will see
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {MCP_TOOLS.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-zinc-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Step 03 — Chat demo */}
          <div className="lg:col-span-3">
            <SectionHeader step="03" title="Talk to your agent" />
            <ChatDemo />
            <p className="mt-5 text-sm text-zinc-500">
              Watch progress in the web UI at{' '}
              <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[12.5px] text-flame-200">
                http://localhost:8080
              </code>{' '}
              — every state change streams over SSE.
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

/* ---------- chat demo ---------- */

type ChatMsg =
  | { kind: 'user'; text: string }
  | {
      kind: 'agent'
      text: string
      tool?: { name: string; args: string; result: string }
    }

const CHAT: ChatMsg[] = [
  {
    kind: 'user',
    text:
      'Create a task to fix the session-expiry bug in /api/v1/auth and have codex pick it up.',
  },
  {
    kind: 'agent',
    text:
      'On it. Filing the task with a CI gate on `cargo test -p auth`, then claiming it for the codex agent.',
    tool: {
      name: 'forge_create_task',
      args: `{
  "project_id": "demo",
  "title": "fix session expiry",
  "description": "session cookie expires too early under load",
  "review_config": { "ci_steps": ["cargo test -p auth"] }
}`,
      result: `{ "id": "T-204", "status": "todo", "version": 1 }`,
    },
  },
  {
    kind: 'agent',
    text: 'Task T-204 is in_progress under codex. I\'ll watch the review gate.',
    tool: {
      name: 'forge_assign_agent',
      args: `{ "task_id": "T-204", "agent_id": "codex-prod" }`,
      result: `{ "task_id": "T-204", "status": "in_progress", "worktree": ".forge/T-204" }`,
    },
  },
  {
    kind: 'user',
    text: 'Show me the diff once review passes.',
  },
  {
    kind: 'agent',
    text:
      'Review passed (3/3 CI steps green). Here is the patch — 4 files, +38/-12. Ready to merge?',
    tool: {
      name: 'forge_get_task_diff',
      args: `{ "task_id": "T-204" }`,
      result: `--- a/crates/api/src/auth.rs
+++ b/crates/api/src/auth.rs
@@ -42,7 +42,7 @@
-    cookie.set_max_age(Duration::minutes(15));
+    cookie.set_max_age(Duration::hours(8));
...`,
    },
  },
]

function ChatDemo() {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-ink-2/80 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/5 bg-ink-3/60 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
            chat · MCP connected to forge
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          127.0.0.1:8080/mcp
        </span>
      </div>

      <div className="max-h-[36rem] space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
        {CHAT.map((m, i) =>
          m.kind === 'user' ? <UserMsg key={i} text={m.text} /> : <AgentMsg key={i} msg={m} />,
        )}
      </div>
    </div>
  )
}

function UserMsg({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm border border-flame-500/25 bg-flame-500/10 px-4 py-2.5 text-sm leading-relaxed text-zinc-100">
        {text}
      </div>
    </div>
  )
}

function AgentMsg({ msg }: { msg: Extract<ChatMsg, { kind: 'agent' }> }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-ink-3">
        <span className="text-[11px] font-semibold text-flame-300">AI</span>
      </span>
      <div className="min-w-0 flex-1 space-y-2.5">
        <p className="text-sm leading-relaxed text-zinc-200">{msg.text}</p>
        {msg.tool && <ToolCall name={msg.tool.name} args={msg.tool.args} result={msg.tool.result} />}
      </div>
    </div>
  )
}

function ToolCall({ name, args, result }: { name: string; args: string; result: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
      <div className="flex items-center justify-between border-b border-white/5 bg-flame-500/5 px-3 py-1.5">
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-flame-400">
            <path d="m8 6 6 6-6 6" />
          </svg>
          <span className="text-zinc-500">tool</span>
          <span className="text-flame-300">{name}</span>
        </div>
        <span className="rounded border border-emerald-500/20 bg-emerald-500/5 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-300">
          ok
        </span>
      </div>
      <div className="grid grid-cols-1 divide-y divide-white/5 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <pre className="overflow-x-auto px-3 py-2.5 text-[11.5px] leading-relaxed">
          <span className="mb-1 block font-mono text-[9px] uppercase tracking-wider text-zinc-500">
            args
          </span>
          <code className="font-mono text-zinc-300">{highlightJsonish(args)}</code>
        </pre>
        <pre className="overflow-x-auto px-3 py-2.5 text-[11.5px] leading-relaxed">
          <span className="mb-1 block font-mono text-[9px] uppercase tracking-wider text-zinc-500">
            result
          </span>
          <code className="font-mono text-zinc-300">{highlightResult(result)}</code>
        </pre>
      </div>
    </div>
  )
}

/* ---------- code block ---------- */

function CodeBlock({ code, lang = 'shell' }: { code: string; lang?: 'shell' | 'json' | 'toml' }) {
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
      <pre className="overflow-x-auto px-5 py-5 text-[12.5px] leading-relaxed text-zinc-200">
        <code className="font-mono">{highlight(code, lang)}</code>
      </pre>
    </div>
  )
}

function highlight(code: string, lang: 'shell' | 'json' | 'toml'): React.ReactNode {
  return code.split('\n').map((line, i) => (
    <span key={i}>
      {highlightLine(line, lang)}
      {'\n'}
    </span>
  ))
}

function highlightLine(line: string, lang: 'shell' | 'json' | 'toml'): React.ReactNode {
  if (line.trim().startsWith('#') || line.trim().startsWith('//')) {
    return <span className="text-zinc-500">{line}</span>
  }
  if (lang === 'shell') {
    const cmdRe = /^(\s*)(curl|brew|forge-ctl|forge|cd|git|cargo|docker|jq|open)\b/
    const m = line.match(cmdRe)
    const tokens: React.ReactNode[] = []
    let remaining = line
    if (m) {
      tokens.push(<span key="ws">{m[1]}</span>)
      tokens.push(<span key="cmd" className="text-flame-300">{m[2]}</span>)
      remaining = remaining.slice(m[0].length)
    }
    const strSplit = remaining.split(/('[^']*'|"[^"]*")/g)
    strSplit.forEach((s, j) => {
      if (s.startsWith("'") || s.startsWith('"')) {
        tokens.push(<span key={`s${j}`} className="text-emerald-300/80">{s}</span>)
      } else {
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
    return <>{tokens}</>
  }
  if (lang === 'json') {
    return highlightJsonLine(line)
  }
  // toml
  return highlightTomlLine(line)
}

function highlightJsonLine(line: string): React.ReactNode {
  const tokens: React.ReactNode[] = []
  const re = /("(?:[^"\\]|\\.)*"\s*:?)|("(?:[^"\\]|\\.)*")|(\b\d+\b)|(true|false|null)/g
  let last = 0
  let m: RegExpExecArray | null
  let idx = 0
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) tokens.push(<span key={`r${idx++}`}>{line.slice(last, m.index)}</span>)
    const tok = m[0]
    if (m[1]) {
      tokens.push(<span key={`k${idx++}`} className="text-sky-300/90">{tok}</span>)
    } else if (m[2]) {
      tokens.push(<span key={`s${idx++}`} className="text-emerald-300/85">{tok}</span>)
    } else if (m[3]) {
      tokens.push(<span key={`n${idx++}`} className="text-flame-300">{tok}</span>)
    } else {
      tokens.push(<span key={`b${idx++}`} className="text-flame-300">{tok}</span>)
    }
    last = m.index + tok.length
  }
  if (last < line.length) tokens.push(<span key={`tail`}>{line.slice(last)}</span>)
  return <>{tokens}</>
}

function highlightTomlLine(line: string): React.ReactNode {
  if (/^\s*\[.*\]\s*$/.test(line)) {
    return <span className="text-sky-300/90">{line}</span>
  }
  const eq = line.indexOf('=')
  if (eq > 0) {
    return (
      <>
        <span className="text-zinc-200">{line.slice(0, eq)}</span>
        <span className="text-zinc-500">=</span>
        <span className="text-emerald-300/85">{line.slice(eq + 1)}</span>
      </>
    )
  }
  return <>{line}</>
}

function highlightJsonish(code: string): React.ReactNode {
  return code.split('\n').map((line, i) => (
    <span key={i}>
      {highlightJsonLine(line)}
      {'\n'}
    </span>
  ))
}

function highlightResult(code: string): React.ReactNode {
  // Detect diff blocks
  if (/^[-+@]/m.test(code)) {
    return code.split('\n').map((line, i) => {
      let cls = 'text-zinc-400'
      if (line.startsWith('+++') || line.startsWith('---')) cls = 'text-zinc-500'
      else if (line.startsWith('+')) cls = 'text-emerald-300'
      else if (line.startsWith('-')) cls = 'text-rose-300'
      else if (line.startsWith('@@')) cls = 'text-sky-300'
      return (
        <span key={i} className={cls}>
          {line}
          {'\n'}
        </span>
      )
    })
  }
  return highlightJsonish(code)
}
