/**
 * ==============================================================================
 * QuickNode Streams — Custom JavaScript Filter Function for QARBI Protocol
 * Arbitrum Open House Singapore (Arbitrum One, Arbitrum Sepolia, Nova & Orbit)
 * ==============================================================================
 * 
 * Instructions:
 * 1. Go to your QuickNode Dashboard -> Streams -> "Create Stream".
 * 2. Select your Network: Arbitrum Sepolia, Arbitrum One, Nova, or Robinhood Chain.
 * 3. Choose your Dataset: "Receipts" or "Block with Receipts".
 * 4. In "Filter & Modify with Code", paste the entire contents of this file.
 * 5. Set your Webhook Destination URL: https://<your-qarbi-domain>/api/webhooks/quicknode-stream
 * 6. Set your HMAC secret key (and add it to your .env as QUICKNODE_STREAM_SECRET).
 * 7. Click "Test Filter" and save!
 */

// QARBI Canonical Verified Contract Addresses (case-insensitive)
const QARBI_CONTRACTS = {
  TOKEN: "0xd74F17527C480BFd0016be31792403ea2F69f842",
  REGISTRY: "0xA4984b0b33e685fc6171EE234c66007cd10c18AC",
  TASK_MARKET: "0x59FA58058f72A766da1c706Ec8FcEae743B450DE",
  CONWAY_ENGINE: "0x7A168D432500F421116A29f337613aeffa33a0bA",
  AGENT_WALLET: "0x37da753Eb54989D13c9eD461597c9a19a588345E",
  OFFICIAL_PAYMENT_RECIPIENT: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"
};

// Event Topic0 Hashes for Fast Indexing
const EVENT_TOPICS = {
  // AgentRegistry: AgentRegistered(uint256,string,string,address,address,bytes32,uint256)
  AGENT_REGISTERED: "0xb7c85848bbdcbe75e929b9cf2a6b22eb1fbb1994e63dfa8a4da0dfdbe3671424",
  // TaskMarket: TaskCreated(uint256,address,string,string,uint256,uint256)
  TASK_CREATED: "0xb0ba2ce9fbaf3e5a5e378c8959f63566114ebca3e7f457ffad040c6c21e35ef7",
  // TaskMarket: TaskSettled(uint256,uint256,address,uint256)
  TASK_SETTLED: "0x78ab1d8a4362b535d8e27c00e12d1b7145b23d9b4b9b9423c89b88e100f7e44a",
  // ConwayEngine: GridStepped(uint256,uint256,uint256,uint256)
  GRID_STEPPED: "0x535d4fa643a6d71b26871317d7b37dbf2e463a502f3c75fe95f61d567bb577e9",
  // ERC20: Transfer(address,address,uint256)
  TRANSFER: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
};

// Normalized lowercase map for robust case-insensitive lookup
const NORMALIZED_CONTRACTS = Object.fromEntries(
  Object.entries(QARBI_CONTRACTS).map(([k, v]) => [k, v.toLowerCase()])
);
const TARGET_ADDRESS_SET = new Set(Object.values(NORMALIZED_CONTRACTS));

/**
 * Main QuickNode Streams entrypoint
 * @param {Object} stream - QuickNode block stream payload containing blocks/receipts
 */
function main(stream) {
  try {
    const data = stream.data || stream;
    const blocks = Array.isArray(data) ? data : [data];
    const matchingEvents = [];

    for (const block of blocks) {
      const blockNumber = block.number || block.blockNumber;
      const blockTimestamp = block.timestamp ? parseInt(block.timestamp, 16) || Number(block.timestamp) : Math.floor(Date.now() / 1000);
      const receipts = block.receipts || [];
      const txs = block.transactions || [];

      // 1. Process Event Logs in Transaction Receipts
      for (const receipt of receipts) {
        if (!receipt || !receipt.logs) continue;
        const txHash = receipt.transactionHash;
        const status = receipt.status;

        // Skip reverted transactions
        if (status === "0x0" || status === 0) continue;

        for (let i = 0; i < receipt.logs.length; i++) {
          const log = receipt.logs[i];
          const contractAddress = (log.address || "").toLowerCase();
          const topic0 = (log.topics && log.topics[0]) ? log.topics[0].toLowerCase() : "";

          // Check if event targets any QARBI contract (case-insensitive)
          if (!TARGET_ADDRESS_SET.has(contractAddress)) continue;

          let detectedType = "CUSTOM_CONTRACT_EVENT";
          let parsedData = {};

          if (contractAddress === NORMALIZED_CONTRACTS.REGISTRY) {
            detectedType = "AGENT_REGISTERED";
            parsedData = {
              registry: contractAddress,
              agentIdHex: log.topics[1] || null,
              owner: log.topics[2] ? "0x" + log.topics[2].slice(-40) : null,
              logIndex: i
            };
          } else if (contractAddress === NORMALIZED_CONTRACTS.TASK_MARKET) {
            detectedType = topic0.includes("settle") ? "TASK_SETTLED" : "TASK_CREATED";
            parsedData = {
              market: contractAddress,
              taskIdHex: log.topics[1] || null,
              creator: log.topics[2] ? "0x" + log.topics[2].slice(-40) : null,
              logIndex: i
            };
          } else if (contractAddress === NORMALIZED_CONTRACTS.CONWAY_ENGINE) {
            detectedType = "CONWAY_STEP";
            parsedData = {
              engine: contractAddress,
              logIndex: i
            };
          } else if (contractAddress === NORMALIZED_CONTRACTS.TOKEN) {
            detectedType = "TOKEN_TRANSFER";
            parsedData = {
              from: log.topics[1] ? "0x" + log.topics[1].slice(-40) : null,
              to: log.topics[2] ? "0x" + log.topics[2].slice(-40) : null,
              rawAmount: log.data
            };
          }

          matchingEvents.push({
            id: `qn_${blockNumber}_${txHash}_${i}`,
            eventType: detectedType,
            contractAddress,
            txHash,
            blockNumber: typeof blockNumber === "string" ? parseInt(blockNumber, 16) : blockNumber,
            timestamp: blockTimestamp,
            topics: log.topics,
            data: log.data,
            parsed: parsedData
          });
        }
      }

      // 2. Process Native ETH Autonomous x402 Payments
      for (const tx of txs) {
        const toAddr = (tx.to || "").toLowerCase();
        if (toAddr === NORMALIZED_CONTRACTS.OFFICIAL_PAYMENT_RECIPIENT) {
          const valueWei = tx.value ? BigInt(tx.value).toString() : "0";
          if (valueWei !== "0") {
            matchingEvents.push({
              id: `qn_x402_${tx.hash}`,
              eventType: "X402_PAYMENT",
              contractAddress: toAddr,
              txHash: tx.hash,
              blockNumber: typeof blockNumber === "string" ? parseInt(blockNumber, 16) : blockNumber,
              timestamp: blockTimestamp,
              payer: tx.from,
              recipient: tx.to,
              valueWei,
              parsed: {
                paymentChannel: "x402-autonomous-settlement",
                arbitrumNitroGas: tx.gasPrice
              }
            });
          }
        }
      }
    }

    // QuickNode Streams pushes the returned array to the webhook destination
    if (matchingEvents.length === 0) {
      return null; // Don't trigger empty webhook requests
    }

    return {
      streamSource: "QuickNode Arbitrum Streams",
      provider: "QuickNode",
      network: "Arbitrum Nitro Rollup / Orbit",
      eventCount: matchingEvents.length,
      events: matchingEvents
    };
  } catch (err) {
    return {
      error: err.toString(),
      timestamp: Date.now()
    };
  }
}

// Export for ESM / testing environments
export { main, QARBI_CONTRACTS, EVENT_TOPICS };
export default main;
