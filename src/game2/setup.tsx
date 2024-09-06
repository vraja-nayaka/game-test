import { useEffect, useState } from "react";
import { Player } from "./types";
import { getDodgePercent } from "./utils";

type Props = {
  player1: Player;
  player2: Player;
  setPlayer1: (player1: Player) => void;
  setPlayer2: (player2: Player) => void;
  setIsBattleStarted: (bool: boolean) => void;
  addLog: (log: string) => void;
  setDodgeMultiplier: (mult: number) => void;
  dodgeMultiplier: number;
};

export const Setup = ({
  player1,
  player2,
  setPlayer1,
  setPlayer2,
  setIsBattleStarted,
  addLog,
  dodgeMultiplier,
  setDodgeMultiplier,
}: Props) => {
  const [setup, setSetup] = useState({
    attack1: 4,
    defense1: 4,
    health1: 4,
    dodge1: 4,
    heal1: 4,
    attack2: 4,
    defense2: 4,
    health2: 4,
    dodge2: 4,
    heal2: 4,
  });

  const [healthMult, setHealthMult] = useState<number>(1);
  const [healthCommon, setHealthCommon] = useState<number>(0);

  const maxPoints = healthCommon ? 40 : 50;

  useEffect(() => {
    if (maxPoints === 40) {
      setSetup((prev) => ({ ...prev, health1: 0, health2: 0 }));
      setHealthMult(1);
    }
  }, [maxPoints]);

  const handleSetupChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    player: string,
    stat: string
  ) => {
    const value = parseInt(e.target.value);
    const valudatedValue = stat === "dodge" ? Math.min(value, 14) : value;
    setSetup((prev) => ({
      ...prev,
      [`${stat}${player}`]: valudatedValue,
    }));
  };

  const getRestPoints = (id: 1 | 2) =>
    maxPoints -
    (setup[`attack${id}`] || 0) -
    (setup[`defense${id}`] || 0) -
    (setup[`health${id}`] || 0) -
    (setup[`dodge${id}`] || 0) -
    (setup[`heal${id}`] || 0);

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
    const { attack1, defense1, health1, dodge1, heal1 } = setup;
    const { attack2, defense2, health2, dodge2, heal2 } = setup;
    if (
      isValidSetup(attack1, defense1, health1, dodge1, heal1) &&
      isValidSetup(attack2, defense2, health2, dodge2, heal2)
    ) {
      setPlayer1({
        ...player1,
        attack: attack1,
        defense: defense1,
        health: healthCommon || health1 * healthMult,
        currentHealth: healthCommon || health1 * healthMult,
        heal: heal1,
        dodge: dodge1,
      });
      setPlayer2({
        ...player2,
        attack: attack2,
        defense: defense2,
        health: healthCommon || health2 * healthMult,
        currentHealth: healthCommon || health2 * healthMult,
        heal: heal2,
        dodge: dodge2,
      });
      setIsBattleStarted(true);
      addLog("Игра началась!");
    } else {
      alert("Общее количество очков должно быть ровно 40 для каждого игрока.");
    }
  };

  return (
    <div className="setup">
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
        Мультипликатор здоровья:{" "}
        <input
          type="number"
          value={healthMult}
          min="1"
          onChange={(e) => setHealthMult(parseInt(e.target.value))}
          disabled={!!healthCommon}
        />
      </label>
      <label>
        Фиксированное здоровье:{" "}
        <input
          type="number"
          value={healthCommon}
          min="0"
          onChange={(e) => setHealthCommon(parseInt(e.target.value))}
        />
      </label>
      <h2>Распределите характеристики</h2>
      <div className="container">
        <div id="setup1">
          <h3>Игрок 1 ({getRestPoints(1)} очков доступно)</h3>
          <label>
            Атака:{" "}
            <input
              type="number"
              value={setup.attack1}
              min="4"
              max="14"
              onChange={(e) => handleSetupChange(e, "1", "attack")}
            />
          </label>
          <br />
          <label>
            Защита:{" "}
            <input
              type="number"
              value={setup.defense1}
              min="4"
              max="14"
              onChange={(e) => handleSetupChange(e, "1", "defense")}
            />
          </label>
          <br />
          <label>
            Heal:{" "}
            <input
              type="number"
              value={setup.heal1}
              min="4"
              max="14"
              onChange={(e) => handleSetupChange(e, "1", "heal")}
            />
          </label>
          <br />
          <label>
            Dodge ({getDodgePercent(setup.dodge1, dodgeMultiplier)}%):{" "}
            <input
              type="number"
              value={setup.dodge1}
              min="4"
              max="14"
              onChange={(e) => handleSetupChange(e, "1", "dodge")}
            />
          </label>
          <br />
          <label>
            Здоровье ({healthCommon || setup.health1 * healthMult}):{" "}
            <input
              type="number"
              value={setup.health1}
              min="4"
              max="14"
              onChange={(e) => handleSetupChange(e, "1", "health")}
              disabled={!!healthCommon}
            />
          </label>
          <br />
        </div>
        <div id="setup2">
          <h3>Игрок 2 ({getRestPoints(2)} очков доступно)</h3>
          <label>
            Атака:{" "}
            <input
              type="number"
              value={setup.attack2}
              min="4"
              max="14"
              onChange={(e) => handleSetupChange(e, "2", "attack")}
            />
          </label>
          <br />
          <label>
            Защита:{" "}
            <input
              type="number"
              value={setup.defense2}
              min="4"
              max="14"
              onChange={(e) => handleSetupChange(e, "2", "defense")}
            />
          </label>
          <br />
          <label>
            Heal:{" "}
            <input
              type="number"
              value={setup.heal2}
              min="4"
              max="14"
              onChange={(e) => handleSetupChange(e, "2", "heal")}
            />
          </label>
          <br />
          <label>
            Dodge ({getDodgePercent(setup.dodge2, dodgeMultiplier)}%):{" "}
            <input
              type="number"
              value={setup.dodge2}
              min="4"
              max="14"
              onChange={(e) => handleSetupChange(e, "2", "dodge")}
            />
          </label>
          <br />
          <label>
            Здоровье ({healthCommon || setup.health2 * healthMult}):{" "}
            <input
              type="number"
              value={setup.health2}
              min="4"
              max="14"
              onChange={(e) => handleSetupChange(e, "2", "health")}
              disabled={!!healthCommon}
            />
          </label>
          <br />
        </div>
      </div>
      <button onClick={confirmSetup}>Подтвердить выбор</button>
    </div>
  );
};
