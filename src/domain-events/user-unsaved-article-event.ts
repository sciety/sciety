import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { EventIdFromString } from '../types/codecs/EventIdFromString';
import { UserIdFromString, UserId } from '../types/user-id';
import { Doi } from '../types/doi';
import { generate } from '../types/event-id';

export const userUnsavedArticleEventCodec = t.type({
  id: EventIdFromString,
  type: t.literal('UserUnsavedArticle'),
  date: tt.DateFromISOString,
  userId: UserIdFromString,
  articleId: DoiFromString,
});

export type UserUnsavedArticleEvent = t.TypeOf<typeof userUnsavedArticleEventCodec>;

export const isUserUnsavedArticleEvent = (event: { type: string }):
  event is UserUnsavedArticleEvent => event.type === 'UserUnsavedArticle';

export const userUnsavedArticle = (
  userId: UserId,
  doi: Doi,
  date: Date = new Date(),
): UserUnsavedArticleEvent => ({
  id: generate(),
  type: 'UserUnsavedArticle',
  date,
  userId,
  articleId: doi,
});
