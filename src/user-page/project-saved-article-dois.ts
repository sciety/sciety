import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { GetSavedArticleDois } from './fetch-saved-articles';
import { DomainEvent, isUserSavedArticleEvent } from '../types/domain-events';

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export const projectSavedArticleDois = (getAllEvents: GetAllEvents): GetSavedArticleDois => (userId) => pipe(
  getAllEvents,
  T.map(flow(
    RA.filter(isUserSavedArticleEvent),
    RA.filter((event) => event.userId === userId),
    RA.map((event) => event.articleId),
    RA.reverse,
  )),
);
