import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { FetchReview } from './fetch-review';
import { FetchStaticFile } from './fetch-static-file';
import {
  AddArticleToList,
  CommitEvents, CreateList, FetchArticle, GetAllEvents, GetListsOwnedBy,
  Logger,
  RemoveArticleFromList,
} from '../shared-ports';
import { GetArticleVersionEventsFromBiorxiv } from '../third-parties/biorxiv';
import { GetBiorxivOrMedrxivSubjectArea } from '../third-parties/biorxiv/get-biorxiv-or-medrxiv-subject-area';
import { SearchResults } from '../third-parties/europe-pmc';
import { GetTwitterUserDetails, GetTwitterUserId, GetUserDetailsBatch } from '../third-parties/twitter';
import * as DE from '../types/data-error';
import { Doi } from '../types/doi';

export type CollectedPorts = {
  getAllMissingArticleIds: () => ReadonlyArray<Doi>,
  addArticleToList: AddArticleToList,
  commitEvents: CommitEvents,
  createList: CreateList,
  fetchArticle: FetchArticle,
  fetchReview: FetchReview,
  fetchStaticFile: FetchStaticFile,
  findVersionsForArticleDoi: GetArticleVersionEventsFromBiorxiv,
  getAllEvents: GetAllEvents,
  getBiorxivOrMedrxivSubjectArea: GetBiorxivOrMedrxivSubjectArea,
  getListsOwnedBy: GetListsOwnedBy,
  getUserDetails: GetTwitterUserDetails,
  getUserDetailsBatch: GetUserDetailsBatch,
  getUserId: GetTwitterUserId,
  logger: Logger,
  removeArticleFromList: RemoveArticleFromList,
  searchEuropePmc: (
    pageSize: number,
  ) => (query: string, cursor: O.Option<string>, evaluatedOnly: boolean) => TE.TaskEither<DE.DataError, SearchResults>,
};
