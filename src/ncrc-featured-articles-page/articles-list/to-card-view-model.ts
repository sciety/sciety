import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ArticleErrorCardViewModel } from '../../list-page/evaluated-articles-list/render-article-error-card';
import { ArticleViewModel } from '../../shared-components/article-card';
import { fetchArticleDetails } from '../../shared-components/article-card/fetch-article-details';
import { FindVersionsForArticleDoi, getLatestArticleVersionDate } from '../../shared-components/article-card/get-latest-article-version-date';
import { ArticleActivity } from '../../types/article-activity';
import { ArticleAuthors } from '../../types/article-authors';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type Article = {
  title: SanitisedHtmlFragment,
  server: ArticleServer,
  authors: ArticleAuthors,
};

type GetArticle = (id: Doi) => TE.TaskEither<DE.DataError, Article>;

export type Ports = {
  fetchArticle: GetArticle,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
};

const getArticleDetails = (ports: Ports) => fetchArticleDetails(
  getLatestArticleVersionDate(ports.findVersionsForArticleDoi),
  ports.fetchArticle,
);

export const toCardViewModel = (
  ports: Ports,
) => (
  evaluatedArticle: ArticleActivity,
): TE.TaskEither<ArticleErrorCardViewModel, ArticleViewModel> => pipe(
  evaluatedArticle.doi,
  getArticleDetails(ports),
  TE.bimap(
    (error) => ({
      ...evaluatedArticle,
      href: `/articles/${evaluatedArticle.doi.value}`,
      error,
    }),
    (articleDetails) => ({
      ...evaluatedArticle,
      ...articleDetails,
      authors: articleDetails.authors,
      latestVersionDate: articleDetails.latestVersionDate,
    }),
  ),
);
