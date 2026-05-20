import Link from "next/link";
import { notFound } from "next/navigation";
import { dbGetAudit } from "@/lib/supabase";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AuditCharts from "@/components/audit/audit-charts";
import CredexCta from "@/components/shared/credex-cta";
import { 
  TrendingDown, 
  AlertTriangle, 
  HelpCircle, 
  Terminal, 
  Users, 
  Cpu, 
  Share2, 
  ChevronLeft,
  Calendar,
  Sparkles
} from "lucide-react";
import CopyButton from "./copy-button"; // Separate Client Component for browser APIs

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate dynamic Open Graph metadata for viral social cards
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const audit = await dbGetAudit(id);
  
  if (!audit) {
    return {
      title: "Audit Report Not Found — TokenSpend.ai",
    };
  }

  const company = audit.team_name || "Your Startup";
  const savings = audit.savings_metrics.totalYearlySavings;
  const ogUrl = `/api/og?company=${encodeURIComponent(company)}&savings=${savings}`;

  return {
    title: `AI Spend Audit: ${company} — TokenSpend.ai`,
    description: `We identified $${savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}/year in LLM token, seat, and compute inefficiencies. View our interactive report.`,
    openGraph: {
      title: `AI Spend Audit: ${company}`,
      description: `Identified $${savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr in waste.`,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: `${company} AI Spend Audit`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `AI Spend Audit: ${company}`,
      description: `Identified $${savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr in waste.`,
      images: [ogUrl],
    },
  };
}

// Simple local markdown parser to avoid heavy dependency compile weights
function parseMarkdown(mdText: string | null) {
  if (!mdText) return null;
  
  const lines = mdText.split("\n");
  return lines.map((line, idx) => {
    if (line.startsWith("### ")) {
      return (
        <h3 key={idx} className="text-base font-bold text-white mt-6 mb-2 border-b border-border/40 pb-1 uppercase tracking-wider">
          {line.replace("### ", "")}
        </h3>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h2 key={idx} className="text-lg font-bold text-white mt-8 mb-3">
          {line.replace("## ", "")}
        </h2>
      );
    }
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <p key={idx} className="text-sm font-semibold text-muted-foreground my-2">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const formatted = line.replace(/^[\-\*]\s+/, "");
      // Bold subparts detection
      const boldParts = formatted.split("**");
      return (
        <li key={idx} className="text-xs md:text-sm text-muted-foreground ml-4 list-disc my-1.5 leading-relaxed">
          {boldParts.map((part, pIdx) => 
            pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-semibold">{part}</strong> : part
          )}
        </li>
      );
    }
    if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) {
      const formatted = line.replace(/^\d\.\s+/, "");
      const boldParts = formatted.split("**");
      return (
        <li key={idx} className="text-xs md:text-sm text-muted-foreground ml-4 list-decimal my-2 leading-relaxed">
          {boldParts.map((part, pIdx) => 
            pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-semibold">{part}</strong> : part
          )}
        </li>
      );
    }
    if (line.trim() === "") {
      return <div key={idx} className="h-2" />;
    }
    
    // Normal paragraph text with inline bolds
    const boldParts = line.split("**");
    return (
      <p key={idx} className="text-xs md:text-sm text-muted-foreground leading-relaxed my-2">
        {boldParts.map((part, pIdx) => 
          pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-semibold">{part}</strong> : part
        )}
      </p>
    );
  });
}

export default async function ReportPage({ params }: PageProps) {
  const { id } = await params;
  const audit = await dbGetAudit(id);

  if (!audit) {
    notFound();
  }

  const { team_name, team_size, total_monthly_spend, savings_metrics, ai_summary, created_at } = audit;
  const dateFormatted = new Date(created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="min-h-screen bg-background text-white flex flex-col selection:bg-primary/30 bg-grid-pattern relative">
      <Header />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-1 text-xs text-muted-foreground hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center space-x-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>Audited on {dateFormatted}</span>
            </span>
            <span className="h-4 w-px bg-border" />
            <CopyButton auditId={id} companyName={team_name} yearlySavings={savings_metrics.totalYearlySavings} />
          </div>
        </div>

        {/* Audit Header Banner */}
        <div className="border border-border/80 bg-card/40 backdrop-blur-md rounded-2xl p-6 md:p-8 space-y-4 glow-card animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Stack Audit Findings
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {team_name}
              </h2>
              <p className="text-xs text-muted-foreground">
                Workload Category: <strong className="text-white capitalize">{savings_metrics.inputSummary.useCase}</strong> ({team_size} active seats)
              </p>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-3 text-right">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Total Annual Savings
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-400">
                ${savings_metrics.totalYearlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr
              </h1>
            </div>
          </div>
        </div>

        {/* Dynamic Charts component */}
        <AuditCharts 
          breakdown={savings_metrics.breakdown}
          totalSavings={savings_metrics.totalMonthlySavings}
          totalSpend={total_monthly_spend}
        />

        {/* AI Analysis Summary Box */}
        <div className="relative border border-border/80 bg-card/45 backdrop-blur-md rounded-2xl p-6 md:p-8 glow-card animate-fade-in">
          <div className="absolute right-4 top-4 inline-flex items-center space-x-1.5 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded text-[10px] font-bold text-primary uppercase">
            <Sparkles className="h-3 w-3" />
            <span>AI Insights</span>
          </div>

          <div className="prose prose-invert max-w-none prose-sm">
            {parseMarkdown(ai_summary)}
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Actionable Recommendations ({savings_metrics.recommendations.length})
            </h3>
            <span className="text-xs text-muted-foreground">
              Sorted by highest cost reduction
            </span>
          </div>

          {savings_metrics.recommendations.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl p-10 text-center text-muted-foreground text-sm animate-fade-in">
              Your stack is 100% efficient! No spend anomalies or redundant licenses detected.
            </div>
          ) : (
            <div className="space-y-4">
              {savings_metrics.recommendations.map((rec) => {
                const isHigh = rec.severity === "high";
                return (
                  <div 
                    key={rec.id} 
                    className={`border rounded-xl p-5 md:p-6 bg-card/45 relative flex flex-col md:flex-row items-start justify-between gap-6 transition-all glow-card hover:bg-card/75 animate-fade-in ${
                      isHigh ? "border-rose-500/20" : "border-border/80"
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Categorized Icon badge */}
                      <div className={`p-2.5 rounded-lg border shrink-0 ${
                        rec.category === "api" ? "bg-primary/10 border-primary/20 text-primary" :
                        rec.category === "seat" ? "bg-indigo-400/10 border-indigo-400/20 text-indigo-400" :
                        "bg-indigo-700/10 border-indigo-700/20 text-indigo-500"
                      }`}>
                        {rec.category === "api" && <Terminal className="h-5 w-5" />}
                        {rec.category === "seat" && <Users className="h-5 w-5" />}
                        {rec.category === "compute" && <Cpu className="h-5 w-5" />}
                      </div>

                      {/* Details */}
                      <div className="space-y-2 max-w-xl">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-white">{rec.targetToolOrProvider}</h4>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            isHigh ? "bg-rose-500/10 border border-rose-500/20 text-rose-400" : "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400"
                          }`}>
                            {rec.severity} severity
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Current status: <span className="text-white">{rec.currentDescription}</span>
                        </p>
                        
                        <div className="bg-muted/30 border border-border/60 rounded-lg p-3 text-xs text-white">
                          <span className="font-semibold text-primary block mb-1">Recommended Action:</span>
                          {rec.recommendedAction}
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                          {rec.reasoning}
                        </p>
                      </div>
                    </div>

                    {/* Cost recovery dial */}
                    <div className="flex flex-row md:flex-col justify-between items-center md:items-end w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-border/40 shrink-0 gap-2">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Monthly Saving</span>
                        <h3 className="text-xl md:text-2xl font-black text-emerald-400">
                          +${rec.monthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                        </h3>
                      </div>

                      {rec.alternativeProviderUrl && (
                        <a
                          href={rec.alternativeProviderUrl}
                          className="inline-flex items-center space-x-1 text-[11px] text-white font-bold bg-primary hover:bg-primary/95 px-3 py-1.5 rounded-md transition-colors shadow-lg shadow-primary/10"
                        >
                          <span>Optimize with Credex</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sponsored CTA Widget */}
        <CredexCta 
          auditId={id} 
          yearlySavings={savings_metrics.totalYearlySavings} 
          companyName={team_name} 
        />

      </main>

      <Footer />
    </div>
  );
}
