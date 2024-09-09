export const getDodgePercent = (dodge: number, rate: number) => {
  return (dodge || 0) * rate;
};

export const getIsDodgeSuccess = (dodge: number, rate: number) => {
  const dodgeRate = getDodgePercent(dodge, rate) / 100;
  return Math.random() <= dodgeRate;
};
