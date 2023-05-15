import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { sequenceS } from 'fp-ts/Apply';
import * as RI from '../../../types/evaluation-locator';
import { sanitise } from '../../../types/sanitised-html-fragment';
import { GroupId } from '../../../types/group-id';
import { EvaluationLocator } from '../../../types/evaluation-locator';
import { FetchReview } from '../../../shared-ports';
import { Queries } from '../../../shared-read-models';
import { EvaluationFeedItem } from '../view-model';
import { detectLanguage } from '../../../shared-components/lang-attribute';

export type Ports = {
  fetchReview: FetchReview,
  getGroup: Queries['getGroup'],
};

export type ReviewEvent = {
  type: 'review',
  groupId: GroupId,
  reviewId: EvaluationLocator,
  publishedAt: Date,
};

export const reviewToFeedItem = (
  adapters: Ports,
  feedEvent: ReviewEvent,
): T.Task<EvaluationFeedItem> => pipe(
  {
    groupDetails: pipe(
      adapters.getGroup(feedEvent.groupId),
      O.match(
        () => ({
          groupName: 'A group',
          groupHref: `/groups/${feedEvent.groupId}`,
          groupAvatar: '/static/images/sciety-logo.jpg',
        }),
        (group) => ({
          groupName: group.name,
          groupHref: `/groups/${group.slug}`,
          groupAvatar: group.avatarPath,
        }),
      ),
      T.of,
    ),
    review: pipe(
      feedEvent.reviewId,
      adapters.fetchReview,
      TE.match(
        () => ({
          url: RI.inferredSourceUrl(feedEvent.reviewId),
          fullText: O.none,
          fullTextLanguageCode: O.none,
        }),
        (review) => ({
          ...review,
          url: O.some(review.url),
          fullText: O.some(review.fullText),
          fullTextLanguageCode: detectLanguage(review.fullText),
        }),
      ),
    ),
  },
  sequenceS(T.ApplyPar),
  T.map(({
    groupDetails, review,
  }) => ({
    type: 'evaluation' as const,
    id: feedEvent.reviewId,
    source: review.url,
    publishedAt: feedEvent.publishedAt,
    ...groupDetails,
    fullText: O.map(sanitise)(review.fullText),
    fullTextLanguageCode: review.fullTextLanguageCode,
  })),
);
