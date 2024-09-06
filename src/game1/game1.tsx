import { useState } from "react";
import { Player } from "./types";
import { PlayerDisplay } from "./PlayerDisplay";
import { Setup } from "./setup";
import ActionLog from "../components/ActionLogs";

const initialPlayer: Player = {
  attack: 6,
  defense: 6,
  health: 60,
  ultReady: true,
  ultChecked: false,
  lastMove: null,
  ultCooldown: 0,
};

const Game1: React.FC = () => {
  const [player1, setPlayer1] = useState<Player>({ ...initialPlayer });
  const [player2, setPlayer2] = useState<Player>({ ...initialPlayer });
  const [ultCooldown, setUltCooldown] = useState<number>(2);
  const [isBattleStarted, setIsBattleStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prevLogs) => [message, ...prevLogs]);
  };

  const randomBonus = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getDamage = (playerId: 1 | 2): number => {
    const playerData = playerId === 1 ? player1 : player2;
    const opponentId = playerId === 1 ? 2 : 1;
    const opponentData = playerId === 1 ? player2 : player1;

    if (opponentData.lastMove !== "attack") {
      const ultText = opponentData.ultChecked ? " (с ультой 💫)" : "";
      addLog(`Игрок ${opponentId} защищается` + ultText);
      return 0;
    }

    let baseDamage = opponentData.attack * 2;
    let randomDamage = randomBonus(-2, 2);
    let totalDamage = baseDamage + randomDamage;

    if (opponentData.lastMove === "attack" && opponentData.ultChecked) {
      totalDamage *= 2;
    }

    let defensePercent = playerData.defense * 5 + randomBonus(-5, 5);
    if (playerData.ultChecked) {
      defensePercent += 25;
    }

    const defenseEffect =
      playerData.lastMove === "defend"
        ? Math.round((totalDamage * defensePercent) / 100)
        : 0;

    const defenseText = defenseEffect
      ? `: ${totalDamage} - ${defenseEffect} защита (${defensePercent}%)`
      : "";

    const damageDealt = Math.max(totalDamage - defenseEffect, 0);
    const ultText = opponentData.ultChecked ? " (с ультой! 💫)" : "";
    addLog(
      `Игрок ${opponentId} атакует на ${damageDealt} урона${defenseText}` +
        ultText
    );

    return damageDealt;
  };

  const endTurn = () => {
    const newPlayersState = [player1, player2].map((playerData, index) => {
      const playerId = index === 0 ? 1 : 2;
      const damage = getDamage(playerId);
      const newHealth = playerData.health - damage;

      const newCooldown = playerData.ultChecked
        ? ultCooldown
        : playerData.ultCooldown > 0
        ? playerData.ultCooldown - 1
        : 0;

      if (newHealth <= 0) {
        setGameOver(true);
      }

      return {
        ...playerData,
        ultChecked: false,
        ultCooldown: newCooldown,
        ultReady: newCooldown === 0,
        lastMove: null,
        health: newHealth,
      };
    });

    [setPlayer1, setPlayer2].forEach((setPlayer, index) => {
      setPlayer(newPlayersState[index]);
    });
  };

  return (
    <div className="App">
      {!isBattleStarted ? (
        <>
          <label>
            Ult Cooldown:{" "}
            <input
              type="number"
              value={ultCooldown}
              min="0"
              onChange={(e) => setUltCooldown(parseInt(e.target.value))}
            />
          </label>
          <Setup
            player1={player1}
            player2={player2}
            setIsBattleStarted={setIsBattleStarted}
            setPlayer1={setPlayer1}
            setPlayer2={setPlayer2}
            addLog={addLog}
          />
        </>
      ) : (
        <>
          <div className="container">
            <PlayerDisplay
              playerId={1}
              player={player1}
              setPlayer={setPlayer1}
            />
            <PlayerDisplay
              playerId={2}
              player={player2}
              setPlayer={setPlayer2}
            />
          </div>
          {gameOver ? (
            <h1>Игра окончена</h1>
          ) : (
            <button onClick={endTurn}>Конец хода</button>
          )}
          <ActionLog logs={logs} />
        </>
      )}
    </div>
  );
};

export { Game1 };
