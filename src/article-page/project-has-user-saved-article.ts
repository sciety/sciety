import * as RT from 'fp-ts/ReaderTask';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow } from 'fp-ts/function';
import { ArticleSaveState } from './render-save-article';
import { Doi, eqDoi } from '../types/doi';
import { DomainEvent, isUserSavedArticleEvent } from '../types/domain-events';
import { UserId } from '../types/user-id';

type GetEvents = T.Task<ReadonlyArray<DomainEvent>>;

type ProjectHasUserSavedArticle = (doi: Doi, userId: UserId) => RT.ReaderTask<GetEvents, ArticleSaveState>;

export const projectHasUserSavedArticle: ProjectHasUserSavedArticle = (doi, userId) => T.map(
  flow(
    RA.filter(isUserSavedArticleEvent),
    RA.some((event) => (event.userId === userId && eqDoi.equals(event.articleId, doi))),
    (hasSavedArticle) => ({
      userId,
      hasSavedArticle,
    }),
  ),
);
