import * as O from 'fp-ts/Option';
import {
  FeedEvent,
  getFeedEventsContent,
} from '../../../../src/html-pages/article-page/construct-view-model/get-feed-events-content';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { TestFramework, createTestFramework } from '../../../framework';

describe('get-feed-events-content', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there are evaluations', () => {
    const groupId = arbitraryGroupId();
    const feedEvents: ReadonlyArray<FeedEvent> = [
      {
        type: 'review',
        groupId,
        reviewId: arbitraryEvaluationLocator(),
        publishedAt: new Date(),
      },
      {
        type: 'review',
        groupId,
        reviewId: arbitraryEvaluationLocator(),
        publishedAt: new Date(),
      },
    ];

    it('creates a view model for the evaluations', async () => {
      const ports = {
        ...framework.queries,
        ...framework.happyPathThirdParties,
        getAllEvents: framework.getAllEvents,
      };
      const viewModel = await getFeedEventsContent(ports, 'biorxiv', O.none)(feedEvents)();

      expect(viewModel).toHaveLength(2);
    });
  });
});
