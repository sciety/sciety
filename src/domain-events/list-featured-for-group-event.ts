import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { listIdCodec } from '../types/list-id';

export const listFeaturedForGroupEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('ListFeaturedForGroup'),
  date: tt.DateFromISOString,
  listId: listIdCodec,
  featuredFor: GroupIdFromString,
});
