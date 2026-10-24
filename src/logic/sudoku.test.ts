import { describe, it, expect } from 'vitest';
import { generatePuzzle } from './sudokuGenerator';
import { countSolutions, solvableBySingles } from './sudokuSolver';
import { isValidSolution } from './sudokuValidator';
import { createGame, reducer } from '../hooks/useSudokuGame';
const { puzzle, solution } = generatePuzzle();
const base = () => createGame(puzzle, solution);
const empty = puzzle.findIndex(v => !v), fixed = puzzle.findIndex(v => v);
const wrong = (i: number) => (solution[i] % 9) + 1;
describe('puzzle', () => {
  it('valid, unique, extreme', () => {
    expect(isValidSolution(solution)).toBe(true);
    expect(countSolutions(puzzle)).toBe(1);
    expect(puzzle.every((v, i) => !v || v === solution[i])).toBe(true);
    expect(solvableBySingles(puzzle)).toBe(false);
  });
});
describe('game', () => {
  const sel = (i: number) => reducer(base(), { t: 'sel', i });
  it('fixed cells immutable', () => {
    const s = reducer(sel(fixed), { t: 'num', n: wrong(fixed) });
    expect(s.board[fixed]).toBe(puzzle[fixed]); expect(s.mistakes).toBe(0);
    expect(reducer(sel(fixed), { t: 'erase' }).board[fixed]).toBe(puzzle[fixed]);
  });
  it('notes toggle without mistakes, undo restores, mistakes persist', () => {
    let s = reducer(sel(empty), { t: 'note' });
    s = reducer(reducer(s, { t: 'num', n: 1 }), { t: 'num', n: 2 }); expect(s.notes[empty]).toBe(3);
    s = reducer(s, { t: 'num', n: 1 }); expect(s.notes[empty]).toBe(2); expect(s.mistakes).toBe(0);
    s = reducer(reducer(s, { t: 'note' }), { t: 'num', n: wrong(empty) });
    expect(s.mistakes).toBe(1); expect(s.notes[empty]).toBe(0);
    s = reducer(s, { t: 'undo' }); expect(s.board[empty]).toBe(0); expect(s.notes[empty]).toBe(2); expect(s.mistakes).toBe(1);
  });
  it('3 mistakes lock the game', () => {
    let s = sel(empty);
    for (let k = 0; k < 3; k++) s = reducer(s, { t: 'num', n: wrong(empty) });
    expect(s.status).toBe('lost');
    expect(reducer(s, { t: 'num', n: solution[empty] })).toBe(s);
  });
  it('completing wins; pause blocks input', () => {
    const p = reducer(sel(empty), { t: 'pause' }); expect(reducer(p, { t: 'num', n: solution[empty] })).toBe(p);
    let s = base();
    puzzle.forEach((v, i) => { if (!v) s = reducer(reducer(s, { t: 'sel', i }), { t: 'num', n: solution[i] }); });
    expect(s.status).toBe('won');
  });
});
