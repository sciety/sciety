import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { ListIdFromString } from '../types/list-id';
import { generate } from '../types/event-id';
import { GroupId } from '../types/group-id';
import { ListId } from '../types/list-id';

export const evaluatedArticlesListSpecifiedEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('EvaluatedArticlesListSpecified'),
  date: tt.DateFromISOString,
  listId: ListIdFromString,
  groupId: GroupIdFromString,
});

export type EvaluatedArticlesListSpecifiedEvent = t.TypeOf<typeof evaluatedArticlesListSpecifiedEventCodec>;

export const isEvaluatedArticlesListSpecified = (event: { type: string }):
  event is EvaluatedArticlesListSpecifiedEvent => event.type === 'EvaluatedArticlesListSpecified';

export const evaluatedArticlesListSpecified = (
  listId: ListId,
  groupId: GroupId,
): EvaluatedArticlesListSpecifiedEvent => ({
  id: generate(),
  type: 'EvaluatedArticlesListSpecified',
  date: new Date(),
  listId,
  groupId,
});
