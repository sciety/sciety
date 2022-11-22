import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { FetchReview } from './fetch-review';
import { FetchStaticFile } from './fetch-static-file';
import {
  GetArticleIdsByState, GetOneArticleIdInEvaluatedState, GetOneArticleReadyToBeListed, SharedPorts,
} from '../shared-ports';
import { GetArticleVersionEventsFromBiorxiv } from '../third-parties/biorxiv';
import { SearchResults } from '../third-parties/europe-pmc';
import { GetTwitterUserDetails, GetTwitterUserId, GetUserDetailsBatch } from '../third-parties/twitter';
import * as DE from '../types/data-error';

export type CollectedPorts = SharedPorts & {
  getOneArticleReadyToBeListed: GetOneArticleReadyToBeListed,
  getArticleIdsByState: GetArticleIdsByState,
  getOneArticleIdInEvaluatedState: GetOneArticleIdInEvaluatedState,
  fetchReview: FetchReview,
  fetchStaticFile: FetchStaticFile,
  findVersionsForArticleDoi: GetArticleVersionEventsFromBiorxiv,
  getUserDetails: GetTwitterUserDetails,
  getUserDetailsBatch: GetUserDetailsBatch,
  getUserId: GetTwitterUserId,
  searchEuropePmc: (
    pageSize: number,
  ) => (query: string, cursor: O.Option<string>, evaluatedOnly: boolean) => TE.TaskEither<DE.DataError, SearchResults>,
};
