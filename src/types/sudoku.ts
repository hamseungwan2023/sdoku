export type Status = 'playing' | 'won' | 'lost';
export interface Entry { i: number; v: number; n: number }
export interface Game {
  puzzle: number[]; solution: number[]; board: number[]; notes: number[]; // notes: 9-bit mask per cell
  mistakes: number; selected: number | null; noteMode: boolean; status: Status;
  paused: boolean; elapsed: number; history: Entry[]; hints: number; msg: string;
}
