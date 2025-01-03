import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { maintainSnapshotsForEvaluatedExpressions } from '../../../src/sagas/maintain-snapshots-for-evaluated-expressions/maintain-snapshots-for-evaluated-expressions';
import * as GID from '../../../src/types/group-id';
import * as PH from '../../../src/types/publishing-history';
import { createTestFramework, TestFramework } from '../../framework';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryPaperExpression } from '../../types/paper-expression.helper';
import { arbitraryRecordEvaluationPublicationCommand } from '../../write-side/commands/record-evaluation-publication-command.helper';

describe('maintain-snapshots-for-evaluated-expressions', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when an evaluation publication was recorded for a considered group', () => {
    const accessMicrobiologyGroupId = GID.fromValidatedString('4d6a8908-22a9-45c8-bd56-3c7140647709');
    const recordEvaluationPublicationCommand = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: accessMicrobiologyGroupId,
    };

    beforeEach(async () => {
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationCommand);
    });

    describe('and no associated snapshots exist', () => {
      beforeEach(async () => {
        const publishingHistory = pipe(
          [
            { ...arbitraryPaperExpression(), expressionDoi: recordEvaluationPublicationCommand.expressionDoi },
          ],
          PH.fromExpressions,
          E.getOrElseW(shouldNotBeCalled),
        );

        const dependencies = {
          ...framework.dependenciesForSagas,
          fetchPublishingHistory: () => TE.right(publishingHistory),
        };
        await maintainSnapshotsForEvaluatedExpressions(dependencies)();
      });

      it('causes a paper to be regarded as evaluated by that group', () => {
        const papersEvaluatedByGroup = framework.queries.getPapersEvaluatedByGroup(
          recordEvaluationPublicationCommand.groupId,
        );

        expect(papersEvaluatedByGroup.size).toBe(1);
      });

      it('causes the queue to be empty', () => {
        const queue = framework.queries.getExpressionsWithNoAssociatedSnapshot();

        expect(queue).toStrictEqual([]);
      });
    });
  });

  describe('when an evaluation publication was recorded for a group that is not considered', () => {
    const recordEvaluationPublicationCommand = arbitraryRecordEvaluationPublicationCommand();

    beforeEach(async () => {
      await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationCommand);

      await maintainSnapshotsForEvaluatedExpressions(framework.dependenciesForSagas)();
    });

    it('does nothing', () => {
      const papersEvaluatedByGroup = framework.queries.getPapersEvaluatedByGroup(
        recordEvaluationPublicationCommand.groupId,
      );

      expect(papersEvaluatedByGroup.size).toBe(0);
    });
  });
});
