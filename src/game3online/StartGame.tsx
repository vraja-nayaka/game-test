import { useState } from "react";
import { apiRefs } from "../api/refs";
import { addDoc, deleteDoc, query, updateDoc } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Setup } from "./setup";
import { Player } from "./types";
import { GameProcess } from "./GameProcess";

const initialPlayer: Player = {
  attack: 10,
  defense: 0,
  health: 100,
  currentHealth: 100,
  prevHealth: 100,
  dodge: 0,
  ultReady: true,
  ultChecked: false,
  lastMove: null,
  ultCooldown: 0,
};

export const StartGame = () => {
  const [dodgeMultiplier, setDodgeMultiplier] = useState<number>(5);
  const [ultDamageMultiplier, setUltDamageMultiplier] = useState<number>(1);
  const [maxPoints, setMaxPoints] = useState<number>(30);
  const [playerName, setPlayerName] = useState<string>(
    localStorage.getItem("name") || "default"
  );

  const [player, setPlayer] = useState<Player>(initialPlayer);
  const [currentGameId, setCurrentGameId] = useState<string | null>(
    localStorage.getItem("currentOnlineGameId")
  );
  const [isCurrentGameAdmin, setIsCurrentGameAdmin] = useState<boolean | null>(
    localStorage.getItem("currentOnlineGameIsAdmin") === "true" || null
  );

  const onStartNewGame = async () => {
    const doc = await addDoc(apiRefs.gamesReady<Player>(), {
      player1: { ...player, name: playerName },
      dodgeMultiplier,
      ultDamageMultiplier,
      healthCommon: 100,
      healthMult: 1,
      maxPoints,
    });
    const prevGameId = localStorage.getItem("currentOnlineGameId");
    if (prevGameId) {
      try {
        await deleteDoc(apiRefs.gameReady<Player>(prevGameId));
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem("currentOnlineGameIsAdmin", "true");
    localStorage.setItem("currentOnlineGameId", doc.id);
    setIsCurrentGameAdmin(true);
    setCurrentGameId(doc.id);
  };

  const [activeGames] = useCollectionData(
    query(apiRefs.gamesReadyWithId<Player>())
  );

  const joinGame = (id: string) => {
    localStorage.setItem("currentOnlineGameId", id);
    localStorage.setItem("currentOnlineGameIsAdmin", "false");
    setCurrentGameId(id);
    setIsCurrentGameAdmin(false);
    updateDoc(apiRefs.gameReady<Player>(id), {
      player2Name: playerName,
    });
  };

  const existedGame =
    currentGameId && activeGames?.find(({ id }) => id === currentGameId);

  return (
    <>
      {existedGame ? (
        <>
          <div>
            <span>gameId: {currentGameId}</span>
            {existedGame.player1?.isReady && existedGame.player2?.isReady ? (
              <>
                <GameProcess
                  existedGame={existedGame}
                  isCurrentGameAdmin={isCurrentGameAdmin}
                />
              </>
            ) : (
              <Setup
                dodgeMultiplier={existedGame.dodgeMultiplier}
                maxPoints={existedGame.maxPoints}
                player={player}
                isCurrentGameAdmin={isCurrentGameAdmin}
                savePlayer={(savedPlayer) => {
                  const readyPlayer = {
                    ...savedPlayer,
                    name: playerName,
                    isReady: true,
                  };
                  const payload = isCurrentGameAdmin
                    ? { player1: readyPlayer }
                    : { player2: readyPlayer };
                  updateDoc(apiRefs.gameReady<Player>(currentGameId), payload);
                  setPlayer(savedPlayer);
                }}
                isMeRead={
                  isCurrentGameAdmin
                    ? existedGame.player1?.isReady
                    : existedGame.player2?.isReady
                }
              />
            )}
            <button
              onClick={() => {
                if (currentGameId) {
                  deleteDoc(apiRefs.gameReady<Player>(currentGameId));
                  localStorage.removeItem("currentOnlineGameId");
                  localStorage.removeItem("currentOnlineGameIsAdmin");
                  setIsCurrentGameAdmin(null);
                  setCurrentGameId(null);
                }
              }}
            >
              Delete game
            </button>
          </div>
        </>
      ) : (
        <div>
          <label>
            <b>Имя Игрока: </b>{" "}
            <input
              type="string"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                localStorage.setItem("name", e.target.value);
              }}
            />
          </label>
          <div className="container">
            <div className="setup">
              <h3>Настройки для новой игры:</h3>
              <label>
                Максимум очков характеристик:{" "}
                <input
                  type="number"
                  value={maxPoints}
                  min="0"
                  onChange={(e) => setMaxPoints(parseInt(e.target.value))}
                />
              </label>
              <label>
                Мультипликатор уклонения:{" "}
                <input
                  type="number"
                  value={dodgeMultiplier}
                  min="0"
                  onChange={(e) => setDodgeMultiplier(parseInt(e.target.value))}
                />
              </label>

              <label>
                Мультипликатор урона от ульта:{" "}
                <input
                  type="number"
                  value={ultDamageMultiplier}
                  min="1"
                  onChange={(e) =>
                    setUltDamageMultiplier(parseInt(e.target.value))
                  }
                />
              </label>

              <button onClick={onStartNewGame}>Start new game</button>
            </div>

            <div>
              <h3>Connect existing game</h3>

              {/* // ?.filter(({ player2, player2Name }) => !player2 && !player2Name) */}
              {activeGames?.map(({ player1, id, player2, player2Name }) => {
                const isInProgress = Boolean(player2 || player2Name);
                return (
                  <button
                    key={id}
                    onClick={() => joinGame(id)}
                    disabled={isInProgress}
                  >
                    Admin: {player1.name}, id: {id}{" "}
                    {isInProgress ? "(In Progress)" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
