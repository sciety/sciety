import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isArticleAddedToListEvent } from '../domain-events';
import { ArticleAddedToListEvent } from '../domain-events/article-added-to-list-event';

type NeedsToBeAdded = (existingEvents: ReadonlyArray<DomainEvent>,)
=> (eventToAdd: ArticleAddedToListEvent)
=> boolean;

export const needsToBeAdded: NeedsToBeAdded = (existingEvents) => (eventToAdd) => pipe(
  existingEvents,
  RA.filter(isArticleAddedToListEvent),
  RA.map((event) => event.articleId),
  (articleIds) => !articleIds.includes(eventToAdd.articleId),
);
