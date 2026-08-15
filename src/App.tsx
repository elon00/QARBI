import React, { useState } from "react";
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
import {
  INITIAL_AGENTS,
  INITIAL_TASKS,
  INITIAL_TRANSACTIONS,
  INITIAL_SECURITY_LOGS,
} from "./data/initialState";
import { TRANSLATIONS } from "./data/translations";
import { LanguageCode, Agent, TaskItem, TransactionRecord, SecurityEvent } from "./types";
import { evolveAgentWithStylus } from "./lib/conwayEngine";

export function App() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("en");
  const [activeTab, setActiveTab] = useState<TabKey>("spawner");
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [securityLogs, setSecurityLogs] = useState<SecurityEvent[]>(INITIAL_SECURITY_LOGS);
  const [userBalanceQarbi, setUserBalanceQarbi] = useState<number>(250);
  const [userBalanceEth, setUserBalanceEth] = useState<number>(0.245);
  const [isEmergencyLocked, setIsEmergencyLocked] = useState<boolean>(false);
  const [isFaucetOpen, setIsFaucetOpen] = useState<boolean>(false);
  const [terminalActiveAgent, setTerminalActiveAgent] = useState<string | undefined>(undefined);

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

  const handleAddAgent = (newAgent: Agent, tx: TransactionRecord) => {
    setAgents((prev) => [newAgent, ...prev]);
    setTransactions((prev) => [tx, ...prev]);
  };

  const handleEvolveAgent = (agentId: number) => {
    const target = agents.find((a) => a.id === agentId);
    if (!target) return;

    const { updatedAgent, txRecord } = evolveAgentWithStylus(target, 45);
    setAgents((prev) => prev.map((a) => (a.id === agentId ? updatedAgent : a)));
    setTransactions((prev) => [txRecord, ...prev]);
  };

  const handleUpdateAgents = (updatedAgents: Agent[], txRecord: TransactionRecord) => {
    setAgents(updatedAgents);
    setTransactions((prev) => [txRecord, ...prev]);
  };

  const handleAddTask = (newTask: TaskItem, txRecord: TransactionRecord) => {
    setTasks((prev) => [newTask, ...prev]);
    setTransactions((prev) => [txRecord, ...prev]);
  };

  const handleUpdateTask = (updatedTask: TaskItem, txRecord: TransactionRecord) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setTransactions((prev) => [txRecord, ...prev]);

    // If task was completed, increment executor's completedTasks and give reputation
    if (updatedTask.status === "COMPLETED" && updatedTask.assigneeAgentId) {
      setAgents((prev) =>
        prev.map((a) => {
          if (a.id === updatedTask.assigneeAgentId) {
            return {
              ...a,
              completedTasks: a.completedTasks + 1,
              reputation: Math.min(1000, a.reputation + 25),
            };
          }
          return a;
        })
      );
    }
  };

  const handleToggleKillSwitch = (txRecord: TransactionRecord) => {
    setIsEmergencyLocked((prev) => !prev);
    setTransactions((prev) => [txRecord, ...prev]);
  };

  const handleAddSecurityLog = (log: SecurityEvent) => {
    setSecurityLogs((prev) => [log, ...prev]);
  };

  const handleClaimFaucet = (qarbiAmount: number, ethAmount: number, txRecord: TransactionRecord) => {
    setUserBalanceQarbi((prev) => prev + qarbiAmount);
    setUserBalanceEth((prev) => prev + ethAmount);
    setTransactions((prev) => [txRecord, ...prev]);
  };

  const handleNavigateToTerminal = (agentName: string) => {
    setTerminalActiveAgent(agentName);
    setActiveTab("terminal");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white flex flex-col">
      {/* Global Header */}
      <Header
        t={t}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        userBalanceQarbi={userBalanceQarbi}
        userBalanceEth={userBalanceEth}
        onOpenFaucet={() => setIsFaucetOpen(true)}
        isEmergencyLocked={isEmergencyLocked}
      />

      {/* Navigation Sub-header */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        t={t}
        agentCount={agents.length}
        openTaskCount={tasks.filter((task) => task.status === "OPEN").length}
        isEmergencyLocked={isEmergencyLocked}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "spawner" && (
          <AgentSpawner
            agents={agents}
            onAddAgent={handleAddAgent}
            onEvolveAgent={handleEvolveAgent}
            t={t}
            onNavigateToTerminal={handleNavigateToTerminal}
          />
        )}

        {activeTab === "conway" && (
          <ConwayVisualizer
            agents={agents}
            onUpdateAgents={handleUpdateAgents}
            t={t}
          />
        )}

        {activeTab === "terminal" && (
          <AgentTerminal
            agents={agents}
            activeAgentName={terminalActiveAgent}
            onPostTask={handleAddTask}
            t={t}
            isEmergencyLocked={isEmergencyLocked}
          />
        )}

        {activeTab === "tasks" && (
          <TaskMarketplace
            tasks={tasks}
            agents={agents}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            t={t}
          />
        )}

        {activeTab === "security" && (
          <SecurityEnclave
            securityLogs={securityLogs}
            agents={agents}
            isEmergencyLocked={isEmergencyLocked}
            onToggleKillSwitch={handleToggleKillSwitch}
            onAddSecurityLog={handleAddSecurityLog}
            t={t}
          />
        )}

        {activeTab === "explorer" && (
          <ArbitrumExplorer
            transactions={transactions}
            t={t}
          />
        )}

        {activeTab === "whitepaper" && (
          <WhitepaperViewer t={t} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-xs text-slate-400 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-200">Qarbi Protocol</span>
            <span>•</span>
            <span>Arbitrum Sepolia Testnet (421614)</span>
            <span>•</span>
            <span className="text-cyan-400">Stylus Rust VM</span>
          </div>

          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span>NIST FIPS 204 ML-DSA-65</span>
            <span>•</span>
            <span>4-Layer Spending Enclave</span>
          </div>
        </div>
      </footer>

      {/* Faucet Claim Modal */}
      <FaucetModal
        isOpen={isFaucetOpen}
        onClose={() => setIsFaucetOpen(false)}
        onClaim={handleClaimFaucet}
        t={t}
      />
    </div>
  );
}

export default App;
