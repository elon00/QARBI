pub const GRID_SIZE: usize = 16;
pub const CELL_COUNT: usize = GRID_SIZE * GRID_SIZE; // 256 cells

/// Conway B3/S23 cellular automaton step over a 256-bit (32-byte) state.
pub fn evolve_step(state: &[u8; 32]) -> [u8; 32] {
    let mut grid = [false; CELL_COUNT];
    for i in 0..CELL_COUNT {
        let byte_idx = i / 8;
        let bit_idx = i % 8;
        grid[i] = (state[byte_idx] & (1 << bit_idx)) != 0;
    }

    let mut next_grid = [false; CELL_COUNT];

    for y in 0..GRID_SIZE {
        for x in 0..GRID_SIZE {
            let idx = y * GRID_SIZE + x;
            let mut live_neighbors = 0;

            for dy in [-1i32, 0, 1] {
                for dx in [-1i32, 0, 1] {
                    if dx == 0 && dy == 0 {
                        continue;
                    }
                    let nx = (x as i32 + dx + GRID_SIZE as i32) as usize % GRID_SIZE;
                    let ny = (y as i32 + dy + GRID_SIZE as i32) as usize % GRID_SIZE;
                    let n_idx = ny * GRID_SIZE + nx;
                    if grid[n_idx] {
                        live_neighbors += 1;
                    }
                }
            }

            if grid[idx] {
                next_grid[idx] = live_neighbors == 2 || live_neighbors == 3;
            } else {
                next_grid[idx] = live_neighbors == 3;
            }
        }
    }

    let mut output = [0u8; 32];
    for i in 0..CELL_COUNT {
        if next_grid[i] {
            let byte_idx = i / 8;
            let bit_idx = i % 8;
            output[byte_idx] |= 1 << bit_idx;
        }
    }

    output
}

/// Compute entropy score of a 32-byte Conway state.
pub fn compute_entropy_score(state: &[u8; 32]) -> u64 {
    let mut active_cells: u64 = 0;
    let mut transitions: u64 = 0;

    for (i, &byte) in state.iter().enumerate() {
        active_cells += byte.count_ones() as u64;
        if i > 0 {
            transitions += (byte ^ state[i - 1]).count_ones() as u64;
        }
    }

    (active_cells * 100) + (transitions * 50)
}

/// Multi-generation evolution verification.
pub fn verify_evolution(seed: &[u8; 32], generations: u32, min_score: u64) -> bool {
    let mut current = *seed;
    for _ in 0..generations {
        current = evolve_step(&current);
    }
    compute_entropy_score(&current) >= min_score
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_empty_grid_remains_empty() {
        let state = [0u8; 32];
        let next = evolve_step(&state);
        assert_eq!(state, next);
        assert_eq!(compute_entropy_score(&next), 0);
    }

    #[test]
    fn test_blinker_oscillation() {
        // Horizontal blinker at (1,1), (2,1), (3,1)
        let mut h_blinker = [0u8; 32];
        for x in 1..=3 {
            let idx = 1 * GRID_SIZE + x;
            h_blinker[idx / 8] |= 1 << (idx % 8);
        }

        let v_blinker = evolve_step(&h_blinker);
        assert_ne!(h_blinker, v_blinker);

        let restored = evolve_step(&v_blinker);
        assert_eq!(h_blinker, restored);
    }

    #[test]
    fn test_evolution_proof_verification() {
        let mut glider = [0u8; 32];
        let coords = [(1, 0), (2, 1), (0, 2), (1, 2), (2, 2)];
        for (x, y) in coords {
            let idx = y * GRID_SIZE + x;
            glider[idx / 8] |= 1 << (idx % 8);
        }

        let passed = verify_evolution(&glider, 4, 100);
        assert!(passed);
    }
}