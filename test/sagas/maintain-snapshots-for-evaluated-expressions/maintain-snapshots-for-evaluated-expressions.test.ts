/* eslint-disable @typescript-eslint/no-unused-vars */
import { maintainSnapshotsForEvaluatedExpressions } from '../../../src/sagas/maintain-snapshots-for-evaluated-expressions/maintain-snapshots-for-evaluated-expressions';
import { createTestFramework, TestFramework } from '../../framework';
import { arbitraryRecordEvaluationPublicationCommand } from '../../write-side/commands/record-evaluation-publication-command.helper';

describe('maintain-snapshots-for-evaluated-expressions', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when an evaluation publication was recorded', () => {
    const recordEvaluationPublicationCommand = arbitraryRecordEvaluationPublicationCommand();

    beforeEach(async () => {
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationCommand);
    });

    describe('and no associated snapshots exist', () => {
      beforeEach(async () => {
        await maintainSnapshotsForEvaluatedExpressions({
          ...framework.dependenciesForViews,
          getAllEvents: framework.getAllEvents,
          commitEvents: framework.commitEvents,
        });
      });

      it.failing('records a snapshot that allows the paper to be considered evaluated by groups', () => {
        const papersEvaluatedByGroup = framework.queries.getPapersEvaluatedByGroup(
          recordEvaluationPublicationCommand.groupId,
        );

        expect(papersEvaluatedByGroup[0]).toStrictEqual([recordEvaluationPublicationCommand.expressionDoi]);
      });

      it.failing('causes the queue to be empty', () => {
        const queue = framework.queries.getExpressionsWithNoAssociatedSnapshot();

        expect(queue).toStrictEqual([]);
      });
    });
  });
});
