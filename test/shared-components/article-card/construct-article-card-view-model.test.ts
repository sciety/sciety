import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TO from 'fp-ts/TaskOption';
import { arbitraryList } from '../../types/list-helper';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { dummyLogger } from '../../dummy-logger';
import * as DE from '../../../src/types/data-error';
import { constructArticleCardViewModel } from '../../../src/shared-components/article-card/construct-article-card-view-model';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { createTestFramework, TestFramework } from '../../framework';
import { ArticleCardViewModel } from '../../../src/shared-components/article-card';
import { arbitraryRecordedEvaluation } from '../../types/recorded-evaluation.helper';
import { ArticleErrorCardViewModel } from '../../../src/shared-components/article-card/render-article-error-card';

describe('construct-article-card-view-model', () => {
  let framework: TestFramework;
  let viewModel: E.Either<ArticleErrorCardViewModel, ArticleCardViewModel>;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when all information is fetched successfully', () => {
    describe('when an article has not been evaluated', () => {
      const articleId = arbitraryArticleId();

      beforeEach(async () => {
        viewModel = await pipe(
          articleId,
          constructArticleCardViewModel({
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
          articleLink: `/articles/activity/${articleId.value}`,
        })));
      });
    });

    describe('when an article has been evaluated', () => {
      const articleId = arbitraryArticleId();
      const evaluation = {
        ...arbitraryRecordedEvaluation(),
        articleId,
      };

      beforeEach(async () => {
        await framework.commandHelpers.recordEvaluation(evaluation);
        viewModel = await pipe(
          articleId,
          constructArticleCardViewModel({
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
    const articleId = arbitraryArticleId();
    const list = arbitraryList();
    let successfulViewModel: ArticleCardViewModel;

    beforeEach(async () => {
      await framework.commandHelpers.createList(list);
      await framework.commandHelpers.addArticleToList(articleId, list.id);
      successfulViewModel = await pipe(
        articleId,
        constructArticleCardViewModel({
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
    const articleId = arbitraryArticleId();
    let successfulViewModel: ArticleCardViewModel;

    beforeEach(async () => {
      successfulViewModel = await pipe(
        articleId,
        constructArticleCardViewModel({
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

  describe('when fetching the article fails', () => {
    beforeEach(async () => {
      viewModel = await pipe(
        arbitraryArticleId(),
        constructArticleCardViewModel({
          ...framework.queries,
          ...framework.happyPathThirdParties,
          fetchArticle: () => TE.left(DE.unavailable),
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
        arbitraryArticleId(),
        constructArticleCardViewModel({
          ...framework.queries,
          ...framework.happyPathThirdParties,
          findVersionsForArticleDoi: () => TO.none,
          logger: dummyLogger,
        }),
      )();
    });

    it('returns an ArticleCardViewModel with the version information omitted', () => {
      expect(viewModel).toStrictEqual(E.right(expect.objectContaining({
        latestVersionDate: O.none,
      })));
    });
  });
});
