import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Read query arguments
    const company = searchParams.get("company") || "Your Startup";
    const savings = searchParams.get("savings") || "0";
    const parsedSavings = parseFloat(savings);
    const formattedSavings = isNaN(parsedSavings) 
      ? "$0/yr" 
      : `$${parsedSavings.toLocaleString("en-US", { maximumFractionDigits: 0 })}/yr`;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#030303",
            color: "#ffffff",
            fontFamily: "sans-serif",
            padding: "80px",
            border: "8px solid #1f1f23",
            position: "relative",
          }}
        >
          {/* Neon Purple accent glow */}
          <div
            style={{
              position: "absolute",
              top: "-200px",
              left: "-200px",
              width: "600px",
              height: "600px",
              borderRadius: "300px",
              background: "rgba(99, 102, 241, 0.15)",
              filter: "blur(120px)",
            }}
          />

          {/* Branding Top */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "40px",
              alignSelf: "flex-start",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
                marginRight: "12px",
              }}
            />
            <span
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                letterSpacing: "-0.02em",
                color: "#a3a3a3",
              }}
            >
              TokenSpend.ai
            </span>
          </div>

          {/* Core Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "flex-start",
              flexGrow: 1,
            }}
          >
            <span
              style={{
                fontSize: "36px",
                color: "#737373",
                fontWeight: "500",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              AI Spend Audit — {company}
            </span>
            <span
              style={{
                fontSize: "64px",
                fontWeight: "800",
                color: "#ffffff",
                letterSpacing: "-0.03em",
                lineHeight: "1.1",
                marginBottom: "40px",
              }}
            >
              Identified AI Infrastructure Waste
            </span>

            {/* Savings Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#09090b",
                border: "2px solid #1f2937",
                padding: "24px 48px",
                borderRadius: "16px",
                alignSelf: "flex-start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    fontSize: "20px",
                    color: "#10b981",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "4px",
                  }}
                >
                  Projected Annual Savings
                </span>
                <span
                  style={{
                    fontSize: "80px",
                    fontWeight: "bold",
                    color: "#10b981",
                    lineHeight: "1.0",
                  }}
                >
                  {formattedSavings}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid #1f1f23",
              paddingTop: "32px",
              marginTop: "40px",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "20px",
                color: "#737373",
              }}
            >
              Audit APIs, subscription seats, and GPU compute
            </span>
            <span
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#6366f1",
              }}
            >
              Partnered with Credex
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err: any) {
    console.error("OG Image generation exception:", err);
    return new Response("Failed to generate social banner.", { status: 500 });
  }
}
