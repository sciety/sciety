import * as O from 'fp-ts/Option';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { FeedEvent } from '../../../../src/html-pages/article-page/construct-view-model/get-feed-events-content';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { reviewToFeedItem } from '../../../../src/html-pages/article-page/construct-view-model/review-to-feed-item';
import { arbitraryUserId } from '../../../types/user-id.helper';
import { TestFramework, createTestFramework } from '../../../framework';

describe('review-to-feed-item', () => {
  let framework: TestFramework;
  const groupId = arbitraryGroupId();
  const feedEvent: FeedEvent = {
    type: 'review',
    groupId,
    reviewId: arbitraryEvaluationLocator(),
    publishedAt: new Date(),
  };

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there is a logged in user', () => {
    it('responses are present in the view model', async () => {
      const ports = {
        ...framework.queries,
        ...framework.happyPathThirdParties,
        getAllEvents: framework.getAllEvents,
      };
      const viewModel = await reviewToFeedItem(ports, feedEvent, O.some(arbitraryUserId()))();

      expect(O.isSome(viewModel.responses)).toBe(true);
    });
  });

  describe('when there is no logged in user', () => {
    it('responses are not present in the view model', async () => {
      const ports = {
        ...framework.queries,
        ...framework.happyPathThirdParties,
        getAllEvents: framework.getAllEvents,
      };
      const viewModel = await reviewToFeedItem(ports, feedEvent, O.none)();

      expect(viewModel.responses).toStrictEqual(O.none);
    });
  });
});
