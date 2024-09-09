import { useState } from "react";
import { Player } from "./types";
import { PlayerDisplay } from "./PlayerDisplay";
import { Setup } from "./setup";
import ActionLog from "../components/ActionLogs";
import { getIsDodgeSuccess } from "../utils";

const initialPlayer: Player = {
  attack: 4,
  defense: 4,
  health: 4,
  currentHealth: 4,
  dodge: 0,
  heal: 4,
  ultReady: true,
  ultChecked: false,
  lastMove: null,
  ultCooldown: 0,
};

const Game2: React.FC = () => {
  const [player1, setPlayer1] = useState<Player>({ ...initialPlayer });
  const [player2, setPlayer2] = useState<Player>({ ...initialPlayer });
  const [ultCooldown, setUltCooldown] = useState<number>(1);
  const [dodgeMultiplier, setDodgeMultiplier] = useState<number>(5);

  const [isBattleStarted, setIsBattleStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prevLogs) => [message, ...prevLogs]);
  };

  const getDamage = (playerId: 1 | 2): number => {
    const playerData = playerId === 1 ? player1 : player2;
    const opponentId = playerId === 1 ? 2 : 1;
    const opponentData = playerId === 1 ? player2 : player1;

    let logText = `Игрок ${opponentId} `;
    if (opponentData.lastMove === null) {
      addLog(logText + "отдыхает");
      return playerData.lastMove === "heal" ? -playerData.heal : 0;
    }

    const isDodgeSuccess = getIsDodgeSuccess(playerData.dodge, dodgeMultiplier);

    let totalDamage = 0;

    const defenseEffect =
      playerData.lastMove === "ultimate" || playerData.ultCooldown
        ? 0
        : playerData.defense;

    if (opponentData.lastMove === "attack") {
      totalDamage = Math.max(0, opponentData.attack - defenseEffect);
      logText += `атакует 🗡 на ${totalDamage} (${opponentData.attack} - ${defenseEffect} защита)`;
    }

    if (opponentData.lastMove === "ultimate") {
      totalDamage = Math.max(
        0,
        opponentData.attack +
          opponentData.defense +
          opponentData.heal -
          defenseEffect
      );
      logText += `ультует 🔥 на ${totalDamage} (${opponentData.attack}🗡 + ${opponentData.defense}🛡 + ${opponentData.heal}💊 - ${defenseEffect} защита)`;
    }

    if (isDodgeSuccess && opponentData.lastMove !== "heal") {
      totalDamage = 0;
      logText += `. Но игрок ${playerId} УВЕРНУЛСЯ и не получил урона! ⚡️`;
    }

    if (opponentData.lastMove === "heal") {
      logText += `хилится 💊 на ${opponentData.heal}`;
    }

    if (playerData.lastMove === "heal") {
      totalDamage -= playerData.heal;
    }

    addLog(logText);
    return totalDamage;
  };

  const endTurn = () => {
    const newPlayersState = [player1, player2].map((playerData, index) => {
      const playerId = index === 0 ? 1 : 2;
      const damage = getDamage(playerId);
      const newHealth = playerData.currentHealth - damage;

      const newCooldown =
        playerData.lastMove === "ultimate"
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
        currentHealth: Math.min(newHealth, playerData.health),
      };
    });

    [setPlayer1, setPlayer2].forEach((setPlayer, index) => {
      setPlayer(newPlayersState[index]);
    });
  };

  const restart = () => {
    const newPlayersState = [player1, player2].map((playerData) => {
      return {
        ...playerData,
        currentHealth: playerData.health,
        lastMove: null,
        ultCooldown: 0,
        ultReady: true,
      };
    });
    [setPlayer1, setPlayer2].forEach((setPlayer, index) => {
      setPlayer(newPlayersState[index]);
    });
    setLogs([]);
    setGameOver(false);
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
            setDodgeMultiplier={setDodgeMultiplier}
            dodgeMultiplier={dodgeMultiplier}
          />
        </>
      ) : (
        <>
          <button onClick={restart}>Restart с теми же статами</button>
          <div className="container">
            <PlayerDisplay
              playerId={1}
              player={player1}
              setPlayer={setPlayer1}
              dodgeMultiplier={dodgeMultiplier}
            />
            <PlayerDisplay
              playerId={2}
              player={player2}
              setPlayer={setPlayer2}
              dodgeMultiplier={dodgeMultiplier}
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

export { Game2 };
