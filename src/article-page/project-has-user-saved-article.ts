import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { DomainEvent } from '../domain-events';
import { articleSaveState } from '../save-article/article-save-state';
import { Doi } from '../types/doi';
import { UserId } from '../types/user-id';

type GetEvents = T.Task<ReadonlyArray<DomainEvent>>;

type ProjectHasUserSavedArticle = (doi: Doi, userId: UserId) => (getEvents: GetEvents) => T.Task<boolean>;

export const projectHasUserSavedArticle: ProjectHasUserSavedArticle = (doi, userId) => (getEvents) => pipe(
  getEvents,
  T.map(flow(
    articleSaveState(userId, doi),
    (state) => state === 'saved',
  )),
);
