import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TO from 'fp-ts/TaskOption';
import * as EDOI from '../../../src/types/expression-doi';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { dummyLogger } from '../../dummy-logger';
import * as DE from '../../../src/types/data-error';
import { constructViewModel } from '../../../src/shared-components/paper-activity-summary-card/construct-view-model';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { createTestFramework, TestFramework } from '../../framework';
import { PaperActivitySummaryCardViewModel } from '../../../src/shared-components/paper-activity-summary-card';
import { ErrorViewModel } from '../../../src/shared-components/paper-activity-summary-card/render-error-as-html';
import { arbitraryCreateListCommand } from '../../write-side/commands/create-list-command.helper';
import { arbitraryRecordEvaluationPublicationCommand } from '../../write-side/commands/record-evaluation-publication-command.helper';
import { ArticleId } from '../../../src/types/article-id';

describe('construct-view-model', () => {
  let framework: TestFramework;
  let viewModel: E.Either<ErrorViewModel, PaperActivitySummaryCardViewModel>;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when all information is fetched successfully', () => {
    describe('when an article has not been evaluated', () => {
      const inputExpressionDoi = EDOI.fromValidatedString(arbitraryArticleId().value);

      beforeEach(async () => {
        viewModel = await pipe(
          inputExpressionDoi,
          constructViewModel({
            ...framework.queries,
            ...framework.happyPathThirdParties,
            logger: dummyLogger,
          }),
        )();
      });

      it('returns an ArticleCardViewModel', () => {
        expect(E.isRight(viewModel)).toBe(true);
      });

      it('the latest activity date is not available', () => {
        expect(viewModel).toStrictEqual(E.right(expect.objectContaining({
          latestActivityAt: O.none,
        })));
      });

      it('the evaluation count is not displayed', () => {
        expect(viewModel).toStrictEqual(E.right(expect.objectContaining({
          evaluationCount: O.none,
        })));
      });

      it('the article card links to the article page', () => {
        expect(viewModel).toStrictEqual(E.right(expect.objectContaining({
          paperActivityPageHref: `/articles/activity/${inputExpressionDoi}`,
        })));
      });
    });

    describe('when an article has been evaluated', () => {
      const inputExpressionDoi = EDOI.fromValidatedString(arbitraryArticleId().value);
      const command = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId: new ArticleId(inputExpressionDoi),
      };

      beforeEach(async () => {
        await framework.commandHelpers.recordEvaluationPublication(command);
        viewModel = await pipe(
          inputExpressionDoi,
          constructViewModel({
            ...framework.queries,
            ...framework.happyPathThirdParties,
            logger: dummyLogger,
          }),
        )();
      });

      it('returns an ArticleCardViewModel', () => {
        expect(E.isRight(viewModel)).toBe(true);
      });

      it('the latest activity date is displayed', () => {
        expect(viewModel).toStrictEqual(E.right(expect.objectContaining({
          latestActivityAt: O.some(expect.anything()),
        })));
      });

      it('the evaluation count is displayed', () => {
        expect(viewModel).toStrictEqual(E.right(expect.objectContaining({
          evaluationCount: O.some(expect.anything()),
        })));
      });
    });
  });

  describe('when an article appears in lists', () => {
    const inputExpressionDoi = EDOI.fromValidatedString(arbitraryArticleId().value);
    const command = arbitraryCreateListCommand();
    let successfulViewModel: PaperActivitySummaryCardViewModel;

    beforeEach(async () => {
      await framework.commandHelpers.createList(command);
      await framework.commandHelpers.addArticleToList(new ArticleId(inputExpressionDoi), command.listId);
      successfulViewModel = await pipe(
        inputExpressionDoi,
        constructViewModel({
          ...framework.queries,
          ...framework.happyPathThirdParties,
          logger: dummyLogger,
        }),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('displays the count', () => {
      expect(successfulViewModel.listMembershipCount).toStrictEqual(O.some(expect.anything()));
    });
  });

  describe('when an article does not appear in any list', () => {
    const inputExpressionDoi = EDOI.fromValidatedString(arbitraryArticleId().value);
    let successfulViewModel: PaperActivitySummaryCardViewModel;

    beforeEach(async () => {
      successfulViewModel = await pipe(
        inputExpressionDoi,
        constructViewModel({
          ...framework.queries,
          ...framework.happyPathThirdParties,
          logger: dummyLogger,
        }),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('displays nothing', () => {
      expect(successfulViewModel.listMembershipCount).toStrictEqual(O.none);
    });
  });

  describe('when fetching the front matter fails', () => {
    beforeEach(async () => {
      viewModel = await pipe(
        EDOI.fromValidatedString(arbitraryArticleId().value),
        constructViewModel({
          ...framework.queries,
          ...framework.happyPathThirdParties,
          fetchExpressionFrontMatter: () => TE.left(DE.unavailable),
          logger: dummyLogger,
        }),
      )();
    });

    it('returns an ArticleErrorCardViewModel', () => {
      expect(E.isLeft(viewModel)).toBe(true);
    });
  });

  describe('when fetching the version information fails', () => {
    beforeEach(async () => {
      viewModel = await pipe(
        EDOI.fromValidatedString(arbitraryArticleId().value),
        constructViewModel({
          ...framework.queries,
          ...framework.happyPathThirdParties,
          findAllExpressionsOfPaper: () => TO.none,
          logger: dummyLogger,
        }),
      )();
    });

    it('returns an ArticleCardViewModel with the version information omitted', () => {
      expect(viewModel).toStrictEqual(E.right(expect.objectContaining({
        latestPublishedAt: O.none,
      })));
    });
  });
});