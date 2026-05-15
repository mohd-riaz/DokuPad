import Link from "next/link";
import Logo from "@/components/logo";
import LandingThemeToggle from "@/components/landing-theme-toggle";
import LandingCollabDemo from "@/components/landing-collab-demo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function GithubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.7.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
    </svg>
  );
}

function ArrowRight({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ExternalLinkIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17L17 7M7 7h10v10" />
    </svg>
  );
}

const FAQ_ITEMS = [
  {
    q: "How does DokuPad handle conflicts when two people type at once?",
    a: "It uses Yjs, a CRDT (Conflict-free Replicated Data Type). Concurrent edits converge to the same state automatically — no last-writer-wins, no merge dialogs.",
  },
  {
    q: "Who can collaborate on a document?",
    a: "Real-time collaboration is enabled when the document was created with an organization selected in the Clerk organization switcher. Documents created without an organization are personal — they don't sync with other users.",
  },
  {
    q: "Can I run DokuPad myself?",
    a: "Yes. The code is MIT-licensed. Clone the repo, install the client and server, set up Convex and Clerk, and you're running locally. Full instructions in the README.",
  },
  {
    q: "What's the stack?",
    a: "Next.js + React + Tailwind + shadcn/ui on the frontend. Tiptap for rich-text editing. Yjs and Y-socket.io for real-time sync. Convex for persistence. Clerk for authentication.",
  },
  {
    q: "Is this a production-ready SaaS?",
    a: "No. DokuPad is a portfolio project showcasing real-time collaborative editing. It's free to try at the live demo, but there's no commercial offering, no SLA, and no support contract.",
  },
];

const FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
      </svg>
    ),
    title: "Rich text editing",
    body: "Headings, lists, tables, task lists, images, links, code, highlights — powered by Tiptap with sensible keyboard shortcuts.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="12" r="3" /><circle cx="15" cy="12" r="3" />
        <path d="M9 9V6M15 9V6" />
      </svg>
    ),
    title: "Real-time multi-cursor editing",
    body: "Yjs CRDTs over Y-socket.io. Concurrent edits converge automatically — no overwrites, no merge dialogs.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5" />
        <path d="M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6" />
      </svg>
    ),
    title: "Persistent storage",
    body: "Documents and Yjs state live in Convex. Reload anytime — your edits, formatting, and embeds are exactly where you left them.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Auth with Clerk",
    body: "Sign in, sign up, sessions, profile — handled. Drop into the editor without rolling your own auth.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Organization-scoped collaboration",
    body: "Docs created under an organization are shared with the whole org. Personal docs stay personal — no accidental leaks.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    title: "Document management",
    body: "Create, rename, search, and delete documents from a single workspace. Edits and formatting persist across reloads.",
  },
];

const HOW_IT_WORKS = [
  "You type a change in the Tiptap editor.",
  "It's converted into a Yjs update.",
  "The update is sent over a Y-socket.io WebSocket.",
  "The server relays it to every connected client.",
  "Each client merges the update — CRDT math guarantees convergence.",
];

export default function LandingPage() {
  return (
    <div className="relative antialiased min-h-screen">
      <div className="hero-glow" aria-hidden="true" />

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/60 border-b border-border/60">
        <div className="max-w-[1240px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Logo size={22} />
            DokuPad
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <LandingThemeToggle />
            <a
              href="https://github.com/mohd-riaz/DokuPad"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <GithubIcon />
            </a>
            <Link
              href="/sign-in"
              className="hidden sm:inline-flex h-9 items-center px-3 rounded-md border border-border bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-9 items-center gap-1.5 px-3.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get started
              <ArrowRight />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[calc(100vh-4rem)]">
        <div className="relative max-w-[1240px] mx-auto px-6 pt-16 md:pt-28 pb-32 md:pb-48">
          <div className="flex justify-center mb-8">
            <a
              href="https://github.com/mohd-riaz/DokuPad"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur pl-1 pr-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="inline-flex items-center gap-1 rounded-full landing-accent-bg landing-accent px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                Open source
              </span>
              MIT-licensed · view the repo on GitHub
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="transition group-hover:translate-x-0.5">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </a>
          </div>

          <h1 className="mx-auto max-w-4xl text-center text-[44px] leading-[1.05] md:text-[64px] md:leading-[1.02] font-semibold tracking-tight text-balance">
            The collaborative doc<br />your team won&apos;t fight over.
          </h1>
          <p className="mx-auto max-w-2xl mt-5 text-center text-base md:text-lg text-muted-foreground text-pretty">
            A real-time collaborative document editor with multi-cursor editing,
            powered by Yjs CRDTs, Tiptap, Next.js, and Convex. Open source on GitHub.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center gap-1.5 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get started
              <ArrowRight size={14} />
            </Link>
            <a
              href="https://github.com/mohd-riaz/DokuPad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 px-5 rounded-md border border-border bg-card text-sm font-medium hover:bg-muted transition-colors"
            >
              <GithubIcon size={14} />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── Live Collab Demo ── */}
      <LandingCollabDemo />

      {/* ── Features ── */}
      <section id="features" className="relative py-20 md:py-28 border-t border-border">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-[34px] md:text-[44px] font-semibold tracking-tight leading-[1.1] mb-4 text-balance">
              Everything you need to write together.
            </h2>
            <p className="text-muted-foreground text-lg text-pretty">
              A focused set of features that ship today. No marketing-page mirage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border mt-12 rounded-xl overflow-hidden border border-border">
            {FEATURES.map(({ icon, title, body }) => (
              <div key={title} className="bg-card p-7">
                <div className="w-10 h-10 rounded-md landing-accent-bg landing-accent flex items-center justify-center mb-5">
                  {icon}
                </div>
                <h3 className="font-semibold mb-1.5">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Collab Deep-dive ── */}
      <section id="collab" className="relative py-20 md:py-28 border-t border-border bg-muted/20">
        <div className="max-w-[1240px] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-[34px] md:text-[44px] font-semibold tracking-tight leading-[1.1] mb-4 text-balance">
              How concurrent edits stay conflict-free.
            </h2>
            <p className="text-muted-foreground text-lg mb-6 text-pretty">
              DokuPad uses Yjs — a CRDT (Conflict-free Replicated Data Type) — so two people
              can edit the same paragraph at the same time and the document always converges
              to the same state.
            </p>
            <ol className="space-y-3 text-sm">
              {HOW_IT_WORKS.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-5 h-5 mt-0.5 rounded-full landing-accent-bg landing-accent flex items-center justify-center flex-shrink-0 font-mono text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Architecture diagram */}
          <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-5">
              Architecture
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {["Client A", "Client B", "Client C"].map((client) => (
                  <div key={client} className="rounded-md border border-border bg-muted/40 p-2.5 text-[11px]">
                    <div className="font-medium mb-0.5">{client}</div>
                    <div className="text-muted-foreground font-mono text-[10px]">Tiptap · Yjs</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center text-muted-foreground/60 text-[10px] font-mono">
                <div className="flex flex-col items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                  <div>WebSocket · Yjs updates</div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                </div>
              </div>
              <div className="rounded-md border border-foreground/40 bg-foreground text-background p-3 text-center">
                <div className="text-[11px] font-medium">Y-socket.io server</div>
                <div className="text-[10px] font-mono opacity-70">sync · broadcast</div>
              </div>
              <div className="flex justify-center text-muted-foreground/60 text-[10px] font-mono">
                <div className="flex flex-col items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                  <div>persistence</div>
                </div>
              </div>
              <div className="rounded-md border border-border bg-card p-3 text-center shadow-sm">
                <div className="text-[11px] font-medium">Convex</div>
                <div className="text-[10px] font-mono text-muted-foreground">database · serverless fns</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="relative py-20 md:py-28 border-t border-border bg-muted/20">
        <div className="max-w-[1240px] mx-auto px-6 grid lg:grid-cols-[1.1fr_1fr] gap-12 items-start">
          <div>
            <h2 className="text-[34px] md:text-[44px] font-semibold tracking-tight leading-[1.1] mb-5 text-balance">
              A real-time editor, built in the open.
            </h2>
            <p className="text-muted-foreground text-lg mb-4 text-pretty">
              DokuPad is a full-stack portfolio project by{" "}
              <a
                href="https://github.com/mohd-riaz"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-foreground/30 underline-offset-2 hover:text-foreground"
              >
                Mohd Riaz
              </a>{" "}
              — exploring how to build a real-time collaborative editor with modern web primitives.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The code is MIT-licensed and lives on GitHub. Clone it, run it locally,
              or just read through how Yjs, Tiptap, and Convex fit together.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/mohd-riaz/DokuPad"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <GithubIcon size={14} />
                View on GitHub
              </a>
              <a
                href="https://dokupad.mohdriaz.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 px-4 rounded-md border border-border bg-card text-sm font-medium hover:bg-muted transition-colors"
              >
                Open live demo
                <ExternalLinkIcon />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-border rounded-xl overflow-hidden border border-border">
            {[
              { label: "License", value: "MIT" },
              { label: "Language", value: "TypeScript" },
              { label: "Frontend", value: "Next.js · React · Tailwind · shadcn/ui", small: true },
              { label: "Backend", value: "Convex · Y-socket.io · Clerk", small: true },
            ].map(({ label, value, small }) => (
              <div key={label} className="bg-card p-5">
                <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
                  {label}
                </div>
                <div className={`font-semibold ${small ? "text-sm leading-snug" : "text-lg"}`}>
                  {value}
                </div>
              </div>
            ))}
            <div className="bg-card p-5 col-span-2">
              <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
                Hosting
              </div>
              <div className="font-semibold text-sm leading-snug">
                Vercel (frontend) · Convex (backend) · Render (Y-socket.io)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative py-20 md:py-24 border-t border-border">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-[34px] md:text-[40px] font-semibold tracking-tight text-center mb-10">
            Questions, answered.
          </h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Accordion type="single" collapsible className="divide-y divide-border">
              {FAQ_ITEMS.map(({ q, a }, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-0 px-5">
                  <AccordionTrigger className="py-5 text-sm font-medium text-left hover:no-underline">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                    {a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-24 border-t border-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-[40px] md:text-[56px] font-semibold tracking-tight leading-[1.05] text-balance">
            Try it. Read the code.<br />That&apos;s the offer.
          </h2>
          <p className="text-muted-foreground text-lg mt-4">
            Open the demo in two tabs and watch the cursors. Or pull the repo and
            see how it&apos;s wired together.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center gap-1.5 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Create your free account
            </Link>
            <a
              href="https://github.com/mohd-riaz/DokuPad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 px-6 rounded-md border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              <GithubIcon size={14} />
              Star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-muted/30">
        <div className="max-w-[1240px] mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-muted-foreground">
          <div>© 2026 DokuPad</div>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="https://dokupad.mohdriaz.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Live demo</a>
            <a href="https://github.com/mohd-riaz/DokuPad" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub</a>
            <a href="https://github.com/mohd-riaz/DokuPad/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">MIT license</a>
            <a href="https://github.com/mohd-riaz/DokuPad#features" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Features</a>
            <a href="https://github.com/mohd-riaz/DokuPad#real-time-collaboration" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">How it works</a>
            <a href="https://github.com/mohd-riaz/DokuPad#installation" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Run it locally</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
