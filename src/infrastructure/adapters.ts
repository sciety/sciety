import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import { CommitEvents } from './commit-events';
import { EventSourcedFollowListRepository } from './event-sourced-follow-list-repository';
import { FetchCrossrefArticle } from './fetch-crossref-article';
import { FetchReview } from './fetch-review';
import { FetchStaticFile } from './fetch-static-file';
import { FindReviewsForArticleDoi } from './find-reviews-for-article-doi';
import { Follows } from './follows';
import { GetArticleVersionEventsFromBiorxiv } from './get-article-version-events-from-biorxiv';
import { GetTwitterUserDetails } from './get-twitter-user-details';
import { Logger } from './logger';
import { SearchEuropePmc } from './search-europe-pmc';
import { DomainEvent } from '../types/domain-events';
import { EditorialCommunity } from '../types/editorial-community';
import { GroupId } from '../types/editorial-community-id';
import { EditorialCommunityRepository } from '../types/editorial-community-repository';

type GetEditorialCommunity = (editorialCommunityId: GroupId) => T.Task<O.Option<EditorialCommunity>>;

type GetAllEditorialCommunities = T.Task<RNEA.ReadonlyNonEmptyArray<EditorialCommunity>>;

export type Adapters = {
  fetchArticle: FetchCrossrefArticle,
  fetchReview: FetchReview,
  fetchStaticFile: FetchStaticFile,
  searchEuropePmc: SearchEuropePmc,
  editorialCommunities: EditorialCommunityRepository,
  getEditorialCommunity: GetEditorialCommunity,
  getAllEditorialCommunities: GetAllEditorialCommunities,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  findVersionsForArticleDoi: GetArticleVersionEventsFromBiorxiv,
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: CommitEvents,
  getFollowList: EventSourcedFollowListRepository,
  getUserDetails: GetTwitterUserDetails,
  follows: Follows,
  logger: Logger,
};
