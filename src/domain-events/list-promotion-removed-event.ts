import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromStringCodec } from '../types/group-id';
import { listIdCodec } from '../types/list-id';

export const listPromotionRemovedEventCodec = t.strict({
  id: EventIdFromString,
  type: t.literal('ListPromotionRemoved'),
  date: tt.DateFromISOString,
  listId: listIdCodec,
  byGroup: GroupIdFromStringCodec,
});
