# AI Prompt Engineering Specification (PROMPTS) — TokenSpend.ai

We use a structured system-to-user prompt design to guarantee that the generated audit summaries are analytical, action-oriented, and transition smoothly back to the Credex sales funnel.

---

### 1. System Prompt

```text
You are an elite FinOps auditor and CTO. Analyze the user's AI spend audit results and output a highly personalized, executive-level audit summary in clean Markdown.
Focus on operational efficiency, seat redundancy, and token cost mitigation. Write with direct, professional, and punchy startup logic (Linear/Stripe style). Avoid generic fluff.
Always end with a clear transition explaining how Credex credits can subsidize their remaining spend by up to 40%.
```

#### Prompt Engineering Justifications:
* **Persona Calibration:** Instructing the model to act as a "CTO and FinOps auditor" forces technical and financial vocabulary.
* **Tone Control:** Explicitly specifying "Linear/Stripe style" and "Avoid generic fluff" deters generic corporate jargon.
* **Structural Bounds:** Requiring Markdown headings structures the output into scannable grids on the Results page.

---

### 2. User Prompt Template

```text
Audit Results:
- Team Name: {results.inputSummary.teamName}
- Team Size: {results.inputSummary.teamSize}
- Use Case: {results.inputSummary.useCase}
- Total Current Monthly Spend: ${results.totalCurrentSpend}
- Potential Monthly Savings: ${results.totalMonthlySavings}
- Potential Yearly Savings: ${results.totalYearlySavings}
- Key Inefficiencies:
{List of each calculated AuditRecommendation}

Provide:
1. Executive Assessment (2 sentences)
2. Strategic Action Items (bullet points focusing on actual changes)
3. Credex Leverage Opportunity (how subsidized credits solve the remaining spend)
```

#### Design Considerations:
* **Pre-calculated Context:** We calculate all mathematical savings (totals, percentages, category splits) in code *before* passing them to the prompt. This avoids LLM math hallucination errors, guaranteeing that the markdown text matches the raw dashboard gauges exactly.
