"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SpendInput, ApiUsage, SeatUsage, ComputeUsage } from "@/types";
import { Plus, Trash2, ArrowRight, ArrowLeft, Loader2, Sparkles, Database } from "lucide-react";

export default function SpendForm() {
  const router = useRouter();
  
  // Current Wizard Step
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Spend Input Form State
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState(5);
  const [useCase, setUseCase] = useState<SpendInput["useCase"]>("coding");

  const [apis, setApis] = useState<ApiUsage[]>([]);
  const [seats, setSeats] = useState<SeatUsage[]>([]);
  const [compute, setCompute] = useState<ComputeUsage[]>([]);

  // Demo prefill data for user convenience and rapid testing
  const loadDemoData = () => {
    setTeamName("NovaAI Sandbox");
    setTeamSize(12);
    setUseCase("coding");
    setApis([
      { provider: "openai", model: "gpt-4o", monthlyTokensInput: 180, monthlyTokensOutput: 40, cost: 1500 },
      { provider: "google", model: "gemini-1.5-pro", monthlyTokensInput: 80, monthlyTokensOutput: 30, cost: 250 }
    ]);
    setSeats([
      { toolName: "cursor", seatCount: 10, costPerSeat: 40, cost: 400 },
      { toolName: "chatgpt-plus", seatCount: 8, costPerSeat: 20, cost: 160 }
    ]);
    setCompute([
      { providerName: "aws", useCase: "inference", monthlyCost: 4000, utilizationPercent: 15 }
    ]);
    setStep(1); // Keep on step 1 so they see the details
    setError("");
  };

  // Step 2 APIs Management
  const addApi = () => {
    setApis([...apis, { provider: "openai", model: "gpt-4o", monthlyTokensInput: 10, monthlyTokensOutput: 5, cost: 100 }]);
  };
  const removeApi = (index: number) => {
    setApis(apis.filter((_, idx) => idx !== index));
  };
  const updateApi = (index: number, field: keyof ApiUsage, value: any) => {
    const updated = [...apis];
    updated[index] = { ...updated[index], [field]: value };
    setApis(updated);
  };

  // Step 3 Seats Management
  const addSeat = () => {
    setSeats([...seats, { toolName: "chatgpt-plus", seatCount: 5, costPerSeat: 20, cost: 100 }]);
  };
  const removeSeat = (index: number) => {
    setSeats(seats.filter((_, idx) => idx !== index));
  };
  const updateSeat = (index: number, field: keyof SeatUsage, value: any) => {
    const updated = [...seats];
    if (field === "seatCount" || field === "costPerSeat") {
      const seatsCount = field === "seatCount" ? Number(value) : updated[index].seatCount;
      const rate = field === "costPerSeat" ? Number(value) : updated[index].costPerSeat;
      updated[index] = {
        ...updated[index],
        [field]: Number(value),
        cost: seatsCount * rate
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setSeats(updated);
  };

  // Step 4 Compute Management
  const addCompute = () => {
    setCompute([...compute, { providerName: "aws", useCase: "inference", monthlyCost: 500, utilizationPercent: 10 }]);
  };
  const removeCompute = (index: number) => {
    setCompute(compute.filter((_, idx) => idx !== index));
  };
  const updateCompute = (index: number, field: keyof ComputeUsage, value: any) => {
    const updated = [...compute];
    updated[index] = {
      ...updated[index],
      [field]: field === "monthlyCost" || field === "utilizationPercent" ? Number(value) : value
    };
    setCompute(updated);
  };

  // Submit Spend Data
  const handleSubmit = async () => {
    if (!teamName.trim()) {
      setError("Please specify a team name.");
      setStep(1);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload: SpendInput = {
        teamName,
        teamSize: Number(teamSize),
        useCase,
        apis,
        seats,
        compute
      };

      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Spend audit compilation failed.");
      }

      // Route to results
      router.push(`/report/${data.auditId}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during submission.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-card/85 backdrop-blur-md border border-border/80 rounded-2xl shadow-2xl overflow-hidden glow-card">
      {/* Wizard Header Bar */}
      <div className="border-b border-border bg-muted/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Step {step} of 4
          </span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
          <span className="text-sm font-bold text-white">
            {step === 1 && "General Context"}
            {step === 2 && "Model APIs Cost"}
            {step === 3 && "SaaS Tools & Seats"}
            {step === 4 && "GPU & Dedicated Compute"}
          </span>
        </div>

        {/* Demo Button */}
        {step === 1 && (
          <button
            type="button"
            onClick={loadDemoData}
            className="inline-flex items-center space-x-1.5 text-xs text-primary hover:text-primary-foreground border border-primary/20 bg-primary/5 hover:bg-primary/20 px-2.5 py-1 rounded transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Prefill Demo Startup</span>
          </button>
        )}
      </div>

      {/* Form Content */}
      <div className="p-6 md:p-8 min-h-[300px]">
        {error && (
          <div className="mb-6 text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* STEP 1: GENERAL */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Startup / Team Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Velocity Labs"
                  className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Total Team Size (Seats)
                </label>
                <input
                  type="number"
                  min={1}
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Primary Product Use Case
              </label>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value as SpendInput["useCase"])}
                className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
              >
                <option value="coding">Software Engineering (heavy IDE assistant usage)</option>
                <option value="customer-support">Customer Support (high classification & routing volume)</option>
                <option value="agent-workflows">Multi-Agent Systems (extremely high prompt cost ratios)</option>
                <option value="general">General Operations / Chatbots</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: MODEL APIS */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground max-w-md">
                Add active API workloads (OpenAI, Anthropic, Gemini, etc.) and average monthly token counts.
              </p>
              <button
                type="button"
                onClick={addApi}
                className="inline-flex items-center space-x-1 text-xs text-white bg-primary hover:bg-primary/95 px-3 py-1.5 rounded-lg transition-colors font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add API</span>
              </button>
            </div>

            {apis.length === 0 ? (
              <div className="border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground text-xs">
                No custom API workloads added. Tap &apos;Add API&apos; or press Next to skip.
              </div>
            ) : (
              <div className="space-y-4">
                {apis.map((api, idx) => (
                  <div key={idx} className="bg-muted/20 border border-border rounded-xl p-4 space-y-4 relative">
                    <button
                      type="button"
                      onClick={() => removeApi(idx)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Provider</label>
                        <select
                          value={api.provider}
                          onChange={(e) => updateApi(idx, "provider", e.target.value)}
                          className="w-full bg-muted/40 border border-border rounded-md px-2.5 py-1.5 text-xs text-white"
                        >
                          <option value="openai">OpenAI</option>
                          <option value="anthropic">Anthropic</option>
                          <option value="google">Google</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Model Name</label>
                        <select
                          value={api.model}
                          onChange={(e) => updateApi(idx, "model", e.target.value)}
                          className="w-full bg-muted/40 border border-border rounded-md px-2.5 py-1.5 text-xs text-white"
                        >
                          <option value="gpt-4o">gpt-4o</option>
                          <option value="gpt-4o-mini">gpt-4o-mini</option>
                          <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
                          <option value="claude-3-5-haiku">claude-3-5-haiku</option>
                          <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                          <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                          <option value="llama-3.1-70b">llama-3.1-70b</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                          Tokens Input (M/mo)
                        </label>
                        <input
                          type="number"
                          value={api.monthlyTokensInput}
                          onChange={(e) => updateApi(idx, "monthlyTokensInput", Number(e.target.value))}
                          placeholder="e.g. 50"
                          className="w-full bg-muted/40 border border-border rounded-md px-2.5 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                          Tokens Output (M/mo)
                        </label>
                        <input
                          type="number"
                          value={api.monthlyTokensOutput}
                          onChange={(e) => updateApi(idx, "monthlyTokensOutput", Number(e.target.value))}
                          placeholder="e.g. 10"
                          className="w-full bg-muted/40 border border-border rounded-md px-2.5 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="max-w-[200px]">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                        Reported Monthly Cost ($)
                      </label>
                      <input
                        type="number"
                        value={api.cost}
                        onChange={(e) => updateApi(idx, "cost", Number(e.target.value))}
                        className="w-full bg-muted/40 border border-border rounded-md px-2.5 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: SAAS SEATS */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground max-w-md">
                Add productivity and development tools (ChatGPT, Claude Pro, Cursor, GitHub Copilot).
              </p>
              <button
                type="button"
                onClick={addSeat}
                className="inline-flex items-center space-x-1 text-xs text-white bg-primary hover:bg-primary/95 px-3 py-1.5 rounded-lg transition-colors font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Tool</span>
              </button>
            </div>

            {seats.length === 0 ? (
              <div className="border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground text-xs">
                No SaaS developer tools added. Tap &apos;Add Tool&apos; or press Next to skip.
              </div>
            ) : (
              <div className="space-y-4">
                {seats.map((seat, idx) => (
                  <div key={idx} className="bg-muted/20 border border-border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative">
                    <button
                      type="button"
                      onClick={() => removeSeat(idx)}
                      className="absolute right-3 top-3 md:static text-muted-foreground hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Tool Name</label>
                        <select
                          value={seat.toolName}
                          onChange={(e) => updateSeat(idx, "toolName", e.target.value)}
                          className="w-full bg-muted/40 border border-border rounded-md px-2.5 py-1.5 text-xs text-white"
                        >
                          <option value="chatgpt-plus">ChatGPT Plus ($20)</option>
                          <option value="claude-pro">Claude Pro ($20)</option>
                          <option value="cursor">Cursor Business ($40)</option>
                          <option value="github-copilot">GitHub Copilot ($19)</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Seats Count</label>
                        <input
                          type="number"
                          value={seat.seatCount}
                          onChange={(e) => updateSeat(idx, "seatCount", e.target.value)}
                          className="w-full bg-muted/40 border border-border rounded-md px-2.5 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                          Cost per Seat ($/mo)
                        </label>
                        <input
                          type="number"
                          value={seat.costPerSeat}
                          onChange={(e) => updateSeat(idx, "costPerSeat", e.target.value)}
                          className="w-full bg-muted/40 border border-border rounded-md px-2.5 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Calculated Total</label>
                        <div className="w-full bg-muted/20 border border-border rounded-md px-2.5 py-1.5 text-xs text-muted-foreground">
                          ${seat.cost}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 4: COMPUTE */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground max-w-md">
                Add server/GPU instances (AWS, GCP, RunPod, Lambda Labs) and their utilization ratios.
              </p>
              <button
                type="button"
                onClick={addCompute}
                className="inline-flex items-center space-x-1 text-xs text-white bg-primary hover:bg-primary/95 px-3 py-1.5 rounded-lg transition-colors font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Compute</span>
              </button>
            </div>

            {compute.length === 0 ? (
              <div className="border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground text-xs">
                No GPU/Compute nodes added. Tap &apos;Add Compute&apos; or Submit to finish.
              </div>
            ) : (
              <div className="space-y-4">
                {compute.map((comp, idx) => (
                  <div key={idx} className="bg-muted/20 border border-border rounded-xl p-4 space-y-4 relative">
                    <button
                      type="button"
                      onClick={() => removeCompute(idx)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Provider</label>
                        <select
                          value={comp.providerName}
                          onChange={(e) => updateCompute(idx, "providerName", e.target.value)}
                          className="w-full bg-muted/40 border border-border rounded-md px-2.5 py-1.5 text-xs text-white"
                        >
                          <option value="aws">AWS</option>
                          <option value="gcp">GCP</option>
                          <option value="runpod">RunPod</option>
                          <option value="lambdalabs">Lambda Labs</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Use Case</label>
                        <select
                          value={comp.useCase}
                          onChange={(e) => updateCompute(idx, "useCase", e.target.value)}
                          className="w-full bg-muted/40 border border-border rounded-md px-2.5 py-1.5 text-xs text-white"
                        >
                          <option value="inference">Inference (Real-time LLM API)</option>
                          <option value="training">Training / Fine-Tuning</option>
                          <option value="idle-dev">Idle Dev Instances</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                          Monthly Cost ($)
                        </label>
                        <input
                          type="number"
                          value={comp.monthlyCost}
                          onChange={(e) => updateCompute(idx, "monthlyCost", e.target.value)}
                          className="w-full bg-muted/40 border border-border rounded-md px-2.5 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                          Active Utilization (%)
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={comp.utilizationPercent}
                          onChange={(e) => updateCompute(idx, "utilizationPercent", e.target.value)}
                          className="w-full bg-muted/40 border border-border rounded-md px-2.5 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wizard Footer Controls */}
      <div className="border-t border-border bg-muted/40 px-6 py-4 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center space-x-1.5 text-xs text-muted-foreground hover:text-white bg-transparent border border-border hover:bg-muted px-4 py-2 rounded-lg transition-all font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="inline-flex items-center space-x-1.5 text-xs text-white bg-primary hover:bg-primary/90 px-5 py-2.5 rounded-lg transition-all font-semibold"
          >
            <span>Next Step</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-bold rounded-lg group bg-gradient-to-br from-primary to-indigo-500 group-hover:from-primary group-hover:to-indigo-500 text-white hover:text-white focus:ring-4 focus:outline-none focus:ring-primary/30 disabled:opacity-50"
          >
            <span className="relative px-5 py-2 bg-background rounded-md group-hover:bg-opacity-0 flex items-center justify-center gap-1.5 transition-all">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Compiling Audit...</span>
                </>
              ) : (
                <>
                  <Database className="h-4 w-4" />
                  <span>Execute Audit</span>
                </>
              )}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
