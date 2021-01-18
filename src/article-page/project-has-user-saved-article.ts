import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/lib/function';
import { HasUserSavedArticle } from './render-saved-link';
import Doi from '../types/doi';
import { DomainEvent, isUserSavedArticleEvent } from '../types/domain-events';

import toUserId from '../types/user-id';

type GetEvents = T.Task<ReadonlyArray<DomainEvent>>;

export const projectHasUserSavedArticle: HasUserSavedArticle = (doi, userId) => {
  const getEvents: GetEvents = T.of([
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
  ]);

  return pipe(
    getEvents,
    T.map((events) => events
      .filter(isUserSavedArticleEvent)
      .filter((event) => event.userId === userId)
      .map((event) => event.articleId.value)
      .includes(doi.value)),
  );
};
