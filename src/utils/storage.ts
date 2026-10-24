import type { Game } from '../types/sudoku';
const KEY = 'sudoku-extreme-v1';
export const saveGame = (g: Game) => { try { localStorage.setItem(KEY, JSON.stringify(g)); } catch { /* ignore */ } };
export function loadGame(): Game | null {
  try {
    const g = JSON.parse(localStorage.getItem(KEY) || 'null');
    const a = (x: unknown) => Array.isArray(x) && x.length === 81 && x.every(n => Number.isInteger(n));
    if (g && a(g.puzzle) && a(g.solution) && a(g.board) && a(g.notes) && ['playing', 'won', 'lost'].includes(g.status)
      && Number.isInteger(g.mistakes) && Array.isArray(g.history)) return g as Game;
  } catch { /* corrupted */ }
  return null;
}
