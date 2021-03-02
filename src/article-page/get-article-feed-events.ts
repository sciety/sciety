import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { getFeedEventsContent, GetReview } from './get-feed-events-content';
import { handleArticleVersionErrors } from './handle-article-version-errors';
import { mergeFeeds } from './merge-feeds';
import { GetFeedItems } from './render-feed';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { ReviewId } from '../types/review-id';

export type FindReviewsForArticleDoi = (articleVersionDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId,
  editorialCommunityId: GroupId,
  occurredAt: Date,
}>>;

export type FindVersionsForArticleDoi = (doi: Doi, server: ArticleServer) => T.Task<ReadonlyArray<{
  source: URL,
  occurredAt: Date,
  version: number,
}>>;

export type GetEditorialCommunity = (editorialCommunityId: GroupId) => T.Task<O.Option<{
  name: string,
  avatarPath: string,
}>>;

// TODO: return a [Readonly]NonEmptyArray
export const getArticleFeedEvents = (
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  fetchReview: GetReview,
  getEditorialCommunity: GetEditorialCommunity,
): GetFeedItems => (
  (doi, server) => async () => (
    // TODO: turn into pipe to remove nesting
    handleArticleVersionErrors(
      getFeedEventsContent(
        mergeFeeds([
          () => pipe(
            doi,
            findReviewsForArticleDoi,
            T.map(RA.map((review) => ({ type: 'review', ...review }))),
          ),
          () => pipe(
            findVersionsForArticleDoi(doi, server),
            T.map(RA.map((version) => ({ type: 'article-version', ...version }))),
          ),
        ]),
        fetchReview,
        flow(
          getEditorialCommunity,
          T.map(O.getOrElseW(() => { throw new Error('No such community'); })),
        ),
      ),
    )(doi, server)()
  )
);
