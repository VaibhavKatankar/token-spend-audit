"use client";

interface CostBreakdown {
  apiSpend: number;
  apiSavings: number;
  seatSpend: number;
  seatSavings: number;
  computeSpend: number;
  computeSavings: number;
}

interface AuditChartsProps {
  breakdown: CostBreakdown;
  totalSavings: number;
  totalSpend: number;
}

export default function AuditCharts({ breakdown, totalSavings, totalSpend }: AuditChartsProps) {
  const { apiSpend, seatSpend, computeSpend } = breakdown;
  
  // Calculate relative proportions for the stacked bar
  const total = apiSpend + seatSpend + computeSpend;
  const apiPercent = total > 0 ? (apiSpend / total) * 100 : 0;
  const seatPercent = total > 0 ? (seatSpend / total) * 100 : 0;
  const computePercent = total > 0 ? (computeSpend / total) * 100 : 0;

  // Donut SVG parameters for savings ratio
  const savingsPercent = totalSpend > 0 ? (totalSavings / totalSpend) * 100 : 0;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (savingsPercent / 100) * circumference;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Chart 1: Allocation Bar */}
      <div className="bg-card/50 border border-border/80 rounded-xl p-5 md:p-6 space-y-6">
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider text-muted-foreground/80">
            Spend Distribution
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total reported stack: <strong className="text-white">${totalSpend.toLocaleString()}</strong>
          </p>
        </div>

        {/* Stacked bar diagram */}
        <div className="space-y-4">
          <div className="h-6 w-full rounded-full overflow-hidden flex bg-muted/40 border border-border">
            {apiPercent > 0 && (
              <div
                style={{ width: `${apiPercent}%` }}
                className="bg-primary hover:brightness-110 transition-all duration-300 relative group cursor-pointer"
                title={`APIs: $${apiSpend}`}
              />
            )}
            {seatPercent > 0 && (
              <div
                style={{ width: `${seatPercent}%` }}
                className="bg-indigo-400 hover:brightness-110 transition-all duration-300 relative group cursor-pointer"
                title={`Seats: $${seatSpend}`}
              />
            )}
            {computePercent > 0 && (
              <div
                style={{ width: `${computePercent}%` }}
                className="bg-indigo-700 hover:brightness-110 transition-all duration-300 relative group cursor-pointer"
                title={`Compute: $${computeSpend}`}
              />
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded bg-primary shrink-0" />
              <div>
                <p className="font-semibold text-white">APIs</p>
                <p className="text-[10px] text-muted-foreground">${apiSpend.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded bg-indigo-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">Seats</p>
                <p className="text-[10px] text-muted-foreground">${seatSpend.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded bg-indigo-700 shrink-0" />
              <div>
                <p className="font-semibold text-white">Compute</p>
                <p className="text-[10px] text-muted-foreground">${computeSpend.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart 2: Savings Donut Gauges */}
      <div className="bg-card/50 border border-border/80 rounded-xl p-5 md:p-6 flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider text-muted-foreground/80">
            Efficiency Audit
          </h4>
          <div>
            <h3 className="text-3xl font-extrabold text-emerald-400">
              {savingsPercent.toFixed(0)}%
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Of your total monthly budget goes to waste or idle fees.
            </p>
          </div>
          <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2.5 py-0.5 rounded-full font-medium">
            Saved: ${totalSavings.toLocaleString()}/mo
          </div>
        </div>

        {/* SVG Circular Donut Chart */}
        <div className="relative h-28 w-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Background path */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="stroke-muted"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Active Savings path */}
            {savingsPercent > 0 && (
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-emerald-400 transition-all duration-1000 ease-out"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Trim</span>
            <span className="text-xs font-bold text-white">Budget</span>
          </div>
        </div>
      </div>
    </div>
  );
}
