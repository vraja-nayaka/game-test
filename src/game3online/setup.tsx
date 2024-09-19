import { useState } from "react";
import { Player } from "./types";
import { getDodgePercent } from "../utils";

type Props = {
  player: Player;
  savePlayer: (player1: Player) => void;
  dodgeMultiplier: number;
  maxPoints: number;
  disabled?: boolean;
  isCurrentGameAdmin: boolean | null;
  isMeRead?: boolean;
};

export const Setup = ({
  player,
  savePlayer,
  dodgeMultiplier,
  maxPoints,
  disabled,
  isCurrentGameAdmin,
  isMeRead,
}: Props) => {
  const [setup, setSetup] = useState({
    attack: 10,
    defense: 0,
    dodge: 0,
  });
  const handleSetupChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    stat: string
  ) => {
    const value = parseInt(e.target.value);
    const valudatedValue = stat === "dodge" ? Math.min(value, 14) : value;
    setSetup((prev) => ({
      ...prev,
      [stat]: valudatedValue,
    }));
  };

  const getRestPoints = () =>
    maxPoints - (setup.attack || 0) - (setup.defense || 0) - (setup.dodge || 0);

  const isValidSetup = (attack: number, defense: number, dodge: number) => {
    return attack + defense + dodge === maxPoints;
  };

  const confirmSetup = () => {
    const { attack, defense, dodge } = setup;
    if (isValidSetup(attack, defense, dodge)) {
      savePlayer({
        ...player,
        attack,
        defense,
        health: 100,
        currentHealth: 100,
        dodge,
      });
    } else {
      alert(
        `Общее количество очков должно быть ровно ${maxPoints} для каждого игрока.`
      );
    }
  };

  return (
    <div className="setup">
      <h2>Распределите характеристики</h2>
      <div className="container">
        <div id="setup1">
          <h3>
            Игрок {isCurrentGameAdmin ? "1" : "2"} ({getRestPoints()} очков
            доступно)
          </h3>
          <label>
            Атака:{" "}
            <input
              type="number"
              value={setup.attack}
              min="10"
              max="20"
              onChange={(e) => handleSetupChange(e, "attack")}
              disabled={disabled}
            />
          </label>
          <br />
          <label>
            Защита:{" "}
            <input
              type="number"
              value={setup.defense}
              min="0"
              max="10"
              onChange={(e) => handleSetupChange(e, "defense")}
              disabled={disabled}
            />
          </label>
          <br />
          <label>
            Dodge ({getDodgePercent(setup.dodge, dodgeMultiplier)}%):{" "}
            <input
              type="number"
              value={setup.dodge}
              min="0"
              max="10"
              onChange={(e) => handleSetupChange(e, "dodge")}
              disabled={disabled}
            />
          </label>
          <br />
        </div>
      </div>
      <button onClick={confirmSetup}>Сохранить статы</button>

      {isMeRead && <h2>You are ready. Waiting for other player</h2>}
    </div>
  );
};
