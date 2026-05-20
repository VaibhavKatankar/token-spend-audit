"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

interface CopyButtonProps {
  auditId: string;
  companyName: string;
  yearlySavings: number;
}

export default function CopyButton({ auditId, companyName, yearlySavings }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const shareUrl = `${window.location.origin}/report/${auditId}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
        copied
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          : "bg-muted hover:bg-muted/80 border-border text-muted-foreground hover:text-white"
      }`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          <span>Copied Link!</span>
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5" />
          <span>Share Audit</span>
        </>
      )}
    </button>
  );
}
