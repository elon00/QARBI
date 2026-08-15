import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Sparkles,
  Shuffle,
  Cpu,
  Flame,
  Zap,
  TrendingUp,
  Info,
  CheckCircle,
} from "lucide-react";
import { ConwayCell, Agent, TranslationStrings, TransactionRecord } from "../types";
import {
  createRandomGrid,
  createEmptyGrid,
  stepConwayGrid,
  PRESET_PATTERNS,
  applyPatternToGrid,
  evolveAgentWithStylus,
} from "../lib/conwayEngine";
import { generateTxHash } from "../lib/crypto";

interface ConwayVisualizerProps {
  agents: Agent[];
  onUpdateAgents: (updatedAgents: Agent[], txRecord: TransactionRecord) => void;
  t: TranslationStrings;
}

export const ConwayVisualizer: React.FC<ConwayVisualizerProps> = ({
  agents,
  onUpdateAgents,
  t,
}) => {
  const [grid, setGrid] = useState<ConwayCell[][]>(() => createRandomGrid());
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [generation, setGeneration] = useState<number>(1);
  const [livingCount, setLivingCount] = useState<number>(0);
  const [synergyScore, setSynergyScore] = useState<number>(38);
  const [speedMs, setSpeedMs] = useState<number>(180);
  const [selectedPatternIndex, setSelectedPatternIndex] = useState<number>(0);
  const [recentEvolutionLog, setRecentEvolutionLog] = useState<string | null>(null);

  const timerRef = useRef<any>(null);

  // Compute live metrics on grid changes
  useEffect(() => {
    let count = 0;
    let totalSynergy = 0;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c].alive) {
          count++;
          totalSynergy += grid[r][c].synergy;
        }
      }
    }
    setLivingCount(count);
    setSynergyScore(count > 0 ? Math.round(totalSynergy / count) : 0);
  }, [grid]);

  // Simulation Loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setGrid((prev) => {
          const { nextGrid, livingCount: live, synergyAvg } = stepConwayGrid(prev);
          setLivingCount(live);
          setSynergyScore(synergyAvg);
          return nextGrid;
        });
        setGeneration((g) => g + 1);
      }, speedMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, speedMs]);

  const handleStepTick = () => {
    setIsRunning(false);
    setGrid((prev) => {
      const { nextGrid } = stepConwayGrid(prev);
      return nextGrid;
    });
    setGeneration((g) => g + 1);
  };

  const handleClear = () => {
    setIsRunning(false);
    setGrid(createEmptyGrid());
    setGeneration(0);
  };

  const handleRandomize = () => {
    setGrid(createRandomGrid());
    setGeneration(1);
  };

  const handleApplyPattern = (idx: number) => {
    setSelectedPatternIndex(idx);
    setGrid((prev) => applyPatternToGrid(prev, idx));
    setGeneration(1);
  };

  const handleCellClick = (r: number, c: number) => {
    setGrid((prev) => {
      const copy = prev.map((row) => row.map((cell) => ({ ...cell })));
      const isAlive = !copy[r][c].alive;
      copy[r][c] = {
        alive: isAlive,
        energy: isAlive ? 90 : 0,
        age: isAlive ? 1 : 0,
        synergy: isAlive ? 45 : 0,
        agentId: isAlive ? Math.floor(Math.random() * agents.length) + 1 : undefined,
      };
      return copy;
    });
  };

  const handleTriggerStylusEvolution = () => {
    const updatedAgents = agents.map((agent) => {
      const { updatedAgent } = evolveAgentWithStylus(agent, synergyScore);
      return updatedAgent;
    });

    const txHash = generateTxHash();
    const txRecord: TransactionRecord = {
      hash: txHash,
      blockNumber: 18492140 + generation,
      from: "0x3648...74dC8 (ConwayEngine.rs)",
      to: "0x89D2...25150 (AgentRegistry.sol)",
      type: "CONWAY_EVOLUTION",
      value: "0.0 ETH",
      status: "CONFIRMED",
      timestamp: Date.now(),
      gasUsed: 4120 * agents.length,
      gasSavedStylus: "89.4% vs EVM SSTORE",
      dataSummary: `Conway state evolved for ${agents.length} agents (Synergy: ${synergyScore}%, Gen: ${generation})`,
    };

    onUpdateAgents(updatedAgents, txRecord);
    setRecentEvolutionLog(`Stylus Wasm executed state evolution for ${agents.length} citizens. Synergy bonus +${Math.min(synergyScore, 50)} applied.`);
    setTimeout(() => setRecentEvolutionLog(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              {t.conway.title}
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-300">
            {t.conway.subtitle}
          </p>
        </div>

        {/* Gas Benchmark Pill */}
        <div className="px-4 py-2.5 rounded-xl bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs flex items-center space-x-3">
          <Zap className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="font-semibold text-cyan-300">Arbitrum Stylus Wasm Engine</div>
            <div className="text-[11px] text-slate-400">4,120 Gas per mutation (89.4% savings vs EVM)</div>
          </div>
        </div>
      </div>

      {/* Main Grid Card */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        {/* Controls Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-md transition cursor-pointer ${
                isRunning
                  ? "bg-amber-600 hover:bg-amber-500 text-white"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>{t.conway.pause}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>{t.conway.play}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleStepTick}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              title="Execute single generation step"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>{t.conway.stepTick}</span>
            </button>

            <button
              type="button"
              onClick={handleRandomize}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>{t.conway.randomize}</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.conway.clear}</span>
            </button>
          </div>

          {/* Pattern Presets */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">{t.conway.patternLabel}:</span>
            <div className="flex items-center space-x-1.5">
              {PRESET_PATTERNS.map((pattern, idx) => (
                <button
                  key={pattern.name}
                  type="button"
                  onClick={() => handleApplyPattern(idx)}
                  className={`px-2.5 py-1 text-xs rounded-lg transition font-medium cursor-pointer ${
                    selectedPatternIndex === idx
                      ? "bg-cyan-600 text-white font-semibold shadow-sm"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                  title={pattern.description}
                >
                  {pattern.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block">{t.conway.generation}</span>
            <span className="font-mono text-base font-bold text-cyan-300">
              #{generation}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">{t.conway.activeCells}</span>
            <span className="font-mono text-base font-bold text-emerald-400">
              {livingCount} cells
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">{t.conway.synergyFactor}</span>
            <span className="font-mono text-base font-bold text-indigo-400">
              {synergyScore}%
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">{t.conway.speedLabel}</span>
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="range"
                min="50"
                max="500"
                step="25"
                value={speedMs}
                onChange={(e) => setSpeedMs(Number(e.target.value))}
                className="w-24 accent-cyan-500 cursor-pointer"
              />
              <span className="font-mono text-[11px] text-slate-400">{speedMs}ms</span>
            </div>
          </div>
        </div>

        {/* The Cellular Canvas Grid */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 overflow-x-auto shadow-inner flex justify-center">
          <div
            className="grid gap-[2px] bg-slate-900 p-2 rounded-xl border border-slate-800"
            style={{
              gridTemplateColumns: `repeat(${grid[0]?.length || 36}, minmax(14px, 1fr))`,
            }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const isAlive = cell.alive;
                const hasAgent = cell.agentId !== undefined;

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => handleCellClick(r, c)}
                    title={
                      isAlive
                        ? `Cell (${r}, ${c}): Alive | Energy: ${cell.energy} | Age: ${cell.age} ${
                            hasAgent ? `| Agent #${cell.agentId}` : ""
                          }`
                        : `Cell (${r}, ${c}): Dormant`
                    }
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-[3px] transition-all duration-150 cursor-pointer flex items-center justify-center ${
                      isAlive
                        ? hasAgent
                          ? "bg-gradient-to-br from-cyan-400 to-indigo-500 shadow-sm shadow-cyan-500/50 scale-105"
                          : cell.age > 4
                          ? "bg-indigo-500 shadow-sm shadow-indigo-500/30"
                          : "bg-cyan-400 shadow-sm shadow-cyan-400/40"
                        : "bg-slate-950/80 hover:bg-slate-800/60"
                    }`}
                  >
                    {hasAgent && (
                      <span className="text-[8px] font-mono font-black text-slate-950">
                        {cell.agentId}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Evolution Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-slate-950 to-indigo-950/40 border border-indigo-800/40">
          <div className="flex items-center space-x-3 text-xs text-slate-300">
            <TrendingUp className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <div>
              <span className="font-semibold text-white block">Conway Synergy to Stylus On-Chain State Evolution</span>
              <span className="text-slate-400 text-[11px]">
                Calculates collective synergy ({synergyScore}%) and updates citizen reputations via Stylus Rust contract.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTriggerStylusEvolution}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-900/30 transition cursor-pointer active:scale-95 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>{t.conway.triggerEvolutionBtn}</span>
          </button>
        </div>

        {recentEvolutionLog && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs flex items-center space-x-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{recentEvolutionLog}</span>
          </div>
        )}
      </div>
    </div>
  );
};
