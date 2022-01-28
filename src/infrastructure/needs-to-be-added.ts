import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ArticleAddedToListEvent, DomainEvent, isArticleAddedToListEvent } from '../domain-events';

type NeedsToBeAdded = (existingEvents: ReadonlyArray<DomainEvent>,)
=> (eventToAdd: ArticleAddedToListEvent)
=> boolean;

export const needsToBeAdded: NeedsToBeAdded = (existingEvents) => (eventToAdd) => pipe(
  existingEvents,
  RA.filter(isArticleAddedToListEvent),
  RA.some((event) => event.articleId.value === eventToAdd.articleId.value && event.listId === eventToAdd.listId),
  (found) => !found,
);
