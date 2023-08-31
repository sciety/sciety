import { ensureEvaluationsAreListed } from '../../../src/sagas/ensure-evaluations-are-listed/ensure-evaluations-are-listed';
import { dummyLogger } from '../../dummy-logger';
import { TestFramework, createTestFramework } from '../../framework';
import { arbitraryRecordedEvaluation } from '../../types/recorded-evaluation.helper';
import * as LOID from '../../../src/types/list-owner-id';
import { arbitraryAddGroupCommand } from '../../write-side/commands/add-group-command.helper';

describe('ensure-evaluations-are-listed', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there are listed evaluations', () => {
    const addGroupCommand = arbitraryAddGroupCommand();
    const evaluation = {
      ...arbitraryRecordedEvaluation(),
      groupId: addGroupCommand.groupId,
    };
    let listedArticleIds: ReadonlyArray<string>;

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.deprecatedRecordEvaluation(evaluation);

      await ensureEvaluationsAreListed({
        ...framework.queries,
        getAllEvents: framework.getAllEvents,
        commitEvents: framework.commitEvents,
        logger: dummyLogger,
      });

      const list = framework.queries.selectAllListsOwnedBy(LOID.fromGroupId(addGroupCommand.groupId))[0];
      listedArticleIds = list.articleIds;
    });

    it('adds the article to the appropriate list', () => {
      expect(listedArticleIds).toContain(evaluation.articleId.value);
    });
  });
});
