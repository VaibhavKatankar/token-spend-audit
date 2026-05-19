import { NextRequest, NextResponse } from "next/server";
import { dbSaveLead, dbGetAudit } from "@/lib/supabase";
import { sendAuditConfirmationEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { email, companyName, auditId, creditsRequested } = await req.json();

    if (!email || !auditId) {
      return NextResponse.json(
        { error: "Email address and auditId are required parameters." },
        { status: 400 }
      );
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Save lead record in database
    await dbSaveLead(email, companyName || "Unknown", auditId, !!creditsRequested);

    // Retrieve audit findings to customize email subject & totals
    const auditRecord = await dbGetAudit(auditId);
    const totalSavings = auditRecord ? auditRecord.savings_metrics.totalYearlySavings : 0;
    
    // Construct absolute url path
    const origin = req.nextUrl.origin;
    const reportUrl = `${origin}/report/${auditId}`;

    // Send transaction email
    await sendAuditConfirmationEmail(email, companyName || "Your Startup", totalSavings, reportUrl);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API /api/lead error:", err);
    return NextResponse.json(
      { error: "Internal server error occurred while processing the lead capture." },
      { status: 500 }
    );
  }
}
