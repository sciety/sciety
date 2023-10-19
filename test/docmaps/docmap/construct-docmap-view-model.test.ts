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

const selectedGroupId = arbitraryGroupId();
const articleId = arbitraryArticleId();

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

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
    });

    describe('when there is an evaluation by the selected group', () => {
      const recordEvaluationPublicationCommand = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId,
        groupId: addGroupCommand.groupId,
      };
      let result: DocmapViewModel;

      beforeEach(async () => {
        await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationCommand);
        result = await pipe(
          { articleId, groupId: addGroupCommand.groupId },
          constructDocmapViewModel(defaultAdapters),
          TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
        )();
      });

      it('includes the article id', async () => {
        expect(result).toStrictEqual(expect.objectContaining({ articleId }));
      });

      it('includes the group', async () => {
        expect(result).toStrictEqual(expect.objectContaining({
          group: expect.objectContaining({ id: addGroupCommand.groupId }),
        }));
      });
    });

    describe('when there are multiple evaluations recorded for the selected group', () => {
      const earlierDate = new Date('1980-01-01');
      const laterDate = new Date('2000-01-01');
      const command1 = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId,
        groupId: addGroupCommand.groupId,
        issuedAt: earlierDate,
      };
      const command2 = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId,
        groupId: addGroupCommand.groupId,
        issuedAt: laterDate,
      };

      describe('and they have never been updated', () => {
        let result: DocmapViewModel;

        beforeEach(async () => {
          await framework.commandHelpers.recordEvaluationPublication(command1);
          await framework.commandHelpers.recordEvaluationPublication(command2);
          result = await pipe(
            constructDocmapViewModel(defaultAdapters)({ articleId, groupId: addGroupCommand.groupId }),
            TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
          )();
        });

        it('returns all evaluations', () => {
          expect(result.evaluations).toHaveLength(2);
        });

        it('the updatedAt is when the most recently recorded evaluation was recorded', () => {
          expect(result.updatedAt).toStrictEqual(laterDate);
        });
      });

      describe('and they have been updated', () => {
        let result: DocmapViewModel;

        beforeEach(async () => {
          await framework.commandHelpers.recordEvaluationPublication(command1);
          await framework.commandHelpers.recordEvaluationPublication(command2);
          await framework.commandHelpers.updateEvaluation({
            ...arbitraryUpdateEvaluationCommand(),
            evaluationLocator: command1.evaluationLocator,
          });
          await framework.commandHelpers.updateEvaluation({
            ...arbitraryUpdateEvaluationCommand(),
            evaluationLocator: command2.evaluationLocator,
          });
          result = await pipe(
            constructDocmapViewModel(defaultAdapters)({ articleId, groupId: addGroupCommand.groupId }),
            TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
          )();
        });

        it('returns all of the evaluations', () => {
          expect(result.evaluations).toHaveLength(2);
        });

        it.todo('the updatedAt is when the most recently updated evaluation was updated');
      });
    });

    describe('when there is a single, but updated, recorded evaluation for the selected group', () => {
      let result: DocmapViewModel;
      const evaluationPublicationRecordedDate = new Date('1980-01-01');
      const evaluationUpdatedDate = new Date('2000-01-01');
      const evaluationLocator = arbitraryEvaluationLocator();

      const command = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        evaluationLocator,
        articleId,
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
        result = await pipe(
          constructDocmapViewModel(defaultAdapters)({ articleId, groupId: addGroupCommand.groupId }),
          TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
        )();
      });

      it('the updatedAt is when the evaluation was updated', () => {
        expect(result.updatedAt).toStrictEqual(updateEvaluationCommand.issuedAt);
      });
    });

    describe('when we can infer a source URL for the evaluations', () => {
      const evaluationLocatorWithInferrableSourceUrl = arbitraryReviewDoi();
      const sourceUrl = pipe(
        inferredSourceUrl(evaluationLocatorWithInferrableSourceUrl),
        O.getOrElseW(shouldNotBeCalled),
      );
      let result: DocmapViewModel;

      beforeEach(async () => {
        const recordEvaluationPublicationCommand = {
          ...arbitraryRecordEvaluationPublicationCommand(),
          groupId: addGroupCommand.groupId,
          evaluationLocator: evaluationLocatorWithInferrableSourceUrl,
          articleId,
        };
        const ports: Ports = {
          ...defaultAdapters,
          fetchReview: shouldNotBeCalled,
        };
        await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationCommand);
        result = await pipe(
          constructDocmapViewModel(ports)({ articleId, groupId: addGroupCommand.groupId }),
          TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
        )();
      });

      it('returns the inferred source URL rather than calling the port', () => {
        expect(result.evaluations).toStrictEqual([
          expect.objectContaining({
            sourceUrl,
          }),
        ]);
      });
    });

    describe('when we cannot infer a source URL for the evaluations', () => {
      const evaluationLocatorWithUninferrableSourceUrl = arbitraryNcrcId();
      const sourceUrl = new URL(arbitraryUri());
      let result: DocmapViewModel;

      beforeEach(async () => {
        const recordEvaluationPublicationCommand = {
          ...arbitraryRecordEvaluationPublicationCommand(),
          groupId: addGroupCommand.groupId,
          evaluationLocator: evaluationLocatorWithUninferrableSourceUrl,
          articleId,
        };
        const ports: Ports = {
          ...defaultAdapters,
          fetchReview: () => TE.right({ url: sourceUrl }),
        };
        await framework.commandHelpers.recordEvaluationPublication(recordEvaluationPublicationCommand);
        result = await pipe(
          constructDocmapViewModel(ports)({ articleId, groupId: addGroupCommand.groupId }),
          TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
        )();
      });

      it('obtains the source URL by calling the port', () => {
        expect(result.evaluations).toStrictEqual([
          expect.objectContaining({
            sourceUrl,
          }),
        ]);
      });
    });

    describe('when there are no evaluations by the selected group', () => {
      it('returns an E.left of not-found', async () => {
        const result = await constructDocmapViewModel(defaultAdapters)({ articleId, groupId: selectedGroupId })();

        expect(result).toStrictEqual(E.left('not-found'));
      });
    });

    describe('when there are evaluations by other groups', () => {
      it('only uses the evaluation by the selected group', async () => {
        const addOtherGroup = arbitraryAddGroupCommand();
        const recordEvaluationByThisGroup = {
          ...arbitraryRecordEvaluationPublicationCommand(),
          articleId,
          groupId: selectedGroupId,
        };
        await framework.commandHelpers.addGroup(addOtherGroup);
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          groupId: addOtherGroup.groupId,
          articleId,
        });
        await framework.commandHelpers.recordEvaluationPublication(recordEvaluationByThisGroup);

        const result = await pipe(
          {
            articleId,
            groupId: selectedGroupId,
          },
          constructDocmapViewModel(defaultAdapters),
          TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
        )();

        expect(result.evaluations).toStrictEqual([
          expect.objectContaining({
            evaluationLocator: recordEvaluationByThisGroup.evaluationLocator,
          }),
        ]);
      });
    });

    describe('when there is a single evaluation by the selected group', () => {
      const command = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        groupId: selectedGroupId,
        articleId,
      };
      let result: DocmapViewModel;

      beforeEach(async () => {
        await framework.commandHelpers.recordEvaluationPublication(command);
        result = await pipe(
          {
            articleId,
            groupId: selectedGroupId,
          },
          constructDocmapViewModel(defaultAdapters),
          TE.getOrElse(framework.abortTest('generateDocmapViewModel')),
        )();
      });

      it('returns O.none for the input published date', async () => {
        expect(result.inputPublishedDate).toStrictEqual(O.none);
      });
    });
  });

  describe('when the group cannot be retrieved', () => {
    let result: E.Either<DE.DataError, DocmapViewModel>;

    beforeEach(async () => {
      result = await pipe(
        {
          articleId,
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
