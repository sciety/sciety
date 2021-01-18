import * as T from 'fp-ts/Task';
import { HasUserSavedArticle } from './render-saved-link';
import Doi from '../types/doi';
import { UserSavedArticleEvent } from '../types/domain-events';
import toUserId from '../types/user-id';

export const projectHasUserSavedArticle: HasUserSavedArticle = (doi, userId) => {
  const events: ReadonlyArray<UserSavedArticleEvent> = [
    {
      type: 'UserSavedArticle',
      date: new Date(),
      userId: toUserId('1295307136415735808'),
      articleId: new Doi('10.1101/2020.07.04.187583'),
    },
    {
      type: 'UserSavedArticle',
      date: new Date(),
      userId: toUserId('1295307136415735808'),
      articleId: new Doi('10.1101/2020.09.09.289785'),
    },
  ];

  const savedDois = events
    .filter((event) => event.userId === userId)
    .map((event) => event.articleId.value);
  return T.of(savedDois.includes(doi.value));
};
