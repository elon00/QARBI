import { ConwayCell, Agent, TransactionRecord } from "../types";
import { generateOperationId } from "./crypto";

export const GRID_ROWS = 24;
export const GRID_COLS = 36;

export function createEmptyGrid(rows: number = GRID_ROWS, cols: number = GRID_COLS): ConwayCell[][] {
  const grid: ConwayCell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: ConwayCell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({ alive: false, energy: 0, age: 0, synergy: 0 });
    }
    grid.push(row);
  }
  return grid;
}

export function createRandomGrid(rows: number = GRID_ROWS, cols: number = GRID_COLS, density: number = 0.22): ConwayCell[][] {
  const grid: ConwayCell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: ConwayCell[] = [];
    for (let c = 0; c < cols; c++) {
      const isAlive = Math.random() < density;
      row.push({
        alive: isAlive,
        energy: isAlive ? Math.floor(Math.random() * 60) + 40 : 0,
        age: isAlive ? 1 : 0,
        synergy: isAlive ? Math.floor(Math.random() * 30) + 10 : 0,
        agentId: isAlive ? (Math.random() < 0.25 ? Math.floor(Math.random() * 4) + 1 : undefined) : undefined,
      });
    }
    grid.push(row);
  }
  return grid;
}

export function stepConwayGrid(currentGrid: ConwayCell[][]): { nextGrid: ConwayCell[][]; livingCount: number; synergyAvg: number } {
  const rows = currentGrid.length;
  const cols = currentGrid[0].length;
  const nextGrid: ConwayCell[][] = createEmptyGrid(rows, cols);
  let livingCount = 0;
  let totalSynergy = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let liveNeighbors = 0;
      let neighborEnergySum = 0;
      let neighborAgentIds: number[] = [];

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = (r + dr + rows) % rows;
          const nc = (c + dc + cols) % cols;
          if (currentGrid[nr][nc].alive) {
            liveNeighbors++;
            neighborEnergySum += currentGrid[nr][nc].energy;
            if (currentGrid[nr][nc].agentId) {
              neighborAgentIds.push(currentGrid[nr][nc].agentId!);
            }
          }
        }
      }

      const currentCell = currentGrid[r][c];
      let willLive = false;
      let newEnergy = 0;
      let newAge = 0;
      let newAgentId = currentCell.agentId;

      if (currentCell.alive) {
        if (liveNeighbors === 2 || liveNeighbors === 3) {
          willLive = true;
          newAge = currentCell.age + 1;
          newEnergy = Math.min(100, Math.max(10, Math.floor(neighborEnergySum / (liveNeighbors || 1)) + 5));
        } else {
          // Underpopulation (<2) or Overpopulation (>3)
          willLive = false;
        }
      } else {
        if (liveNeighbors === 3) {
          // Reproduction
          willLive = true;
          newAge = 1;
          newEnergy = Math.min(100, Math.max(20, Math.floor(neighborEnergySum / 3)));
          if (neighborAgentIds.length > 0) {
            newAgentId = neighborAgentIds[Math.floor(Math.random() * neighborAgentIds.length)];
          }
        }
      }

      const calculatedSynergy = willLive ? Math.min(100, liveNeighbors * 25) : 0;
      if (willLive) {
        livingCount++;
        totalSynergy += calculatedSynergy;
      }

      nextGrid[r][c] = {
        alive: willLive,
        age: newAge,
        energy: newEnergy,
        synergy: calculatedSynergy,
        agentId: willLive ? newAgentId : undefined,
      };
    }
  }

  const synergyAvg = livingCount > 0 ? Math.round(totalSynergy / livingCount) : 0;
  return { nextGrid, livingCount, synergyAvg };
}

export const PRESET_PATTERNS = [
  {
    name: "Gosper Glider Gun",
    description: "Continuous stream of autonomous cellular entities symbolizing perpetual agent task creation.",
    coords: [
      [5, 1], [5, 2], [6, 1], [6, 2],
      [5, 11], [6, 11], [7, 11], [4, 12], [8, 12], [3, 13], [9, 13], [3, 14], [9, 14],
      [6, 15], [4, 16], [8, 16], [5, 17], [6, 17], [7, 17], [6, 18],
      [3, 21], [4, 21], [5, 21], [3, 22], [4, 22], [5, 22], [2, 23], [6, 23],
      [1, 25], [2, 25], [6, 25], [7, 25],
      [3, 35], [4, 35], [3, 36], [4, 36],
    ],
  },
  {
    name: "Pulsar (Oscillator)",
    description: "High-synergy rhythmic cycle reflecting periodic agent state settlement loops.",
    coords: [
      [4, 8], [4, 9], [4, 10], [4, 14], [4, 15], [4, 16],
      [6, 6], [6, 11], [6, 13], [6, 18],
      [7, 6], [7, 11], [7, 13], [7, 18],
      [8, 6], [8, 11], [8, 13], [8, 18],
      [9, 8], [9, 9], [9, 10], [9, 14], [9, 15], [9, 16],
      [11, 8], [11, 9], [11, 10], [11, 14], [11, 15], [11, 16],
      [12, 6], [12, 11], [12, 13], [12, 18],
      [13, 6], [13, 11], [13, 13], [13, 18],
      [14, 6], [14, 11], [14, 13], [14, 18],
      [16, 8], [16, 9], [16, 10], [16, 14], [16, 15], [16, 16],
    ],
  },
  {
    name: "Glider Fleet",
    description: "Mobile agent packets traversing the state space towards graduation targets.",
    coords: [
      [2, 3], [3, 4], [4, 2], [4, 3], [4, 4],
      [8, 12], [9, 13], [10, 11], [10, 12], [10, 13],
      [14, 20], [15, 21], [16, 19], [16, 20], [16, 21],
    ],
  },
  {
    name: "Acorn (Methuselah)",
    description: "Compact 7-cell seed that blooms into over 5,000 generations of emergent behavior.",
    coords: [
      [12, 16], [13, 18], [14, 15], [14, 16], [14, 19], [14, 20], [14, 21],
    ],
  },
];

export function applyPatternToGrid(grid: ConwayCell[][], patternIndex: number): ConwayCell[][] {
  const pattern = PRESET_PATTERNS[patternIndex] || PRESET_PATTERNS[0];
  const newGrid = createEmptyGrid(grid.length, grid[0].length);

  for (const [r, c] of pattern.coords) {
    if (r >= 0 && r < newGrid.length && c >= 0 && c < newGrid[0].length) {
      newGrid[r][c] = {
        alive: true,
        age: 1,
        energy: 85,
        synergy: 50,
        agentId: Math.floor(Math.random() * 4) + 1,
      };
    }
  }
  return newGrid;
}

/**
 * High-performance state evolution replicating Arbitrum Stylus ConwayEngine.rs
 */
export function evolveAgentWithStylus(
  agent: Agent,
  synergyScore: number = 25
): { updatedAgent: Agent; statusChanged: boolean; gasUsed: number; txRecord: TransactionRecord } {
  const completed = agent.completedTasks;
  const failed = agent.failedTasks;

  const successGain = completed * 15;
  const failurePenalty = failed * 25;
  const synergyBonus = Math.min(synergyScore, 50);

  let newRep = Math.max(0, 100 + successGain + synergyBonus - failurePenalty);
  newRep = Math.min(1000, newRep);

  let newEnergy = agent.energy;
  if (completed > 0) {
    newEnergy = Math.min(100, newEnergy + 10);
  } else {
    newEnergy = Math.max(0, newEnergy - 5);
  }

  let newStatus = agent.status;
  if (newEnergy === 0) {
    newStatus = "DORMANT";
  } else if (newRep >= 800 && completed >= 20) {
    newStatus = "GRADUATED";
  } else {
    newStatus = "ACTIVE";
  }

  const statusChanged = newStatus !== agent.status;

  const updatedAgent: Agent = {
    ...agent,
    reputation: newRep,
    energy: newEnergy,
    status: newStatus,
  };

  const txRecord: TransactionRecord = {
    hash: `LOCAL-CONWAY-${generateOperationId()}`,
    blockNumber: 18492150,
    from: "0x364817F20A86107441B5eF392c0199e58b874dC8 (ConwayEngine.rs)",
    to: agent.walletAddress,
    type: "CONWAY_EVOLUTION",
    value: "0.0 ETH",
    status: "CONFIRMED",
    timestamp: Date.now(),
    gasUsed: 4120,
    gasSavedStylus: "89.4% vs EVM",
    dataSummary: `evolveState(${agent.name}) - Reputation: ${newRep}, Energy: ${newEnergy}`,
  };

  return { updatedAgent, statusChanged, gasUsed: 4120, txRecord };
}
