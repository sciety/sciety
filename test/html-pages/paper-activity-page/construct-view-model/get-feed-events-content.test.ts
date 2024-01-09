import {
  FeedEvent,
  getFeedEventsContent,
} from '../../../../src/html-pages/paper-activity-page/construct-view-model/get-feed-events-content';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { TestFramework, createTestFramework } from '../../../framework';
import { dummyLogger } from '../../../dummy-logger';

describe('get-feed-events-content', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there are evaluations', () => {
    const groupId = arbitraryGroupId();
    const feedEvents: ReadonlyArray<FeedEvent> = [
      {
        type: 'evaluation-published',
        groupId,
        evaluationLocator: arbitraryEvaluationLocator(),
        publishedAt: new Date(),
      },
      {
        type: 'evaluation-published',
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
