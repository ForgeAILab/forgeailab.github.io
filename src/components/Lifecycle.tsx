import { useEffect, useState } from 'react'

const STAGES = [
  { id: 'todo',        label: 'Todo',        hint: 'Queued' },
  { id: 'in_progress', label: 'In progress', hint: 'Agent claimed' },
  { id: 'review',      label: 'Review',      hint: 'CI gate' },
  { id: 'merging',     label: 'Merging',     hint: 'Auto-merge' },
  { id: 'done',        label: 'Done',        hint: 'Worktree cleaned' },
] as const

type TaskCard = {
  id: string
  agent: string
  agentColor: string
  title: string
  /** offset applied to global tick to stagger flow */
  phase: number
}

const TASKS: TaskCard[] = [
  { id: 'T-104', agent: 'claude-code', agentColor: '#D97757', title: 'fix login session expiry', phase: 0 },
  { id: 'T-105', agent: 'codex',       agentColor: '#10A37F', title: 'add /api/v1/teams endpoint', phase: 2 },
  { id: 'T-106', agent: 'gemini',      agentColor: '#4285F4', title: 'refactor task service', phase: 4 },
  { id: 'T-107', agent: 'opencode',    agentColor: '#A78BFA', title: 'flake fix in happy_path', phase: 1 },
]

const CYCLE_MS = 2200

export default function Lifecycle() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), CYCLE_MS)
    return () => clearInterval(i)
  }, [])

  return (
    <section id="lifecycle" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-flame-400">
            Task pipeline
          </p>
          <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            One pipeline. Any agent you pick.
          </h2>
          <p className="mt-4 text-balance text-base leading-relaxed text-zinc-400 sm:text-lg">
            Each task runs through the same stages no matter which agent
            handles it — isolated worktree, CI gate, review, then merge. REST,
            MCP, and the web UI all drive the same pipeline.
          </p>
        </div>

        {/* Pipeline visualization */}
        <div className="relative mt-16 overflow-hidden rounded-3xl border border-white/5 bg-ink-2/60 p-6 backdrop-blur sm:p-10">
          {/* Halo */}
          <div
            className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-72 w-[40rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,107,26,0.5), transparent 70%)' }}
            aria-hidden
          />

          {/* Stage headers */}
          <div className="relative grid grid-cols-5 gap-2 sm:gap-6">
            {STAGES.map((s, i) => (
              <div key={s.id} className="text-center">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-ink-3 px-2.5 py-1 sm:px-3">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      i === STAGES.length - 1 ? 'bg-emerald-400' : 'bg-flame-500'
                    }`}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-200 sm:text-[11px]">
                    {s.label}
                  </span>
                </div>
                <p className="mt-2 hidden text-[11px] text-zinc-500 sm:block">{s.hint}</p>
              </div>
            ))}
          </div>

          {/* Connecting rail with traveling glow */}
          <div className="relative mt-8 sm:mt-10">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            {/* milestone dots between columns */}
            <div className="absolute inset-x-0 top-1/2 grid grid-cols-5 -translate-y-1/2">
              {STAGES.map((_, i) => (
                <div key={i} className="flex justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                </div>
              ))}
            </div>

            {/* Lanes */}
            <div className="relative space-y-4 py-3">
              {TASKS.map((task) => {
                const stage = (tick + task.phase) % STAGES.length
                return <Lane key={task.id} task={task} stage={stage} />
              })}
            </div>
          </div>

          {/* Footnotes */}
          <div className="mt-10 grid grid-cols-1 gap-3 border-t border-white/5 pt-6 text-xs text-zinc-400 sm:grid-cols-3">
            <Footnote
              tag="WORKTREE"
              text="A task gets its own git worktree when claimed, then cleans up when done."
            />
            <Footnote
              tag="GATE"
              text="Required CI steps run inside the worktree. Failures stop review from moving to merge."
            />
            <Footnote
              tag="EVENTS"
              text="Every transition streams as an event over /api/v1/events."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function Lane({ task, stage }: { task: TaskCard; stage: number }) {
  // Position each card so its CENTER lands on the center of the column.
  // With 5 columns, column centers sit at 10%, 30%, 50%, 70%, 90%.
  const centers = [10, 30, 50, 70, 90]
  const leftPct = centers[stage]

  const isDone = stage === STAGES.length - 1
  const isReview = stage === 2
  const isMerging = stage === 3

  return (
    <div className="relative h-14">
      {/* progress bar fill behind the card up to its current stage */}
      <div
        className="absolute left-0 top-1/2 h-px -translate-y-1/2 rounded-full bg-gradient-to-r from-flame-500/0 via-flame-500 to-flame-500/0 transition-all duration-700 ease-out"
        style={{ width: `${leftPct}%` }}
      />

      {/* the task card */}
      <div
        className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
        style={{ left: `${leftPct}%`, transform: 'translate(-50%, -50%)' }}
      >
        <div
          className={`group flex w-[200px] items-center gap-2.5 rounded-xl border bg-ink-3/90 px-3 py-2 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] backdrop-blur sm:w-[220px] ${
            isDone
              ? 'border-emerald-500/30 ring-1 ring-emerald-500/20'
              : isReview
              ? 'border-amber-500/30 ring-1 ring-amber-500/20'
              : isMerging
              ? 'border-flame-500/40 ring-1 ring-flame-500/30'
              : 'border-white/10'
          }`}
        >
          <span
            className="h-6 w-6 shrink-0 rounded-md ring-1 ring-white/10"
            style={{ background: task.agentColor }}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                {task.id}
              </span>
              {isDone && <span className="text-[10px] text-emerald-400">✓</span>}
              {isReview && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                </span>
              )}
              {isMerging && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame-500 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-flame-500" />
                </span>
              )}
            </div>
            <p className="truncate text-[11px] font-medium text-zinc-200">{task.title}</p>
          </div>
        </div>
        <p className="mt-1.5 text-center font-mono text-[10px] text-zinc-500">
          {task.agent}
        </p>
      </div>
    </div>
  )
}

function Footnote({ tag, text }: { tag: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 rounded border border-flame-500/20 bg-flame-500/5 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-flame-300">
        {tag}
      </span>
      <p className="leading-relaxed">{text}</p>
    </div>
  )
}
