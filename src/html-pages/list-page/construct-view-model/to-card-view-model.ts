import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ArticleViewModel, Ports as ArticleCardPorts, getLatestArticleVersionDate } from '../../../shared-components/article-card';
import { fetchArticleDetails } from '../../../shared-components/article-card/fetch-article-details';
import { ArticleActivity } from '../../../types/article-activity';
import { ArticleAuthors } from '../../../types/article-authors';
import { ArticleServer } from '../../../types/article-server';
import * as DE from '../../../types/data-error';
import { Doi } from '../../../types/doi';
import { SanitisedHtmlFragment } from '../../../types/sanitised-html-fragment';
import { ArticleErrorCardViewModel } from '../render-as-html/render-article-error-card';

type Article = {
  title: SanitisedHtmlFragment,
  server: ArticleServer,
  authors: ArticleAuthors,
};

type GetArticle = (articleId: Doi) => TE.TaskEither<DE.DataError, Article>;

export type Ports = ArticleCardPorts & {
  fetchArticle: GetArticle,
};

const getArticleDetails = (ports: Ports) => fetchArticleDetails(
  getLatestArticleVersionDate(ports),
  ports.fetchArticle,
);

export const toCardViewModel = (
  ports: Ports,
) => (
  articleActivity: ArticleActivity,
): TE.TaskEither<ArticleErrorCardViewModel, ArticleViewModel> => pipe(
  articleActivity.articleId,
  getArticleDetails(ports),
  TE.bimap(
    (error) => ({
      ...articleActivity,
      href: `/articles/${articleActivity.articleId.value}`,
      error,
    }),
    (articleDetails) => ({
      ...articleActivity,
      ...articleDetails,
      authors: articleDetails.authors,
      latestVersionDate: articleDetails.latestVersionDate,
    }),
  ),
);
