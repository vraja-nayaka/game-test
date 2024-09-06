import { updateDoc } from "firebase/firestore";
import { apiRefs, WithId } from "../api/refs";
import { GameReadyConfig } from "../api/types";
import { PlayerDisplay } from "./PlayerDisplay";
import ActionLog from "../components/ActionLogs";
import { useEffect } from "react";
import { getIsDodgeSuccess } from "./utils";

type Props = {
  existedGame: WithId<GameReadyConfig>;
  isCurrentGameAdmin: boolean | null;
};

export const GameProcess = ({ existedGame, isCurrentGameAdmin }: Props) => {
  const ultCooldown = 1;
  const { dodgeMultiplier, player1, player2, id, logs = [] } = existedGame;

  const getDamage = (playerId: 1 | 2): [number, string] => {
    if (!player1 || !player2) {
      return [0, "player not found"];
    }

    const playerData = playerId === 1 ? player1 : player2;
    const opponentData = playerId === 1 ? player2 : player1;

    let logText = `Игрок ${opponentData.name} `;
    if (opponentData.lastMove === null) {
      const damage = playerData.lastMove === "heal" ? -playerData.heal : 0;
      return [damage, logText + "отдыхает"];
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
      logText += `. Но ${playerData.name} УВЕРНУЛСЯ и не получил урона! ⚡️`;
    }

    if (opponentData.lastMove === "heal") {
      logText += `хилится 💊 на ${opponentData.heal}`;
    }

    if (playerData.lastMove === "heal") {
      totalDamage -= playerData.heal;
    }

    return [totalDamage, logText];
  };

  const restart = () => {
    const [newPlayer1, newPlayer2] = [player1, player2].map((playerData) => {
      return {
        ...playerData,
        currentHealth: playerData?.health,
        lastMove: null,
        ultCooldown: 0,
        ultReady: true,
      };
    });
    updateDoc(apiRefs.gameReady(id), {
      player1: newPlayer1,
      player2: newPlayer2,
      logs: ["Game restarted"],
    });
  };

  useEffect(() => {
    const isPlayer1TurnEnd = player1.lastMove || !player1.ultReady;
    const isPlayer2TurnEnd = player2?.lastMove || !player2?.ultReady;
    // endTurn
    if (isCurrentGameAdmin && isPlayer1TurnEnd && isPlayer2TurnEnd) {
      if (!player1 || !player2) {
        return;
      }

      const newLogs = [...logs];

      const [newPlayer1, newPlayer2] = [player1, player2].map(
        (playerData, index) => {
          const playerId = index === 0 ? 1 : 2;
          const [damage, log] = getDamage(playerId);
          newLogs.unshift(log);
          const newHealth = playerData.currentHealth - damage;

          const newCooldown =
            playerData.lastMove === "ultimate"
              ? ultCooldown
              : playerData.ultCooldown > 0
              ? playerData.ultCooldown - 1
              : 0;

          return {
            ...playerData,
            ultChecked: false,
            ultCooldown: newCooldown,
            ultReady: newCooldown === 0,
            lastMove: null,
            currentHealth: Math.min(newHealth, playerData.health),
          };
        }
      );

      updateDoc(apiRefs.gameReady(id), {
        player1: newPlayer1,
        player2: newPlayer2,
        logs: newLogs,
      });
    }
  }, [player1, player2]);

  if (!player2) {
    return <>player2 not found</>;
  }

  const isGameOver = player1.currentHealth <= 0 || player2.currentHealth <= 0;

  return (
    <div>
      <button onClick={restart}>Restart</button>
      <div className="container">
        <PlayerDisplay
          dodgeMultiplier={dodgeMultiplier}
          player={player1}
          setPlayer={(player) =>
            updateDoc(apiRefs.gameReady(id), { player1: player })
          }
          isMyPlayer={!!isCurrentGameAdmin}
          isGameOver={isGameOver}
        />

        <PlayerDisplay
          dodgeMultiplier={dodgeMultiplier}
          player={player2}
          setPlayer={(player) =>
            updateDoc(apiRefs.gameReady(id), { player2: player })
          }
          isMyPlayer={!isCurrentGameAdmin}
          isGameOver={isGameOver}
        />
      </div>
      {isGameOver && <h1>Игра окончена</h1>}

      <ActionLog logs={logs} />
    </div>
  );
};
