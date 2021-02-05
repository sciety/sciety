import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { Doi, eqDoi } from '../types/doi';
import { DomainEvent, isUserSavedArticleEvent } from '../types/domain-events';
import { UserId } from '../types/user-id';

export type GetEvents = T.Task<ReadonlyArray<DomainEvent>>;

type ProjectHasUserSavedArticle = (getEvents: GetEvents) => (doi: Doi, userId: UserId) => T.Task<boolean>;

export const projectHasUserSavedArticle: ProjectHasUserSavedArticle = (getEvents) => (doi, userId) => pipe(
  getEvents,
  T.map(
    flow(
      RA.filter(isUserSavedArticleEvent),
      RA.some((event) => (event.userId === userId && eqDoi.equals(event.articleId, doi))),
    ),
  ),
);
