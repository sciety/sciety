import { ensureEvaluationsAreListed } from '../../../src/sagas/ensure-evaluations-are-listed/ensure-evaluations-are-listed';
import { dummyLogger } from '../../dummy-logger';
import { TestFramework, createTestFramework } from '../../framework';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryRecordedEvaluation } from '../../types/recorded-evaluation.helper';
import * as LOID from '../../../src/types/list-owner-id';

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
    const group = arbitraryGroup();
    const evaluation = {
      ...arbitraryRecordedEvaluation(),
      groupId: group.id,
    };
    const articleId = arbitraryDoi().value;
    let listedArticleIds: ReadonlyArray<string>;

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group);
      await framework.commandHelpers.recordEvaluation(evaluation);

      await ensureEvaluationsAreListed({
        ...framework.queries,
        logger: dummyLogger,
      });

      const list = framework.queries.selectAllListsOwnedBy(LOID.fromGroupId(group.id))[0];
      listedArticleIds = list.articleIds;
    });

    it.failing('adds the article to the appropriate list', () => {
      expect(listedArticleIds).toContain(articleId);
    });
  });
});
