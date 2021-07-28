import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow } from 'fp-ts/function';
import {
  ArticleRemovedFromUserListEvent,
  DomainEvent, isArticleRemovedFromUserListEvent,
  isUserSavedArticleEvent,
  UserSavedArticleEvent,
} from '../types/domain-events';

type RelevantEvent = UserSavedArticleEvent | ArticleRemovedFromUserListEvent;
const isRelevantEvent = (event: DomainEvent): event is RelevantEvent => (
  isUserSavedArticleEvent(event) || isArticleRemovedFromUserListEvent(event)
);

type StateManager = (events: ReadonlyArray<DomainEvent>) => boolean;

// ts-unused-exports:disable-next-line
export const stateManager: StateManager = flow(
  RA.filter(isRelevantEvent),
  RA.last,
  O.map(isUserSavedArticleEvent),
  O.getOrElseW(() => false),
);
