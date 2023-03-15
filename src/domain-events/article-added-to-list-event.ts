import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { ListIdFromString } from '../types/list-id';
import { Doi } from '../types/doi';
import { generate } from '../types/event-id';
import { ListId } from '../types/list-id';

export const articleAddedToListEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('ArticleAddedToList'),
  date: tt.DateFromISOString,
  articleId: DoiFromString,
  listId: ListIdFromString,
});

export type ArticleAddedToListEvent = t.TypeOf<typeof articleAddedToListEventCodec>;

export const isArticleAddedToListEvent = (event: { type: string }):
  event is ArticleAddedToListEvent => event.type === 'ArticleAddedToList';

export const articleAddedToList = (
  articleId: Doi,
  listId: ListId,
  date = new Date(),
): ArticleAddedToListEvent => ({
  id: generate(),
  type: 'ArticleAddedToList',
  date,
  articleId,
  listId,
});
