import { countSolutions, search, solvableBySingles, type Grid } from './sudokuSolver';
export interface Generated { puzzle: Grid; solution: Grid }
const MAX_CLUES = 26;
/** Extreme = unique solution, <=26 clues, and NOT solvable by naked/hidden singles alone. Time-capped; returns best candidate, never loops forever. */
export function generatePuzzle(maxMs = 4000): Generated {
  const start = Date.now();
  let fallback: Generated | null = null;
  while (Date.now() - start < maxMs || !fallback) {
    const solution = search(Array(81).fill(0), 1, true).solution as Grid;
    const puzzle = [...solution];
    const order = [...Array(81).keys()].sort(() => Math.random() - 0.5);
    for (const i of order) {
      const v = puzzle[i]; puzzle[i] = 0;
      if (countSolutions(puzzle) !== 1) puzzle[i] = v;
    }
    const clues = puzzle.filter(Boolean).length;
    if (clues <= MAX_CLUES && !solvableBySingles(puzzle)) return { puzzle, solution };
    if (!fallback || clues < fallback.puzzle.filter(Boolean).length) fallback = { puzzle, solution };
  }
  return fallback;
}
