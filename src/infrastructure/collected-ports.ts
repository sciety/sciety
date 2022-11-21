import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { FetchReview } from './fetch-review';
import { FetchStaticFile } from './fetch-static-file';
import {
  AddArticleToList,
  CommitEvents,
  CreateList, FetchArticle,
  GetAllEvents, GetArticleIdsByState,
  GetArticleSubjectArea,
  GetListsOwnedBy, GetOneArticleIdInEvaluatedState,
  GetOneArticleReadyToBeListed,
  IsArticleOnTheListOwnedBy,
  Logger,
  RecordSubjectArea,
  RemoveArticleFromList,
  SelectAllListsOwnedBy,
  SelectArticlesBelongingToList,
} from '../shared-ports';
import { GetArticleVersionEventsFromBiorxiv } from '../third-parties/biorxiv';
import { SearchResults } from '../third-parties/europe-pmc';
import { GetTwitterUserDetails, GetTwitterUserId, GetUserDetailsBatch } from '../third-parties/twitter';
import * as DE from '../types/data-error';

export type CollectedPorts = {
  getOneArticleReadyToBeListed: GetOneArticleReadyToBeListed,
  getArticleIdsByState: GetArticleIdsByState,
  getOneArticleIdInEvaluatedState: GetOneArticleIdInEvaluatedState,
  selectArticlesBelongingToList: SelectArticlesBelongingToList,
  isArticleOnTheListOwnedBy: IsArticleOnTheListOwnedBy,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
  addArticleToList: AddArticleToList,
  commitEvents: CommitEvents,
  createList: CreateList,
  fetchArticle: FetchArticle,
  fetchReview: FetchReview,
  fetchStaticFile: FetchStaticFile,
  findVersionsForArticleDoi: GetArticleVersionEventsFromBiorxiv,
  getAllEvents: GetAllEvents,
  getArticleSubjectArea: GetArticleSubjectArea,
  getListsOwnedBy: GetListsOwnedBy,
  getUserDetails: GetTwitterUserDetails,
  getUserDetailsBatch: GetUserDetailsBatch,
  getUserId: GetTwitterUserId,
  recordSubjectArea: RecordSubjectArea,
  logger: Logger,
  removeArticleFromList: RemoveArticleFromList,
  searchEuropePmc: (
    pageSize: number,
  ) => (query: string, cursor: O.Option<string>, evaluatedOnly: boolean) => TE.TaskEither<DE.DataError, SearchResults>,
};
