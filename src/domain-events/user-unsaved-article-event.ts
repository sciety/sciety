import * as t from 'io-ts';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { userIdCodec } from '../types/user-id';
import { eventBaseCodec } from './event-base';

export const userUnsavedArticleEventCodec = t.type({
  ...eventBaseCodec('UserUnsavedArticle'),
  userId: userIdCodec,
  articleId: DoiFromString,
});
