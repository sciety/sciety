import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { URL } from 'url';
import { arbitrarySanitisedHtmlFragment, arbitraryUri } from '../../helpers';
import { constructArticleCardViewModel, Ports } from '../../../src/shared-components/article-card/construct-article-card-view-model';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { sanitise } from '../../../src/types/sanitised-html-fragment';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';

describe('construct-article-card-view-model', () => {
  describe('when all information is fetched successfully', () => {
    it('returns a correct view model', async () => {
      const articleId = arbitraryArticleId();
      const latestVersionDate = new Date();
      const laterPublicationDate = new Date('2020');
      const article = {
        articleId,
        server: 'biorxiv' as const,
        title: pipe('', toHtmlFragment, sanitise),
        authors: O.none,
      };
      const ports: Ports = {
        fetchArticle: () => TE.right({
          abstract: arbitrarySanitisedHtmlFragment(),
          authors: article.authors,
          doi: articleId,
          title: article.title,
          server: article.server,
        }),
        findVersionsForArticleDoi: () => TO.some([{
          source: new URL(arbitraryUri()),
          publishedAt: latestVersionDate,
          version: 1,
        }]),
        getActivityForDoi: (a) => ({
          articleId: a,
          latestActivityAt: O.some(laterPublicationDate),
          evaluationCount: 2,
          listMembershipCount: 0,
        }),
      };

      const viewModel = await pipe(
        article.articleId,
        constructArticleCardViewModel(ports),
        TE.getOrElseW(() => T.of(shouldNotBeCalled)),
      )();

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
