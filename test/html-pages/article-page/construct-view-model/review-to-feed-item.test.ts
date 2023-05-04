import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { toHtmlFragment } from '../../../../src/types/html-fragment';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { FeedEvent } from '../../../../src/html-pages/article-page/construct-view-model/get-feed-events-content';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryGroup } from '../../../types/group.helper';
import { reviewToFeedItem } from '../../../../src/html-pages/article-page/construct-view-model/review-to-feed-item';
import { arbitraryUserId } from '../../../types/user-id.helper';

describe('review-to-feed-item', () => {
  const groupId = arbitraryGroupId();
  const feedEvent: FeedEvent = {
    type: 'review',
    groupId,
    reviewId: arbitraryEvaluationLocator(),
    publishedAt: new Date(),
  };

  describe('when there is a logged in user', () => {
    it('responses are present in the view model', async () => {
      const ports = {
        getAllEvents: T.of([]),
        fetchReview: () => TE.right({
          fullText: pipe('some text', toHtmlFragment),
          url: new URL('http://example.com'),
        }),
        getGroup: () => O.some(arbitraryGroup()),
      };
      const viewModel = await reviewToFeedItem(ports, feedEvent, O.some(arbitraryUserId()))();

      expect(O.isSome(viewModel.responses)).toBe(true);
    });
  });

  describe('when there is no logged in user', () => {
    it('responses are not present in the view model', async () => {
      const ports = {
        getAllEvents: T.of([]),
        fetchReview: () => TE.right({
          fullText: pipe('some text', toHtmlFragment),
          url: new URL('http://example.com'),
        }),
        getGroup: () => O.some(arbitraryGroup()),
      };
      const viewModel = await reviewToFeedItem(ports, feedEvent, O.none)();

      expect(viewModel.responses).toStrictEqual(O.none);
    });
  });
});
