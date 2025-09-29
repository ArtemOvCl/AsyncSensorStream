export const convertCelsiusToFahrenheit = (celsius: number): number => {
  return +(celsius * 9/5 + 32).toFixed(2);
}