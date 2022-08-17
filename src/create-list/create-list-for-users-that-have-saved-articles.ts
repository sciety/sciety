import { isUserSavedArticleEvent } from '../domain-events/user-saved-article-event';
import * as T from 'fp-ts/Task';
import { DomainEvent } from '../domain-events';

export const createListForUsersThatHaveSavedArticles = (event: DomainEvent): T.Task<void> => {
  if (isUserSavedArticleEvent(event)) {
    // issue a CreateList command
    //   listId: `listid${event.userId}`
    //   ownerId: event.userId
    //   date: new Date()
  }
  return T.of(undefined);
};
