import { ensureEvaluationsAreListed } from '../../../src/sagas/ensure-evaluations-are-listed/ensure-evaluations-are-listed';
import { dummyLogger } from '../../dummy-logger';
import { TestFramework, createTestFramework } from '../../framework';

describe('ensure-evaluations-are-listed', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there are no unlisted evaluations', () => {
    const resources = {
      list: {
        addArticle: jest.fn(),
      },
    };

    beforeEach(async () => {
      const ports = {
        ...framework.queries,
        logger: dummyLogger,
        resources,
      };
      await ensureEvaluationsAreListed(ports);
    });

    it('does nothing', () => {
      expect(resources.list.addArticle).not.toHaveBeenCalled();
    });
  });

  describe('when there are listed evaluations', () => {
    it.todo('adds exactly one missing article to the appropriate list');
  });
});
