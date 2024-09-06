import { Player } from "../game2online/types";

export type OnlinePlayer = Player & { name: string; isReady?: boolean };

export type GameReadyConfig = {
  healthMult: number;
  healthCommon: number;
  dodgeMultiplier: number;
  maxPoints: number;
  player1: OnlinePlayer;
  player2?: OnlinePlayer;
  logs?: string[];
};
