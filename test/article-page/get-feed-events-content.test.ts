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
} from '../../src/article-page/get-feed-events-content';
import { Doi } from '../../src/types/doi';
import { GroupId } from '../../src/types/group-id';
import { toHtmlFragment } from '../../src/types/html-fragment';

describe('get-feed-events-content', () => {
  describe('when there are reviews', () => {
    it('creates a view model for the reviews', async () => {
      const feedEvents: ReadonlyArray<FeedEvent> = [
        {
          type: 'review',
          groupId: new GroupId('groupId'),
          reviewId: new Doi('10.1101/111111'),
          occurredAt: new Date(),
        },
        {
          type: 'review',
          groupId: new GroupId('groupId'),
          reviewId: new Doi('10.1101/222222'),
          occurredAt: new Date(),
        },
      ];
      const fetchReview: FetchReview = () => TE.right({
        fullText: pipe('some text', toHtmlFragment),
        url: new URL('http://example.com'),
      });
      const getGroup = () => T.of({
        name: 'A Group',
        avatarPath: 'https://example.com/avatar',
      });
      const countReviewResponses: CountReviewResponses = () => T.of({
        helpfulCount: 0,
        notHelpfulCount: 0,
      });
      const getUserReviewResponse: GetUserReviewResponse = () => T.of(O.none);

      const viewModel = await getFeedEventsContent(feedEvents, 'biorxiv', O.none)({
        fetchReview, getGroup, countReviewResponses, getUserReviewResponse,
      })();

      expect(viewModel).toHaveLength(2);
    });
  });
});
