import { toExpressionDoisByMostRecentlyAdded } from '../../../src/read-models/lists/list';
import { ensureEvaluationsAreListed } from '../../../src/sagas/ensure-evaluations-are-listed/ensure-evaluations-are-listed';
import * as LOID from '../../../src/types/list-owner-id';
import { TestFramework, createTestFramework } from '../../framework';
import { arbitraryAddGroupCommand } from '../../write-side/commands/add-group-command.helper';
import { arbitraryRecordEvaluationPublicationCommand } from '../../write-side/commands/record-evaluation-publication-command.helper';

describe('ensure-evaluations-are-listed', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there are listed evaluations', () => {
    const addGroupCommand = arbitraryAddGroupCommand();
    const recordEvaluationPublicationCommand = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: addGroupCommand.groupId,
    };
    let listedExpressionDois: ReadonlyArray<string>;

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationCommand);

      await ensureEvaluationsAreListed(framework.dependenciesForSagas);

      const list = framework.queries.selectAllListsOwnedBy(LOID.fromGroupId(addGroupCommand.groupId))[0];
      listedExpressionDois = toExpressionDoisByMostRecentlyAdded(list.entries);
    });

    it('adds the article to the appropriate list', () => {
      expect(listedExpressionDois).toContain(recordEvaluationPublicationCommand.expressionDoi);
    });
  });
});
