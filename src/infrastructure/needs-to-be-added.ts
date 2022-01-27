import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../domain-events';
import { ArticleAddedToListEvent } from '../domain-events/article-added-to-list-event';

type NeedsToBeAdded = (existingEvents: ReadonlyArray<DomainEvent>,)
=> (eventToAdd: ArticleAddedToListEvent)
=> boolean;

export const needsToBeAdded: NeedsToBeAdded = () => () => pipe(
  false,
);
