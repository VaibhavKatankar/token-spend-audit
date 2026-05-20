# Verified Pricing Catalog (PRICING_DATA) — TokenSpend.ai

The mathematical models in our Spend Audit Engine are configured using verified retail and developer subscription pricing data from official vendor sheets as of May 2026.

---

### 1. API Token Rates (per Million Tokens in USD)

| Model Name | API Key | Input Cost / M | Output Cost / M | Official Source |
| :--- | :--- | :--- | :--- | :--- |
| **OpenAI GPT-4o** | `gpt-4o` | $5.00 | $15.00 | [OpenAI Pricing Console](https://openai.com/api/pricing) |
| **OpenAI GPT-4o-mini** | `gpt-4o-mini` | $0.15 | $0.60 | [OpenAI Pricing Console](https://openai.com/api/pricing) |
| **Anthropic Claude 3.5 Sonnet** | `claude-3-5-sonnet` | $3.00 | $15.00 | [Anthropic API Pricing](https://www.anthropic.com/pricing) |
| **Anthropic Claude 3.5 Haiku** | `claude-3-5-haiku` | $0.80 | $4.00 | [Anthropic API Pricing](https://www.anthropic.com/pricing) |
| **Google Gemini 1.5 Pro** | `gemini-1.5-pro` | $1.25 | $5.00 | [Google Cloud Vertex Pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing) |
| **Google Gemini 1.5 Flash** | `gemini-1.5-flash` | $0.075 | $0.30 | [Google Cloud Vertex Pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing) |
| **Llama 3.1 70B (Groq)** | `llama-3.1-70b` | $0.59 | $0.79 | [Groq Developer Console](https://groq.com/pricing) |

---

### 2. SaaS Developer Tools (per Seat in USD)

| Tool / Service Name | Monthly Rate / Seat | Yearly Commitment Rate | Official Source |
| :--- | :--- | :--- | :--- |
| **Cursor Business** | $40.00 | $40.00 | [Cursor pricing](https://cursor.com/pricing) |
| **GitHub Copilot Business** | $19.00 | $19.00 | [GitHub Copilot Pricing](https://github.com/features/copilot#pricing) |
| **ChatGPT Plus / Team** | $20.00 | $20.00 | [OpenAI ChatGPT Pricing](https://openai.com/chatgpt/pricing) |
| **Claude Pro / Team** | $20.00 | $20.00 | [Anthropic Claude Pricing](https://www.anthropic.com/claude) |

---

### 3. Compute GPU Nodes (Average Retail Rates in USD)

* **AWS p4d.24xlarge (8x A100 40GB):** ~$32.77 / hour
* **AWS g5.2xlarge (1x A10G):** ~$1.21 / hour
* **RunPod A100 (80GB SXM4) Dedicated:** ~$1.89 / hour
* **RunPod Serverless GPU (Baseline):** ~$0.0004 / second of execution
