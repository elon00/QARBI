import { useState, type FormEvent } from "react";
import { ethers } from "ethers";
import manifest from "../contracts/deployedAddresses.json";
import type { TaskPlan } from "../lib/task-planning";

const explorer = manifest.explorerUrl;
const tokenAbi = [
  "function faucet() returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

async function readSnapshot() {
  const provider = new ethers.JsonRpcProvider(manifest.rpcUrl, undefined, { batchMaxCount: 1 });
  try {
    if ((await provider.getNetwork()).chainId !== BigInt(manifest.chainId)) throw new Error("Wrong RPC network");
    const block = await provider.getBlockNumber();
    const registry = new ethers.Contract(manifest.contracts.AgentRegistry.address,
      ["function taskMarketAddress() view returns (address)"], provider);
    const token = new ethers.Contract(manifest.contracts.QARBIToken.address,
      ["function totalSupply() view returns (uint256)"], provider);
    const [codes, market, supply] = await Promise.all([
      Promise.all(Object.values(manifest.contracts).map(entry => provider.getCode(entry.address, block))),
      registry.taskMarketAddress({ blockTag: block }), token.totalSupply({ blockTag: block }),
    ]);
    if (!codes.every((code, index) => code !== "0x" &&
      ethers.keccak256(code) === Object.values(manifest.contracts)[index].runtimeCodeKeccak256)) {
      throw new Error("Contract bytecode did not match the deployment manifest");
    }
    if (market.toLowerCase() !== manifest.contracts.TaskMarket.address.toLowerCase()) {
      throw new Error("The registry points to an unexpected TaskMarket");
    }
    return { block, supply: ethers.formatUnits(supply) };
  } finally {
    provider.destroy();
  }
}

export function TestnetPreview() {
  const [snapshot, setSnapshot] = useState<Awaited<ReturnType<typeof readSnapshot>>>();
  const [checking, setChecking] = useState(false);
  const [chainError, setChainError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState<TaskPlan>();
  const [planning, setPlanning] = useState(false);
  const [planError, setPlanError] = useState("");
  const [claimPending, setClaimPending] = useState(false);
  const [claimError, setClaimError] = useState("");
  const [claim, setClaim] = useState<{ hash: string; amount: string }>();

  async function claimTokens() {
    setClaimPending(true);
    setClaimError("");
    setClaim(undefined);
    let broadcastHash: string | undefined;
    try {
      const injected = (window as Window & { ethereum?: ethers.Eip1193Provider }).ethereum;
      if (!injected) throw new Error("Open QARBI in a browser with an Ethereum wallet.");
      const provider = new ethers.BrowserProvider(injected);
      if ((await provider.getNetwork()).chainId !== BigInt(manifest.chainId)) {
        throw new Error("Switch your wallet to Arbitrum Sepolia before claiming.");
      }
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const address = manifest.contracts.QARBIToken.address;
      const code = await provider.getCode(address);
      if (code === "0x" || ethers.keccak256(code) !== manifest.contracts.QARBIToken.runtimeCodeKeccak256) {
        throw new Error("The faucet contract does not match the deployment manifest.");
      }
      const token = new ethers.Contract(address, tokenAbi, signer);
      const transaction = await token.faucet();
      broadcastHash = transaction.hash;
      const receipt = await transaction.wait(1, 60_000);
      if (receipt?.status !== 1) throw new Error("No successful receipt yet.");
      for (const log of receipt.logs) {
        if (log.address.toLowerCase() !== address.toLowerCase()) continue;
        const event = token.interface.parseLog(log);
        if (event?.name === "Transfer" && event.args.from === ethers.ZeroAddress &&
            event.args.to.toLowerCase() === account.toLowerCase()) {
          setClaim({ hash: receipt.hash, amount: ethers.formatUnits(event.args.value) });
          return;
        }
      }
      throw new Error("The receipt has no matching token mint.");
    } catch (error) {
      const reason = ethers.isError(error, "ACTION_REJECTED") ? "Wallet request declined." :
        ethers.isError(error, "CALL_EXCEPTION") ? "The faucet call reverted. Check the cooldown and wallet gas balance." :
        error instanceof Error && !ethers.isError(error, "UNKNOWN_ERROR") && !ethers.isError(error, "NETWORK_ERROR") ? error.message : "Unable to verify the claim.";
      setClaimError(broadcastHash ? reason + " Check transaction " + broadcastHash + " before retrying." : reason);
    } finally {
      setClaimPending(false);
    }
  }

  async function checkChain() {
    setChecking(true);
    setChainError("");
    setSnapshot(undefined);
    try {
      setSnapshot(await readSnapshot());
    } catch (error) {
      setChainError(error instanceof Error ? error.message : "The testnet check failed.");
    } finally {
      setChecking(false);
    }
  }

  async function requestPlan(event: FormEvent) {
    event.preventDefault();
    setPlanning(true);
    setPlan(undefined);
    setPlanError("");
    try {
      const response = await fetch("/api/gemini/plan-task", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }), signal: AbortSignal.timeout(12000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Planning failed.");
      if (data.execution !== "none" || typeof data.plan?.taskTitle !== "string" ||
          typeof data.plan.taskDescription !== "string" || typeof data.plan.suggestedArchetype !== "string") {
        throw new Error("The service returned an invalid draft.");
      }
      setPlan(data.plan);
    } catch (error) {
      setPlanError(error instanceof Error ? error.message : "Planning failed.");
    } finally {
      setPlanning(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl space-y-10 px-5 py-12 text-slate-100">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">QARBI Protocol</h1>
        <p className="text-slate-300">Arbitrum Sepolia testnet preview · Chain {manifest.chainId}</p>
      </header>
      <section aria-labelledby="deployments" className="space-y-4">
        <h2 id="deployments" className="text-xl font-semibold">Contract deployments</h2>
        <p className="text-slate-300">Links open the contracts and their creation receipts on Arbiscan.</p>
        <ul className="divide-y divide-slate-800 rounded-lg border border-slate-800">
          {Object.entries(manifest.contracts).map(([name, entry]) => (
            <li key={name} className="space-y-2 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold">{name}</span>
                <a className="text-cyan-300 underline" href={explorer + "/tx/" + entry.deploymentTxHash}>Creation receipt</a>
              </div>
              <a className="block break-all font-mono text-sm text-cyan-300 underline" href={explorer + "/address/" + entry.address}>{entry.address}</a>
            </li>
          ))}
        </ul>
        <button type="button" className="rounded bg-cyan-300 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50" onClick={checkChain} disabled={checking}>
          {checking ? "Checking…" : "Check live contract state"}
        </button>
        <div role="status" className="text-sm text-slate-300">
          {snapshot && <>Block {snapshot.block} · {snapshot.supply} QARBI supply · Five bytecode hashes matched · Registry links to TaskMarket</>}
          {chainError && <span className="text-rose-300">Unable to verify chain state. {chainError}</span>}
        </div>
      </section>
      <section aria-labelledby="faucet" className="space-y-3">
        <h2 id="faucet" className="text-xl font-semibold">QARBI test token faucet</h2>
        <p className="text-slate-300">Your wallet signs the claim and pays gas in Arbitrum Sepolia test ETH.</p>
        <button type="button" onClick={claimTokens} disabled={claimPending}
          className="rounded bg-cyan-300 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50">
          {claimPending ? "Waiting for wallet or receipt…" : "Claim QARBI test tokens"}
        </button>
        {claimError && <p role="alert" className="break-words text-rose-300">{claimError}</p>}
        {claim && <p role="status">Minted {claim.amount} QARBI. <a className="text-cyan-300 underline" href={explorer + "/tx/" + claim.hash}>View receipt</a></p>}
      </section>
      <section aria-labelledby="planner" className="space-y-4">
        <h2 id="planner" className="text-xl font-semibold">AI task planner</h2>
        <p className="text-slate-300">Draft a task for review. Prompts are sent to Gemini when configured.</p>
        <form className="space-y-3" onSubmit={requestPlan}>
          <label className="block" htmlFor="task-intent">Task intent</label>
          <textarea id="task-intent" rows={4} maxLength={2000} required value={prompt}
            onChange={event => setPrompt(event.target.value)} className="block w-full rounded border border-slate-600 bg-slate-900 p-3" />
          <button className="rounded bg-cyan-300 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50" disabled={planning || !prompt.trim()}>
            {planning ? "Drafting…" : "Draft plan"}
          </button>
        </form>
        {planError && <p role="alert" className="text-rose-300">{planError}</p>}
        {plan && <div role="status" className="space-y-2 rounded border border-slate-700 p-4">
          <h3 className="font-semibold">{plan.taskTitle}</h3>
          <p>{plan.taskDescription}</p>
          <p className="text-slate-300">Suggested role: {plan.suggestedArchetype}</p>
        </div>}
      </section>
      <footer className="border-t border-slate-800 pt-4 text-sm">
        <a className="text-cyan-300 underline" href="https://github.com/elon00/QARBI">Source, setup, and release status</a>
      </footer>
    </main>
  );
}
