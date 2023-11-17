import {
  FeedEvent,
  getFeedEventsContent,
} from '../../../../src/html-pages/article-page/construct-view-model/get-feed-events-content.js';
import { arbitraryGroupId } from '../../../types/group-id.helper.js';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper.js';
import { TestFramework, createTestFramework } from '../../../framework/index.js';
import { dummyLogger } from '../../../dummy-logger.js';

describe('get-feed-events-content', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there are evaluations', () => {
    const groupId = arbitraryGroupId();
    const feedEvents: ReadonlyArray<FeedEvent> = [
      {
        type: 'evaluation',
        groupId,
        evaluationLocator: arbitraryEvaluationLocator(),
        publishedAt: new Date(),
      },
      {
        type: 'evaluation',
        groupId,
        evaluationLocator: arbitraryEvaluationLocator(),
        publishedAt: new Date(),
      },
    ];

    it('creates a view model for the evaluations', async () => {
      const dependencies = {
        ...framework.queries,
        ...framework.happyPathThirdParties,
        getAllEvents: framework.getAllEvents,
        logger: dummyLogger,
      };
      const viewModel = await getFeedEventsContent(dependencies, 'biorxiv')(feedEvents)();

      expect(viewModel).toHaveLength(2);
    });
  });
});
