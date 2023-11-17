import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString.js';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString.js';
import { listIdCodec } from '../types/list-id.js';

export const evaluatedArticlesListSpecifiedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('EvaluatedArticlesListSpecified'),
  date: tt.DateFromISOString,
  listId: listIdCodec,
  groupId: GroupIdFromString,
});
