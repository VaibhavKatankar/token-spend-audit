import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "";

export const resend = resendApiKey !== "" ? new Resend(resendApiKey) : null;

/**
 * Sends audit PDF download & savings summary confirmation to user email.
 */
export async function sendAuditConfirmationEmail(
  toEmail: string,
  companyName: string,
  totalSavings: number,
  reportUrl: string
): Promise<boolean> {
  const subject = `AI Spend Audit: $${totalSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}/year in savings identified for ${companyName}`;
  
  const htmlContent = `
    <div style="font-family: sans-serif; background-color: #030303; color: #fafafa; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1f1f1f;">
      <h2 style="color: #6366f1; margin-bottom: 20px;">TokenSpend.ai</h2>
      <p style="font-size: 16px; line-height: 1.5; color: #ededed;">
        We have finished auditing the AI infrastructure spend for <strong>${companyName}</strong>.
      </p>
      <div style="background-color: #0d0d0d; border: 1px solid #1f1f1f; padding: 20px; border-radius: 8px; margin: 24px 0;">
        <p style="margin: 0; font-size: 14px; color: #a3a3a3; text-transform: uppercase; letter-spacing: 0.05em;">Identified Annual Savings</p>
        <h1 style="margin: 8px 0 0 0; color: #10b981; font-size: 36px;">$${totalSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr</h1>
      </div>
      <p style="font-size: 15px; line-height: 1.5; color: #a3a3a3; margin-bottom: 30px;">
        To review the complete line-by-line breakdown, modify dials, and check seat overlaps, view your interactive public report:
      </p>
      <a href="${reportUrl}" style="background-color: #6366f1; color: #fafafa; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; text-align: center;">
        View Interactive Spend Report
      </a>
      <hr style="border: 0; border-top: 1px solid #1f1f1f; margin: 30px 0;" />
      <p style="font-size: 12px; color: #737373;">
        Want to unlock these savings immediately? Route your LLM and GPU workloads through Credex to secure up to 40% subsidized credits on premium nodes.
      </p>
    </div>
  `;

  if (resend) {
    try {
      const response = await resend.emails.send({
        from: "TokenSpend.ai <audits@tokenspend.ai>",
        to: [toEmail],
        subject,
        html: htmlContent,
      });

      if (response.error) {
        console.warn("Resend email delivery failed:", response.error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Resend API exception:", err);
      return false;
    }
  }

  // Fallback console log for local environment demonstration
  console.log(`
=========================================
[SMTP Fallback] Transactional Email Logged:
To: ${toEmail}
Subject: ${subject}
Report URL: ${reportUrl}
Content Preview: Savings of $${totalSavings}/yr identified.
=========================================
  `);

  return true;
}
