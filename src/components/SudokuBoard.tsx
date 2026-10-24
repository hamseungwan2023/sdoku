import type { Game } from '../types/sudoku';
const peer = (a: number, b: number) => Math.floor(a / 9) === Math.floor(b / 9) || a % 9 === b % 9 ||
  (Math.floor(a / 27) === Math.floor(b / 27) && Math.floor((a % 9) / 3) === Math.floor((b % 9) / 3));
export function SudokuCell({ g, i, onSel }: { g: Game; i: number; onSel: (i: number) => void }) {
  const v = g.board[i], s = g.selected, sv = s !== null ? g.board[s] : 0;
  const cls = ['cell', g.puzzle[i] ? 'fixed' : 'user', i % 9 % 3 === 2 && i % 9 < 8 ? 'br' : '', Math.floor(i / 9) % 3 === 2 && i < 72 ? 'bb' : '',
    s === i ? 'sel' : sv && v === sv ? 'same' : s !== null && peer(s, i) ? 'peer' : '', v && v !== g.solution[i] ? 'wrong' : ''].join(' ');
  return (
    <div className={cls} onClick={() => onSel(i)} role="gridcell" aria-label={`${Math.floor(i / 9) + 1}행 ${i % 9 + 1}열`}>
      {v ? v : g.notes[i] ? <div className="notes">{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <span key={n}>{g.notes[i] & (1 << (n - 1)) ? n : ''}</span>)}</div> : null}
    </div>
  );
}
export function SudokuBoard({ game, onSel }: { game: Game; onSel: (i: number) => void }) {
  return (
    <div className="board-wrap">
      <div className="board" role="grid">{game.board.map((_, i) => <SudokuCell key={i} g={game} i={i} onSel={onSel} />)}</div>
      {game.paused && <div className="cover">일시 정지됨<br /><small>재개 버튼을 눌러 계속하세요</small></div>}
    </div>
  );
}
