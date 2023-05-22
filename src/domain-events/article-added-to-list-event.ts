import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { listIdCodec, ListId } from '../types/list-id';
import { Doi } from '../types/doi';
import { generate } from '../types/event-id';

export const articleAddedToListEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('ArticleAddedToList'),
  date: tt.DateFromISOString,
  articleId: DoiFromString,
  listId: listIdCodec,
});

type ArticleAddedToListEvent = t.TypeOf<typeof articleAddedToListEventCodec>;

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
