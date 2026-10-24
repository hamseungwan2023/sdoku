export type Grid = number[];
const pc = (m: number) => { let c = 0; while (m) { m &= m - 1; c++; } return c; };
const box = (i: number) => Math.floor(i / 27) * 3 + Math.floor((i % 9) / 3);
/** Backtracking (MRV). Returns solution count (up to limit) and first solution. */
export function search(g: Grid, limit = 2, random = false) {
  const b = [...g], R = Array(9).fill(0), C = Array(9).fill(0), B = Array(9).fill(0);
  let count = 0, first: Grid | null = null;
  b.forEach((v, i) => { if (v) { const m = 1 << (v - 1); R[Math.floor(i / 9)] |= m; C[i % 9] |= m; B[box(i)] |= m; } });
  const rec = () => {
    if (count >= limit) return;
    let best = -1, bm = 0, bc = 10;
    for (let i = 0; i < 81; i++) if (!b[i]) {
      const m = ~(R[Math.floor(i / 9)] | C[i % 9] | B[box(i)]) & 511, c = pc(m);
      if (c < bc) { best = i; bm = m; bc = c; if (!c) return; }
    }
    if (best < 0) { count++; if (!first) first = [...b]; return; }
    const r = Math.floor(best / 9), c = best % 9, k = box(best);
    const ds = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => bm & (1 << (d - 1)));
    if (random) ds.sort(() => Math.random() - 0.5);
    for (const d of ds) {
      const m = 1 << (d - 1); b[best] = d; R[r] |= m; C[c] |= m; B[k] |= m;
      rec();
      b[best] = 0; R[r] &= ~m; C[c] &= ~m; B[k] &= ~m;
      if (count >= limit) return;
    }
  };
  rec();
  return { count, solution: first as Grid | null };
}
export const countSolutions = (g: Grid, limit = 2) => search(g, limit).count;
/** True if solvable using only naked + hidden singles (i.e. NOT extreme). */
export function solvableBySingles(g: Grid): boolean {
  const b = [...g];
  const units: number[][] = [];
  for (let r = 0; r < 9; r++) units.push([...Array(9)].map((_, c) => r * 9 + c));
  for (let c = 0; c < 9; c++) units.push([...Array(9)].map((_, r) => r * 9 + c));
  for (let k = 0; k < 9; k++) units.push([...Array(9)].map((_, j) => (Math.floor(k / 3) * 3 + Math.floor(j / 3)) * 9 + (k % 3) * 3 + (j % 3)));
  const cand = (i: number) => { let m = 511; for (const u of units) if (u.includes(i)) for (const j of u) if (b[j]) m &= ~(1 << (b[j] - 1)); return m; };
  for (let progress = true; progress;) {
    progress = false;
    for (let i = 0; i < 81; i++) if (!b[i]) { const m = cand(i); if (pc(m) === 1) { b[i] = Math.log2(m) + 1; progress = true; } }
    for (const u of units) for (let d = 1; d <= 9; d++) {
      const cs = u.filter(i => !b[i] && cand(i) & (1 << (d - 1)));
      if (cs.length === 1 && !u.some(i => b[i] === d)) { b[cs[0]] = d; progress = true; }
    }
  }
  return b.every(v => v);
}
