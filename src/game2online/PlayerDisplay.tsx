import { Player } from "./types";
import { OnlinePlayer } from "../api/types";
import { getDodgePercent } from "../utils";

interface PlayerDisplayProps {
  player: OnlinePlayer;
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

  return (
    <div className="player">
      <h2>Игрок {player.name}</h2>
      <div className="status">
        <p>Атака: {player.attack}</p>
        <p>Защита: {player.defense}</p>
        <p>Лечение: {player.heal}</p>
        <p>Уклонение: {getDodgePercent(player.dodge, dodgeMultiplier)}%</p>
        <p style={{ color: player.currentHealth <= 0 ? "red" : "green" }}>
          Здоровье: {player.currentHealth} / {player.health}
        </p>
      </div>
      {/* <label>
        Ульта: {player.ultCooldown ? `(Cooldown ${player.ultCooldown})` : ""}
        <input
          type="checkbox"
          checked={ultChecked}
          onChange={() => setPlayer({ ...player, ultChecked: !ultChecked })}
          disabled={!player.ultReady}
        />
      </label> */}
      <br />

      {isMyPlayer && (
        <>
          <button
            onClick={() => setPlayer({ ...player, lastMove: "ultimate" })}
            className={lastMove === "ultimate" ? "selectedAction" : undefined}
            disabled={disabled}
          >
            Ultimate
          </button>
          <button
            onClick={() => setPlayer({ ...player, lastMove: "attack" })}
            className={lastMove === "attack" ? "selectedAction" : undefined}
            disabled={disabled}
          >
            Атака
          </button>
          <button
            onClick={() => setPlayer({ ...player, lastMove: "heal" })}
            className={lastMove === "heal" ? "selectedAction" : undefined}
            disabled={disabled}
          >
            Лечение
          </button>
        </>
      )}
    </div>
  );
};
