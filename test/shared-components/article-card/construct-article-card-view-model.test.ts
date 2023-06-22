import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TO from 'fp-ts/TaskOption';
import * as DE from '../../../src/types/data-error';
import { constructArticleCardViewModel } from '../../../src/shared-components/article-card/construct-article-card-view-model';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { createTestFramework, TestFramework } from '../../framework';
import { ArticleCardViewModel } from '../../../src/shared-components/article-card';
import { arbitraryRecordedEvaluation } from '../../types/recorded-evaluation.helper';
import { ArticleErrorCardViewModel } from '../../../src/html-pages/list-page/render-as-html/render-article-error-card';

describe('construct-article-card-view-model', () => {
  let framework: TestFramework;
  let viewModel: E.Either<ArticleErrorCardViewModel, ArticleCardViewModel>;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when an article has not been evaluated', () => {
    describe('when all information is fetched successfully', () => {
      const articleId = arbitraryArticleId();

      beforeEach(async () => {
        viewModel = await pipe(
          articleId,
          constructArticleCardViewModel({
            ...framework.queries,
            ...framework.happyPathThirdParties,
          }),
        )();
      });

      it('returns an ArticleCardViewModel', () => {
        expect(E.isRight(viewModel)).toBe(true);
      });
    });
  });

  describe('when an article has been evaluated', () => {
    describe('when all information is fetched successfully', () => {
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
          }),
        )();
      });

      it('returns an ArticleCardViewModel', () => {
        expect(E.isRight(viewModel)).toBe(true);
      });
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
