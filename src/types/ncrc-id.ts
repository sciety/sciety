export type NcrcId = {
  readonly _tag: 'NcrcId',
  readonly value: string, // TODO use a UUID type
};

export const fromString = (value: string): NcrcId => ({
  _tag: 'NcrcId',
  value,
});

export const isNrcId = (value: unknown): value is NcrcId => {
  if (typeof value === 'object' && value !== null && '_tag' in value) {
    // eslint-disable-next-line no-underscore-dangle
    return (value as NcrcId)._tag === 'NcrcId';
  }
  return false;
};
