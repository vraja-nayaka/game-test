export type OnlinePlayer<Player> = Player & { name: string; isReady?: boolean };

export type GameReadyConfig<Player> = {
  healthMult: number;
  healthCommon: number;
  dodgeMultiplier: number;
  ultDamageMultiplier: number;
  reflectMultiplier?: number;
  maxPoints: number;
  player1: OnlinePlayer<Player>;
  player2?: OnlinePlayer<Player>;
  player2Name?: string;
  logs?: string[];
  cooldown?: number;
};
