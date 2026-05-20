"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            T
          </div>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">
            TokenSpend<span className="text-primary">.ai</span>
          </span>
        </Link>

        {/* Live Status Indicators */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-muted/50 px-3 py-1 rounded-full border border-border">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground font-medium">
              API cost models synced 2h ago
            </span>
          </div>
        </div>

        {/* Navigation Action */}
        <div className="flex items-center space-x-4">
          <Link
            href="/audit"
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-primary to-indigo-500 group-hover:from-primary group-hover:to-indigo-500 text-white hover:text-white focus:ring-4 focus:outline-none focus:ring-primary/30"
          >
            <span className="relative px-4 py-1.5 transition-all ease-in duration-75 bg-background rounded-md group-hover:bg-opacity-0 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary group-hover:text-white transition-colors" />
              Audit Stack
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
