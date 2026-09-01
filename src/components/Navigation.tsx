import React from "react";
import { Users, Grid, Terminal, Layers, ShieldCheck, Activity, FileText } from "lucide-react";
import { TranslationStrings } from "../types";

export type TabKey = "spawner" | "conway" | "terminal" | "tasks" | "security" | "explorer" | "whitepaper";

interface NavigationProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  t: TranslationStrings;
  agentCount: number;
  openTaskCount: number;
  isEmergencyLocked: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  t,
  agentCount,
  openTaskCount,
  isEmergencyLocked,
}) => {
  const tabs: { key: TabKey; label: string; icon: React.FC<{ className?: string }>; badge?: string | number; badgeColor?: string }[] = [
    { key: "spawner", label: t?.tabs?.spawner || "Agent Citadel", icon: Users, badge: agentCount, badgeColor: "bg-cyan-900 text-cyan-300 border-cyan-700" },
    { key: "conway", label: t?.tabs?.conway || "Conway State Engine", icon: Grid, badge: "Stylus Rust", badgeColor: "bg-indigo-900 text-indigo-300 border-indigo-700" },
    { key: "terminal", label: t?.tabs?.terminal || "Agentic AI Dispatcher", icon: Terminal, badge: "AI Powered", badgeColor: "bg-sky-900 text-sky-300 border-sky-700" },
    { key: "tasks", label: t?.tabs?.tasks || "Agent Economy & Market", icon: Layers, badge: openTaskCount, badgeColor: "bg-amber-900 text-amber-300 border-amber-700" },
    { key: "security", label: t?.tabs?.security || "Policy & Security Enclave", icon: ShieldCheck, badge: isEmergencyLocked ? "HALTED" : "4-Layer", badgeColor: isEmergencyLocked ? "bg-rose-900 text-rose-300 border-rose-600" : "bg-emerald-900 text-emerald-300 border-emerald-700" },
    { key: "explorer", label: t?.tabs?.explorer || "Arbitrum Ledger", icon: Activity },
    { key: "whitepaper", label: t?.tabs?.whitepaper || "Technical Whitepaper", icon: FileText },
  ];

  return (
    <nav className="bg-slate-900/80 border-b border-slate-800 backdrop-blur sticky top-20 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
        <div className="flex gap-2 overflow-x-auto py-2.5 scrollbar-thin scrollbar-thumb-slate-700 min-w-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onSelectTab(tab.key)}
                aria-current={isActive ? "page" : undefined}
                className={`shrink-0 flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-600/90 to-blue-600/90 text-white shadow-lg shadow-cyan-900/30 border border-cyan-400/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className="max-w-[16rem] truncate">{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`ml-1 shrink-0 px-1.5 py-0.5 text-[10px] font-mono rounded-full border ${isActive ? "bg-white/20 text-white border-white/30" : tab.badgeColor || "bg-slate-800 text-slate-400 border-slate-700"}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
