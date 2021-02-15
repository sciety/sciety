export type NcrcId = {
  readonly _tag: 'NcrcId',
  readonly value: string, // TODO use a UUID type
};

export const fromString = (value: string): NcrcId => ({
  _tag: 'NcrcId',
  value,
});
