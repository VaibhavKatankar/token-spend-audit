import { describe, it, expect } from "vitest";
import { runSpendAudit } from "../src/lib/audit-engine";
import { SpendInput } from "../src/types";

describe("Spend Audit Engine Core Calculations", () => {
  it("correctly identifies API cost savings when downgrading GPT-4o for simple tasks", () => {
    const input: SpendInput = {
      teamName: "Test Startup",
      teamSize: 10,
      useCase: "customer-support", // Simple classification task
      apis: [
        {
          provider: "openai",
          model: "gpt-4o",
          monthlyTokensInput: 200, // 200 Million input tokens
          monthlyTokensOutput: 50,  // 50 Million output tokens
          cost: 2000,              // Nominal reported cost: $2,000
        }
      ],
      seats: [],
      compute: []
    };

    const results = runSpendAudit(input);

    expect(results.totalCurrentSpend).toBe(2000);
    expect(results.totalMonthlySavings).toBeGreaterThan(0);
    
    // GPT-4o-mini costs:
    // Input: 200M * $0.15 = $30
    // Output: 50M * $0.60 = $30
    // Total optimized = $60
    // Savings: $2,000 - $60 = $1,940
    expect(results.totalMonthlySavings).toBe(1940);
    expect(results.totalYearlySavings).toBe(1940 * 12);
    
    const apiRec = results.recommendations.find(r => r.category === "api");
    expect(apiRec).toBeDefined();
    expect(apiRec?.severity).toBe("high");
    expect(apiRec?.recommendedAction).toContain("GPT-4o-mini");
  });

  it("correctly flags seat redundancies between Cursor and standalone browser chat engines", () => {
    const input: SpendInput = {
      teamName: "Test Dev Team",
      teamSize: 15,
      useCase: "coding",
      apis: [],
      seats: [
        {
          toolName: "cursor",
          seatCount: 10,
          costPerSeat: 40,
          cost: 400
        },
        {
          toolName: "chatgpt-plus",
          seatCount: 8,
          costPerSeat: 20,
          cost: 160
        }
      ],
      compute: []
    };

    const results = runSpendAudit(input);

    // Overlap: min(10 Cursor, 8 ChatGPT Plus) = 8 redundant seats.
    // Redundant savings = 8 * 20 = $160
    expect(results.breakdown.seatSavings).toBe(160);
    
    const seatRec = results.recommendations.find(r => r.category === "seat");
    expect(seatRec).toBeDefined();
    expect(seatRec?.targetToolOrProvider).toBe("ChatGPT Plus / Claude Pro");
  });

  it("identifies compute cost savings on low GPU utilization nodes", () => {
    const input: SpendInput = {
      teamName: "AI Research Corp",
      teamSize: 8,
      useCase: "general",
      apis: [],
      seats: [],
      compute: [
        {
          providerName: "aws",
          useCase: "inference",
          monthlyCost: 5000,
          utilizationPercent: 10 // 90% idle
        }
      ]
    };

    const results = runSpendAudit(input);

    // Idle = 90%. Proportional savings: 5000 * 0.9 * 0.7 = $3,150
    expect(results.breakdown.computeSavings).toBe(3150);
    
    const compRec = results.recommendations.find(r => r.category === "compute");
    expect(compRec).toBeDefined();
    expect(compRec?.severity).toBe("high");
    expect(compRec?.reasoning).toContain("idle 90%");
  });

  it("returns zero savings if workloads are already optimized", () => {
    const input: SpendInput = {
      teamName: "Optimized Team",
      teamSize: 5,
      useCase: "coding",
      apis: [
        {
          provider: "openai",
          model: "gpt-4o-mini", // Already mini
          monthlyTokensInput: 10,
          monthlyTokensOutput: 5,
          cost: 4.5
        }
      ],
      seats: [
        {
          toolName: "cursor",
          seatCount: 5,
          costPerSeat: 40,
          cost: 200
        }
      ],
      compute: [
        {
          providerName: "aws",
          useCase: "training",
          monthlyCost: 1000,
          utilizationPercent: 85 // High active utilization
        }
      ]
    };

    const results = runSpendAudit(input);

    expect(results.totalMonthlySavings).toBe(0);
    expect(results.recommendations.length).toBe(0);
  });
});
