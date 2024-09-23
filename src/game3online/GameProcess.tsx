import { updateDoc } from "firebase/firestore";
import { apiRefs, WithId } from "../api/refs";
import { GameReadyConfig } from "../api/types";
import { PlayerDisplay } from "./PlayerDisplay";
import ActionLog from "../components/ActionLogs";
import { useEffect } from "react";
import { getIsDodgeSuccess } from "../utils";
import { Player } from "./types";

type Props = {
  existedGame: WithId<GameReadyConfig<Player>>;
  isCurrentGameAdmin: boolean | null;
};

export const GameProcess = ({ existedGame, isCurrentGameAdmin }: Props) => {
  const {
    dodgeMultiplier,
    player1,
    player2,
    id,
    logs = [],
    ultDamageMultiplier,
    reflectMultiplier = 1,
    cooldown = 1,
  } = existedGame;

  const calcDamageDealt = (playerData: Player) => {
    if (playerData.lastMove === "attack") {
      return playerData.attack;
    }
    if (playerData.lastMove === "ultimate") {
      return playerData.attack * ultDamageMultiplier;
    }

    return 0;
  };

  const getDamage = (playerId: 1 | 2): [number, string] => {
    if (!player1 || !player2) {
      return [0, "player not found"];
    }

    const playerData = playerId === 1 ? player1 : player2;
    const opponentData = playerId === 1 ? player2 : player1;

    let logText = `Игрок ${opponentData.name} `;

    if (opponentData.lastMove === null) {
      opponentData.lastMove = "attack";
    }
    if (opponentData.lastMove === "defense") {
      return [0, logText + "защищается"];
    }

    const isDodgeSuccess = getIsDodgeSuccess(playerData.dodge, dodgeMultiplier);

    let totalDamage = calcDamageDealt(opponentData);

    const reflectMult =
      playerData.lastMove === "reflect" ? reflectMultiplier : 1;
    const defenseEffect =
      playerData.lastMove === "ultimate" ||
      playerData.lastMove === "defense" ||
      playerData.lastMove === "reflect"
        ? playerData.defense * reflectMult
        : 0;

    if (opponentData.lastMove === "attack") {
      totalDamage = Math.max(0, totalDamage - defenseEffect);
      const defenseText = defenseEffect
        ? `(${opponentData.attack} - ${defenseEffect} защита)`
        : "";
      logText += `атакует 🗡 на ${totalDamage} ${defenseText}`;
    }

    if (opponentData.lastMove === "ultimate") {
      totalDamage = Math.max(0, totalDamage - defenseEffect);
      const ultText = `(${ultDamageMultiplier} * ${opponentData.attack} - ${defenseEffect} защита)`;

      logText += `ультует 🔥 на ${totalDamage} ${ultText}`;
    }

    if (opponentData.lastMove === "reflect") {
      const playerDamage = calcDamageDealt(playerData);
      const reflectDamage = Math.min(
        reflectMultiplier * opponentData.defense,
        playerDamage
      );
      const reflectText = reflectDamage
        ? ` и отражает ${reflectDamage} (${reflectMultiplier} * ${opponentData.defense}) урона в противника`
        : "";

      logText = logText + `делает reflect` + reflectText;

      return [reflectDamage, logText];
    }

    if (isDodgeSuccess) {
      totalDamage = 0;
      logText += `.\n
Но ${playerData.name} УВЕРНУЛСЯ и не получил урона! ⚡️`;
    }

    return [totalDamage, logText];
  };

  const restart = () => {
    const [newPlayer1, newPlayer2] = [player1, player2].map((playerData) => {
      return {
        ...playerData,
        currentHealth: playerData?.health,
        prevHealth: playerData?.health,
        lastMove: null,
        ultCooldown: 0,
        reflectCooldown: 0,
        ultReady: true,
        reflectReady: true,
      };
    });
    updateDoc(apiRefs.gameReady<Player>(id), {
      player1: newPlayer1,
      player2: newPlayer2,
      logs: ["Game restarted"],
    });
  };

  useEffect(() => {
    const isPlayer1TurnEnd = player1.lastMove;
    const isPlayer2TurnEnd = player2?.lastMove;
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

          const newUltCooldown =
            playerData.lastMove === "ultimate"
              ? cooldown
              : playerData.ultCooldown > 0
              ? playerData.ultCooldown - 1
              : 0;

          const newReflectCooldown =
            playerData.lastMove === "reflect"
              ? cooldown
              : playerData.reflectCooldown > 0
              ? playerData.reflectCooldown - 1
              : 0;

          return {
            ...playerData,
            ultChecked: false,
            ultCooldown: newUltCooldown,
            reflectCooldown: newReflectCooldown,
            ultReady: newUltCooldown === 0,
            reflectReady: newReflectCooldown === 0,
            lastMove: null,
            prevHealth: playerData.currentHealth,
            currentHealth: newHealth,
          };
        }
      );

      updateDoc(apiRefs.gameReady<Player>(id), {
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
            updateDoc(apiRefs.gameReady<Player>(id), { player1: player })
          }
          isMyPlayer={!!isCurrentGameAdmin}
          isGameOver={isGameOver}
        />

        <PlayerDisplay
          dodgeMultiplier={dodgeMultiplier}
          player={player2}
          setPlayer={(player) =>
            updateDoc(apiRefs.gameReady<Player>(id), { player2: player })
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
