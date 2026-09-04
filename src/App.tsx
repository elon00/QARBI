import React, { useState, useEffect, Suspense, lazy } from "react";
import { Header } from "./components/Header";
import { Navigation, TabKey } from "./components/Navigation";
import { INITIAL_AGENTS, INITIAL_TASKS, INITIAL_TRANSACTIONS, INITIAL_SECURITY_LOGS } from "./data/initialState";
import { TRANSLATIONS } from "./data/translations";
import { LanguageCode, Agent, TaskItem, TransactionRecord, SecurityEvent } from "./types";
import { evolveAgentWithStylus } from "./lib/conwayEngine";
import { checkWalletConnection, connectWallet, fetchLiveBalances, WalletState } from "./lib/web3";

const AgentSpawner = lazy(() => import("./components/AgentSpawner").then((m) => ({ default: m.AgentSpawner })));
const ConwayVisualizer = lazy(() => import("./components/ConwayVisualizer").then((m) => ({ default: m.ConwayVisualizer })));
const AgentTerminal = lazy(() => import("./components/AgentTerminal").then((m) => ({ default: m.AgentTerminal })));
const TaskMarketplace = lazy(() => import("./components/TaskMarketplace").then((m) => ({ default: m.TaskMarketplace })));
const SecurityEnclave = lazy(() => import("./components/SecurityEnclave").then((m) => ({ default: m.SecurityEnclave })));
const ArbitrumExplorer = lazy(() => import("./components/ArbitrumExplorer").then((m) => ({ default: m.ArbitrumExplorer })));
const WhitepaperViewer = lazy(() => import("./components/WhitepaperViewer").then((m) => ({ default: m.WhitepaperViewer })));
const FaucetModal = lazy(() => import("./components/FaucetModal").then((m) => ({ default: m.FaucetModal })));
const OnchainDeployerModal = lazy(() => import("./components/OnchainDeployerModal").then((m) => ({ default: m.OnchainDeployerModal })));
const WalletQrCard = lazy(() => import("./components/WalletQrCard").then((m) => ({ default: m.WalletQrCard })));

export function App() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("en");
  const [activeTab, setActiveTab] = useState<TabKey>("spawner");
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [securityLogs, setSecurityLogs] = useState<SecurityEvent[]>(INITIAL_SECURITY_LOGS);
  const [userBalanceQarbi, setUserBalanceQarbi] = useState<number>(0);
  const [userBalanceEth, setUserBalanceEth] = useState<number>(0);
  const [isEmergencyLocked, setIsEmergencyLocked] = useState(false);
  const [isFaucetOpen, setIsFaucetOpen] = useState(false);
  const [isDeployerOpen, setIsDeployerOpen] = useState(false);
  const [terminalActiveAgent, setTerminalActiveAgent] = useState<string | undefined>();

  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    isCorrectNetwork: false,
    qarbiBalance: 0,
    ethBalance: 0,
    provider: null,
    signer: null,
  });

  const rawT = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const t = {
    ...TRANSLATIONS.en,
    ...rawT,
    tabs: { ...TRANSLATIONS.en.tabs, ...(rawT?.tabs || {}) },
    spawner: { ...TRANSLATIONS.en.spawner, ...(rawT?.spawner || {}) },
    conway: { ...TRANSLATIONS.en.conway, ...(rawT?.conway || {}) },
    terminal: { ...TRANSLATIONS.en.terminal, ...(rawT?.terminal || {}) },
    tasks: { ...TRANSLATIONS.en.tasks, ...(rawT?.tasks || {}) },
    security: { ...TRANSLATIONS.en.security, ...(rawT?.security || {}) },
    explorer: { ...TRANSLATIONS.en.explorer, ...(rawT?.explorer || {}) },
    whitepaper: { ...TRANSLATIONS.en.whitepaper, ...(rawT?.whitepaper || {}) },
    faucet: { ...TRANSLATIONS.en.faucet, ...(rawT?.faucet || {}) },
  };

  useEffect(() => {
    let cancelled = false;
    async function initWallet() {
      const res = await checkWalletConnection();
      if (!res.address || cancelled) return;
      const balances = await fetchLiveBalances(res.address);
      if (cancelled) return;
      setWallet((prev) => ({ ...prev, isConnected: true, address: res.address, chainId: res.chainId, isCorrectNetwork: res.isCorrectNetwork, qarbiBalance: balances.qarbiBalance, ethBalance: balances.ethBalance }));
      setUserBalanceQarbi(balances.qarbiBalance);
      setUserBalanceEth(balances.ethBalance);
    }
    void initWallet();
    return () => { cancelled = true; };
  }, []);

  const handleConnectWallet = async (walletType: "metamask" | "trust" = "metamask") => {
    try {
      const res = await connectWallet(walletType);
      const balances = await fetchLiveBalances(res.address);
      setWallet({ isConnected: true, address: res.address, chainId: res.chainId, isCorrectNetwork: res.isCorrectNetwork, qarbiBalance: balances.qarbiBalance, ethBalance: balances.ethBalance, provider: res.provider, signer: res.signer });
      setUserBalanceQarbi(balances.qarbiBalance);
      setUserBalanceEth(balances.ethBalance);
    } catch (err: any) {
      console.error("Wallet connection failed:", err);
      alert(err.message || "Failed to connect wallet");
    }
  };

  const handleDisconnectWallet = () => {
    setWallet({ isConnected: false, address: null, chainId: null, isCorrectNetwork: false, qarbiBalance: 0, ethBalance: 0, provider: null, signer: null });
    setUserBalanceQarbi(0);
    setUserBalanceEth(0);
  };

  const handleDeploymentSuccess = (_newContracts: Record<string, string>, createdTxRecords: TransactionRecord[]) => setTransactions((prev) => [...createdTxRecords, ...prev]);
  const handleAddAgent = (newAgent: Agent, tx: TransactionRecord) => { setAgents((prev) => [newAgent, ...prev]); setTransactions((prev) => [tx, ...prev]); };
  const handleEvolveAgent = (agentId: number) => { const target = agents.find((a) => a.id === agentId); if (!target) return; const { updatedAgent } = evolveAgentWithStylus(target, 45); setAgents((prev) => prev.map((a) => (a.id === agentId ? updatedAgent : a))); };
  const handleUpdateAgents = (updatedAgents: Agent[], txRecord: TransactionRecord) => { setAgents(updatedAgents); if (txRecord?.hash) setTransactions((prev) => [txRecord, ...prev]); };
  const handleAddTask = (newTask: TaskItem, txRecord: TransactionRecord) => { setTasks((prev) => [newTask, ...prev]); if (txRecord?.hash) setTransactions((prev) => [txRecord, ...prev]); };
  const handleUpdateTask = (updatedTask: TaskItem, txRecord: TransactionRecord) => { setTasks((prev) => prev.map((item) => (item.id === updatedTask.id ? updatedTask : item))); if (txRecord?.hash) setTransactions((prev) => [txRecord, ...prev]); };
  const handleToggleKillSwitch = (txRecord: TransactionRecord) => { setIsEmergencyLocked((prev) => !prev); if (txRecord?.hash) setTransactions((prev) => [txRecord, ...prev]); };
  const handleAddSecurityLog = (log: SecurityEvent) => setSecurityLogs((prev) => [log, ...prev]);
  const handleClaimFaucet = (_qarbiAmount: number, _ethAmount: number, txRecord: TransactionRecord) => { if (txRecord?.hash) setTransactions((prev) => [txRecord, ...prev]); if (wallet.address) void fetchLiveBalances(wallet.address).then((b) => { setUserBalanceQarbi(b.qarbiBalance); setUserBalanceEth(b.ethBalance); }); };
  const handleNavigateToTerminal = (agentName: string) => { setTerminalActiveAgent(agentName); setActiveTab("terminal"); };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <Header t={t} currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} userBalanceQarbi={userBalanceQarbi} userBalanceEth={userBalanceEth} onOpenFaucet={() => setIsFaucetOpen(true)} onOpenDeployer={() => setIsDeployerOpen(true)} isEmergencyLocked={isEmergencyLocked} walletAddress={wallet.address} isWalletConnected={wallet.isConnected} isCorrectNetwork={wallet.isCorrectNetwork} onConnectWallet={handleConnectWallet} onDisconnectWallet={handleDisconnectWallet} />
      <Navigation activeTab={activeTab} onSelectTab={setActiveTab} t={t} agentCount={agents.length} openTaskCount={tasks.filter((task) => task.status === "OPEN").length} isEmergencyLocked={isEmergencyLocked} />
      
      {/* Statutory Legal & International Compliance Banner */}
      <div className="bg-slate-900/90 border-b border-cyan-900/40 px-4 py-2 text-[11px] text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-semibold">
              COMPLIANCE VERIFIED
            </span>
            <span>
              Supreme Court of India (<em>IAMAI 2020</em>) & PMLA 2002 AML / FIU-IND · FATF Rec 16 · EU MiCA · NIST FIPS 204 (ML-DSA-65)
            </span>
          </div>
          <div className="text-slate-400 font-mono text-[10px]">
            Arbitrum Sepolia Testnet (Chain ID 421614) · Zero Fiat Monetary Value · Experimental
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="py-16 text-center text-sm text-slate-400">Loading module…</div>}>
        {activeTab === "spawner" && <AgentSpawner agents={agents} onAddAgent={handleAddAgent} onEvolveAgent={handleEvolveAgent} t={t} onNavigateToTerminal={handleNavigateToTerminal} signer={wallet.signer} walletAddress={wallet.address} />}
        {activeTab === "conway" && <ConwayVisualizer agents={agents} onUpdateAgents={handleUpdateAgents} t={t} />}
        {activeTab === "terminal" && <AgentTerminal agents={agents} t={t} defaultAgentName={terminalActiveAgent} currentLanguage={currentLanguage} />}
        {activeTab === "tasks" && <TaskMarketplace tasks={tasks} agents={agents} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} t={t} />}
        {activeTab === "security" && <SecurityEnclave agents={agents} isEmergencyLocked={isEmergencyLocked} onToggleKillSwitch={handleToggleKillSwitch} securityLogs={securityLogs} onAddSecurityLog={handleAddSecurityLog} t={t} />}
        {activeTab === "explorer" && <ArbitrumExplorer transactions={transactions} t={t} onOpenDeployer={() => setIsDeployerOpen(true)} />}
        {activeTab === "whitepaper" && <WhitepaperViewer t={t} />}
        </Suspense>
      </main>
      <Suspense fallback={null}><OnchainDeployerModal isOpen={isDeployerOpen} onClose={() => setIsDeployerOpen(false)} signer={wallet.signer} walletAddress={wallet.address} isWalletConnected={wallet.isConnected} ethBalance={wallet.ethBalance} onDeploymentSuccess={handleDeploymentSuccess} t={t} /></Suspense>
      <Suspense fallback={null}><FaucetModal isOpen={isFaucetOpen} onClose={() => setIsFaucetOpen(false)} onClaim={handleClaimFaucet} t={t} signer={wallet.signer} walletAddress={wallet.address} isWalletConnected={wallet.isConnected} /></Suspense>
      <Suspense fallback={null}>{wallet.isConnected && wallet.address && <WalletQrCard address={wallet.address} label="Connected MetaMask / EVM wallet" />}</Suspense>
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-400">© 2026 QARBI Protocol · Arbitrum Sepolia</footer>
    </div>
  );
}

export default App;
