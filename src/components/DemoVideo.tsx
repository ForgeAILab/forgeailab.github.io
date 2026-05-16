import { useEffect, useRef, useState } from 'react'

export default function DemoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hovering, setHovering] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)

  const active = hovering || pinned

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (active) {
      const p = v.play()
      if (p && typeof p.then === 'function') p.catch(() => {})
      setHasPlayed(true)
    } else {
      v.pause()
    }
  }, [active])

  return (
    <div className="relative">
      {/* Halo */}
      <div
        className={`absolute -inset-x-12 -inset-y-12 -z-10 rounded-[40px] blur-3xl transition-opacity duration-500 ${
          active ? 'opacity-70' : 'opacity-30'
        }`}
        style={{
          background:
            'radial-gradient(closest-side, rgba(255,107,26,0.35), transparent 70%)',
        }}
        aria-hidden
      />

      <div
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-ink-2/80 shadow-[0_30px_120px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/5 backdrop-blur"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={() => setPinned((p) => !p)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setPinned((p) => !p)
          }
        }}
        aria-label={pinned ? 'Pause demo video' : 'Play demo video'}
      >
        {/* Window chrome */}
        <div className="relative z-20 flex items-center gap-1.5 border-b border-white/5 bg-ink-3/80 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span className="ml-3 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            forge — 127.0.0.1:8080
          </span>
          <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-zinc-600">
            {pinned ? 'playing' : active ? 'hover · playing' : 'click or hover to play'}
          </span>
        </div>

        {/* Video */}
        <div className="relative">
          <video
            ref={videoRef}
            src="/demo.mp4"
            poster="/demo-poster.jpg"
            muted
            loop
            playsInline
            preload="metadata"
            className={`block w-full transition duration-500 ${
              active ? 'opacity-100 grayscale-0' : 'opacity-70 grayscale brightness-75'
            }`}
          />

          {/* Dim overlay when idle */}
          <div
            className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
              active ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              background:
                'linear-gradient(180deg, rgba(11,15,20,0.35) 0%, rgba(11,15,20,0.55) 100%)',
            }}
            aria-hidden
          />

          {/* Play overlay */}
          <div
            className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              active ? 'opacity-0' : 'opacity-100'
            }`}
            aria-hidden
          >
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <span className="absolute inset-0 -m-3 rounded-full bg-flame-500/20 blur-xl" />
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-flame-500/30 bg-flame-500/90 shadow-[0_12px_40px_-12px_rgba(255,107,26,0.7)] backdrop-blur transition-transform duration-300 group-hover:scale-105">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="ml-0.5 drop-shadow"
                  >
                    <path d="M6 4l14 8-14 8V4z" />
                  </svg>
                </span>
              </div>
              <span className="rounded-full border border-white/10 bg-ink-3/80 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-300 backdrop-blur">
                {hasPlayed ? 'click to pin · hover to resume' : 'hover to play'}
              </span>
            </div>
          </div>

          {/* Pinned indicator (top-right corner) */}
          <div
            className={`pointer-events-none absolute right-3 top-3 z-10 transition-opacity duration-300 ${
              pinned ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-flame-500/30 bg-ink-3/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-flame-200 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame-500 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-flame-500" />
              </span>
              pinned
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
