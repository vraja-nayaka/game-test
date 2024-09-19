import { Player } from "./types";
import { OnlinePlayer } from "../api/types";
import { getDodgePercent } from "../utils";

interface PlayerDisplayProps {
  player: OnlinePlayer<Player>;
  setPlayer: (player: Player) => void;
  dodgeMultiplier: number;
  isMyPlayer: boolean;
  isGameOver: boolean;
}

export const PlayerDisplay: React.FC<PlayerDisplayProps> = ({
  player,
  setPlayer,
  dodgeMultiplier,
  isMyPlayer,
  isGameOver,
}) => {
  const { lastMove } = player;
  const disabled = !player.ultReady || !!lastMove || isGameOver;

  const healthDiff = player.currentHealth - player.prevHealth;

  return (
    <div className="player">
      <h2>Игрок {player.name}</h2>
      <div className="status">
        <p>Атака: {player.attack}</p>
        <p>Защита: {player.defense}</p>
        <p>Уклонение: {getDodgePercent(player.dodge, dodgeMultiplier)}%</p>
        <p style={{ color: player.currentHealth <= 0 ? "red" : "green" }}>
          Здоровье: {player.currentHealth} / {player.health}{" "}
          <span style={{ color: "red" }}>({healthDiff})</span>
        </p>
      </div>
      <br />

      {isMyPlayer && (
        <>
          <button
            onClick={() => setPlayer({ ...player, lastMove: "attack" })}
            className={lastMove === "attack" ? "selectedAction" : undefined}
          >
            Атака
          </button>
          <button
            onClick={() => setPlayer({ ...player, lastMove: "ultimate" })}
            className={lastMove === "ultimate" ? "selectedAction" : undefined}
            disabled={disabled}
          >
            Ultimate
          </button>
          <button
            onClick={() => setPlayer({ ...player, lastMove: "defense" })}
            className={lastMove === "defense" ? "selectedAction" : undefined}
          >
            Защита
          </button>{" "}
          <button
            onClick={() => setPlayer({ ...player, lastMove: "reflect" })}
            className={lastMove === "reflect" ? "selectedAction" : undefined}
            disabled={disabled}
          >
            Рефлект
          </button>
        </>
      )}
    </div>
  );
};
