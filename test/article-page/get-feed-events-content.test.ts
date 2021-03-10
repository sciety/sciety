import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  CountReviewResponses,
  FeedEvent,
  getFeedEventsContent,
  GetReview,
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
          editorialCommunityId: new GroupId('communityId'),
          reviewId: new Doi('10.1101/111111'),
          occurredAt: new Date(),
        },
        {
          type: 'review',
          editorialCommunityId: new GroupId('communityId'),
          reviewId: new Doi('10.1101/222222'),
          occurredAt: new Date(),
        },
      ];
      const getReview: GetReview = () => TE.right({
        fullText: pipe('some text', toHtmlFragment),
        url: new URL('http://example.com'),
      });
      const getEditorialCommunity = () => T.of({
        name: 'A Community',
        avatarPath: 'https://example.com/avatar',
      });
      const countReviewResponses: CountReviewResponses = () => T.of({
        helpfulCount: 0,
        notHelpfulCount: 0,
      });
      const getUserReviewResponse: GetUserReviewResponse = () => T.of(O.none);

      const viewModel = await getFeedEventsContent(getReview, getEditorialCommunity, countReviewResponses, getUserReviewResponse)(feedEvents, 'biorxiv', O.none)();

      expect(viewModel).toHaveLength(2);
    });
  });
});
