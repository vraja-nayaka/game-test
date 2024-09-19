import { useState } from "react";
import { Player } from "./types";
import { PlayerDisplay } from "./PlayerDisplay";
import { Setup } from "./setup";
import ActionLog from "../components/ActionLogs";
import { getIsDodgeSuccess } from "../utils";

const initialPlayer: Player = {
  attack: 6,
  defense: 6,
  dodge: 0,
  health: 60,
  currentHealth: 60,
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

  const [dodgeMultiplier, setDodgeMultiplier] = useState<number>(5);

  const addLog = (message: string) => {
    setLogs((prevLogs) => [message, ...prevLogs]);
  };

  const calcDamageDealt = (playerData: Player) => {
    if (playerData.lastMove === "defend") {
      return 0;
    }

    let totalDamage = playerData.attack;

    if (playerData.ultChecked) {
      totalDamage += playerData.defense;
    }

    return totalDamage;
  };

  const getDamage = (playerId: 1 | 2): number => {
    const playerData = playerId === 1 ? player1 : player2;
    const opponentId = playerId === 1 ? 2 : 1;
    const opponentData = playerId === 1 ? player2 : player1;

    const isDodgeSuccess = getIsDodgeSuccess(playerData.dodge, dodgeMultiplier);

    let totalDamage = calcDamageDealt(opponentData);
    const addDefensePercent = playerData.lastMove === "defend" ? 25 : 0;
    let defensePercent = playerData.defense * 5 + addDefensePercent;

    const defenseEffect =
      playerData.lastMove === "defend" && playerData.ultChecked
        ? 0
        : Math.round((totalDamage * defensePercent) / 100);

    const defenseText = defenseEffect
      ? `: ${totalDamage} - ${defenseEffect} защита (${defensePercent}%)`
      : "";

    const damageDealt = Math.max(totalDamage - defenseEffect, 0);
    const ultText = opponentData.ultChecked ? " (с ультой! 💫)" : "";

    if (opponentData.lastMove === "defend") {
      const reflectDamage = calcDamageDealt(playerData);
      const reflectText =
        playerData.lastMove === "attack"
          ? ` и отражает ${reflectDamage} урона в противника`
          : "";
      const ultText = opponentData.ultChecked
        ? " (с ультой 💫)" + reflectText
        : " (защита + 25%)";

      addLog(`Игрок ${opponentId} защищается` + ultText);

      return opponentData.ultChecked ? reflectDamage : 0;
    }

    const dodgeText =
      isDodgeSuccess &&
      !(playerData.lastMove === "defend" && playerData.ultChecked)
        ? `. Но игрок ${playerId} УВЕРНУЛСЯ и не получил урона! ⚡️`
        : "";

    addLog(
      `Игрок ${opponentId} атакует на ${damageDealt} урона${defenseText}` +
        ultText +
        dodgeText
    );

    return isDodgeSuccess ||
      (playerData.lastMove === "defend" && playerData.ultChecked)
      ? 0
      : damageDealt;
  };

  const endTurn = () => {
    const newPlayersState = [player1, player2].map((playerData, index) => {
      const playerId = index === 0 ? 1 : 2;
      const damage = getDamage(playerId);
      const newHealth = playerData.currentHealth - damage;

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
        currentHealth: newHealth,
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
            dodgeMultiplier={dodgeMultiplier}
            setDodgeMultiplier={setDodgeMultiplier}
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
