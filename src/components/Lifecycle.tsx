import { useCallback, useEffect, useRef, useState } from 'react'

const STAGES = [
  { id: 'todo',        label: 'Todo',        hint: 'Queued' },
  { id: 'in_progress', label: 'In progress', hint: 'Coding agent' },
  { id: 'review',      label: 'Review',      hintAuto: 'Review agent', hintManual: 'You decide' },
  { id: 'merging',     label: 'Merging',     hint: 'Auto-merge' },
  { id: 'done',        label: 'Done',        hint: 'Worktree cleaned' },
] as const

type AgentKey = 'claude' | 'codex' | 'gemini' | 'opencode'

const AGENTS: Record<AgentKey, { name: string; color: string }> = {
  claude:   { name: 'claude-code', color: '#D97757' },
  codex:    { name: 'codex',       color: '#10A37F' },
  gemini:   { name: 'gemini',      color: '#4285F4' },
  opencode: { name: 'opencode',    color: '#A78BFA' },
}

type TaskCard = {
  id: string
  kind: string
  title: string
  startDelay: number
  /** Auto-mode path: sequence of stage indices to walk. */
  autoPath: number[]
  assignment: {
    in_progress: AgentKey
    review: AgentKey
  }
}

// Stage indices: 0=todo, 1=in_progress, 2=review, 3=merging, 4=done
const LINEAR_PATH = [0, 1, 2, 3, 4]
const REJECTED_PATH = [0, 1, 2, 1, 2, 3, 4]

const TASKS: TaskCard[] = [
  {
    id: 'T-104', kind: 'ui', title: 'fix login session expiry', startDelay: 0,
    autoPath: LINEAR_PATH,
    assignment: { in_progress: 'claude', review: 'codex' },
  },
  {
    id: 'T-105', kind: 'api', title: 'add /api/v1/teams endpoint', startDelay: 2,
    autoPath: LINEAR_PATH,
    assignment: { in_progress: 'codex', review: 'claude' },
  },
  {
    id: 'T-106', kind: 'refactor', title: 'refactor task service', startDelay: 1,
    autoPath: REJECTED_PATH,
    assignment: { in_progress: 'gemini', review: 'claude' },
  },
  {
    id: 'T-107', kind: 'flake', title: 'flake fix in happy_path', startDelay: 3,
    autoPath: LINEAR_PATH,
    assignment: { in_progress: 'opencode', review: 'opencode' },
  },
]

const CYCLE_MS = 1400
const MAX_STAGE = STAGES.length - 1

type Mode = 'auto' | 'manual'

type LaneState = {
  stage: number
  remaining: number[]
  attempt: number
  justRejected: boolean
  waiting: boolean
  delayRemaining: number
}

function initLane(task: TaskCard, mode: Mode): LaneState {
  if (mode === 'auto') {
    return {
      stage: task.autoPath[0],
      remaining: task.autoPath.slice(1),
      attempt: 1,
      justRejected: false,
      waiting: false,
      delayRemaining: task.startDelay,
    }
  }
  // manual: walk to review, then wait
  return {
    stage: 0,
    remaining: [1, 2],
    attempt: 1,
    justRejected: false,
    waiting: false,
    delayRemaining: task.startDelay,
  }
}

function initAll(mode: Mode): Record<string, LaneState> {
  return Object.fromEntries(TASKS.map((t) => [t.id, initLane(t, mode)]))
}

function advance(state: LaneState, mode: Mode): LaneState {
  if (state.delayRemaining > 0) {
    return { ...state, delayRemaining: state.delayRemaining - 1, justRejected: false }
  }
  if (state.waiting) return state
  if (state.remaining.length === 0) {
    if (mode === 'manual' && state.stage === 2) {
      return { ...state, waiting: true, justRejected: false }
    }
    return { ...state, justRejected: false }
  }
  const [next, ...rest] = state.remaining
  return {
    ...state,
    stage: next,
    remaining: rest,
    justRejected: next < state.stage,
  }
}

function allSettled(lanes: Record<string, LaneState>, mode: Mode): boolean {
  return Object.values(lanes).every(
    (l) =>
      l.delayRemaining === 0 &&
      (l.remaining.length === 0 && (l.stage === MAX_STAGE || (mode === 'manual' && l.waiting))),
  )
}

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView] as const
}

export default function Lifecycle() {
  const [mode, setMode] = useState<Mode>('auto')
  const [lanes, setLanes] = useState<Record<string, LaneState>>(() => initAll('auto'))
  const [sectionRef, inView] = useInView<HTMLDivElement>(0.25)
  const hasPlayedRef = useRef(false)

  // Reset when entering viewport, or when switching mode
  useEffect(() => {
    if (inView) {
      setLanes(initAll(mode))
      hasPlayedRef.current = true
    }
  }, [inView, mode])

  const settled = allSettled(lanes, mode)

  // Tick
  useEffect(() => {
    if (!inView || settled) return
    const id = setTimeout(() => {
      setLanes((prev) => {
        const next: Record<string, LaneState> = {}
        for (const [id, lane] of Object.entries(prev)) {
          next[id] = advance(lane, mode)
        }
        return next
      })
    }, CYCLE_MS)
    return () => clearTimeout(id)
  }, [inView, lanes, mode, settled])

  const replay = useCallback(() => setLanes(initAll(mode)), [mode])

  const approve = useCallback((taskId: string) => {
    setLanes((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], remaining: [3, 4], waiting: false, justRejected: false },
    }))
  }, [])

  const reject = useCallback((taskId: string) => {
    setLanes((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        remaining: [1, 2],
        attempt: prev[taskId].attempt + 1,
        waiting: false,
        justRejected: false,
      },
    }))
  }, [])

  return (
    <section id="lifecycle" ref={sectionRef} className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-flame-400">
            Task pipeline
          </p>
          <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            One pipeline. Any agent you pick.
          </h2>
          <p className="mt-4 text-balance text-base leading-relaxed text-zinc-400 sm:text-lg">
            Assign a different agent to each stage of a task — one writes the
            code, another reviews it. Or keep a human in the loop and approve
            the review yourself. Forge keeps every task in an isolated worktree
            behind your CI gate.
          </p>
        </div>

        {/* Tab toggle */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full border border-white/10 bg-ink-3/80 p-1 backdrop-blur">
            <TabButton active={mode === 'auto'} onClick={() => setMode('auto')}>
              Auto review
            </TabButton>
            <TabButton active={mode === 'manual'} onClick={() => setMode('manual')}>
              Human review gate
            </TabButton>
          </div>
        </div>

        {/* Pipeline visualization */}
        <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/5 bg-ink-2/60 p-6 backdrop-blur sm:p-10">
          {/* Halo */}
          <div
            className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-72 w-[40rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(255,107,26,0.5), transparent 70%)' }}
            aria-hidden
          />

          {/* Replay button */}
          <button
            onClick={replay}
            disabled={!settled}
            aria-label="Replay pipeline animation"
            title="Replay"
            className={`absolute right-4 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur transition sm:right-6 sm:top-6 ${
              settled
                ? 'border-flame-500/30 bg-flame-500/10 text-flame-200 hover:border-flame-500/50 hover:bg-flame-500/15'
                : 'pointer-events-none border-white/5 bg-white/[0.02] text-zinc-600 opacity-0'
            }`}
          >
            <ReplayIcon />
          </button>

          {/* Stage headers */}
          <div className="relative grid grid-cols-5 gap-2 sm:gap-6">
            {STAGES.map((s, i) => {
              const hint =
                'hint' in s
                  ? s.hint
                  : mode === 'manual'
                  ? s.hintManual
                  : s.hintAuto
              const isReviewCol = i === 2
              return (
                <div key={s.id} className="text-center">
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-full border bg-ink-3 px-2.5 py-1 sm:px-3 ${
                      isReviewCol && mode === 'manual'
                        ? 'border-amber-500/40'
                        : 'border-white/10'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        i === STAGES.length - 1
                          ? 'bg-emerald-400'
                          : isReviewCol && mode === 'manual'
                          ? 'bg-amber-400'
                          : 'bg-flame-500'
                      }`}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-200 sm:text-[11px]">
                      {s.label}
                    </span>
                  </div>
                  <p
                    className={`mt-2 hidden text-[11px] sm:block ${
                      isReviewCol && mode === 'manual' ? 'text-amber-300/80' : 'text-zinc-500'
                    }`}
                  >
                    {hint}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Connecting rail */}
          <div className="relative mt-8 sm:mt-10">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute inset-x-0 top-1/2 grid grid-cols-5 -translate-y-1/2">
              {STAGES.map((_, i) => (
                <div key={i} className="flex justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                </div>
              ))}
            </div>

            {/* Lanes */}
            <div className="relative space-y-5 py-3">
              {TASKS.map((task) => {
                const lane = lanes[task.id]
                return (
                  <Lane
                    key={task.id}
                    task={task}
                    lane={lane}
                    mode={mode}
                    onApprove={() => approve(task.id)}
                    onReject={() => reject(task.id)}
                  />
                )
              })}
            </div>
          </div>

          {/* Footnotes */}
          <div className="mt-10 grid grid-cols-1 gap-3 border-t border-white/5 pt-6 text-xs text-zinc-400 sm:grid-cols-3">
            <Footnote
              tag="ROUTING"
              text="Each stage runs the agent you pick — Codex codes, Claude reviews, or any other combo."
            />
            <Footnote
              tag="WORKTREE"
              text="A task gets its own git worktree when claimed, then cleans up when done."
            />
            <Footnote
              tag="GATE"
              text={
                mode === 'manual'
                  ? 'Reviews land in your queue. Approve to merge, reject to send the task back to coding.'
                  : 'Review or CI can reject — the task bounces back to coding for changes before it can merge.'
              }
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-full px-4 py-1.5 text-xs font-medium transition sm:text-[13px] ${
        active
          ? 'bg-flame-500/15 text-flame-200 shadow-[inset_0_0_0_1px_rgba(255,107,26,0.3)]'
          : 'text-zinc-400 hover:text-zinc-100'
      }`}
    >
      {children}
    </button>
  )
}

type Slot =
  | { kind: 'unassigned' }
  | { kind: 'agent'; agent: { name: string; color: string } }
  | { kind: 'auto' }
  | { kind: 'done'; agent: { name: string; color: string } }

function slotFor(task: TaskCard, stage: number): Slot {
  if (stage === 0) return { kind: 'unassigned' }
  if (stage === 1) return { kind: 'agent', agent: AGENTS[task.assignment.in_progress] }
  if (stage === 2) return { kind: 'agent', agent: AGENTS[task.assignment.review] }
  if (stage === 3) return { kind: 'auto' }
  return { kind: 'done', agent: AGENTS[task.assignment.review] }
}

function Lane({
  task,
  lane,
  mode,
  onApprove,
  onReject,
}: {
  task: TaskCard
  lane: LaneState
  mode: Mode
  onApprove: () => void
  onReject: () => void
}) {
  const centers = [10, 30, 50, 70, 90]
  const leftPct = centers[lane.stage]

  const slot = slotFor(task, lane.stage)
  const isReview = lane.stage === 2
  const isMerging = lane.stage === 3
  const isDone = lane.stage === MAX_STAGE
  const showRetry = lane.attempt > 1 && !isDone && !lane.justRejected
  const waitingForHuman = mode === 'manual' && lane.waiting

  return (
    <div className="relative h-16">
      <div
        className="absolute left-0 top-1/2 h-px -translate-y-1/2 rounded-full bg-gradient-to-r from-flame-500/0 via-flame-500 to-flame-500/0 transition-all duration-700 ease-out"
        style={{ width: `${leftPct}%` }}
      />

      <div
        className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
        style={{ left: `${leftPct}%`, transform: 'translate(-50%, -50%)' }}
      >
        <div
          className={`group flex w-[200px] items-center gap-2.5 rounded-xl border bg-ink-3/90 px-3 py-2 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] backdrop-blur sm:w-[220px] ${
            lane.justRejected
              ? 'border-rose-500/40 ring-1 ring-rose-500/30'
              : waitingForHuman
              ? 'border-amber-500/50 ring-1 ring-amber-500/30'
              : isDone
              ? 'border-emerald-500/30 ring-1 ring-emerald-500/20'
              : isReview
              ? 'border-amber-500/30 ring-1 ring-amber-500/20'
              : isMerging
              ? 'border-flame-500/40 ring-1 ring-flame-500/30'
              : 'border-white/10'
          }`}
        >
          <AgentSquare slot={slot} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                {task.id}
              </span>
              <span className="rounded-sm border border-flame-500/20 bg-flame-500/[0.06] px-1 py-px font-mono text-[9px] uppercase tracking-wider text-flame-300">
                {task.kind}
              </span>
              {lane.justRejected && (
                <span className="rounded-sm border border-rose-500/30 bg-rose-500/10 px-1 py-px font-mono text-[9px] uppercase tracking-wider text-rose-300">
                  rejected
                </span>
              )}
              {showRetry && (
                <span className="rounded-sm border border-rose-500/20 bg-rose-500/[0.06] px-1 py-px font-mono text-[9px] uppercase tracking-wider text-rose-300/90">
                  v{lane.attempt}
                </span>
              )}
              {isDone && <span className="text-[10px] text-emerald-400">✓</span>}
              {isReview && !waitingForHuman && (
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
        {waitingForHuman ? (
          <ReviewActions onApprove={onApprove} onReject={onReject} />
        ) : (
          <SlotLabel slot={slot} />
        )}
      </div>
    </div>
  )
}

function ReviewActions({
  onApprove,
  onReject,
}: {
  onApprove: () => void
  onReject: () => void
}) {
  return (
    <div className="mt-1.5 flex justify-center gap-1.5">
      <button
        onClick={onApprove}
        className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300 transition hover:border-emerald-500/50 hover:bg-emerald-500/15"
      >
        <CheckIcon size={9} />
        approve
      </button>
      <button
        onClick={onReject}
        className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-rose-300 transition hover:border-rose-500/50 hover:bg-rose-500/15"
      >
        <XIcon size={9} />
        reject
      </button>
    </div>
  )
}

function AgentSquare({ slot }: { slot: Slot }) {
  if (slot.kind === 'unassigned') {
    return (
      <span
        className="relative h-6 w-6 shrink-0 rounded-md ring-1 ring-white/10 transition-colors duration-500"
        style={{ background: 'rgba(255,255,255,0.05)' }}
        aria-hidden
      >
        <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] text-zinc-500">
          ?
        </span>
      </span>
    )
  }
  if (slot.kind === 'auto') {
    return (
      <span
        className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-flame-500/15 text-flame-300 ring-1 ring-flame-500/30 transition-colors duration-500"
        aria-hidden
      >
        <GearIcon />
      </span>
    )
  }
  if (slot.kind === 'done') {
    return (
      <span
        className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30 transition-colors duration-500"
        aria-hidden
      >
        <CheckIcon />
      </span>
    )
  }
  return (
    <span
      className="h-6 w-6 shrink-0 rounded-md ring-1 ring-white/10 transition-colors duration-500"
      style={{ background: slot.agent.color }}
      aria-hidden
    />
  )
}

function SlotLabel({ slot }: { slot: Slot }) {
  const cls = 'mt-1.5 text-center font-mono text-[10px] transition-colors duration-500'
  if (slot.kind === 'unassigned')
    return <p className={`${cls} text-zinc-600 italic`}>unassigned</p>
  if (slot.kind === 'auto')
    return <p className={`${cls} text-flame-300/80`}>auto-merge</p>
  if (slot.kind === 'done')
    return <p className={`${cls} text-emerald-300/80`}>merged</p>
  return <p className={`${cls} text-zinc-500`}>{slot.agent.name}</p>
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

function ReplayIcon() {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function CheckIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  )
}

function XIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}
