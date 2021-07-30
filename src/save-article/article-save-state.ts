import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { SaveState } from './command-handler';
import { Doi } from '../types/doi';
import {
  DomainEvent,
  isUserSavedArticleEvent, isUserUnsavedArticleEvent,
  UserSavedArticleEvent,
  UserUnsavedArticleEvent,
} from '../types/domain-events';
import { UserId } from '../types/user-id';

type RelevantEvent = UserSavedArticleEvent | UserUnsavedArticleEvent;

const isRelevantEvent = (userId: UserId, articleId: Doi) => (event: DomainEvent): event is RelevantEvent => (
  (isUserSavedArticleEvent(event) || isUserUnsavedArticleEvent(event))
  && event.userId === userId
  && event.articleId.value === articleId.value
);

type ArticleSaveState = (events: ReadonlyArray<DomainEvent>, userId: UserId, articleId: Doi) => SaveState;

export const articleSaveState: ArticleSaveState = (events, userId, articleId) => pipe(
  events,
  RA.filter(isRelevantEvent(userId, articleId)),
  RA.last,
  O.map(isUserSavedArticleEvent),
  O.fold(
    () => 'not-saved',
    (isSavedEvent) => (isSavedEvent ? 'saved' : 'not-saved'),
  ),
);
