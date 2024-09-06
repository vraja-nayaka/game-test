import { useState } from "react";
import { Player } from "./types";
import { getDodgePercent } from "./utils";

type Props = {
  player: Player;
  savePlayer: (player1: Player) => void;
  dodgeMultiplier: number;
  maxPoints: number;
  healthCommon: number;
  healthMult: number;
  disabled?: boolean;
  isCurrentGameAdmin: boolean | null;
  isMeRead?: boolean;
};

export const Setup = ({
  player,
  savePlayer,
  dodgeMultiplier,
  maxPoints,
  healthCommon,
  healthMult,
  disabled,
  isCurrentGameAdmin,
  isMeRead,
}: Props) => {
  const [setup, setSetup] = useState({
    attack: 4,
    defense: 4,
    health: 4,
    dodge: 4,
    heal: 4,
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
    maxPoints -
    (setup.attack || 0) -
    (setup.defense || 0) -
    (setup.health || 0) -
    (setup.dodge || 0) -
    (setup.heal || 0);

  const isValidSetup = (
    attack: number,
    defense: number,
    health: number,
    dodge: number,
    heal: number
  ) => {
    return attack + defense + health + dodge + heal === maxPoints;
  };

  const confirmSetup = () => {
    const { attack, defense, health, dodge, heal } = setup;
    if (isValidSetup(attack, defense, health, dodge, heal)) {
      savePlayer({
        ...player,
        attack,
        defense,
        health: healthCommon || health * healthMult,
        currentHealth: healthCommon || health * healthMult,
        heal,
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
              min="4"
              max="14"
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
              min="4"
              max="14"
              onChange={(e) => handleSetupChange(e, "defense")}
              disabled={disabled}
            />
          </label>
          <br />
          <label>
            Heal:{" "}
            <input
              type="number"
              value={setup.heal}
              min="4"
              max="14"
              onChange={(e) => handleSetupChange(e, "heal")}
              disabled={disabled}
            />
          </label>
          <br />
          <label>
            Dodge ({getDodgePercent(setup.dodge, dodgeMultiplier)}%):{" "}
            <input
              type="number"
              value={setup.dodge}
              min="4"
              max="14"
              onChange={(e) => handleSetupChange(e, "dodge")}
              disabled={disabled}
            />
          </label>
          <br />
          <label>
            Здоровье ({healthCommon || setup.health * healthMult}):{" "}
            <input
              type="number"
              value={setup.health}
              min="4"
              max="14"
              onChange={(e) => handleSetupChange(e, "health")}
              disabled={!!healthCommon || disabled}
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
