import { Doi } from '../types/doi';
import { EventId, generate } from '../types/event-id';
import { UserId } from '../types/user-id';

export type UserSavedArticleEvent = Readonly<{
  id: EventId,
  type: 'UserSavedArticle',
  date: Date,
  userId: UserId,
  articleId: Doi,
}>;

export const userSavedArticle = (
  userId: UserId,
  doi: Doi,
  date: Date = new Date(),
): UserSavedArticleEvent => ({
  id: generate(),
  type: 'UserSavedArticle',
  date,
  userId,
  articleId: doi,
});
