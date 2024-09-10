import { constructSortedFeed } from '../../../../../../src/read-side/html-pages/group-page/group-home-page/construct-view-model/construct-sorted-feed';
import * as GID from '../../../../../../src/types/group-id';
import { createTestFramework, TestFramework } from '../../../../../framework';
import { arbitraryAddGroupCommand } from '../../../../../write-side/commands/add-group-command.helper';
import { arbitraryRecordEvaluationPublicationCommand } from '../../../../../write-side/commands/record-evaluation-publication-command.helper';
import { arbitraryRecordPaperSnapshotCommand } from '../../../../../write-side/commands/record-paper-snapshot-command.helper';

describe('construct-sorted-feed', () => {
  let framework: TestFramework;
  let result: ReturnType<typeof constructSortedFeed>;

  beforeEach(() => {
    framework = createTestFramework();
  });

  const acmiGroupId = GID.fromValidatedString('4d6a8908-22a9-45c8-bd56-3c7140647709');
  const addGroupCommand = {
    ...arbitraryAddGroupCommand(),
    groupId: acmiGroupId,
  };

  describe('when the group has not evaluated any papers', () => {
    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      result = constructSortedFeed(framework.dependenciesForViews, addGroupCommand.groupId);
    });

    it('returns an empty array', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when the group has evaluated one paper', () => {
    const recordEvaluationPublicationCommand = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: addGroupCommand.groupId,
    };
    const recordPaperSnapshotCommand = {
      ...arbitraryRecordPaperSnapshotCommand(),
      expressionDois: new Set([recordEvaluationPublicationCommand.expressionDoi]),
    };

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationCommand);
      await framework.commandHelpers.recordPaperSnapshot(recordPaperSnapshotCommand);
      result = constructSortedFeed(framework.dependenciesForViews, addGroupCommand.groupId);
    });

    it('returns one expression doi', () => {
      expect(result).toHaveLength(1);
      expect(result[0]).toStrictEqual(recordEvaluationPublicationCommand.expressionDoi);
    });
  });

  describe('when the group has evaluated two papers', () => {
    it.todo('returns the most recently evaluated first');

    it.todo('returns the least recently evaluated second');
  });
});
