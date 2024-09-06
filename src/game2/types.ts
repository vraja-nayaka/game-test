export interface Player {
  attack: number;
  defense: number;
  health: number;
  currentHealth: number;
  dodge: number;
  heal: number;
  ultReady: boolean;
  lastMove: LastMove;
  ultChecked: boolean;
  ultCooldown: number;
}

export type LastMove = "attack" | "ultimate" | "heal" | null;
