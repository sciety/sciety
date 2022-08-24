import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { ListIdFromString } from './ListIdFromString';
import * as LOID from '../list-owner-id';

export const OwnedByQuery = t.type({
  items: t.readonlyArray(t.type({
    id: ListIdFromString,
    name: t.string,
    description: t.string,
    articleCount: t.number,
    lastUpdated: tt.DateFromISOString,
    ownerId: LOID.fromStringCodec,
  })),
});
