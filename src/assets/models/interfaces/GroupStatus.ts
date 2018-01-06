import {PuzzleStatus} from './PuzzleStatus';

export interface GroupStatus {
  puzzles: PuzzleStatus[],
  finishTime: string;
  point:0;
}
