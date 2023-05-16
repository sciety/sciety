import * as t from 'io-ts';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { userIdCodec } from '../types/user-id';
import { eventBaseCodec } from './event-base';

export const userSavedArticleEventCodec = t.type({
  ...eventBaseCodec('UserSavedArticle'),
  userId: userIdCodec,
  articleId: DoiFromString,
});
