export interface ApiUsage {
  provider: "openai" | "anthropic" | "google" | "other";
  model: string;
  monthlyTokensInput: number; // in millions
  monthlyTokensOutput: number; // in millions
  cost: number;
}

export interface SeatUsage {
  toolName: "chatgpt-plus" | "claude-pro" | "cursor" | "github-copilot" | "other";
  seatCount: number;
  costPerSeat: number;
  cost: number;
}

export interface ComputeUsage {
  providerName: "aws" | "gcp" | "runpod" | "lambdalabs" | "other";
  useCase: "training" | "inference" | "idle-dev" | "other";
  monthlyCost: number;
  utilizationPercent: number; // e.g. 10% indicates 90% idle GPU time
}

export interface SpendInput {
  teamName: string;
  teamSize: number;
  useCase: "coding" | "customer-support" | "agent-workflows" | "general";
  apis: ApiUsage[];
  seats: SeatUsage[];
  compute: ComputeUsage[];
}

export interface AuditRecommendation {
  id: string;
  category: "api" | "seat" | "compute";
  targetToolOrProvider: string;
  severity: "high" | "medium" | "low";
  currentDescription: string;
  recommendedAction: string;
  monthlySavings: number;
  reasoning: string;
  alternativeProviderUrl?: string; // e.g. Credex promo, Groq, Bedrock, etc.
}

export interface AuditResults {
  totalCurrentSpend: number;
  totalMonthlySavings: number;
  totalYearlySavings: number;
  breakdown: {
    apiSpend: number;
    apiSavings: number;
    seatSpend: number;
    seatSavings: number;
    computeSpend: number;
    computeSavings: number;
  };
  recommendations: AuditRecommendation[];
  inputSummary: {
    teamName: string;
    teamSize: number;
    useCase: string;
  };
}

export interface AuditReportDb {
  id: string;
  created_at: string;
  team_name: string;
  team_size: number;
  total_monthly_spend: number;
  input_data: SpendInput;
  savings_metrics: AuditResults;
  ai_summary: string | null;
  is_public: boolean;
}

export interface LeadCaptureInput {
  email: string;
  companyName: string;
  auditId: string;
  creditsRequested: boolean;
}
