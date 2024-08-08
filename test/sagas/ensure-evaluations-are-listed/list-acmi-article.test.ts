import { listAcmiArticle } from '../../../src/sagas/ensure-evaluations-are-listed/list-acmi-article';
import { TestFramework, createTestFramework } from '../../framework';
import { arbitraryAddGroupCommand } from '../../write-side/commands/add-group-command.helper';
import { arbitraryRecordEvaluationPublicationCommand } from '../../write-side/commands/record-evaluation-publication-command.helper';

describe('list-acmi-article', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  const addGroupCommand = arbitraryAddGroupCommand();
  const recordEvaluationPublicationCommand = {
    ...arbitraryRecordEvaluationPublicationCommand(),
    groupId: addGroupCommand.groupId,
  };

  describe('given an unlisted evaluated acmi article', () => {
    let result: unknown;

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationCommand);
      result = await listAcmiArticle()();
    });

    describe('when there is no version of the article already in the list', () => {
      it.failing('adds the article to the list', () => {
        expect(result).toContain(recordEvaluationPublicationCommand.expressionDoi);
      });
    });

    describe('when there is already a version of the article in the list', () => {
      it.todo('does nothing');
    });
  });

  describe('given an unlisted evaluated article for any other group', () => {
    it.todo('does nothing');
  });
});
