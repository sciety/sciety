import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { listIdCodec } from './list-id';
import * as LOID from './list-owner-id';

export const listCodec = t.type({
  id: listIdCodec,
  name: t.string,
  description: t.string,
  articleIds: t.array(t.string),
  lastUpdated: tt.DateFromISOString,
  ownerId: LOID.fromStringCodec,
});

export type List = t.TypeOf<typeof listCodec>;
