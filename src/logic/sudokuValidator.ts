import type { Grid } from './sudokuSolver';
export function isValidSolution(g: Grid): boolean {
  if (g.length !== 81) return false;
  const ok = (idx: number[]) => new Set(idx.map(i => g[i])).size === 9 && idx.every(i => g[i] >= 1 && g[i] <= 9);
  for (let k = 0; k < 9; k++) {
    if (!ok([...Array(9)].map((_, j) => k * 9 + j))) return false;
    if (!ok([...Array(9)].map((_, j) => j * 9 + k))) return false;
    if (!ok([...Array(9)].map((_, j) => (Math.floor(k / 3) * 3 + Math.floor(j / 3)) * 9 + (k % 3) * 3 + (j % 3)))) return false;
  }
  return true;
}
export const isBoardSolved = (board: Grid, solution: Grid) => board.length === 81 && board.every((v, i) => v === solution[i]);
