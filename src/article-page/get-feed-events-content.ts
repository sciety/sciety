import { URL } from 'url';
import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { FeedItem, GetFeedItems } from './render-feed';
import { Doi } from '../types/doi';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment } from '../types/html-fragment';
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

export type GetReview = (id: ReviewId) => T.Task<{
  fullText: O.Option<HtmlFragment>,
  url: URL,
}>;

export type GetEditorialCommunity = (id: EditorialCommunityId) => T.Task<{ name: string, avatar: URL }>;

export const getFeedEventsContent = (
  getFeedEvents: Feed,
  getReview: GetReview,
  getEditorialCommunity: GetEditorialCommunity,
) : GetFeedItems => (
  (doi, server) => {
    const reviewToFeedItem = (feedEvent: ReviewEvent): T.Task<O.Option<FeedItem>> => pipe(
      {
        editorialCommunity: getEditorialCommunity(feedEvent.editorialCommunityId),
        review: getReview(feedEvent.reviewId),
      },
      sequenceS(T.task),
      T.map(({ editorialCommunity, review }) => O.some({
        type: 'review',
        id: feedEvent.reviewId,
        source: review.url,
        occurredAt: feedEvent.occurredAt,
        editorialCommunityId: feedEvent.editorialCommunityId,
        editorialCommunityName: editorialCommunity.name,
        editorialCommunityAvatar: editorialCommunity.avatar,
        fullText: O.map(sanitise)(review.fullText),
      })),
    );

    const articleVersionToFeedItem = (feedEvent: ArticleVersionEvent): T.Task<O.Option<FeedItem>> => (
      T.of(O.some({ ...feedEvent, server }))
    );

    const toFeedItem = (feedEvent: FeedEvent): T.Task<O.Option<FeedItem>> => {
      switch (feedEvent.type) {
        case 'article-version':
          return articleVersionToFeedItem(feedEvent);
        case 'review':
          return reviewToFeedItem(feedEvent);
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
