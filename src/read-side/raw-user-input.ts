export type RawUserInput = {
  content: string,
};

export const rawUserInput = (input: string): RawUserInput => ({
  content: input,
});
