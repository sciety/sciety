import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FeedEvent, getFeedEventsContent } from '../../../src/article-page/activity-page/get-feed-events-content';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { arbitraryGroupId } from '../../types/group-id.helper';
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
          publishedAt: new Date(),
        },
        {
          type: 'review',
          groupId,
          reviewId: arbitraryReviewId(),
          publishedAt: new Date(),
        },
      ];
      const ports = {
        getAllEvents: T.of([]),
        fetchReview: () => TE.right({
          fullText: pipe('some text', toHtmlFragment),
          url: new URL('http://example.com'),
        }),
        getUserReviewResponse: () => T.of(O.none),
      };
      const viewModel = await getFeedEventsContent(ports, 'biorxiv', O.none)(feedEvents)();

      expect(viewModel).toHaveLength(2);
    });
  });
});
