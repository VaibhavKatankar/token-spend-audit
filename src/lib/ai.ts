import { AuditResults } from "@/types";

/**
 * Generates a polished, personalized markdown summary of the audit results.
 * If API keys are available, it queries an LLM. Otherwise (or on failure), it uses
 * a highly detailed local heuristic engine to generate a YC-grade contextual summary.
 */
export async function generateAuditSummary(results: AuditResults): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (apiKey) {
    try {
      const response = await fetchWithTimeout("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are an elite FinOps auditor and CTO. Analyze the user's AI spend audit results and output a highly personalized, executive-level audit summary in clean Markdown.
Focus on operational efficiency, seat redundancy, and token cost mitigation. Write with direct, professional, and punchy startup logic (Linear/Stripe style). Avoid generic fluff.
Always end with a clear transition explaining how Credex credits can subsidize their remaining spend by up to 40%.`
            },
            {
              role: "user",
              content: `Audit Results:
- Team Name: ${results.inputSummary.teamName}
- Team Size: ${results.inputSummary.teamSize}
- Use Case: ${results.inputSummary.useCase}
- Total Current Monthly Spend: $${results.totalCurrentSpend.toFixed(2)}
- Potential Monthly Savings: $${results.totalMonthlySavings.toFixed(2)}
- Potential Yearly Savings: $${results.totalYearlySavings.toFixed(2)}
- Key Inefficiencies:
${results.recommendations.map(r => `  * [${r.category.toUpperCase()}] ${r.targetToolOrProvider}: ${r.currentDescription} Savings: $${r.monthlySavings.toFixed(0)}/mo. Action: ${r.recommendedAction}`).join("\n")}

Provide:
1. Executive Assessment (2 sentences)
2. Strategic Action Items (bullet points focusing on actual changes)
3. Credex Leverage Opportunity (how subsidized credits solve the remaining spend)`
            }
          ],
          temperature: 0.3,
          max_tokens: 600,
        }),
        timeout: 6000 // 6-second timeout limit
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      }
      
      console.warn(`AI API call returned status ${response.status}. Falling back to offline engine.`);
    } catch (err) {
      console.warn("AI API call timed out or failed. Falling back to offline engine.", err);
    }
  }

  // Fallback Rule-Based Generation Engine
  return generateOfflineSummary(results);
}

/**
 * Robust fetch wrapper with timeout handling.
 */
async function fetchWithTimeout(resource: string, options: RequestInit & { timeout?: number }) {
  const { timeout = 8000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Detailed offline heuristic summary generator.
 * Emulates LLM analysis by building custom responses based on recommendations.
 */
function generateOfflineSummary(results: AuditResults): string {
  const { teamName, teamSize, useCase } = results.inputSummary;
  const monthlySavings = results.totalMonthlySavings;
  const yearlySavings = results.totalYearlySavings;

  const apiRecs = results.recommendations.filter(r => r.category === "api");
  const seatRecs = results.recommendations.filter(r => r.category === "seat");
  const compRecs = results.recommendations.filter(r => r.category === "compute");

  let assessment = "";
  if (monthlySavings > 2000) {
    assessment = `### Executive Assessment\n**${teamName}** is experiencing critical AI infrastructure spend inefficiencies, running at an optimized loss of **$${monthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo**. By refactoring high-cost LLM API endpoints and trimming subscription seat overlaps, the engineering team can reclaim **$${yearlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr** in pure margin, representing an immediate increase in startup runway.`;
  } else if (monthlySavings > 200) {
    assessment = `### Executive Assessment\n**${teamName}** exhibits moderate cost overruns of **$${monthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo**. While the baseline allocation matches a team of ${teamSize}, fine-tuning seat distributions and substituting lightweight models will trim waste by **$${yearlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr** without introducing functional regression.`;
  } else {
    assessment = `### Executive Assessment\n**${teamName}** has a lean AI stack with minimal overhead. We identified minor optimization opportunities totaling **$${monthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo**. While your current systems are highly efficient, maintaining governance as team size scales will prevent common subscription inflation.`;
  }

  let actionItems = "### Strategic Action Items\n";
  let itemIndex = 1;

  if (apiRecs.length > 0) {
    actionItems += `${itemIndex++}. **Refactor Token Allocations:** Move classification and simple processing workloads off premium endpoints (like GPT-4o) and route them to faster, cost-effective models (like GPT-4o-mini or Claude Haiku). This recovers up to 90% of your raw token spend.\n`;
  }
  if (seatRecs.length > 0) {
    actionItems += `${itemIndex++}. **Consolidate Coding Assistant Environments:** Consolidate active developer IDE environments. Remove standalone ChatGPT Plus/Claude Pro web subscriptions for engineers already using in-editor chat configurations like Cursor.\n`;
  }
  if (compRecs.length > 0) {
    actionItems += `${itemIndex++}. **GPU Infrastructure Reallocation:** Transition low-utilization GPU hosts to serverless endpoints or spot instance pricing to eliminate continuous hourly billing during idle periods.\n`;
  }
  if (results.recommendations.length === 0) {
    actionItems += `* Keep monitoring token ratios monthly to check for unexpected pipeline loops or unused API developer keys.\n`;
  }

  const credexOpportunity = `### Credex Leverage Opportunity
By partnering with **Credex**, you can subsidize your remaining optimized AI spending of **$${(results.totalCurrentSpend - monthlySavings).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo** by up to **40%**. Applying Credex's developer infrastructure credits allows you to maintain premium model API pipelines and GPU training tasks at fraction-of-cost billing.`;

  return `${assessment}\n\n${actionItems}\n\n${credexOpportunity}`;
}
