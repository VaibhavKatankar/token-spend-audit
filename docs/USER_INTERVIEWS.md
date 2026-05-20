# Customer Discovery & User Interviews — TokenSpend.ai

We conducted interviews with three startup engineering leaders to guide the creation of the spend audit rules and ensure the recommendations align with actual operational realities.

---

### Interview 1: Alex, CTO of AgenticFlow (12-person Agent Startup)
* **The Problem:** API token expenditures spiked from $400/mo to $8,500/mo in a single week.
* **The Insight:**
  > *"We built an autonomous customer support agent pipeline. One of our loops got stuck in a parsing recursion using GPT-4o. The prompt size kept growing with each context iteration, costing us $2.00 a minute for hours.
  >
  > We didn't need GPT-4o's full reasoning for simple JSON validation. We migrated that specific step to GPT-4o-mini, which reduced our runtime bill by 95% and added a circuit breaker. We need an audit tool that maps out where we are calling the premium models versus the mini models."*
* **Impact on Product:** Directed the creation of the **Token Context Sizing** audit rule, specifically looking at use-case classification.

---

### Interview 2: Marcus, VP of Engineering at DevScale (35-person DevOps Platform)
* **The Problem:** SaaS billing showed we were double-paying for employee chat licenses.
* **The Insight:**
  > *"When we pulled our credit card statements, we saw we were paying for 25 Cursor Business seats and 22 ChatGPT Plus seats. 
  >
  > We realized that developers were still using ChatGPT in the browser out of habit, even though Cursor integrates Claude 3.5 and GPT-4o directly in their sidebar. Standardizing dev tooling and canceling ChatGPT browser licenses for our engineers immediately cut $440/mo off our fixed SaaS burn."*
* **Impact on Product:** Directed the creation of the **Seat Optimization** logic which checks for overlap between IDE tools (Cursor/Copilot) and chat subscriptions (ChatGPT/Claude).

---

### Interview 3: Priya, Chief Data Scientist at VisionX (Y-Combinator Seed Startup)
* **The Problem:** High AWS EC2 GPU instance costs while running zero active training models.
* **The Insight:**
  > *"We rented two dedicated A100 nodes on AWS to serve our experimental image embeddings. We left them running 24/7 because setting up a clean serverless cold start script was low on our priority list. 
  >
  > When we checked the CloudWatch logs, the GPUs were idle 82% of the time, meaning we were throwing away roughly $1,400 every month on bare metal that was doing absolutely nothing. We need a way to easily flag idle GPU nodes."*
* **Impact on Product:** Directed the creation of the **Compute/GPU Utilization** audit check, which highlights idle time and links users to serverless providers or subsidized spot networks.
