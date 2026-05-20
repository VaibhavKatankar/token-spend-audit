# Testing Plan & Documentation (TESTS) — TokenSpend.ai

We use **Vitest** for lightweight, sub-second unit testing of our mathematical algorithms and fallback systems.

### 1. Test Files
* **`tests/audit-engine.test.ts`**: Verifies that the spend calculations, seat overlaps, and compute inefficiencies are calculated accurately.
* **`tests/fallback-ai.test.ts`**: Verifies that the offline summary engine parses input metrics and produces structured markdown reports under unconfigured API credentials.

### 2. Test Coverage & Rules Tested
1. **API Downgrade Logic:**
   - Verifies that high-volume, low-complexity support workloads running on `gpt-4o` trigger recommendations to downgrade to `gpt-4o-mini` or Claude Haiku.
   - Assures that savings calculations correctly subtract the new token rates from the reported costs.
2. **Seat Consolidation Overlaps:**
   - Verifies that Cursor and ChatGPT Plus seat overlaps are identified.
   - Confirms that savings are calculated based on standard seat costs ($20/seat).
3. **GPU Compute Inefficiencies:**
   - Validates that low-utilization GPU hosts (e.g. 10% active) trigger savings recommendations based on serverless GPU rates.
4. **Optimized Baseline Handling:**
   - Verifies that teams using lightweight models and high-utilization compute return zero savings recommendations, preventing "fake AI savings" bloat.

### 3. Execution Commands
To run the tests in the workspace root, execute:
```bash
# Run tests once in terminal
npx vitest run

# Run tests in watch mode for development
npx vitest
```
