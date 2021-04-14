import * as Eq from 'fp-ts/Eq';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';

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
    return (value as NcrcId)._tag === 'NcrcId';
  }
  return false;
};

export const eqNcrcId: Eq.Eq<NcrcId> = pipe(
  S.Eq,
  Eq.contramap((id) => id.value),
);
