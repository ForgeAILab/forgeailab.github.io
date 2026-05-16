import DemoVideo from "./DemoVideo";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="bg-grid absolute inset-0 -z-10" aria-hidden />

      <div className="mx-auto max-w-5xl px-6 text-center">
        <a
          href="https://github.com/ForgeAILab/forge/releases"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300 backdrop-blur transition hover:border-flame-500/30 hover:bg-flame-500/5 hover:text-flame-200 animate-fade-up"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame-500 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-flame-500" />
          </span>
          <span>Public beta is live</span>
          <span className="text-zinc-500">→</span>
        </a>

        <h1
          className="mt-7 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl animate-fade-up"
          style={{ animationDelay: "60ms" }}
        >
          Run coding agents through{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-br from-flame-300 via-flame-500 to-flame-700 bg-clip-text text-transparent">
              a real workflow.
            </span>
            <svg
              className="absolute -bottom-1 left-0 w-full"
              viewBox="0 0 300 12"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d="M2 8 Q 80 2, 150 6 T 298 5"
                stroke="url(#g)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
              />
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0%" stopColor="#FF9442" />
                  <stop offset="100%" stopColor="#FF6B1A" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>

        <p
          className="mx-auto mt-7 max-w-2xl text-balance text-lg leading-relaxed text-zinc-400 sm:text-xl animate-fade-up"
          style={{ animationDelay: "120ms" }}
        >
          Forge connects Claude Code, Codex, and other MCP agents to tasks,
          worktrees, CI checks, review, and merge. It runs locally and stays
          MIT-licensed.
        </p>

        <div
          className="mt-9 flex flex-wrap items-center justify-center gap-3 animate-fade-up"
          style={{ animationDelay: "180ms" }}
        >
          <a
            href="#quickstart"
            className="group inline-flex items-center gap-2 rounded-full bg-flame-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(255,107,26,0.7)] transition hover:bg-flame-400"
          >
            Start in 5 minutes
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition group-hover:translate-x-0.5"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="https://github.com/ForgeAILab/forge"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-zinc-200 backdrop-blur transition hover:border-white/20 hover:bg-white/5"
          >
            <svg
              viewBox="0 0 16 16"
              width="16"
              height="16"
              fill="currentColor"
              aria-hidden
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            View on GitHub
          </a>
        </div>

        <p
          className="mt-5 font-mono text-xs text-zinc-500 animate-fade-up"
          style={{ animationDelay: "240ms" }}
        >
          $ npx @forgeailab/forge
        </p>
      </div>

      {/* Demo video */}
      <div
        className="mx-auto mt-20 max-w-6xl px-6 animate-fade-up"
        style={{ animationDelay: "300ms" }}
      >
        <DemoVideo />
        <p className="mt-4 text-center font-mono text-xs text-zinc-500">
          30-second walkthrough: task · worktree · CI gate · review · merge
        </p>
      </div>
    </section>
  );
}
