import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/lib/function';
import Doi from '../types/doi';
import { DomainEvent, isUserSavedArticleEvent } from '../types/domain-events';
import { UserId } from '../types/user-id';

export type GetEvents = T.Task<ReadonlyArray<DomainEvent>>;

export type ProjectHasUserSavedArticle = (getEvents: GetEvents) => (doi: Doi, userId: UserId) => T.Task<boolean>;

export const projectHasUserSavedArticle: ProjectHasUserSavedArticle = (getEvents) => (doi, userId) => pipe(
  getEvents,
  T.map((events) => events
    .filter(isUserSavedArticleEvent)
    .filter((event) => event.userId === userId)
    .map((event) => event.articleId.value)
    .includes(doi.value)),
);
