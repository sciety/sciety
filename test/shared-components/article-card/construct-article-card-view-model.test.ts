import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructArticleCardViewModel } from '../../../src/shared-components/article-card/construct-article-card-view-model';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { createTestFramework, TestFramework } from '../../framework';
import { ArticleCardViewModel } from '../../../src/shared-components/article-card';

describe('construct-article-card-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when an article has not been evaluated', () => {
    describe('when all information is fetched successfully', () => {
      const articleId = arbitraryArticleId();
      let viewModel: ArticleCardViewModel;

      beforeEach(async () => {
        viewModel = await pipe(
          articleId,
          constructArticleCardViewModel({
            ...framework.queries,
            ...framework.happyPathThirdParties,
          }),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('returns an ArticleCardViewModel', async () => {
        expect(viewModel).toStrictEqual(expect.objectContaining({
          evaluationCount: 0,
          latestActivityAt: O.none,
        }));
      });
    });
  });

  describe('when an article has been evaluated', () => {
    describe('when all information is fetched successfully', () => {
      it.todo('returns an ArticleCardViewModel');
    });
  });

  describe('when fetching the article fails', () => {
    it.todo('returns an ArticleErrorCardViewModel');
  });

  describe('when fetching the version information fails', () => {
    it.todo('returns an ArticleCardViewModel with the version information omitted');
  });
});
