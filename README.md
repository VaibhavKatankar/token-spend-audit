# TokenSpend.ai — AI Spend Audit Platform

An automated, high-fidelity FinOps auditing platform designed for startups and scale-ups to analyze model API usage, subscription seat bloat, and idle GPU compute costs. Sponsored by **Credex** to route optimized workloads to subsidized credit rates.

---

## ⚡ Key Features

1. **Four-Step Spend Audit Wizard:** Complete cost capturing across LLM APIs, team seat tools (ChatGPT, Claude Pro, Cursor, Copilot), and cloud GPU node providers.
2. **Deterministic Audit Engine:** Implements mathematically precise, financially grounded auditing rules covering token sizes, developer tool overlaps, and serverless GPU reallocations.
3. **Resilient AI Summary:** Generates custom markdown assessments using OpenAI API. Enforces a 6-second timeout and falls back to a highly polished local heuristic analysis engine if offline.
4. **Dynamic Open Graph Sharing:** Dynamically outputs social cards with exact savings figures and company branding on Edge runtimes.
5. **Supabase Database Persistence:** Automatically persists audit findings. Works with local caches when run without credentials.
6. **Lead Capture Integration:** Securely collects emails to dispatch transaction reports via Resend.

---

## 🛠️ Tech Stack

* **Frontend Framework:** Next.js App Router (TypeScript, Tailwind CSS, Framer Motion)
* **API Routings:** Next.js Server Actions and Edge APIs
* **Database & Auth:** Supabase PostgreSQL
* **Mail Delivery:** Resend transactional mailers
* **Test Suite:** Vitest for sub-second assertions

---

## 📂 Codebase Scaffolding

* [src/types/index.ts](file:///d:/my%20project/src/types/index.ts) — Data structures and payload definitions.
* [src/lib/audit-engine.ts](file:///d:/my%20project/src/lib/audit-engine.ts) — Programmatic formulas, catalogs, and recommendation rules.
* [src/lib/ai.ts](file:///d:/my%20project/src/lib/ai.ts) — LLM wrappers, timeout handlers, and offline summary generators.
* [src/lib/supabase.ts](file:///d:/my%20project/src/lib/supabase.ts) — Database adapters with client-side localStorage fallback logic.
* [src/lib/resend.ts](file:///d:/my%20project/src/lib/resend.ts) — Transactional SMTP email flows.
* [src/app/api/audit/route.ts](file:///d:/my%20project/src/app/api/audit/route.ts) — API endpoint executing calculations.
* [src/app/api/lead/route.ts](file:///d:/my%20project/src/app/api/lead/route.ts) — API endpoint saving lead logs.
* [src/app/api/og/route.tsx](file:///d:/my%20project/src/app/api/og/route.tsx) — Edge image rendering service.
* [src/components/audit/spend-form.tsx](file:///d:/my%20project/src/components/audit/spend-form.tsx) — Wizard questionnaire with prefill demo state.
* [src/components/audit/audit-charts.tsx](file:///d:/my%20project/src/components/audit/audit-charts.tsx) — Custom SVG cost distribution graphs.
* [src/components/shared/credex-cta.tsx](file:///d:/my%20project/src/components/shared/credex-cta.tsx) — Lead collection and credit signup form.
* [tests/](file:///d:/my%20project/tests) — Mathematical test suites.

---

## 🚀 Setup & Execution

### 1. Installation
Install workspace packages:
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
RESEND_API_KEY=your_resend_api_key
```
*Note: The platform is built to degrade gracefully. If these keys are omitted, the app falls back to localStorage caches and local console SMTP logging automatically.*

### 3. Run Dev Server
Launch the local Turbopack server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your browser.

### 4. Running Unit Tests
Execute Vitest test cases:
```bash
npx vitest run
```

### 5. Production Compilation
Compile the optimized production bundles:
```bash
npm run build
```

---

## 📖 Strategy Documents

Explore our detailed architectural and positioning research under the `docs` directory:
* [CTO Architectural Reflection](file:///d:/my%20project/docs/REFLECTION.md) — Compromises, peer dependencies, and custom SVG structures.
* [Developer Diary (DEVLOG)](file:///d:/my%20project/docs/DEVLOG.md) — Progress records.
* [AI Infrastructure Economics](file:///d:/my%20project/docs/ECONOMICS.md) — Dollar-for-token pricing sheets.
* [Go-To-Market & Lead Funnels](file:///d:/my%20project/docs/GTM.md) — Conversion strategies for Credex sales leads.
* [User Discovery Interviews](file:///d:/my%20project/docs/USER_INTERVIEWS.md) — Feedback from startup leaders.
* [System Architecture Overview](file:///d:/my%20project/docs/ARCHITECTURE.md) — Security boundaries and data tables.
* [Harness Testing Documentation](file:///d:/my%20project/docs/TESTS.md) — Edge validations.
* [Prompt Engineering Specs](file:///d:/my%20project/docs/PROMPTS.md) — LLM parameters.
* [Success Metrics & KPI Guidelines](file:///d:/my%20project/docs/METRICS.md) — Operational targets.
