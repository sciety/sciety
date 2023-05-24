import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { listIdCodec } from '../types/list-id';

export const evaluatedArticlesListSpecifiedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('EvaluatedArticlesListSpecified'),
  date: tt.DateFromISOString,
  listId: listIdCodec,
  groupId: GroupIdFromString,
});

export type EvaluatedArticlesListSpecifiedEvent = t.TypeOf<typeof evaluatedArticlesListSpecifiedEventCodec>;
