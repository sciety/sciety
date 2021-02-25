import { URL } from 'url';
import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FeedItem, GetFeedItems } from './render-feed';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment } from '../types/html-fragment';
import { HypothesisAnnotationId } from '../types/hypothesis-annotation-id';
import { ReviewId } from '../types/review-id';
import { sanitise } from '../types/sanitised-html-fragment';

type ReviewEvent = {
  type: 'review',
  editorialCommunityId: EditorialCommunityId,
  reviewId: ReviewId,
  occurredAt: Date,
};

type ArticleVersionEvent = {
  type: 'article-version',
  source: URL,
  occurredAt: Date,
  version: number,
};

export type FeedEvent = ReviewEvent | ArticleVersionEvent;

export type Feed = (articleDoi: Doi) => T.Task<ReadonlyArray<FeedEvent>>;

export type GetReview = (id: ReviewId) => TE.TaskEither<unknown, {
  fullText: HtmlFragment,
  url: URL,
}>;

type GetEditorialCommunity = (id: EditorialCommunityId) => T.Task<{
  name: string,
  avatarPath: string,
}>;

const articleVersionToFeedItem = (
  server: ArticleServer,
  feedEvent: ArticleVersionEvent,
) => (
  T.of(O.some({ ...feedEvent, server }))
);

const inferredUrlFromReviewId = (reviewId: ReviewId) => {
  if (reviewId instanceof Doi) {
    return O.some(new URL(`https://doi.org/${reviewId.value}`));
  }
  if (reviewId instanceof HypothesisAnnotationId) {
    return O.some(new URL(`https://hypothes.is/a/${reviewId.value}`));
  }

  return O.none;
};

const reviewToFeedItem = (
  getReview: GetReview,
  getEditorialCommunity: GetEditorialCommunity,
  feedEvent: ReviewEvent,
) => pipe(
  {
    editorialCommunity: getEditorialCommunity(feedEvent.editorialCommunityId),
    review: pipe(
      feedEvent.reviewId,
      getReview,
      T.map(E.fold(
        () => ({
          url: inferredUrlFromReviewId(feedEvent.reviewId),
          fullText: O.none,
        }),
        (review) => ({
          ...review,
          url: O.some(review.url),
          fullText: O.some(review.fullText),
        }),
      )),
    ),
  },
  sequenceS(T.task),
  T.map(({ editorialCommunity, review }) => O.some({
    type: 'review' as const,
    id: feedEvent.reviewId,
    source: review.url,
    occurredAt: feedEvent.occurredAt,
    editorialCommunityId: feedEvent.editorialCommunityId,
    editorialCommunityName: editorialCommunity.name,
    editorialCommunityAvatar: editorialCommunity.avatarPath,
    fullText: O.map(sanitise)(review.fullText),
  })),
);

export const getFeedEventsContent = (
  getFeedEvents: Feed,
  getReview: GetReview,
  getEditorialCommunity: GetEditorialCommunity,
): GetFeedItems => (
  (doi, server) => {
    const toFeedItem = (feedEvent: FeedEvent): T.Task<O.Option<FeedItem>> => {
      switch (feedEvent.type) {
        case 'article-version':
          return articleVersionToFeedItem(server, feedEvent);
        case 'review':
          return reviewToFeedItem(getReview, getEditorialCommunity, feedEvent);
      }
    };
    return pipe(
      doi,
      getFeedEvents,
      T.chain(T.traverseArray(toFeedItem)),
      T.map(RA.compact),
    );
  }
);
