/* eslint-disable @typescript-eslint/no-unused-vars */
import { DependenciesForViews } from '../../../src/read-side/dependencies-for-views';
import { ExpressionDoi } from '../../../src/types/expression-doi';
import { DependenciesForCommands } from '../../../src/write-side';
import { createTestFramework, TestFramework } from '../../framework';
import { arbitraryRecordEvaluationPublicationCommand } from '../../write-side/commands/record-evaluation-publication-command.helper';

type Dependencies = DependenciesForViews & DependenciesForCommands;

const maintainSnapshotsForEvaluatedExpressions = async (
  dependencies: Dependencies,
): Promise<void> => undefined;

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

      const queue: ReadonlyArray<ExpressionDoi> = []; // need to implement as a query;

      it.failing('records a snapshot that allows the paper to be considered evaluated by groups', () => {
        const papersEvaluatedByGroup: ReadonlyArray<ExpressionDoi> = []; // need to wire up existing query to framework

        expect(papersEvaluatedByGroup[0]).toStrictEqual([recordEvaluationPublicationCommand.expressionDoi]);
      });

      it('empties the queue', () => {
        expect(queue).toStrictEqual([]);
      });
    });
  });
});
