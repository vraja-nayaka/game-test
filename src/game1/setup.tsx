import { useState } from 'react';
import { Player } from './types';

type Props = {
  player1: Player;
  player2: Player;
  setPlayer1: (player1: Player) => void;
  setPlayer2: (player2: Player) => void;
  setIsBattleStarted: (bool: boolean) => void;
  addLog: (log: string) => void;
};

export const Setup = ({
  player1,
  player2,
  setPlayer1,
  setPlayer2,
  setIsBattleStarted,
  addLog,
}: Props) => {
  const [setup, setSetup] = useState({
    attack1: 6,
    defense1: 6,
    health1: 6,
    attack2: 6,
    defense2: 6,
    health2: 6,
  });

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
    28 -
    (setup[`attack${id}`] || 6) -
    (setup[`defense${id}`] || 6) -
    (setup[`health${id}`] || 6);

  const isValidSetup = (attack: number, defense: number, health: number) => {
    return attack + defense + health - 18 === 10;
  };

  const confirmSetup = () => {
    const { attack1, defense1, health1, attack2, defense2, health2 } = setup;
    if (
      isValidSetup(attack1, defense1, health1) &&
      isValidSetup(attack2, defense2, health2)
    ) {
      setPlayer1({
        ...player1,
        attack: attack1,
        defense: defense1,
        health: health1 * 10,
      });
      setPlayer2({
        ...player2,
        attack: attack2,
        defense: defense2,
        health: health2 * 10,
      });
      setIsBattleStarted(true);
      addLog('Игра началась!');
    } else {
      alert('Общее количество очков должно быть ровно 10 для каждого игрока.');
    }
  };

  return (
    <div className="setup">
      <h2>Распределите характеристики (10 свободных очков)</h2>
      <div id="setup1">
        <h3>Игрок 1 ({getRestPoints(1)} очков доступно)</h3>
        <label>
          Атака:{' '}
          <input
            type="number"
            value={setup.attack1}
            min="6"
            max="16"
            onChange={(e) => handleSetupChange(e, '1', 'attack')}
          />
        </label>
        <br />
        <label>
          Защита:{' '}
          <input
            type="number"
            value={setup.defense1}
            min="6"
            max="16"
            onChange={(e) => handleSetupChange(e, '1', 'defense')}
          />
        </label>
        <br />
        <label>
          Здоровье:{' '}
          <input
            type="number"
            value={setup.health1}
            min="6"
            max="16"
            onChange={(e) => handleSetupChange(e, '1', 'health')}
          />
        </label>
        <br />
      </div>
      <div id="setup2">
        <h3>Игрок 2 ({getRestPoints(2)} очков доступно)</h3>
        <label>
          Атака:{' '}
          <input
            type="number"
            value={setup.attack2}
            min="6"
            max="16"
            onChange={(e) => handleSetupChange(e, '2', 'attack')}
          />
        </label>
        <br />
        <label>
          Защита:{' '}
          <input
            type="number"
            value={setup.defense2}
            min="6"
            max="16"
            onChange={(e) => handleSetupChange(e, '2', 'defense')}
          />
        </label>
        <br />
        <label>
          Здоровье:{' '}
          <input
            type="number"
            value={setup.health2}
            min="6"
            max="16"
            onChange={(e) => handleSetupChange(e, '2', 'health')}
          />
        </label>
        <br />
      </div>
      <button onClick={confirmSetup}>Подтвердить выбор</button>
    </div>
  );
};
