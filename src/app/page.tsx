"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Sparkles, Terminal, ShieldAlert, Cpu, Users, ArrowRight, TrendingDown } from "lucide-react";

export default function LandingPage() {
  // Slider state for the interactive calculator
  const [estSpend, setEstSpend] = useState(5000);

  // Typical savings coefficient (35%)
  const estSavingsMo = estSpend * 0.35;
  const estSavingsYr = estSavingsMo * 12;

  return (
    <div className="min-h-screen bg-background text-white flex flex-col selection:bg-primary/30 bg-grid-pattern relative">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6 animate-fade-in">
          {/* Status Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/25 px-3 py-1 rounded-full text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Audit Stack in under 2 minutes</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] md:leading-[1.05]">
            Stop Overpaying for <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">LLM Tokens</span> and <span className="underline decoration-indigo-500/50">Idle Seats</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Automated FinOps for AI engineering teams. We analyze prompt contexts, deduplicate developer chat accounts, and locate idle GPU nodes.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/audit"
              className="w-full sm:w-auto relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-bold rounded-lg group bg-gradient-to-br from-primary to-indigo-500 group-hover:from-primary group-hover:to-indigo-500 text-white hover:text-white focus:ring-4 focus:outline-none focus:ring-primary/30"
            >
              <span className="w-full relative px-6 py-3 transition-all ease-in duration-75 bg-background rounded-md group-hover:bg-opacity-0 flex items-center justify-center gap-2">
                <span>Start Free Audit</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>

            <a
              href="#estimator"
              className="w-full sm:w-auto text-xs md:text-sm font-semibold text-muted-foreground hover:text-white border border-border hover:bg-muted/30 px-6 py-3.5 rounded-lg transition-all text-center"
            >
              Try Calculator
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Estimator Widget */}
      <section id="estimator" className="py-16 bg-muted/10 border-b border-border/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card/80 backdrop-blur-md border border-border rounded-2xl p-6 md:p-8 shadow-2xl relative glow-card">
            <div className="absolute -left-12 -top-12 h-24 w-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
            
            <div className="text-center space-y-2 mb-8">
              <h3 className="text-xl font-bold text-white">Instant Savings Estimator</h3>
              <p className="text-xs text-muted-foreground">
                Move the slider to estimate your startup&apos;s optimization opportunities.
              </p>
            </div>

            <div className="space-y-6">
              {/* Slider Input */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Current AI Infrastructure spend</span>
                  <span className="text-primary font-bold">${estSpend.toLocaleString()}/mo</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={50000}
                  step={500}
                  value={estSpend}
                  onChange={(e) => setEstSpend(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                />
              </div>

              {/* Outputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="bg-background/90 border border-border/80 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                    Estimated Monthly Savings
                  </span>
                  <span className="text-2xl md:text-3xl font-extrabold text-emerald-400">
                    ${estSavingsMo.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                  </span>
                </div>

                <div className="bg-background/90 border border-border/80 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                    Projected Annual Recovery
                  </span>
                  <span className="text-2xl md:text-3xl font-extrabold text-emerald-400">
                    ${estSavingsYr.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr
                  </span>
                </div>
              </div>

              {/* Subsidized note */}
              <p className="text-[10px] text-center text-muted-foreground">
                *Savings calculated based on structural seat consolidation and token endpoint re-routing ratios. Claim subsidized credits via Credex.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inefficiencies Features Grid */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            We Scan for Three Cost Pillars
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            General dashboards hide granular operational patterns. Our analysis looks at actual developer configurations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Token costs */}
          <div className="bg-card/60 backdrop-blur-sm border border-border/80 rounded-xl p-6 space-y-4 glow-card">
            <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Terminal className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Token Context Sizing</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We cross-examine average tokens against selected model dimensions. Running classification or chatbot tasks on standard premium models is often 10x more expensive than mini options or open-weights.
            </p>
          </div>

          {/* Card 2: Seat overlaps */}
          <div className="bg-card/60 backdrop-blur-sm border border-border/80 rounded-xl p-6 space-y-4 glow-card">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">IDE & Browser Overlaps</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Paying for Cursor Business ($40/seat) and standalone ChatGPT Plus or Claude Pro ($20/seat) for the same engineers is double-spending. We trace license redundancies to trim seat overhead.
            </p>
          </div>

          {/* Card 3: Idle Compute */}
          <div className="bg-card/60 backdrop-blur-sm border border-border/80 rounded-xl p-6 space-y-4 glow-card">
            <div className="h-10 w-10 rounded-lg bg-indigo-800/10 border border-indigo-800/20 flex items-center justify-center text-indigo-500">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Idle Instance GPU Audits</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Startups pay for 24/7 dedicated hosting to run infrequent fine-tuning or inference tasks. We calculate the cost delta of switching to serverless or spot hosting and route you to Credex credit offsets.
            </p>
          </div>
        </div>
      </section>

      {/* Credex Sponsorship Banner */}
      <section className="py-12 bg-gradient-to-r from-indigo-950/20 via-primary/5 to-indigo-950/20 border-t border-b border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>Credex Infrastructure Credit Partner</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white">
            Access Subsidized AI API and Compute Bills
          </h3>
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            Once our audit detects waste, we can help you transition to Credex credits, letting you continue using premium tools at up to 40% discount. No technical changes required.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
