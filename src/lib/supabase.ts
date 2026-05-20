import { createClient } from "@supabase/supabase-js";
import { AuditReportDb, SpendInput, AuditResults } from "@/types";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// We only initialize Supabase if keys are set
const isSupabaseConfigured = supabaseUrl !== "" && supabaseAnonKey !== "";

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Paths for local JSON database fallbacks (running in server environment)
const dataDir = path.join(process.cwd(), "src/data");
const auditsFilePath = path.join(dataDir, "audits.json");
const leadsFilePath = path.join(dataDir, "leads.json");

// Helper to ensure filesystem storage exists
function ensureStorage() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(auditsFilePath)) {
      fs.writeFileSync(auditsFilePath, JSON.stringify({}), "utf-8");
    }
    if (!fs.existsSync(leadsFilePath)) {
      fs.writeFileSync(leadsFilePath, JSON.stringify([]), "utf-8");
    }
  } catch (err) {
    console.error("Local JSON database initialization failed:", err);
  }
}

/**
 * Persists audit results to Supabase (or fallback JSON storage if keys are absent).
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
      console.error("Supabase write failed, falling back to local storage file:", err);
    }
  }

  // Fallback to local file-based JSON storage
  ensureStorage();
  try {
    const fileData = fs.readFileSync(auditsFilePath, "utf-8") || "{}";
    const audits = JSON.parse(fileData);
    audits[auditId] = auditRecord;
    fs.writeFileSync(auditsFilePath, JSON.stringify(audits, null, 2), "utf-8");
  } catch (e) {
    console.warn("JSON file write failed for audit:", e);
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
        console.warn("Could not find record in Supabase, checking local JSON storage.");
      } else {
        return data as AuditReportDb;
      }
    } catch (err) {
      console.error("Supabase fetch failed, looking up local fallback files:", err);
    }
  }

  // Look in local JSON database
  ensureStorage();
  try {
    if (fs.existsSync(auditsFilePath)) {
      const fileData = fs.readFileSync(auditsFilePath, "utf-8") || "{}";
      const audits = JSON.parse(fileData);
      if (audits[id]) return audits[id];
    }
  } catch (e) {
    console.warn("Local JSON database lookup failed:", e);
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
      console.error("Supabase lead write failed, falling back to local files:", err);
    }
  }

  // Fallback to JSON list file
  ensureStorage();
  try {
    const fileData = fs.readFileSync(leadsFilePath, "utf-8") || "[]";
    const leads = JSON.parse(fileData);
    leads.push(leadRecord);
    fs.writeFileSync(leadsFilePath, JSON.stringify(leads, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.warn("JSON file write failed for lead:", e);
  }

  return true;
}

