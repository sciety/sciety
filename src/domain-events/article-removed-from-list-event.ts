import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articleIdCodec } from '../types/article-id';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { listIdCodec } from '../types/list-id';

export const articleRemovedFromListEventCodec = t.strict({
  id: EventIdFromString,
  type: t.literal('ArticleRemovedFromList'),
  date: tt.DateFromISOString,
  articleId: articleIdCodec,
  listId: listIdCodec,
});
