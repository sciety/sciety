import * as RT from 'fp-ts/ReaderTask';
import * as T from 'fp-ts/Task';
import { flow } from 'fp-ts/function';
import { Doi } from '../types/doi';
import { DomainEvent } from '../types/domain-events';
import { UserId } from '../types/user-id';
import { articleSaveState } from '../user-list/article-save-state';

type GetEvents = T.Task<ReadonlyArray<DomainEvent>>;

type ProjectHasUserSavedArticle = (doi: Doi, userId: UserId) => RT.ReaderTask<GetEvents, boolean>;

export const projectHasUserSavedArticle: ProjectHasUserSavedArticle = (doi, userId) => T.map(
  flow(
    (events) => articleSaveState(events, userId, doi),
    (state) => state === 'saved',
  ),
);
