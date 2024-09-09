import { Player } from "./types";
import { getDodgePercent } from "../utils";

interface PlayerDisplayProps {
  playerId: 1 | 2;
  player: Player;
  setPlayer: (player: Player) => void;
  dodgeMultiplier: number;
}

export const PlayerDisplay: React.FC<PlayerDisplayProps> = ({
  playerId,
  player,
  setPlayer,
  dodgeMultiplier,
}) => {
  const { lastMove } = player;

  return (
    <div className="player">
      <h2>Игрок {playerId}</h2>
      <div className="status">
        <p>Атака: {player.attack}</p>
        <p>Защита: {player.defense}</p>
        <p>Лечение: {player.heal}</p>
        <p>Уклонение: {getDodgePercent(player.dodge, dodgeMultiplier)}%</p>
        <p>
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
      <button
        onClick={() => setPlayer({ ...player, lastMove: "ultimate" })}
        className={lastMove === "ultimate" ? "selectedAction" : undefined}
        disabled={!player.ultReady}
      >
        Ultimate
      </button>
      <button
        onClick={() => setPlayer({ ...player, lastMove: "attack" })}
        className={lastMove === "attack" ? "selectedAction" : undefined}
        disabled={!player.ultReady}
      >
        Атака
      </button>
      <button
        onClick={() => setPlayer({ ...player, lastMove: "heal" })}
        className={lastMove === "heal" ? "selectedAction" : undefined}
        disabled={!player.ultReady}
      >
        Лечение
      </button>
    </div>
  );
};
