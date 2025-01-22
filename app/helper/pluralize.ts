export function pluralize(number: number, word: string) {
  return number === 1 ? `${number} ${word}` : `${number} ${word}s`;
}
