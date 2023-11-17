import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articleIdCodec } from '../types/article-id.js';
import { EventIdFromString } from '../types/codecs/EventIdFromString.js';
import { listIdCodec } from '../types/list-id.js';

export const articleAddedToListEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('ArticleAddedToList'),
  date: tt.DateFromISOString,
  articleId: articleIdCodec,
  listId: listIdCodec,
});
