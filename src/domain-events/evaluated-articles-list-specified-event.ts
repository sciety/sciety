import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromStringCodec } from '../types/group-id';
import { listIdCodec } from '../types/list-id';

export const evaluatedArticlesListSpecifiedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('EvaluatedArticlesListSpecified'),
  date: tt.DateFromISOString,
  listId: listIdCodec,
  groupId: GroupIdFromStringCodec,
});
