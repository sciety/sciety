import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articleIdCodec } from '../types/article-id.js';
import { EventIdFromString } from '../types/codecs/EventIdFromString.js';
import { userIdCodec } from '../types/user-id.js';

export const userSavedArticleEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserSavedArticle'),
  date: tt.DateFromISOString,
  userId: userIdCodec,
  articleId: articleIdCodec,
});
