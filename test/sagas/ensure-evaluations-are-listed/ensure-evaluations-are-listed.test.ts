import { ensureEvaluationsAreListed } from '../../../src/sagas/ensure-evaluations-are-listed/ensure-evaluations-are-listed.js';
import { dummyLogger } from '../../dummy-logger.js';
import { TestFramework, createTestFramework } from '../../framework/index.js';
import * as LOID from '../../../src/types/list-owner-id.js';
import { arbitraryAddGroupCommand } from '../../write-side/commands/add-group-command.helper.js';
import { arbitraryRecordEvaluationPublicationCommand } from '../../write-side/commands/record-evaluation-publication-command.helper.js';

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
    let listedArticleIds: ReadonlyArray<string>;

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationCommand);

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
      expect(listedArticleIds).toContain(recordEvaluationPublicationCommand.articleId.value);
    });
  });
});
