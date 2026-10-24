import { useEffect } from 'react';
import { useSudokuGame } from './hooks/useSudokuGame';
import { SudokuBoard } from './components/SudokuBoard';
import { GameControls, GameHeader, GameOverModal, NumberPad } from './components/GameControls';
export default function App() {
  const { game, dispatch, newGame } = useSudokuGame();
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.matches('input,textarea,select') || e.ctrlKey || e.metaKey || e.altKey) return;
      if (/^[1-9]$/.test(e.key)) dispatch({ t: 'num', n: +e.key });
      else if (e.key === 'Backspace' || e.key === 'Delete') dispatch({ t: 'erase' });
      else if (e.key.toLowerCase() === 'n') dispatch({ t: 'note' });
      else if (e.key === 'Escape') dispatch({ t: 'sel', i: null });
      else { const d: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
        if (d[e.key]) { e.preventDefault(); dispatch({ t: 'move', dr: d[e.key][0], dc: d[e.key][1] }); } }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [dispatch]);
  return (
    <main className="app">
      <h1>극한 <small>Extreme</small></h1>
      <div className="layout">
        <SudokuBoard game={game} onSel={i => dispatch({ t: 'sel', i })} />
        <section className="panel">
          <GameHeader game={game} dispatch={dispatch} />
          <GameControls game={game} dispatch={dispatch} />
          <p className="msg" role="status">{game.msg}</p>
          <NumberPad dispatch={dispatch} />
          <button className="new" onClick={newGame}>새 게임</button>
        </section>
      </div>
      <GameOverModal game={game} newGame={newGame} />
    </main>
  );
}
