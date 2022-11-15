import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../domain-events';
import { articleSaveState } from '../../save-article/article-save-state';
import { Doi } from '../../types/doi';
import { UserId } from '../../types/user-id';

type Projection = (doi: Doi, userId: UserId) => (events: ReadonlyArray<DomainEvent>) => boolean;

// ts-unused-exports:disable-next-line
export const projectHasUserSavedArticle: Projection = (doi, userId) => (events) => pipe(
  events,
  articleSaveState(userId, doi),
  (state) => state === 'saved',
);
