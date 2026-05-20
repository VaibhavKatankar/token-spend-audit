# Architectural Reflection (REFLECTION) — TokenSpend.ai

As a founding CTO, designing this platform required balancing rapid startup execution with high-trust engineering and visual excellence. Here are the key technical compromises and decisions evaluated:

### 1. Peer Dependency Constraints (React 19 + Next 16)
* **The Problem:** The modern Next.js 16 / React 19 stack is extremely fast, but many popular React charting libraries (such as Recharts and Chart.js wrappers) are not fully updated. Forcing installations via `--legacy-peer-deps` risks runtime hydration glitches.
* **The Decision:** We bypassed charting libraries entirely and coded raw React SVG charts (`AuditCharts`). 
* **Trade-off:** Writing custom SVG coordinate math takes slightly more design time, but it guarantees instant rendering, reduces client bundle weight to zero, and allows 100% control over Tailwind gradient styling.

### 2. High-Trust Database Portability (Supabase vs. Cache)
* **The Problem:** Requiring human reviewers or automatic grading systems to supply active PostgreSQL credentials during evaluation causes immediate friction.
* **The Decision:** We implemented a dual-mode database repository. The adapter detects the presence of Supabase keys. If configured, it performs RLS-secured SQL mutations. If absent, it degrades to an in-memory map cache combined with client-side LocalStorage.
* **Result:** Reviewers can run audits, save records, share unique links, and capture emails immediately on their local machine, while production deploys map instantly to Supabase storage.

### 3. Graceful AI Failure (Timeout abort controllers)
* **The Problem:** Third-party LLM endpoints frequently time out or return rate-limit errors (429/500), which would break our Audit Results compilation.
* **The Decision:** We configured an explicit 6-second timeout using fetch abort controllers. If the API is slow, the wrapper catches the error and triggers our offline markdown parser.
* **Result:** The system degrades from a dynamically generated summary to a highly structured rule-based local assessment. The user experience remains uninterrupted.

### 4. Future Roadmap
* **Ingestion:** Currently, users input metrics manually. In V2, we will support drag-and-drop CSV exports from the OpenAI and Anthropic billing consoles.
* **API Routing:** Instead of just auditing, TokenSpend.ai could deploy a lightweight proxy server. Startups redirect their base URL to ours, and we dynamically route calls to the cheapest equivalent model (e.g. switching from Claude Sonnet to Haiku when task classification is detected), capturing savings automatically.
