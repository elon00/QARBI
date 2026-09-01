import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Navigation, TabKey } from "./components/Navigation";
import { AgentSpawner } from "./components/AgentSpawner";
import { ConwayVisualizer } from "./components/ConwayVisualizer";
import { AgentTerminal } from "./components/AgentTerminal";
import { TaskMarketplace } from "./components/TaskMarketplace";
import { SecurityEnclave } from "./components/SecurityEnclave";
import { ArbitrumExplorer } from "./components/ArbitrumExplorer";
import { WhitepaperViewer } from "./components/WhitepaperViewer";
import { FaucetModal } from "./components/FaucetModal";
import { OnchainDeployerModal } from "./components/OnchainDeployerModal";
import { WalletQrCard } from "./components/WalletQrCard";
import { INITIAL_AGENTS, INITIAL_TASKS, INITIAL_TRANSACTIONS, INITIAL_SECURITY_LOGS } from "./data/initialState";
import { TRANSLATIONS } from "./data/translations";
import { LanguageCode, Agent, TaskItem, TransactionRecord, SecurityEvent } from "./types";
import { evolveAgentWithStylus } from "./lib/conwayEngine";
import { checkWalletConnection, connectWallet, fetchLiveBalances, WalletState } from "./lib/web3";

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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "spawner" && <AgentSpawner agents={agents} onAddAgent={handleAddAgent} onEvolveAgent={handleEvolveAgent} t={t} onNavigateToTerminal={handleNavigateToTerminal} signer={wallet.signer} walletAddress={wallet.address} />}
        {activeTab === "conway" && <ConwayVisualizer agents={agents} onUpdateAgents={handleUpdateAgents} t={t} />}
        {activeTab === "terminal" && <AgentTerminal agents={agents} t={t} defaultAgentName={terminalActiveAgent} currentLanguage={currentLanguage} />}
        {activeTab === "tasks" && <TaskMarketplace tasks={tasks} agents={agents} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} t={t} />}
        {activeTab === "security" && <SecurityEnclave isEmergencyLocked={isEmergencyLocked} onToggleKillSwitch={handleToggleKillSwitch} securityLogs={securityLogs} onAddSecurityLog={handleAddSecurityLog} t={t} />}
        {activeTab === "explorer" && <ArbitrumExplorer transactions={transactions} t={t} onOpenDeployer={() => setIsDeployerOpen(true)} />}
        {activeTab === "whitepaper" && <WhitepaperViewer t={t} />}
      </main>
      <OnchainDeployerModal isOpen={isDeployerOpen} onClose={() => setIsDeployerOpen(false)} signer={wallet.signer} walletAddress={wallet.address} isWalletConnected={wallet.isConnected} ethBalance={wallet.ethBalance} onDeploymentSuccess={handleDeploymentSuccess} t={t} />
      <FaucetModal isOpen={isFaucetOpen} onClose={() => setIsFaucetOpen(false)} onClaim={handleClaimFaucet} t={t} signer={wallet.signer} walletAddress={wallet.address} isWalletConnected={wallet.isConnected} />
      {wallet.isConnected && wallet.address && <WalletQrCard address={wallet.address} label="Connected MetaMask / EVM wallet" />}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-400">© 2026 QARBI Protocol · Arbitrum Sepolia</footer>
    </div>
  );
}

export default App;
