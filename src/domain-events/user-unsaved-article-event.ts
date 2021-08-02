import { Doi } from '../types/doi';
import { EventId, generate } from '../types/event-id';
import { UserId } from '../types/user-id';

export type UserUnsavedArticleEvent = Readonly<{
  id: EventId,
  type: 'UserUnsavedArticle',
  date: Date,
  userId: UserId,
  articleId: Doi,
}>;

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
