import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../types/article-id';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { listIdCodec } from '../types/list-id';

export const articleAddedToListEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('ArticleAddedToList'),
  date: tt.DateFromISOString,
  articleId: DoiFromString,
  listId: listIdCodec,
});
