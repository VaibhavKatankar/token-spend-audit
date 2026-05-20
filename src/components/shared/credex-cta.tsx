"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, Loader2, Sparkles } from "lucide-react";

interface CredexCtaProps {
  auditId: string;
  yearlySavings: number;
  companyName: string;
}

export default function CredexCta({ auditId, yearlySavings, companyName }: CredexCtaProps) {
  const [email, setEmail] = useState("");
  const [coName, setCoName] = useState(companyName);
  const [requestCredits, setRequestCredits] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email address is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          companyName: coName || "Your Startup",
          auditId,
          creditsRequested: requestCredits
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit lead.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-b from-card to-background p-6 md:p-8 shadow-2xl shadow-primary/5">
      {/* Background radial glow */}
      <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      {success ? (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Audit Details Dispatched!</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            We have emailed your PDF audit link and cost charts to <strong className="text-white">{email}</strong>.
            A Credex infrastructure specialist will review your workload within 24 hours.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          {/* Pitch Section */}
          <div className="lg:col-span-3 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Partner Opportunity</span>
            </div>
            
            <h3 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
              Unlock Subsidized AI Infrastructure
            </h3>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              We identified <strong className="text-emerald-400 font-semibold">${yearlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr</strong> in structural spend inefficiencies. Partner with Credex to slash your remaining billing by up to <strong className="text-white">40%</strong>.
            </p>

            <ul className="space-y-2.5 text-xs text-muted-foreground pt-2">
              <li className="flex items-center space-x-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Subsidized API rates for OpenAI & Anthropic routes</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Up to 40% discount on raw serverless GPU instances (RunPod/Baseten)</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Consolidated billing & automated optimization alerts</span>
              </li>
            </ul>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2 bg-black/40 border border-border/80 rounded-xl p-5 md:p-6">
            <h4 className="text-sm font-bold text-white mb-4">Request Savings & Credits</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="companyName" className="block text-xs font-medium text-muted-foreground mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={coName}
                  onChange={(e) => setCoName(e.target.value)}
                  placeholder="e.g. Velocity Labs"
                  className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label htmlFor="leadEmail" className="block text-xs font-medium text-muted-foreground mb-1">
                  Work Email *
                </label>
                <input
                  type="email"
                  id="leadEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex items-start space-x-2.5 pt-1">
                <input
                  type="checkbox"
                  id="requestCredits"
                  checked={requestCredits}
                  onChange={(e) => setRequestCredits(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary bg-muted/30 focus:ring-primary/30"
                />
                <label htmlFor="requestCredits" className="text-xs text-muted-foreground leading-normal select-none cursor-pointer">
                  Request up to $5,000 in free Credex startup infrastructure credits.
                </label>
              </div>

              {error && (
                <div className="text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-bold rounded-lg group bg-gradient-to-br from-primary to-indigo-500 group-hover:from-primary group-hover:to-indigo-500 text-white hover:text-white focus:ring-4 focus:outline-none focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-background rounded-md group-hover:bg-opacity-0 flex items-center justify-center gap-1.5">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Secure Savings</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
