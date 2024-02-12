import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DocmapViewModel, constructDocmapViewModel, Ports } from '../../../src/docmaps/docmap/construct-docmap-view-model';
import * as DE from '../../../src/types/data-error';
import { inferredSourceUrl } from '../../../src/types/evaluation-locator';
import { arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryEvaluationLocator, arbitraryNcrcId, arbitraryReviewDoi } from '../../types/evaluation-locator.helper';
import { TestFramework, createTestFramework } from '../../framework';
import { arbitraryAddGroupCommand } from '../../write-side/commands/add-group-command.helper';
import { arbitraryRecordEvaluationPublicationCommand } from '../../write-side/commands/record-evaluation-publication-command.helper';
import { arbitraryUpdateEvaluationCommand } from '../../write-side/commands/update-evaluation-command.helper';
import { RecordEvaluationPublicationCommand } from '../../../src/write-side/commands';
import { toExpressionDoi } from '../../../src/types/article-id';

const selectedGroupId = arbitraryGroupId();
const articleId = arbitraryArticleId();
const expressionDoi = toExpressionDoi(articleId);

describe('construct-docmap-view-model', () => {
  let framework: TestFramework;
  let defaultAdapters: Ports;

  beforeEach(async () => {
    framework = createTestFramework();
    defaultAdapters = {
      ...framework.queries,
      ...framework.happyPathThirdParties,
    };
  });

  describe('when the selected group exists', () => {
    const addGroupCommand = {
      ...arbitraryAddGroupCommand(),
      groupId: selectedGroupId,
    };
    let viewModel: DocmapViewModel;

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
    });

    describe('when there is an evaluation by the selected group', () => {
      const recordEvaluationPublicationCommand: RecordEvaluationPublicationCommand = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        expressionDoi,
        groupId: addGroupCommand.groupId,
      };

      beforeEach(async () => {
        await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationCommand);
        viewModel = await pipe(
          { expressionDoi, groupId: addGroupCommand.groupId },
          constructDocmapViewModel(defaultAdapters),
          TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
        )();
      });

      it('includes the article id', async () => {
        expect(viewModel.expressionDoi).toStrictEqual(expressionDoi);
      });

      it('includes the group', async () => {
        expect(viewModel).toStrictEqual(expect.objectContaining({
          group: expect.objectContaining({ id: addGroupCommand.groupId }),
        }));
      });
    });

    describe('when there are multiple evaluations recorded for the selected group', () => {
      const earlierDate = new Date('1980-01-01');
      const laterDate = new Date('2000-01-01');
      const command1: RecordEvaluationPublicationCommand = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        expressionDoi,
        groupId: addGroupCommand.groupId,
        issuedAt: earlierDate,
      };
      const command2: RecordEvaluationPublicationCommand = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        expressionDoi,
        groupId: addGroupCommand.groupId,
        issuedAt: laterDate,
      };

      beforeEach(async () => {
        await framework.commandHelpers.recordEvaluationPublication(command1);
        await framework.commandHelpers.recordEvaluationPublication(command2);
      });

      describe('and they have never been updated', () => {
        beforeEach(async () => {
          viewModel = await pipe(
            constructDocmapViewModel(defaultAdapters)({ expressionDoi, groupId: addGroupCommand.groupId }),
            TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
          )();
        });

        it('returns all evaluations', () => {
          expect(viewModel.evaluations).toHaveLength(2);
        });

        it('the updatedAt is when the most recently recorded evaluation was recorded', () => {
          expect(viewModel.updatedAt).toStrictEqual(laterDate);
        });
      });

      describe('and they have been updated, in reverse order of their recording', () => {
        const updateDate = new Date('2010-01-01');
        const laterUpdateDate = new Date('2020-01-01');

        beforeEach(async () => {
          await framework.commandHelpers.updateEvaluation({
            ...arbitraryUpdateEvaluationCommand(),
            evaluationLocator: command2.evaluationLocator,
            issuedAt: updateDate,
          });
          await framework.commandHelpers.updateEvaluation({
            ...arbitraryUpdateEvaluationCommand(),
            evaluationLocator: command1.evaluationLocator,
            issuedAt: laterUpdateDate,
          });
          viewModel = await pipe(
            constructDocmapViewModel(defaultAdapters)({ expressionDoi, groupId: addGroupCommand.groupId }),
            TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
          )();
        });

        it('returns all of the evaluations', () => {
          expect(viewModel.evaluations).toHaveLength(2);
        });

        it('the updatedAt is when the most recently updated evaluation was updated', () => {
          expect(viewModel.updatedAt).toStrictEqual(laterUpdateDate);
        });
      });
    });

    describe('when there is a single, but updated, recorded evaluation for the selected group', () => {
      const evaluationPublicationRecordedDate = new Date('1980-01-01');
      const evaluationUpdatedDate = new Date('2000-01-01');
      const evaluationLocator = arbitraryEvaluationLocator();

      const command: RecordEvaluationPublicationCommand = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        evaluationLocator,
        expressionDoi,
        groupId: addGroupCommand.groupId,
        issuedAt: evaluationPublicationRecordedDate,
      };

      const updateEvaluationCommand = {
        ...arbitraryUpdateEvaluationCommand(),
        evaluationLocator,
        issuedAt: evaluationUpdatedDate,
      };

      beforeEach(async () => {
        await framework.commandHelpers.recordEvaluationPublication(command);
        await framework.commandHelpers.updateEvaluation(updateEvaluationCommand);
        viewModel = await pipe(
          constructDocmapViewModel(defaultAdapters)({ expressionDoi, groupId: addGroupCommand.groupId }),
          TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
        )();
      });

      it('the updatedAt is when the evaluation was updated', () => {
        expect(viewModel.updatedAt).toStrictEqual(updateEvaluationCommand.issuedAt);
      });
    });

    describe('when we can infer a source URL for the evaluations', () => {
      const evaluationLocatorWithInferrableSourceUrl = arbitraryReviewDoi();
      const sourceUrl = pipe(
        inferredSourceUrl(evaluationLocatorWithInferrableSourceUrl),
        O.getOrElseW(shouldNotBeCalled),
      );

      beforeEach(async () => {
        const recordEvaluationPublicationCommand: RecordEvaluationPublicationCommand = {
          ...arbitraryRecordEvaluationPublicationCommand(),
          groupId: addGroupCommand.groupId,
          evaluationLocator: evaluationLocatorWithInferrableSourceUrl,
          expressionDoi,
        };
        const ports: Ports = {
          ...defaultAdapters,
          fetchReview: shouldNotBeCalled,
        };
        await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationCommand);
        viewModel = await pipe(
          constructDocmapViewModel(ports)({ expressionDoi, groupId: addGroupCommand.groupId }),
          TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
        )();
      });

      it('returns the inferred source URL rather than calling the port', () => {
        expect(viewModel.evaluations).toStrictEqual([
          expect.objectContaining({
            sourceUrl,
          }),
        ]);
      });
    });

    describe('when we cannot infer a source URL for the evaluations', () => {
      const evaluationLocatorWithUninferrableSourceUrl = arbitraryNcrcId();
      const sourceUrl = new URL(arbitraryUri());

      beforeEach(async () => {
        const recordEvaluationPublicationCommand: RecordEvaluationPublicationCommand = {
          ...arbitraryRecordEvaluationPublicationCommand(),
          groupId: addGroupCommand.groupId,
          evaluationLocator: evaluationLocatorWithUninferrableSourceUrl,
          expressionDoi,
        };
        const ports: Ports = {
          ...defaultAdapters,
          fetchReview: () => TE.right({ url: sourceUrl }),
        };
        await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationCommand);
        viewModel = await pipe(
          constructDocmapViewModel(ports)({ expressionDoi, groupId: addGroupCommand.groupId }),
          TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
        )();
      });

      it('obtains the source URL by calling the port', () => {
        expect(viewModel.evaluations).toStrictEqual([
          expect.objectContaining({
            sourceUrl,
          }),
        ]);
      });
    });

    describe('when there are no evaluations by the selected group', () => {
      it('returns an E.left of not-found', async () => {
        const result = await constructDocmapViewModel(defaultAdapters)({
          expressionDoi,
          groupId: selectedGroupId,
        })();

        expect(result).toStrictEqual(E.left('not-found'));
      });
    });

    describe('when there are evaluations by other groups', () => {
      it('only uses the evaluation by the selected group', async () => {
        const addOtherGroup = arbitraryAddGroupCommand();
        const recordEvaluationByThisGroup: RecordEvaluationPublicationCommand = {
          ...arbitraryRecordEvaluationPublicationCommand(),
          expressionDoi,
          groupId: selectedGroupId,
        };
        await framework.commandHelpers.addGroup(addOtherGroup);
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          groupId: addOtherGroup.groupId,
          expressionDoi,
        });
        await framework.commandHelpers.recordEvaluationPublication(recordEvaluationByThisGroup);

        viewModel = await pipe(
          {
            expressionDoi,
            groupId: selectedGroupId,
          },
          constructDocmapViewModel(defaultAdapters),
          TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
        )();

        expect(viewModel.evaluations).toStrictEqual([
          expect.objectContaining({
            evaluationLocator: recordEvaluationByThisGroup.evaluationLocator,
          }),
        ]);
      });
    });
  });

  describe('when the group cannot be retrieved', () => {
    let result: E.Either<DE.DataError, DocmapViewModel>;

    beforeEach(async () => {
      result = await pipe(
        {
          expressionDoi,
          groupId: selectedGroupId,
        },
        constructDocmapViewModel(defaultAdapters),
      )();
    });

    it('returns not-found', async () => {
      expect(result).toStrictEqual(E.left('not-found'));
    });
  });
});
