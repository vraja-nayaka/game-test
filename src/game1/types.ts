export interface Player {
  attack: number;
  defense: number;
  currentHealth: number;
  health: number;
  dodge: number;
  ultReady: boolean;
  lastMove: LastMove;
  ultChecked: boolean;
  ultCooldown: number;
}

export type LastMove = "attack" | "defend" | null;
