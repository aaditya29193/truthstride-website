"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";

const heroImage = "/signal_image.png";
const problemImage = "/drift_image.png";
const dashboardImage = "/velocity_image.png";

const steps = [
  {
    number: "01",
    title: "Connect your stack",
    body: "One-click OAuth for GitHub, GitLab, Slack, Teams, Jira, Linear and meeting recorders. Zero scripts. Read-only where it matters.",
    tags: ["GitHub", "Slack", "Teams", "Jira", "Meet"],
  },
  {
    number: "02",
    title: "Analyze every signal",
    body: "We read PRs, merges, deploy events, Slack threads, stand-up notes and meeting transcripts. TruthStride extracts intent, decisions and timestamps, not just activity.",
    tags: ["PR reviews", "Decisions", "Deploy events", "Bottlenecks"],
  },
  {
    number: "03",
    title: "Tickets update themselves",
    body: "Sprint points, status, dates, production timestamps, linked PRs, blockers and requirements all write back to the ticket. Your dashboard reflects reality.",
    tags: ["Sprint pts", "Prod date", "Design notes", "Risk"],
  },
];

const logos = [
  "GitHub",
  "GitLab",
  "Slack",
  "MS Teams",
  "Jira",
  "Linear",
  "Notion",
  "Google Meet",
  "Zoom",
  "Asana",
  "Confluence",
];

const realityRows = [
  {
    label: "Reported velocity",
    before: "42 pts",
    after: "28 pts",
    note: "Reality was 33% lower",
    positive: false,
  },
  {
    label: "Tickets with accurate dates",
    before: "31%",
    after: "97%",
    note: "Auto-stamped from Git + Prod",
    positive: true,
  },
  {
    label: "Hours spent on status updates",
    before: "6.2 / wk",
    after: "0.4 / wk",
    note: "Per engineer",
    positive: false,
  },
];

const integrationStats = [
  { value: "1.2M+", label: "Signals ingested / day" },
  { value: "42", label: "Ticket fields auto-updated" },
  { value: "< 10 min", label: "Setup time" },
  { value: "94%", label: "Manual updates killed" },
];

const dashboardStats = [
  {
    title: "Auto-stamped dates",
    body: "Production timestamps come from the deploy event itself, not memory.",
  },
  {
    title: "Source-linked decisions",
    body: "Every dashboard metric links back to PRs, threads, and meeting notes.",
  },
  {
    title: "Quiet blockers surfaced",
    body: "Wait states and review stalls show up before they distort planning.",
  },
];

type WaitlistResponse = {
  message?: string;
};

type HeroFormProps = {
  onSuccess: (message: string) => void;
};

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`site-header ${scrolled ? "site-header-scrolled" : ""}`}
      data-testid="site-header"
    >
      <div className="shell flex h-16 items-center justify-between">
        <a className="brand-mark" href="#">
          <span className="brand-icon">
            B
            <span className="brand-dot" />
          </span>
          <span className="brand-name">TruthStride</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-neutral-600 md:flex">
          <a href="#problem">Problem</a>
          <a href="#how">How it works</a>
          <a href="#integrations">Integrations</a>
        </nav>

        <a className="cta-button cta-button-dark header-cta h-9 px-4 text-sm" href="#waitlist">
          Join waitlist
        </a>
      </div>
    </header>
  );
}

function HeroForm({ onSuccess }: HeroFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: email.split("@")[0] || "Waitlist lead",
          email,
          company: "",
        }),
      });

      const data = (await response.json()) as WaitlistResponse;

      if (!response.ok) {
        throw new Error(data.message || "Please enter a valid email.");
      }

      setJoined(true);
      onSuccess(data.message || "You're on the waitlist.");
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Please enter a valid email.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (joined) {
    return (
      <div className="hero-success" data-testid="hero-waitlist-success">
        <span className="status-check">✓</span>
        <span>You&apos;re on the waitlist. We&apos;ll reach out soon.</span>
      </div>
    );
  }

  return (
    <>
      <form className="mt-10 flex max-w-lg flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <input
          className="hero-input"
          data-testid="hero-email-input"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          required
          type="email"
          value={email}
        />
        <button
          className="cta-button cta-button-blue h-12 shrink-0 px-6"
          data-testid="hero-submit-btn"
          disabled={loading}
          type="submit"
        >
          {loading ? "Joining..." : "Join waitlist"}
          {!loading ? <span aria-hidden="true">→</span> : null}
        </button>
      </form>

      {error ? <p className="form-error mt-3">{error}</p> : null}
    </>
  );
}

function WaitlistSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const requestedCount = useMemo(() => 187, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as WaitlistResponse;

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setSuccess(data.message || "You are on the waitlist.");
      setForm({ name: "", email: "", company: "" });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="waitlist-band" id="waitlist">
      <div className="waitlist-grid" />
      <div className="waitlist-top-line" />
      <div className="shell relative mx-auto max-w-3xl px-6 text-center sm:px-8">
        <p className="section-index section-index-blue">05 — Join the waitlist</p>
        <h2 className="waitlist-title">
          Lead with facts.
          <br />
          <span className="text-neutral-500">Not</span> fiction.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
          Get early access, priority onboarding, and founder-tier pricing. We&apos;re
          onboarding teams in small batches to keep quality high.
        </p>

        {success ? (
          <div className="waitlist-success-card">
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#00A35C] text-sm text-white">
              ✓
            </div>
            <div className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold">
              You&apos;re in.
            </div>
            <p className="mt-2 text-sm text-neutral-400">{success}</p>
          </div>
        ) : (
          <form
            className="mx-auto mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2"
            onSubmit={handleSubmit}
          >
            <input
              className="dark-input"
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Full name"
              required
              value={form.name}
            />
            <input
              className="dark-input"
              onChange={(event) =>
                setForm((current) => ({ ...current, company: event.target.value }))
              }
              placeholder="Company (optional)"
              value={form.company}
            />
            <input
              className="dark-input sm:col-span-2"
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="work@company.com"
              required
              type="email"
              value={form.email}
            />
            <button
              className="cta-button cta-button-light sm:col-span-2 h-12"
              disabled={loading}
              type="submit"
            >
              {loading ? "Joining..." : "Request early access"}
              {!loading ? <span aria-hidden="true">→</span> : null}
            </button>
          </form>
        )}

        {error ? <p className="form-error mx-auto mt-4 max-w-xl text-center">{error}</p> : null}
        {!success ? (
          <p className="waitlist-count mt-6 font-mono text-xs text-neutral-500">
            {requestedCount} teams already requested access
          </p>
        ) : null}
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [heroMessage, setHeroMessage] = useState("");

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <Header />

      <main>
        <section className="hero-grid relative overflow-hidden pb-24 pt-32 sm:pb-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-white" />
          <div className="shell relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="hero-pill">
                <span className="hero-pill-dot" />
                Now onboarding design partners
              </div>

              <h1
                className="hero-title font-heading mt-6 font-bold tracking-tighter text-neutral-950"
                data-testid="hero-title"
              >
                Stop managing tickets.
                <br />
                <span className="text-neutral-500">Start shipping </span>
                <span className="hero-underline-wrap">
                  truth
                  <span className="hero-underline" />
                </span>
                .
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600">
                TruthStride pulls signals from Git, Slack, Teams, and meeting notes to
                auto-update your tickets: sprint points, dates, PR reviews, production
                rollouts, and decisions. Your dashboard finally reflects the work that
                actually happened.
              </p>

              <HeroForm onSuccess={setHeroMessage} />
              {heroMessage ? <p className="mt-3 text-sm text-[#00A35C]">{heroMessage}</p> : null}

              <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-xs text-neutral-500 sm:gap-6">
                <span>NO CREDIT CARD</span>
                <span className="dot-separator" />
                <span>EARLY-ACCESS PRICING</span>
                <span className="dot-separator" />
                <span>SOC 2 ROADMAP</span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="visual-card relative">
                <Image
                  alt="Abstract clean data visualization converging into a structured cube"
                  className="hero-image h-[300px] w-full object-cover sm:h-[420px]"
                  data-testid="hero-image"
                  height={840}
                  priority
                  src={heroImage}
                  width={720}
                />
                <div className="visual-caption hero-caption">
                  <span>SIGNAL → TRUTH</span>
                  <span className="text-[#00A35C]">● LIVE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="shell section-space border-t border-neutral-200" id="problem">
          <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
            <div>
              <p className="section-index">01 — The reality gap</p>
              <h2 className="section-title">Your dashboard is fiction. The work is fact.</h2>
              <p className="section-copy max-w-lg">
                Managers report what they hope. Engineers close tickets late. Sprint
                points get rounded. Dates slip quietly. Decisions made in Slack never reach
                the ticket. Leadership builds strategy on data that was manually curated
                and silently massaged.
              </p>

              <div className="mt-10 space-y-3">
                {realityRows.map((row) => (
                  <div key={row.label} className="metric-row">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-neutral-900">{row.label}</div>
                      <div className="mt-0.5 text-xs text-neutral-500">{row.note}</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 font-mono text-sm">
                      <span className="text-neutral-400 line-through">{row.before}</span>
                      <span className="text-neutral-300">→</span>
                      <span className={row.positive ? "metric-up" : "metric-down"}>
                        {row.positive ? "↗" : "↘"} {row.after}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="visual-card">
                <Image
                  alt="Chaos vs order visual"
                  className="h-[320px] w-full object-cover sm:h-[520px]"
                  height={1040}
                  src={problemImage}
                  width={900}
                />
              </div>
              <div className="drift-card">
                <div className="text-[10px] font-mono tracking-[0.22em] text-neutral-500">
                  DASHBOARD DRIFT
                </div>
                <div className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#E52B2B]">
                  -34%
                </div>
                <div className="text-xs text-neutral-500">avg gap vs reality</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-muted section-space border-y border-neutral-200" id="how">
          <div className="shell">
            <div className="max-w-2xl">
              <p className="section-index">02 — How it works</p>
              <h2 className="section-title">Three steps from chaos to clarity.</h2>
              <p className="section-copy">
                No new tool for your team to learn. TruthStride lives behind the systems
                you already use and surfaces the truth in the dashboards your leaders
                already read.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
              {steps.map((step) => (
                <article key={step.number} className="step-card">
                  <div className="flex items-start justify-between">
                    <div className="step-icon">+</div>
                    <span className="font-mono text-xs text-neutral-400">{step.number}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">{step.body}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {step.tags.map((tag) => (
                      <span key={tag} className="tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space border-b border-neutral-200" id="integrations">
          <div className="shell">
            <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="section-index">03 — Integrations</p>
                <h2 className="section-title">Plugs into the tools that already hold the truth.</h2>
              </div>
              <div className="lg:col-span-7">
                <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
                  Git for what shipped. Slack and Teams for what was discussed. Meeting notes
                  for what was decided. TruthStride connects to them all and writes the
                  complete story back into your ticket system.
                </p>
              </div>
            </div>

            <div className="logo-band">
              <div className="logo-track">
                {[...logos, ...logos].map((logo, index) => (
                  <div key={`${logo}-${index}`} className="logo-chip">
                    <span className="logo-dot" />
                    <span>{logo}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="stat-grid">
              {integrationStats.map((stat) => (
                <div key={stat.label} className="bg-white p-6">
                  <div className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-xs font-mono uppercase tracking-[0.18em] text-neutral-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-muted section-space">
          <div className="shell">
            <div className="max-w-3xl">
              <p className="section-index">04 — The reality layer</p>
              <h2 className="section-title">Numbers decision-makers can finally trust.</h2>
              <p className="section-copy">
                Every sprint point, every production date, every bottleneck is sourced from
                the work itself, not a Monday morning guess.
              </p>
            </div>

            <div className="dashboard-shell" data-testid="dashboard-visual">
              <Image
                alt="Sharp analytical dashboard interface"
                className="h-[420px] w-full object-cover sm:h-[520px]"
                height={1040}
                src={dashboardImage}
                width={1440}
              />

              <div className="dashboard-float dashboard-float-top-left">
                <div className="dashboard-label">Sprint velocity</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="dashboard-value">+30%</span>
                  <span className="text-xs font-medium text-[#00A35C]">accurate</span>
                </div>
                <div className="mt-1 text-xs text-neutral-500">vs self-reported</div>
              </div>

              <div className="dashboard-float dashboard-float-bottom-right">
                <div className="dashboard-label">Production date</div>
                <div className="mt-2 font-[family-name:var(--font-display)] text-lg font-bold text-neutral-950 sm:text-xl">
                  Aug 12 · 14:03 UTC
                </div>
                <div className="mt-1 text-xs text-[#00A35C]">✓ auto-stamped from deploy</div>
              </div>

              <div className="dashboard-float dashboard-float-mid-right hidden lg:block">
                <div className="dashboard-label">Bottleneck</div>
                <div className="mt-2 font-[family-name:var(--font-display)] text-lg font-bold text-neutral-950">
                  Design review
                </div>
                <div className="mt-1 text-xs text-[#E52B2B]">+3.1 days avg wait</div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {dashboardStats.map((stat) => (
                <article key={stat.title} className="info-card-clean">
                  <h3 className="text-lg font-semibold tracking-tight text-neutral-950">
                    {stat.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{stat.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <WaitlistSection />
      </main>

      <footer className="border-t border-white/10 bg-neutral-950 text-neutral-400">
        <div className="shell flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
            <div className="footer-brand flex flex-wrap items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white font-[family-name:var(--font-display)] text-[13px] font-bold text-neutral-950">
              B
            </span>
            <span className="font-[family-name:var(--font-display)] font-semibold tracking-tight text-white">
              TruthStride
            </span>
            <span className="footer-tagline ml-0 text-xs font-mono text-neutral-500 sm:ml-3">
              THE REALITY LAYER FOR ENGINEERING
            </span>
          </div>

          <div className="footer-nav flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-[0.18em] sm:gap-6">
            <a href="#problem">Problem</a>
            <a href="#how">Process</a>
            <a href="#integrations">Stack</a>
            <a href="#waitlist">Waitlist</a>
          </div>

          <div className="text-xs text-neutral-500">© {new Date().getFullYear()} TruthStride. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
