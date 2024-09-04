export interface Player {
  attack: number;
  defense: number;
  health: number;
  ultReady: boolean;
  lastMove: LastMove;
  ultChecked: boolean;
  ultCooldown: number;
}

export type LastMove = 'attack' | 'defend' | null;
