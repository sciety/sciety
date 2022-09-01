import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { CommitEvents } from './commit-events';
import { FetchReview } from './fetch-review';
import { FetchStaticFile } from './fetch-static-file';
import { Logger } from './logger';
import { DomainEvent } from '../domain-events';
import { AddArticleToList } from '../policies/add-article-to-specific-user-list';
import { List } from '../shared-read-models/lists';
import { GetArticleVersionEventsFromBiorxiv } from '../third-parties/biorxiv';
import { GetBiorxivOrMedrxivSubjectArea } from '../third-parties/biorxiv/get-biorxiv-or-medrxiv-subject-area';
import { FetchCrossrefArticle } from '../third-parties/crossref';
import { SearchResults } from '../third-parties/europe-pmc';
import { GetTwitterUserDetails, GetTwitterUserId, GetUserDetailsBatch } from '../third-parties/twitter';
import * as DE from '../types/data-error';
import { ListOwnerId } from '../types/list-owner-id';

export type Adapters = {
  addArticleToList: AddArticleToList,
  commitEvents: CommitEvents,
  fetchArticle: FetchCrossrefArticle,
  fetchReview: FetchReview,
  fetchStaticFile: FetchStaticFile,
  findVersionsForArticleDoi: GetArticleVersionEventsFromBiorxiv,
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  getBiorxivOrMedrxivSubjectArea: GetBiorxivOrMedrxivSubjectArea,
  getListsOwnedBy: (ownerId: ListOwnerId) => TE.TaskEither<DE.DataError, ReadonlyArray<List>>,
  getUserDetails: GetTwitterUserDetails,
  getUserDetailsBatch: GetUserDetailsBatch,
  getUserId: GetTwitterUserId,
  logger: Logger,
  searchEuropePmc: (
    pageSize: number,
  ) => (query: string, cursor: O.Option<string>, evaluatedOnly: boolean) => TE.TaskEither<DE.DataError, SearchResults>,
};
