import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ArticleCardViewModel } from '../../../../../src/read-side/html-pages/shared-components/article-card';
import { constructViewModel } from '../../../../../src/read-side/html-pages/shared-components/article-card/construct-view-model';
import { ErrorViewModel } from '../../../../../src/read-side/html-pages/shared-components/article-card/render-error-as-html';
import { constructPaperActivityPageHref } from '../../../../../src/read-side/paths';
import * as DE from '../../../../../src/types/data-error';
import * as PH from '../../../../../src/types/publishing-history';
import { RecordEvaluationPublicationCommand } from '../../../../../src/write-side/commands/record-evaluation-publication';
import { createTestFramework, TestFramework } from '../../../../framework';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../../../types/expression-doi.helper';
import { arbitraryPublishingHistoryOnlyPreprints } from '../../../../types/publishing-history.helper';
import { arbitraryCreateListCommand } from '../../../../write-side/commands/create-list-command.helper';
import { arbitraryRecordEvaluationPublicationCommand } from '../../../../write-side/commands/record-evaluation-publication-command.helper';

describe('construct-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when all information is fetched successfully', () => {
    let viewModel: ArticleCardViewModel;

    describe('when an article has not been evaluated', () => {
      const inputExpressionDoi = arbitraryExpressionDoi();
      const publishingHistory = arbitraryPublishingHistoryOnlyPreprints({ earliestExpressionDoi: inputExpressionDoi });
      const latestExpressionDoi = PH.getLatestExpression(publishingHistory).expressionDoi;

      beforeEach(async () => {
        viewModel = await pipe(
          inputExpressionDoi,
          constructViewModel({
            ...framework.dependenciesForViews,
            fetchPublishingHistory: () => TE.right(publishingHistory),
          }),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('the latest activity date is not available', () => {
        expect(viewModel.latestActivityAt).toStrictEqual(O.none);
      });

      it('the evaluation count is not displayed', () => {
        expect(viewModel.evaluationCount).toStrictEqual(O.none);
      });

      it('the article card links to the article page', () => {
        expect(viewModel.paperActivityPageHref).toStrictEqual(constructPaperActivityPageHref(latestExpressionDoi));
      });
    });

    describe('when an article has been evaluated', () => {
      const inputExpressionDoi = arbitraryExpressionDoi();
      const command: RecordEvaluationPublicationCommand = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        expressionDoi: inputExpressionDoi,
      };

      beforeEach(async () => {
        await framework.commandHelpers.recordEvaluationPublication(command);
        viewModel = await pipe(
          inputExpressionDoi,
          constructViewModel({
            ...framework.dependenciesForViews,
            fetchPublishingHistory: () => TE.right(
              arbitraryPublishingHistoryOnlyPreprints({ earliestExpressionDoi: inputExpressionDoi }),
            ),
          }),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('the latest activity date is displayed', () => {
        expect(O.isSome(viewModel.latestActivityAt)).toBe(true);
      });

      it('the evaluation count is displayed', () => {
        expect(O.isSome(viewModel.evaluationCount)).toBe(true);
      });
    });
  });

  describe('when an article appears in lists', () => {
    const inputExpressionDoi = arbitraryExpressionDoi();
    const command = arbitraryCreateListCommand();
    let successfulViewModel: ArticleCardViewModel;

    beforeEach(async () => {
      await framework.commandHelpers.createList(command);
      await framework.commandHelpers.addArticleToList(
        { expressionDoi: inputExpressionDoi, listId: command.listId },
      );
      successfulViewModel = await pipe(
        inputExpressionDoi,
        constructViewModel(framework.dependenciesForViews),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('displays the count', () => {
      expect(O.isSome(successfulViewModel.listMembershipCount)).toBe(true);
    });
  });

  describe('when an article does not appear in any list', () => {
    const inputExpressionDoi = arbitraryExpressionDoi();
    let successfulViewModel: ArticleCardViewModel;

    beforeEach(async () => {
      successfulViewModel = await pipe(
        inputExpressionDoi,
        constructViewModel(framework.dependenciesForViews),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('displays nothing', () => {
      expect(successfulViewModel.listMembershipCount).toStrictEqual(O.none);
    });
  });

  describe('when fetching the front matter fails', () => {
    let viewModel: E.Either<ErrorViewModel, ArticleCardViewModel>;

    beforeEach(async () => {
      viewModel = await pipe(
        arbitraryExpressionDoi(),
        constructViewModel({
          ...framework.dependenciesForViews,
          fetchExpressionFrontMatter: () => TE.left(DE.unavailable),
        }),
      )();
    });

    it('returns an ErrorViewModel', () => {
      expect(E.isLeft(viewModel)).toBe(true);
    });
  });

  describe('when fetching the publishing history fails', () => {
    let viewModel: E.Either<ErrorViewModel, ArticleCardViewModel>;

    beforeEach(async () => {
      viewModel = await pipe(
        arbitraryExpressionDoi(),
        constructViewModel({
          ...framework.dependenciesForViews,
          fetchPublishingHistory: () => TE.left(DE.notFound),
        }),
      )();
    });

    it('returns an ErrorViewModel', () => {
      expect(E.isLeft(viewModel)).toBe(true);
    });
  });
});
