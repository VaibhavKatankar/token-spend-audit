import { createClient } from "@supabase/supabase-js";
import { AuditReportDb, SpendInput, AuditResults } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// We only initialize Supabase if keys are set
const isSupabaseConfigured = supabaseUrl !== "" && supabaseAnonKey !== "";

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server-side / Memory-side fallback storage to enable full features without Supabase keys
const mockAuditsCache = new Map<string, AuditReportDb>();
const mockLeadsCache: any[] = [];

/**
 * Persists audit results to Supabase (or fallback storage if keys are absent).
 */
export async function dbSaveAudit(
  teamName: string,
  teamSize: number,
  totalSpend: number,
  inputData: SpendInput,
  savingsMetrics: AuditResults,
  aiSummary: string | null
): Promise<string> {
  const auditId = typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
  const createdAt = new Date().toISOString();

  const auditRecord: AuditReportDb = {
    id: auditId,
    created_at: createdAt,
    team_name: teamName,
    team_size: teamSize,
    total_monthly_spend: totalSpend,
    input_data: inputData,
    savings_metrics: savingsMetrics,
    ai_summary: aiSummary,
    is_public: true
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("audits")
        .insert({
          id: auditId,
          team_name: teamName,
          team_size: teamSize,
          total_monthly_spend: totalSpend,
          input_data: inputData,
          savings_metrics: savingsMetrics,
          ai_summary: aiSummary,
          is_public: true
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (err) {
      console.error("Supabase write failed, falling back to local memory store:", err);
    }
  }

  // Fallback to local memory / localstorage cache
  mockAuditsCache.set(auditId, auditRecord);
  if (typeof window !== "undefined") {
    try {
      const localStore = localStorage.getItem("token_spend_audits") || "{}";
      const audits = JSON.parse(localStore);
      audits[auditId] = auditRecord;
      localStorage.setItem("token_spend_audits", JSON.stringify(audits));
    } catch (e) {
      console.warn("localStorage write failed:", e);
    }
  }

  return auditId;
}

/**
 * Retrieves audit report from Supabase (or fallback storage).
 */
export async function dbGetAudit(id: string): Promise<AuditReportDb | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("audits")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        // Fall back to memory lookup if not found in Postgres
        console.warn("Could not find record in Supabase, checking memory caches.");
      } else {
        return data as AuditReportDb;
      }
    } catch (err) {
      console.error("Supabase fetch failed, looking up fallback caches:", err);
    }
  }

  // Look in Memory cache
  if (mockAuditsCache.has(id)) {
    return mockAuditsCache.get(id) || null;
  }

  // Look in LocalStorage
  if (typeof window !== "undefined") {
    try {
      const localStore = localStorage.getItem("token_spend_audits") || "{}";
      const audits = JSON.parse(localStore);
      if (audits[id]) return audits[id];
    } catch (e) {
      console.warn("localStorage lookup failed:", e);
    }
  }

  return null;
}

/**
 * Submits lead contacts.
 */
export async function dbSaveLead(
  email: string,
  companyName: string,
  auditId: string,
  creditsRequested: boolean
): Promise<boolean> {
  const leadRecord = {
    id: typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
    created_at: new Date().toISOString(),
    audit_id: auditId,
    email,
    company_name: companyName,
    credits_requested: creditsRequested,
    status: "new"
  };

  if (supabase) {
    try {
      const { error } = await supabase
        .from("leads")
        .insert({
          email,
          company_name: companyName,
          audit_id: auditId,
          credits_requested: creditsRequested
        });

      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Supabase lead write failed, falling back to local memory:", err);
    }
  }

  // Fallback to memory
  mockLeadsCache.push(leadRecord);
  if (typeof window !== "undefined") {
    try {
      const localStore = localStorage.getItem("token_spend_leads") || "[]";
      const leads = JSON.parse(localStore);
      leads.push(leadRecord);
      localStorage.setItem("token_spend_leads", JSON.stringify(leads));
    } catch (e) {
      console.warn("localStorage write failed for leads:", e);
    }
  }

  return true;
}
