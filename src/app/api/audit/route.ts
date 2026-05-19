import { NextRequest, NextResponse } from "next/server";
import { runSpendAudit } from "@/lib/audit-engine";
import { generateAuditSummary } from "@/lib/ai";
import { dbSaveAudit } from "@/lib/supabase";
import { SpendInput } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: SpendInput = await req.json();

    // Simple validation of required fields
    if (!body.teamName || !body.teamSize || typeof body.teamSize !== "number") {
      return NextResponse.json(
        { error: "Invalid payload: teamName and teamSize are required." },
        { status: 400 }
      );
    }

    // Run audit logic
    const results = runSpendAudit(body);

    // Generate summary
    const summary = await generateAuditSummary(results);

    // Save record to DB
    const auditId = await dbSaveAudit(
      body.teamName,
      body.teamSize,
      results.totalCurrentSpend,
      body,
      results,
      summary
    );

    return NextResponse.json({
      success: true,
      auditId,
      results
    });
  } catch (err: any) {
    console.error("API /api/audit error:", err);
    return NextResponse.json(
      { error: "Internal server error occurred while executing the spend audit." },
      { status: 500 }
    );
  }
}
