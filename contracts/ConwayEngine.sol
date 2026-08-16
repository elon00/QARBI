// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ConwayEngine
 * @notice High-throughput Mathematical Cellular Automaton & Synergy State Machine on Arbitrum Sepolia.
 * Simulates Conway's Game of Life grid transitions, entropy shifts, and emergent multi-agent synergy bonuses onchain.
 */
contract ConwayEngine {
    uint8 public constant ROWS = 24;
    uint8 public constant COLS = 36;

    event GridStepped(uint256 livingCount, uint256 entropyScore, uint256 synergyScore, uint256 timestamp);

    /**
     * @notice Simulates next generation for a bitmask grid representation
     * @param livingGrid array of row bitmasks (each uint64 representing up to 36 columns)
     */
    function stepGrid(uint64[24] calldata livingGrid) external returns (
        uint64[24] memory nextGrid,
        uint256 livingCount,
        uint256 entropyScore,
        uint256 synergyScore
    ) {
        livingCount = 0;

        for (uint8 r = 0; r < ROWS; r++) {
            uint64 nextRowMask = 0;
            for (uint8 c = 0; c < COLS; c++) {
                uint8 neighbors = 0;

                for (int8 dr = -1; dr <= 1; dr++) {
                    for (int8 dc = -1; dc <= 1; dc++) {
                        if (dr == 0 && dc == 0) continue;
                        uint8 nr = uint8((int8(r) + dr + int8(ROWS)) % int8(ROWS));
                        uint8 nc = uint8((int8(c) + dc + int8(COLS)) % int8(COLS));

                        if ((livingGrid[nr] & (uint64(1) << nc)) != 0) {
                            neighbors++;
                        }
                    }
                }

                bool isAlive = (livingGrid[r] & (uint64(1) << c)) != 0;
                bool willLive = false;

                if (isAlive) {
                    if (neighbors == 2 || neighbors == 3) {
                        willLive = true;
                    }
                } else {
                    if (neighbors == 3) {
                        willLive = true;
                    }
                }

                if (willLive) {
                    nextRowMask |= (uint64(1) << c);
                    livingCount++;
                }
            }
            nextGrid[r] = nextRowMask;
        }

        // Compute mathematical entropy and multi-agent synergy bonus
        entropyScore = (livingCount * 31337 + block.timestamp) % 1000;
        synergyScore = livingCount > 0 ? (livingCount * 85 + (entropyScore % 150)) / 10 : 0;

        emit GridStepped(livingCount, entropyScore, synergyScore, block.timestamp);
        return (nextGrid, livingCount, entropyScore, synergyScore);
    }

    /**
     * @notice Calculate synergy multiplier for agent collaboration onchain
     */
    function calculateAgentSynergy(uint256 livingCells, uint256 agentCount) external pure returns (uint256) {
        if (livingCells == 0 || agentCount == 0) return 100;
        return 100 + (livingCells * agentCount * 12) / (livingCells + agentCount);
    }
}
