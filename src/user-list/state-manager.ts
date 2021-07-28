import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  ArticleRemovedFromUserListEvent,
  DomainEvent, isArticleRemovedFromUserListEvent,
  isUserSavedArticleEvent,
  UserSavedArticleEvent,
} from '../types/domain-events';
import { UserId } from '../types/user-id';

type RelevantEvent = UserSavedArticleEvent | ArticleRemovedFromUserListEvent;

const isRelevantEvent = (userId: UserId) => (event: DomainEvent): event is RelevantEvent => (
  (isUserSavedArticleEvent(event) || isArticleRemovedFromUserListEvent(event))
  && event.userId === userId
);

type StateManager = (events: ReadonlyArray<DomainEvent>, userId: UserId) => boolean;

// ts-unused-exports:disable-next-line
export const stateManager: StateManager = (events, userId) => pipe(
  events,
  RA.filter(isRelevantEvent(userId)),
  RA.last,
  O.map(isUserSavedArticleEvent),
  O.getOrElseW(() => false),
);
