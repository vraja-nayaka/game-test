import React from 'react';

interface ActionLogProps {
  logs: string[];
}

const ActionLog: React.FC<ActionLogProps> = ({ logs }) => {
  return (
    <div className="log">
      {logs.map((log, index) => (
        <p key={index}>{log}</p>
      ))}
    </div>
  );
};

export default ActionLog;
