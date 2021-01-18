import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/lib/function';
import { HasUserSavedArticle } from './render-saved-link';
import { DomainEvent, isUserSavedArticleEvent } from '../types/domain-events';

export type GetEvents = T.Task<ReadonlyArray<DomainEvent>>;

export const projectHasUserSavedArticle = (getEvents: GetEvents): HasUserSavedArticle => (doi, userId) => pipe(
  getEvents,
  T.map((events) => events
    .filter(isUserSavedArticleEvent)
    .filter((event) => event.userId === userId)
    .map((event) => event.articleId.value)
    .includes(doi.value)),
);
