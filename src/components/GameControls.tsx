import { Eraser, Lightbulb, Pause, Pencil, Play, RotateCcw } from 'lucide-react';
import type { Game } from '../types/sudoku';
import type { Act } from '../hooks/useSudokuGame';
const fmt = (t: number) => { const h = Math.floor(t / 3600), m = String(Math.floor(t / 60) % 60).padStart(2, '0'), s = String(t % 60).padStart(2, '0'); return h ? `${String(h).padStart(2, '0')}:${m}:${s}` : `${m}:${s}`; };
type P = { game: Game; dispatch: (a: Act) => void };
export function GameHeader({ game, dispatch }: P) {
  return (
    <div className="stats">
      <div><small>힌트 사용</small><b>{game.hints}</b></div>
      <div><small>실수</small><b>{game.mistakes}/3</b></div>
      <div><small>시간</small><b>{fmt(game.elapsed)}</b></div>
      <button className="pause" aria-label={game.paused ? '재개' : '일시 정지'} onClick={() => dispatch({ t: 'pause' })}>{game.paused ? <Play size={16} /> : <Pause size={16} />}</button>
    </div>
  );
}
export function GameControls({ game, dispatch }: P) {
  return (
    <div className="tools">
      <button aria-label="실행 취소" onClick={() => dispatch({ t: 'undo' })}><RotateCcw /></button>
      <button aria-label="지우기" onClick={() => dispatch({ t: 'erase' })}><Eraser /></button>
      <button aria-label="메모 모드" className={game.noteMode ? 'on' : ''} onClick={() => dispatch({ t: 'note' })}><Pencil /><i className="badge">{game.noteMode ? 'ON' : 'OFF'}</i></button>
      <button aria-label="힌트" onClick={() => dispatch({ t: 'hint' })}><Lightbulb /></button>
    </div>
  );
}
export function NumberPad({ dispatch }: { dispatch: (a: Act) => void }) {
  return <div className="pad">{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <button key={n} onClick={() => dispatch({ t: 'num', n })}>{n}</button>)}</div>;
}
export function GameOverModal({ game, newGame }: { game: Game; newGame: () => void }) {
  if (game.status === 'playing') return null;
  return (
    <div className="modal"><div className="dialog">
      <h2>{game.status === 'won' ? '축하합니다! 퍼즐 완료' : '게임 오버'}</h2>
      <p>{game.status === 'won' ? `기록 ${fmt(game.elapsed)} · 실수 ${game.mistakes}회` : '실수 3회를 초과했습니다.'}</p>
      <button className="new" onClick={newGame}>새 게임</button>
    </div></div>
  );
}
