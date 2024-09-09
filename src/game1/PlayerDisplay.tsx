import { Player } from "./types";

interface PlayerDisplayProps {
  playerId: 1 | 2;
  player: Player;
  setPlayer: (player: Player) => void;
}

export const PlayerDisplay: React.FC<PlayerDisplayProps> = ({
  playerId,
  player,
  setPlayer,
}) => {
  const { lastMove, ultChecked } = player;

  return (
    <div className="player">
      <h2>Игрок {playerId}</h2>
      <div className="status">
        <p>Атака: {player.attack}</p>
        <p>Защита: {player.defense}</p>
        <p>Уклонение: {player.dodge}</p>
        <p>Здоровье: {player.currentHealth} / {player.health}</p>
      </div>
      <label>
        Ульта: {player.ultCooldown ? `(Cooldown ${player.ultCooldown})` : ""}
        <input
          type="checkbox"
          checked={ultChecked}
          onChange={() => setPlayer({ ...player, ultChecked: !ultChecked })}
          disabled={!player.ultReady}
        />
      </label>
      <br />
      <button
        onClick={() => setPlayer({ ...player, lastMove: "attack" })}
        className={lastMove === "attack" ? "selectedAction" : undefined}
      >
        Атака
      </button>
      <button
        onClick={() => setPlayer({ ...player, lastMove: "defend" })}
        className={lastMove === "defend" ? "selectedAction" : undefined}
      >
        Защита
      </button>
    </div>
  );
};
