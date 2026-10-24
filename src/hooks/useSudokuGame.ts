import { useEffect, useReducer, useCallback } from 'react';
import type { Game } from '../types/sudoku';
import { generatePuzzle } from '../logic/sudokuGenerator';
import { isBoardSolved } from '../logic/sudokuValidator';
import { loadGame, saveGame } from '../utils/storage';

export const MAX_MISTAKES = 3;
export type Act = { t: 'sel'; i: number | null } | { t: 'move'; dr: number; dc: number } | { t: 'num'; n: number } | { t: 'erase' }
  | { t: 'undo' } | { t: 'hint' } | { t: 'note' } | { t: 'pause' } | { t: 'tick' } | { t: 'new'; g: Game };

export function createGame(puzzle: number[], solution: number[]): Game {
  return { puzzle, solution, board: [...puzzle], notes: Array(81).fill(0), mistakes: 0, selected: null, noteMode: false,
    status: 'playing', paused: false, elapsed: 0, history: [], hints: 0, msg: '' };
}
const live = (s: Game) => s.status === 'playing' && !s.paused;
const finish = (s: Game): Game => s.mistakes >= MAX_MISTAKES ? { ...s, status: 'lost' } : isBoardSolved(s.board, s.solution) ? { ...s, status: 'won' } : s;
function edit(s: Game, i: number, v: number, n: number, extra: Partial<Game> = {}): Game {
  const board = [...s.board], notes = [...s.notes]; board[i] = v; notes[i] = n;
  return finish({ ...s, ...extra, board, notes, msg: '', history: [...s.history, { i, v: s.board[i], n: s.notes[i] }] });
}
export function reducer(s: Game, a: Act): Game {
  switch (a.t) {
    case 'new': return a.g;
    case 'sel': return { ...s, selected: a.i, msg: '' };
    case 'move': { if (s.selected === null) return { ...s, selected: 0 };
      const p = s.selected, r = Math.min(8, Math.max(0, Math.floor(p / 9) + a.dr)), c = Math.min(8, Math.max(0, (p % 9) + a.dc));
      return { ...s, selected: r * 9 + c }; }
    case 'note': return { ...s, noteMode: !s.noteMode };
    case 'pause': return s.status === 'playing' ? { ...s, paused: !s.paused } : s;
    case 'tick': return live(s) ? { ...s, elapsed: s.elapsed + 1 } : s;
    case 'num': {
      const i = s.selected; if (!live(s) || i === null || s.puzzle[i]) return s;
      if (s.noteMode) return s.board[i] ? s : edit(s, i, 0, s.notes[i] ^ (1 << (a.n - 1)));
      const bad = a.n !== s.solution[i];
      if (!bad && s.board[i] === a.n) return s;
      return edit(s, i, a.n, 0, bad ? { mistakes: s.mistakes + 1 } : {});
    }
    case 'erase': { const i = s.selected; if (!live(s) || i === null || s.puzzle[i] || (!s.board[i] && !s.notes[i])) return s; return edit(s, i, 0, 0); }
    case 'undo': { if (!live(s) || !s.history.length) return s; const h = s.history[s.history.length - 1];
      const board = [...s.board], notes = [...s.notes]; board[h.i] = h.v; notes[h.i] = h.n;
      return { ...s, board, notes, history: s.history.slice(0, -1), selected: h.i, msg: '' }; }
    case 'hint': { const i = s.selected; if (!live(s)) return s;
      if (i === null || s.puzzle[i] || s.board[i] === s.solution[i]) return { ...s, msg: '힌트를 받을 빈 칸을 선택하세요' };
      return edit(s, i, s.solution[i], 0, { hints: s.hints + 1 }); }
  }
}
export function useSudokuGame() {
  const [game, dispatch] = useReducer(reducer, null, () => { const g = loadGame(); if (g) return g; const p = generatePuzzle(); return createGame(p.puzzle, p.solution); });
  useEffect(() => saveGame(game), [game]);
  useEffect(() => { const id = setInterval(() => dispatch({ t: 'tick' }), 1000); return () => clearInterval(id); }, []);
  const newGame = useCallback(() => {
    if (game.status === 'playing' && game.history.length && !window.confirm('진행 중인 게임을 버리고 새 게임을 시작할까요?')) return;
    try { const p = generatePuzzle(); dispatch({ t: 'new', g: createGame(p.puzzle, p.solution) }); }
    catch { window.alert('퍼즐 생성에 실패했습니다. 기존 게임을 유지합니다.'); }
  }, [game.status, game.history.length]);
  return { game, dispatch, newGame };
}
