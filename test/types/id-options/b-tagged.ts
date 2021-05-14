export type B = {
  readonly _type: 'B',
  readonly value: string,
};

export const fromString = (s: string): B => ({
  _type: 'B',
  value: s,
});
