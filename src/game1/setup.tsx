import { useEffect, useState } from "react";
import { Player } from "./types";
import { getDodgePercent } from "../utils";

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
    attack1: 6,
    defense1: 6,
    dodge1: 6,
    health1: 6,
    attack2: 6,
    defense2: 6,
    dodge2: 6,
    health2: 6,
  });

  const [healthMult, setHealthMult] = useState<number>(10);
  const [healthCommon, setHealthCommon] = useState<number>(0);

  const maxPoints = healthCommon ? 28 : 34;

  useEffect(() => {
    if (maxPoints === 28) {
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
    setSetup((prev) => ({
      ...prev,
      [`${stat}${player}`]: value,
    }));
  };

  const getRestPoints = (id: 1 | 2) =>
    maxPoints -
    (setup[`attack${id}`] || 0) -
    (setup[`defense${id}`] || 0) -
    (setup[`dodge${id}`] || 0) -
    (setup[`health${id}`] || 0);

  const isValidSetup = (
    attack: number,
    defense: number,
    health: number,
    dodge: number
  ) => {
    return attack + defense + health + dodge === maxPoints;
  };

  const confirmSetup = () => {
    const {
      attack1,
      defense1,
      health1,
      dodge1,
      attack2,
      defense2,
      health2,
      dodge2,
    } = setup;
    if (
      isValidSetup(attack1, defense1, health1, dodge1) &&
      isValidSetup(attack2, defense2, health2, dodge2)
    ) {
      setPlayer1({
        ...player1,
        attack: attack1,
        defense: defense1,
        dodge: dodge1,
        health: healthCommon || health1 * healthMult,
        currentHealth: healthCommon || health1 * healthMult,
      });
      setPlayer2({
        ...player2,
        attack: attack2,
        defense: defense2,
        dodge: dodge2,
        health: healthCommon || health2 * healthMult,
        currentHealth: healthCommon || health2 * healthMult,
      });
      setIsBattleStarted(true);
      addLog("Игра началась!");
    } else {
      alert(
        `Общее количество очков должно быть ровно ${maxPoints} для каждого игрока.`
      );
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
      <div id="setup1">
        <h3>Игрок 1 ({getRestPoints(1)} очков доступно)</h3>
        <label>
          Атака:{" "}
          <input
            type="number"
            value={setup.attack1}
            min="6"
            max="16"
            onChange={(e) => handleSetupChange(e, "1", "attack")}
          />
        </label>
        <br />
        <label>
          Защита:{" "}
          <input
            type="number"
            value={setup.defense1}
            min="6"
            max="16"
            onChange={(e) => handleSetupChange(e, "1", "defense")}
          />
        </label>
        <br />
        <label>
          Уклонение ({getDodgePercent(setup.dodge1, dodgeMultiplier)}%):{" "}
          <input
            type="number"
            value={setup.dodge1}
            min="0"
            max="16"
            onChange={(e) => handleSetupChange(e, "1", "dodge")}
          />
        </label>
        <br />
        <label>
          Здоровье({healthCommon || setup.health1 * healthMult}):{" "}
          <input
            type="number"
            value={setup.health1}
            min="6"
            max="16"
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
            min="6"
            max="16"
            onChange={(e) => handleSetupChange(e, "2", "attack")}
          />
        </label>
        <br />
        <label>
          Защита:{" "}
          <input
            type="number"
            value={setup.defense2}
            min="6"
            max="16"
            onChange={(e) => handleSetupChange(e, "2", "defense")}
          />
        </label>
        <br />
        <label>
          Уклонение ({getDodgePercent(setup.dodge2, dodgeMultiplier)}%):{" "}
          <input
            type="number"
            value={setup.dodge2}
            min="0"
            max="16"
            onChange={(e) => handleSetupChange(e, "2", "dodge")}
          />
        </label>
        <br />
        <label>
          Здоровье({healthCommon || setup.health2 * healthMult}):{" "}
          <input
            type="number"
            value={setup.health2}
            min="6"
            max="16"
            onChange={(e) => handleSetupChange(e, "2", "health")}
            disabled={!!healthCommon}
          />
        </label>
        <br />
      </div>
      <button onClick={confirmSetup}>Подтвердить выбор</button>
    </div>
  );
};
