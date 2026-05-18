import { describe, it, expect } from "vitest";
import { generateAuditSummary } from "../src/lib/ai";
import { AuditResults } from "../src/types";

describe("AI Integration & Fallback Engine", () => {
  it("correctly produces a highly detailed fallback summary when no API key is present", async () => {
    const mockResults: AuditResults = {
      totalCurrentSpend: 3000,
      totalMonthlySavings: 1200,
      totalYearlySavings: 14400,
      breakdown: {
        apiSpend: 1500,
        apiSavings: 600,
        seatSpend: 500,
        seatSavings: 200,
        computeSpend: 1000,
        computeSavings: 400
      },
      recommendations: [
        {
          id: "rec-1",
          category: "api",
          targetToolOrProvider: "OpenAI GPT-4o",
          severity: "high",
          currentDescription: "Using GPT-4o at $1,500/mo.",
          recommendedAction: "Use GPT-4o-mini.",
          monthlySavings: 600,
          reasoning: "Token optimization savings"
        },
        {
          id: "rec-2",
          category: "seat",
          targetToolOrProvider: "ChatGPT Plus",
          severity: "medium",
          currentDescription: "Double paying.",
          recommendedAction: "Consolidate to Cursor.",
          monthlySavings: 200,
          reasoning: "Seat consolidation"
        }
      ],
      inputSummary: {
        teamName: "Velocity Labs",
        teamSize: 12,
        useCase: "coding"
      }
    };

    // Ensure environment key is empty for test run
    const originalKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    try {
      const summary = await generateAuditSummary(mockResults);
      
      expect(summary).toBeDefined();
      expect(summary).toContain("Velocity Labs");
      expect(summary).toContain("Executive Assessment");
      expect(summary).toContain("Strategic Action Items");
      expect(summary).toContain("Credex Leverage Opportunity");
      
      // Check mathematical representation in text
      expect(summary).toContain("1,200");
      expect(summary).toContain("14,400");
      expect(summary).toContain("1,800"); // optimized remaining spend: $3,000 - $1,200 = $1,800
    } finally {
      // Restore key
      process.env.OPENAI_API_KEY = originalKey;
    }
  });
});
