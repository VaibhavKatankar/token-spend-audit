# Go-To-Market (GTM) & Lead Acquisition Strategy — Credex

TokenSpend.ai is not just an auditor; it is a high-efficiency customer acquisition funnel for Credex. Here is how we turn audit outputs into enterprise sales leads:

### 1. The Value Proposition (The Hook)
Startups are burning seed capital on unoptimized LLM calls and dedicated idle GPU instances. CTOs are under pressure to cut burn rates.
* **The Pitch:** "Find out where your AI stack is leaking cash in 2 minutes. Free, non-custodial, no API keys required."
* **ICP Target:** CTOs, Tech Leads, and Finance Managers at Seed to Series B AI startups.

### 2. Lead Capture Mechanics & Conversion Loops
We capture high-intent leads through two distinct pathways:
1. **The Lead Capture Widget (Subsidized Credits):** On the audit report page, we display a clear call-to-action: *"Claim up to $5,000 in subsidized credits to cover your remaining spend."* To claim, they enter their email and company name.
2. **Email Delivery Flow:** To export the audit breakdown or share the findings with their finance team, we send a copy directly to their work inbox via Resend. This ensures we collect valid, high-trust corporate email addresses.

### 3. Viral Loop & Social Referral
* **Cryptographic Report Sharing:** When an audit finishes, a unique report URL is generated (e.g., `/report/[uuid]`).
* **Branded Dynamic OG Images:** When shared on LinkedIn or X (Twitter), our Edge endpoint (`/api/og`) automatically renders a custom card: *"Spend Audit: Velocity Labs saved $14,400/yr."*
* **The Social Loop:** Founders love sharing metrics. A tweet showing *"We cut our AI bill by 35% with TokenSpend.ai"* prompts other founders in their network to click and audit their own stack.

### 4. Sales Follow-Up Playbook
Once a lead is registered in Supabase, the Credex sales team receives the specific parameters:
* **The Intel:** The sales representative knows exactly what the startup uses (e.g., *"NovaAI spends $4,000/mo on AWS GPUs with only 15% utilization"*).
* **The Outreach:**
  > *"Hey team, we noticed your spend audit indicated $3,150/yr in GPU waste. We have subsidized serverless GPU node capacity available through Credex that can run your exact model for 40% less. Let's get you set up with $1,000 in trial credits."*
* **The Conversion:** The startup transitions from retail pricing (AWS/OpenAI) to Credex's subsidized routing system.
