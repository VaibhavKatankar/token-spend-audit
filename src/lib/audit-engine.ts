import { SpendInput, AuditResults, AuditRecommendation, ApiUsage, SeatUsage, ComputeUsage } from "@/types";

// Static LLM Pricing Catalog (in USD per million tokens)
export const MODEL_CATALOG: Record<string, { name: string; inputCost: number; outputCost: number; provider: string }> = {
  "gpt-4o": { name: "OpenAI GPT-4o", inputCost: 5.00, outputCost: 15.00, provider: "openai" },
  "gpt-4o-mini": { name: "OpenAI GPT-4o-mini", inputCost: 0.15, outputCost: 0.60, provider: "openai" },
  "claude-3-5-sonnet": { name: "Anthropic Claude 3.5 Sonnet", inputCost: 3.00, outputCost: 15.00, provider: "anthropic" },
  "claude-3-5-haiku": { name: "Anthropic Claude 3.5 Haiku", inputCost: 0.80, outputCost: 4.00, provider: "anthropic" },
  "gemini-1.5-pro": { name: "Google Gemini 1.5 Pro", inputCost: 1.25, outputCost: 5.00, provider: "google" },
  "gemini-1.5-flash": { name: "Google Gemini 1.5 Flash", inputCost: 0.075, outputCost: 0.30, provider: "google" },
  "llama-3.1-70b": { name: "Llama 3.1 70B (Open Weights via Groq/Bedrock)", inputCost: 0.59, outputCost: 0.79, provider: "other" },
};

/**
 * Calculates detailed cost audits and optimizations based on user inputs.
 */
export function runSpendAudit(input: SpendInput): AuditResults {
  const recommendations: AuditRecommendation[] = [];
  
  let apiSpend = 0;
  let apiSavings = 0;
  let seatSpend = 0;
  let seatSavings = 0;
  let computeSpend = 0;
  let computeSavings = 0;

  // 1. Audit API & Token Spend
  input.apis.forEach((api, idx) => {
    apiSpend += api.cost;
    const modelKey = api.model.toLowerCase();
    
    // Check if we have exact model catalog rates
    const catalogInfo = MODEL_CATALOG[modelKey];
    
    // Core API Optimization Rule 1: GPT-4o/Claude Sonnet for simple task classification or low-context workflows
    if (catalogInfo && (modelKey === "gpt-4o" || modelKey === "claude-3-5-sonnet")) {
      const isSimpleUseCase = input.useCase === "customer-support" || input.useCase === "general";
      
      let recommendedModel = "";
      let newRateInput = 0;
      let newRateOutput = 0;

      if (catalogInfo.provider === "openai") {
        recommendedModel = "gpt-4o-mini";
        newRateInput = MODEL_CATALOG["gpt-4o-mini"].inputCost;
        newRateOutput = MODEL_CATALOG["gpt-4o-mini"].outputCost;
      } else {
        recommendedModel = "claude-3-5-haiku";
        newRateInput = MODEL_CATALOG["claude-3-5-haiku"].inputCost;
        newRateOutput = MODEL_CATALOG["claude-3-5-haiku"].outputCost;
      }

      // Calculate nominal token cost
      const nominalInputCost = api.monthlyTokensInput * newRateInput;
      const nominalOutputCost = api.monthlyTokensOutput * newRateOutput;
      const optimizedMonthlyCost = nominalInputCost + nominalOutputCost;
      
      // Calculate potential savings (ensure we don't save more than the API cost itself)
      const potentialMonthlySavings = Math.max(0, api.cost - optimizedMonthlyCost);

      if (potentialMonthlySavings > 50) { // Only recommend if savings are significant (> $50)
        apiSavings += potentialMonthlySavings;
        recommendations.push({
          id: `api-downgrade-${idx}`,
          category: "api",
          targetToolOrProvider: catalogInfo.name,
          severity: potentialMonthlySavings > 1000 ? "high" : "medium",
          currentDescription: `Running ${catalogInfo.name} for ${input.useCase} workloads at $${api.cost.toFixed(0)}/mo.`,
          recommendedAction: `Shift high-volume, low-complexity classification and chat pipelines to ${MODEL_CATALOG[recommendedModel].name}.`,
          monthlySavings: potentialMonthlySavings,
          reasoning: `Based on your average tokens (${api.monthlyTokensInput}M input, ${api.monthlyTokensOutput}M output), moving to ${recommendedModel} cuts raw API expenditure by up to ${( (potentialMonthlySavings / api.cost) * 100 ).toFixed(0)}% without impacting downstream task performance.`,
          alternativeProviderUrl: "https://credex.ai/optimize/api"
        });
      }
    }

    // Core API Optimization Rule 2: Non-OpenAI/Anthropic proprietary migration to open weights
    if (catalogInfo && modelKey === "gemini-1.5-pro") {
      const newRateInput = MODEL_CATALOG["gemini-1.5-flash"].inputCost;
      const newRateOutput = MODEL_CATALOG["gemini-1.5-flash"].outputCost;
      const optimizedMonthlyCost = (api.monthlyTokensInput * newRateInput) + (api.monthlyTokensOutput * newRateOutput);
      const potentialMonthlySavings = Math.max(0, api.cost - optimizedMonthlyCost);

      if (potentialMonthlySavings > 50) {
        apiSavings += potentialMonthlySavings;
        recommendations.push({
          id: `api-gemini-${idx}`,
          category: "api",
          targetToolOrProvider: "Gemini 1.5 Pro",
          severity: "medium",
          currentDescription: `Using Gemini 1.5 Pro costing $${api.cost.toFixed(0)}/mo.`,
          recommendedAction: `Leverage Gemini 1.5 Flash for high-throughput translation, parsing, or metadata extraction.`,
          monthlySavings: potentialMonthlySavings,
          reasoning: `Gemini 1.5 Flash is priced at a fraction of Pro's cost ($0.075/M vs $1.25/M input) while sharing the same 1M token context window. Ideal for batch jobs or high-volume indexing.`,
          alternativeProviderUrl: "https://credex.ai/optimize/api"
        });
      }
    }
  });

  // 2. Audit Subscription Seats
  let cursorSeats = 0;
  let copilotSeats = 0;
  let chatgptSeats = 0;
  let claudeSeats = 0;

  input.seats.forEach((seat) => {
    seatSpend += seat.cost;
    const name = seat.toolName.toLowerCase();
    if (name === "cursor") cursorSeats = seat.seatCount;
    if (name === "github-copilot") copilotSeats = seat.seatCount;
    if (name === "chatgpt-plus") chatgptSeats = seat.seatCount;
    if (name === "claude-pro") claudeSeats = seat.seatCount;
  });

  // Seat Optimization Rule 1: Developer Chat Seat Redundancy
  // Developers with Cursor or Copilot licenses already have access to in-editor LLM queries.
  // Double-provisioning separate ChatGPT Plus/Claude Pro seats for the same developers is highly redundant.
  const activeCodingSeats = Math.max(cursorSeats, copilotSeats);
  const activeChatSeats = chatgptSeats + claudeSeats;

  if (activeCodingSeats > 0 && activeChatSeats > 0) {
    // Redundant seats is the overlap between developers coding and developers with standalone chat packages
    // We assume engineers are a subset of the team size, capped at the actual chat seats
    const redundantSeats = Math.min(activeCodingSeats, activeChatSeats);
    const monthlySeatCostSaved = redundantSeats * 20; // Standard ChatGPT Plus/Claude Pro seat rate

    if (monthlySeatCostSaved > 0) {
      seatSavings += monthlySeatCostSaved;
      recommendations.push({
        id: "seat-developer-redundancy",
        category: "seat",
        targetToolOrProvider: "ChatGPT Plus / Claude Pro",
        severity: "medium",
        currentDescription: `Double-paying for ${chatgptSeats} ChatGPT Plus and ${claudeSeats} Claude Pro seats alongside coding assistants.`,
        recommendedAction: `Deprecate standalone chat accounts for developers equipped with Cursor or GitHub Copilot.`,
        monthlySavings: monthlySeatCostSaved,
        reasoning: `Cursor and GitHub Copilot support integrated chat models directly inside the editor (including Claude 3.5 Sonnet and GPT-4o keys). Standalone browser licenses represent direct subscription overlap for engineering personnel.`,
        alternativeProviderUrl: "https://credex.ai/optimize/seats"
      });
    }
  }

  // Seat Optimization Rule 2: Cursor vs. Github Copilot Double Pay
  if (cursorSeats > 0 && copilotSeats > 0) {
    const redundantCodingSeats = Math.min(cursorSeats, copilotSeats);
    const monthlySavingsCoding = redundantCodingSeats * 19; // GitHub Copilot base price

    if (monthlySavingsCoding > 0) {
      seatSavings += monthlySavingsCoding;
      recommendations.push({
        id: "seat-coding-redundancy",
        category: "seat",
        targetToolOrProvider: "GitHub Copilot",
        severity: "medium",
        currentDescription: `Providing both Cursor ($40/mo) and GitHub Copilot ($19/mo) to the same engineering team.`,
        recommendedAction: `Standardize on Cursor and disable active GitHub Copilot subscriptions for Cursor users.`,
        monthlySavings: monthlySavingsCoding,
        reasoning: `Cursor replaces the autocomplete and indexing features of GitHub Copilot. Provisioning both to the same developers double-allocates developer tooling budgets.`,
        alternativeProviderUrl: "https://credex.ai/optimize/seats"
      });
    }
  }

  // 3. Audit Compute & Idle GPU costs
  input.compute.forEach((comp, idx) => {
    computeSpend += comp.monthlyCost;
    
    // Compute Rule 1: Idle GPU Audits
    // Startups often rent dedicated instance nodes (e.g. AWS EC2 GPU nodes or runpod pods) 24/7, resulting in high idle costs.
    if (comp.utilizationPercent < 40) {
      // Savings calculation: proportional to idle percent. If utilization is 10%, we are 90% idle.
      // Moving to serverless can realistically trim costs by 50-70%, accounting for container cold start buffers.
      const idlePercent = 100 - comp.utilizationPercent;
      const potentialComputeSavings = comp.monthlyCost * (idlePercent / 100) * 0.7; // 70% efficiency coefficient on serverless

      if (potentialComputeSavings > 50) {
        computeSavings += potentialComputeSavings;
        recommendations.push({
          id: `compute-idle-${idx}`,
          category: "compute",
          targetToolOrProvider: comp.providerName.toUpperCase(),
          severity: comp.monthlyCost > 2000 ? "high" : "medium",
          currentDescription: `Dedicated GPU instances showing low average utilization (${comp.utilizationPercent}% active).`,
          recommendedAction: `Migrate baseline batch workloads or inference routes to Serverless GPU providers or spot nodes.`,
          monthlySavings: potentialComputeSavings,
          reasoning: `Your dedicated instance is idle ${idlePercent}% of the time. Moving to serverless inference (e.g., RunPod serverless, Replicate) charging only per-millisecond execution captures significant savings.`,
          alternativeProviderUrl: "https://credex.ai/optimize/compute"
        });
      }
    }
  });

  const totalMonthlySavings = apiSavings + seatSavings + computeSavings;
  const totalYearlySavings = totalMonthlySavings * 12;

  return {
    totalCurrentSpend: apiSpend + seatSpend + computeSpend,
    totalMonthlySavings,
    totalYearlySavings,
    breakdown: {
      apiSpend,
      apiSavings,
      seatSpend,
      seatSavings,
      computeSpend,
      computeSavings,
    },
    recommendations: recommendations.sort((a, b) => b.monthlySavings - a.monthlySavings),
    inputSummary: {
      teamName: input.teamName,
      teamSize: input.teamSize,
      useCase: input.useCase,
    }
  };
}
