import { UUID } from 'io-ts-types';

export type NcrcId = {
  readonly _tag: 'NcrcId',
  readonly value: UUID,
};
