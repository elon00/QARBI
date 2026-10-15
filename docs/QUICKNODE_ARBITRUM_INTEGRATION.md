# ⚡ QuickNode Integration Guide for QARBI Protocol
## Arbitrum Open House Singapore // Builder Credits & Real-Time Event Pipeline

Welcome to the **QARBI Protocol** QuickNode Integration guide for **Arbitrum Open House Singapore**.

QARBI is an agent-native Web4 platform for autonomous AI agents with sovereign post-quantum identity (NIST FIPS 204 ML-DSA-65), on-chain task escrows, mathematical cellular state evolution (Stylus Rust WASM), and economic agency on Arbitrum.

Through our integration with **QuickNode**, QARBI builders and autonomous agents benefit from:
- **Zero-Stale Blocks**: High-throughput reads and low-latency JSON-RPC execution.
- **Unified Multi-Chain Orbit Support**: Arbitrum One, Arbitrum Sepolia, Arbitrum Nova, Robinhood Chain, and Gravity from the same provider.
- **QuickNode Streams**: Real-time event ingestion directly into QARBI's agent orchestration engine with zero block-polling lag.
- **Enterprise Grade Infrastructure**: SOC 1 Type 2, SOC 2 Type 2, and ISO 27001 certified.

---

## 🎁 How to Claim Your Free 3-Month QuickNode Build Plan

Open House Singapore builders receive **three months of the QuickNode [Build Plan](https://www.quicknode.com/pricing) for free** ($147 total value).

### Step-by-Step Redemption:
1. Log in or create an account at [QuickNode](https://www.quicknode.com/).
2. Open **Usage & Billing** in your dashboard.
3. In the **Usage** tab, select the **[Build Plan](https://www.quicknode.com/pricing)**.
4. ⚠️ **IMPORTANT**: You **MUST choose Monthly billing**, not annual, or the coupon code will not apply.
5. At checkout, enter coupon code:
   ```text
   ARBOHSGP
   ```
   *(Note: The code is strictly case-sensitive).*
6. Apply the coupon before adding payment details.
7. Need assistance? Reach out directly to **@[sensahill](https://t.me/sensahill)** on Telegram.

---

## 🌐 Multi-Chain & Orbit Endpoints Supported in QARBI

Whichever track you choose at Arbitrum Open House Singapore, QARBI and QuickNode support it out of the box:

| Chain / Orbit Rollup | Chain ID | Track | QuickNode Faucet & Docs |
|---|---|---|---|
| **Arbitrum Sepolia** | `421614` | Core Nitro / Stylus | [Arbitrum Sepolia Faucet](https://faucet.quicknode.com/arbitrum/sepolia) · [RPC Docs](https://www.quicknode.com/docs/arbitrum) |
| **Arbitrum One** | `42161` | Core Mainnet | [Arbitrum One Specs](https://www.quicknode.com/chains/arb) · [RPC Docs](https://www.quicknode.com/docs/arbitrum) |
| **Arbitrum Nova** | `42170` | Gaming & Social | [Arbitrum Nova Specs](https://www.quicknode.com/chains/nova) · [RPC Docs](https://www.quicknode.com/docs/arbitrum-nova) |
| **Robinhood Chain** | `46630` | Orbit Track | [Robinhood Testnet Faucet](https://faucet.quicknode.com/robinhood/testnet) · [RPC Docs](https://www.quicknode.com/docs/robinhood) |
| **Gravity Alpha** | `1625` | Orbit Track | [Gravity Docs](https://www.quicknode.com/docs/gravity) · [Gravity Specs](https://www.quicknode.com/chains/gravity) |

---

## 📡 QuickNode Streams: Real-Time Event Pipeline Setup

QuickNode Streams filter contract events, blocks, and transactions using JavaScript on QuickNode's edge nodes, pushing filtered events straight to QARBI's webhook.

### 1. Create a Stream in QuickNode Dashboard
1. Go to **Streams** > **Create Stream**.
2. Select your chain: **Arbitrum Sepolia** (or Arbitrum One / Nova / Robinhood).
3. Select Dataset: **Receipts** or **Block with Receipts**.
4. In **Filter & Modify with Code**, paste the JavaScript filter script from:
   ```text
   scripts/quicknode-stream-filter.js
   ```
5. Set Webhook Destination:
   ```text
   https://<your-server-or-ngrok>/api/webhooks/quicknode-stream
   ```
6. Set your HMAC secret key (and place it in your `.env` as `QUICKNODE_STREAM_SECRET`).
7. Click **Test Filter** and activate the Stream.

### 2. Events Processed by QARBI Streams Webhook
- `AgentRegistered`: Instant post-quantum agent identity indexing and synchronization.
- `TaskCreated`: Triggers Google Gemini 2.0 Flash reasoning agent to plan and formulate sub-tasks.
- `TaskSettled`: Finalizes $QARBI bounty payouts and updates agent reputation scores.
- `GridStepped`: Records Conway cellular automaton generational mutations in Stylus.
- `X402_PAYMENT`: Instant zero-polling confirmation of autonomous agent micro-payments.

---

## 🧪 Testing and Verifying Your QuickNode Pipeline

### Test 1: In-App Latency Benchmark
1. Run `npm run dev`.
2. Click the **QuickNode $147 FREE** button in the top navigation bar.
3. Switch to the **Multi-Chain RPC & Latency** tab.
4. Paste your QuickNode endpoint URL and click **Test Latency**.
5. Compare your QuickNode sub-millisecond response against public shared RPCs.

### Test 2: Ingest a Simulated Stream Event
1. In the QuickNode Modal, open the **Streams Event Pipeline** tab.
2. Click **Simulate Event**.
3. Watch the event appear instantly in the live event monitor.

### Test 3: Standalone Crypto & Reality Suite
```bash
# Verify cryptographic assertions (27/27)
npm run audit:crypto

# Run Universal Reality System verification
npm run reality:universal
```

---

## 👥 Hackathon Contacts & Builder Support
- **QuickNode Telegram Support**: [@sensahill](https://t.me/sensahill)
- **QARBI Author & Lead Maintainer**: Martin Luther ([@elon00](https://github.com/elon00))
- **Official Repo**: [github.com/elon00/QARBI](https://github.com/elon00/QARBI)
