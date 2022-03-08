export const padSingleDigits = (num: number) => {
  const str = num + "";
  return str.length === 1 ? "0" + str : str;
};
