import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { ListIdFromString } from './ListIdFromString';
import * as LOID from '../list-owner-id';

export const OwnedByQuery = t.type({
  items: t.readonlyArray(t.type({
    listId: ListIdFromString,
    name: t.string,
    description: t.string,
    articleIds: t.array(t.string),
    lastUpdated: tt.DateFromISOString,
    ownerId: LOID.fromStringCodec,
  })),
});
