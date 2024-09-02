import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articleIdCodec } from '../types/article-id';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { userIdCodec } from '../types/user-id';

export const userUnsavedArticleEventCodec = t.strict({
  id: EventIdFromString,
  type: t.literal('UserUnsavedArticle'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  articleId: articleIdCodec,
});
