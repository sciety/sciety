import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { getFeedEventsContent, GetReview } from './get-feed-events-content';
import { createHandleArticleVersionErrors } from './handle-article-version-errors';
import { mergeFeeds } from './merge-feeds';
import { GetFeedItems } from './render-feed';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { ReviewId } from '../types/review-id';

type FindReviewsForArticleDoi = (articleVersionDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId,
  editorialCommunityId: EditorialCommunityId,
  occurredAt: Date,
}>>;

export type FindVersionsForArticleDoi = (doi: Doi, server: ArticleServer) => T.Task<ReadonlyArray<{
  source: URL,
  occurredAt: Date,
  version: number,
}>>;

export const getArticleFeedEvents = (
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  fetchReview: GetReview,
  getEditorialCommunity: (editorialCommunityId: EditorialCommunityId) => T.Task<O.Option<{
    name: string,
    avatarPath: string,
  }>>,
): GetFeedItems => (
  (doi, server) => async () => (
    // TODO: turn into pipe to remove nesting
    createHandleArticleVersionErrors(
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
