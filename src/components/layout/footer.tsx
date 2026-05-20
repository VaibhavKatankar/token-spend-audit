"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left branding */}
        <div className="flex flex-col items-center md:items-start space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white tracking-tight">
              TokenSpend<span className="text-primary">.ai</span>
            </span>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border">
              v1.0.0
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center md:text-left">
            Automated FinOps analysis for modern AI operations.
          </p>
        </div>

        {/* Center note */}
        <div className="text-xs text-muted-foreground text-center max-w-md">
          TokenSpend.ai is sponsored by{" "}
          <a
            href="https://credex.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-semibold"
          >
            Credex
          </a>
          . We help startups reduce waste and access up to 40% subsidized credits on LLM and GPU infrastructure.
        </div>

        {/* Right copyright */}
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} TokenSpend.ai. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
