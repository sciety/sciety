import { constructSortedFeed } from '../../../../../../src/read-side/html-pages/group-page/group-home-page/construct-view-model/construct-sorted-feed';
import * as EDOI from '../../../../../../src/types/expression-doi';
import * as GID from '../../../../../../src/types/group-id';
import {
  RecordEvaluationPublicationCommand,
  RecordPaperSnapshotCommand,
} from '../../../../../../src/write-side/commands';
import { createTestFramework, TestFramework } from '../../../../../framework';
import { arbitraryDate } from '../../../../../helpers';
import { arbitraryRecordEvaluationPublicationCommand } from '../../../../../write-side/commands/record-evaluation-publication-command.helper';
import { arbitraryRecordPaperSnapshotCommand } from '../../../../../write-side/commands/record-paper-snapshot-command.helper';

describe('construct-sorted-feed', () => {
  let framework: TestFramework;
  let result: ReturnType<typeof constructSortedFeed>;

  beforeEach(() => {
    framework = createTestFramework();
  });

  const acmiGroupId = GID.fromValidatedString('4d6a8908-22a9-45c8-bd56-3c7140647709');

  describe('when the group has not evaluated any papers', () => {
    beforeEach(async () => {
      result = constructSortedFeed(framework.dependenciesForViews, acmiGroupId);
    });

    it('returns an empty array', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when the group has evaluated one paper', () => {
    const recordEvaluationPublicationCommand: RecordEvaluationPublicationCommand = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: acmiGroupId,
    };
    const recordPaperSnapshotCommand: RecordPaperSnapshotCommand = {
      ...arbitraryRecordPaperSnapshotCommand(),
      expressionDois: new Set([recordEvaluationPublicationCommand.expressionDoi]),
    };

    beforeEach(async () => {
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationCommand);
      await framework.commandHelpers.recordPaperSnapshot(recordPaperSnapshotCommand);
      result = constructSortedFeed(framework.dependenciesForViews, acmiGroupId);
    });

    it('returns one expression doi', () => {
      expect(result).toHaveLength(1);
      expect(result[0]).toStrictEqual(recordEvaluationPublicationCommand.expressionDoi);
    });
  });

  describe('when the group has evaluated two papers', () => {
    const recordPublicationForEarlierEvaluationCommand: RecordEvaluationPublicationCommand = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: acmiGroupId,
      publishedAt: new Date('1997-01-01'),
    };
    const recordPublicationForLaterEvaluationCommand: RecordEvaluationPublicationCommand = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: acmiGroupId,
      publishedAt: new Date('2007-01-01'),
    };
    const recordPaperSnapshotForEarlierEvaluationCommand: RecordPaperSnapshotCommand = {
      ...arbitraryRecordPaperSnapshotCommand(),
      expressionDois: new Set([recordPublicationForEarlierEvaluationCommand.expressionDoi]),
    };
    const recordPaperSnapshotForLaterEvaluationCommand: RecordPaperSnapshotCommand = {
      ...arbitraryRecordPaperSnapshotCommand(),
      expressionDois: new Set([recordPublicationForLaterEvaluationCommand.expressionDoi]),
    };

    beforeEach(async () => {
      await framework.commandHelpers.recordEvaluationPublication(recordPublicationForLaterEvaluationCommand);
      await framework.commandHelpers.recordEvaluationPublication(recordPublicationForEarlierEvaluationCommand);
      await framework.commandHelpers.recordPaperSnapshot(recordPaperSnapshotForEarlierEvaluationCommand);
      await framework.commandHelpers.recordPaperSnapshot(recordPaperSnapshotForLaterEvaluationCommand);
      result = constructSortedFeed(framework.dependenciesForViews, acmiGroupId);
    });

    it('returns the most recently evaluated first and the least recently evaluated second', () => {
      expect(result).toHaveLength(2);
      expect(result[0]).toStrictEqual(recordPublicationForLaterEvaluationCommand.expressionDoi);
      expect(result[1]).toStrictEqual(recordPublicationForEarlierEvaluationCommand.expressionDoi);
    });
  });

  describe('when the group has evaluated two papers on the same day', () => {
    const evaluationsPublishedAt = arbitraryDate();
    const recordEvaluationPublicationForFirstPaperCommand: RecordEvaluationPublicationCommand = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: acmiGroupId,
      publishedAt: evaluationsPublishedAt,
      expressionDoi: EDOI.fromValidatedString('10.1234/1111'),
    };
    const recordEvaluationPublicationForSecondPaperCommand: RecordEvaluationPublicationCommand = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: acmiGroupId,
      publishedAt: evaluationsPublishedAt,
      expressionDoi: EDOI.fromValidatedString('10.1234/9999'),
    };
    const recordPaperSnapshotForFirstPaperCommand: RecordPaperSnapshotCommand = {
      ...arbitraryRecordPaperSnapshotCommand(),
      expressionDois: new Set([recordEvaluationPublicationForFirstPaperCommand.expressionDoi]),
    };
    const recordPaperSnapshotForSecondPaperCommand: RecordPaperSnapshotCommand = {
      ...arbitraryRecordPaperSnapshotCommand(),
      expressionDois: new Set([recordEvaluationPublicationForSecondPaperCommand.expressionDoi]),
    };

    beforeEach(async () => {
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationForSecondPaperCommand);
      await framework.commandHelpers.recordPaperSnapshot(recordPaperSnapshotForSecondPaperCommand);
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationForFirstPaperCommand);
      await framework.commandHelpers.recordPaperSnapshot(recordPaperSnapshotForFirstPaperCommand);
      result = constructSortedFeed(framework.dependenciesForViews, acmiGroupId);
    });

    it.failing('returns them in alphanumerical order by representative', () => {
      expect(result).toHaveLength(2);
      expect(result[0]).toStrictEqual(recordEvaluationPublicationForFirstPaperCommand.expressionDoi);
      expect(result[1]).toStrictEqual(recordEvaluationPublicationForSecondPaperCommand.expressionDoi);
    });
  });
});
