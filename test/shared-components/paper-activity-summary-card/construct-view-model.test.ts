import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
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
import { RecordEvaluationPublicationCommand } from '../../../src/write-side/commands/record-evaluation-publication';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import * as PH from '../../../src/types/publishing-history';
import { arbitraryPublishingHistoryOnlyPreprints } from '../../types/publishing-history.helper';
import { paperActivityPagePath } from '../../../src/read-side/paths/paper-activity-page-redirect-path';

describe('construct-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when all information is fetched successfully', () => {
    let viewModel: PaperActivitySummaryCardViewModel;

    describe('when an article has not been evaluated', () => {
      const inputExpressionDoi = arbitraryExpressionDoi();
      const publishingHistory = arbitraryPublishingHistoryOnlyPreprints({ earliestExpressionDoi: inputExpressionDoi });
      const latestExpressionDoi = PH.getLatestExpression(publishingHistory).expressionDoi;

      beforeEach(async () => {
        viewModel = await pipe(
          inputExpressionDoi,
          constructViewModel({
            ...framework.queries,
            ...framework.happyPathThirdParties,
            fetchPublishingHistory: () => TE.right(publishingHistory),
            logger: dummyLogger,
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
        expect(viewModel.paperActivityPageHref).toStrictEqual(paperActivityPagePath(latestExpressionDoi));
      });
    });

    describe('when an article has been evaluated', () => {
      const inputExpressionDoi = EDOI.fromValidatedString(arbitraryArticleId().value);
      const command: RecordEvaluationPublicationCommand = {
        ...arbitraryRecordEvaluationPublicationCommand(),
        expressionDoi: inputExpressionDoi,
      };

      beforeEach(async () => {
        await framework.commandHelpers.recordEvaluationPublication(command);
        viewModel = await pipe(
          inputExpressionDoi,
          constructViewModel({
            ...framework.queries,
            ...framework.happyPathThirdParties,
            fetchPublishingHistory: () => TE.right(
              arbitraryPublishingHistoryOnlyPreprints({ earliestExpressionDoi: inputExpressionDoi }),
            ),
            logger: dummyLogger,
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
      expect(O.isSome(successfulViewModel.listMembershipCount)).toBe(true);
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
    let viewModel: E.Either<ErrorViewModel, PaperActivitySummaryCardViewModel>;

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

    it('returns an ErrorViewModel', () => {
      expect(E.isLeft(viewModel)).toBe(true);
    });
  });

  describe('when fetching the publishing history fails', () => {
    let viewModel: E.Either<ErrorViewModel, PaperActivitySummaryCardViewModel>;

    beforeEach(async () => {
      viewModel = await pipe(
        EDOI.fromValidatedString(arbitraryArticleId().value),
        constructViewModel({
          ...framework.queries,
          ...framework.happyPathThirdParties,
          fetchPublishingHistory: () => TE.left(DE.notFound),
          logger: dummyLogger,
        }),
      )();
    });

    it('returns an ErrorViewModel', () => {
      expect(E.isLeft(viewModel)).toBe(true);
    });
  });
});
