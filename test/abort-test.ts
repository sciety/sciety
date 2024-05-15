export type AbortTest = (message: string) => <L>(left: L) => never;

export const abortTest: AbortTest = (message) => (left) => {
  throw new Error(`${message}: ${JSON.stringify(left)}`);
};
