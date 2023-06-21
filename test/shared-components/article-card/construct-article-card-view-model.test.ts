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

  describe('when all information is fetched successfully', () => {
    const articleId = arbitraryArticleId();
    const latestVersionDate = new Date();
    const laterPublicationDate = new Date('2020');
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

    it.skip('returns a correct view model', async () => {
      expect(viewModel).toStrictEqual(expect.objectContaining({
        evaluationCount: 2,
        latestVersionDate: O.some(latestVersionDate),
        latestActivityAt: O.some(laterPublicationDate),
      }));
    });
  });

  describe('when fetching the article fails', () => {
    it.todo('returns an ArticleErrorCardViewModel');
  });

  describe('when fetching the version information fails', () => {
    it.todo('returns an ArticleCardViewModel with the version information omitted');
  });
});
