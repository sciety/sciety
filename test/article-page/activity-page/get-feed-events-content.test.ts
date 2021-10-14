import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  CountReviewResponses,
  FeedEvent,
  FetchReview,
  getFeedEventsContent,
  GetUserReviewResponse,
} from '../../../src/article-page/activity-page/get-feed-events-content';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('get-feed-events-content', () => {
  describe('when there are reviews', () => {
    it('creates a view model for the reviews', async () => {
      const groupId = arbitraryGroupId();
      const feedEvents: ReadonlyArray<FeedEvent> = [
        {
          type: 'review',
          groupId,
          reviewId: arbitraryReviewId(),
          occurredAt: new Date(),
        },
        {
          type: 'review',
          groupId,
          reviewId: arbitraryReviewId(),
          occurredAt: new Date(),
        },
      ];
      const fetchReview: FetchReview = () => TE.right({
        fullText: pipe('some text', toHtmlFragment),
        url: new URL('http://example.com'),
      });
      const getGroup = () => T.of(arbitraryGroup());
      const countReviewResponses: CountReviewResponses = () => T.of({
        helpfulCount: 0,
        notHelpfulCount: 0,
      });
      const getUserReviewResponse: GetUserReviewResponse = () => T.of(O.none);

      const viewModel = await getFeedEventsContent({
        fetchReview, getGroup, countReviewResponses, getUserReviewResponse,
      })(feedEvents, 'biorxiv', O.none)();

      expect(viewModel).toHaveLength(2);
    });
  });
});
