pub mod conway_core;

pub use conway_core::{
    compute_entropy_score, evolve_step, verify_evolution, CELL_COUNT, GRID_SIZE,
};

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_core_engine() {
        let state = [0u8; 32];
        let next = evolve_step(&state);
        assert_eq!(state, next);
    }
}