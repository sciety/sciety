import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { listIdCodec, ListId } from '../types/list-id';
import { Doi } from '../types/doi';
import { generate } from '../types/event-id';

export const articleRemovedFromListEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('ArticleRemovedFromList'),
  date: tt.DateFromISOString,
  articleId: DoiFromString,
  listId: listIdCodec,
});

export type ArticleRemovedFromListEvent = t.TypeOf<typeof articleRemovedFromListEventCodec>;

export const isArticleRemovedFromListEvent = (event: { type: string }):
  event is ArticleRemovedFromListEvent => event.type === 'ArticleRemovedFromList';

export const articleRemovedFromList = (
  articleId: Doi,
  listId: ListId,
  date = new Date(),
): ArticleRemovedFromListEvent => ({
  id: generate(),
  type: 'ArticleRemovedFromList',
  date,
  articleId,
  listId,
});
