export interface Player {
  attack: number;
  defense: number;
  health: number;
  currentHealth: number;
  prevHealth: number;
  dodge: number;
  ultReady: boolean;
  reflectReady: boolean;
  lastMove: LastMove;
  ultChecked: boolean;
  ultCooldown: number;
  reflectCooldown: number;
}

export type LastMove = "attack" | "ultimate" | "defense" | "reflect" | null;
