import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchArticle } from '../../../shared-ports/fetch-article';
import { ArticleCardViewModel, Ports as ArticleCardPorts, getLatestArticleVersionDate } from '../../../shared-components/article-card';
import { fetchArticleDetails } from '../../../shared-components/article-card/fetch-article-details';
import { ArticleActivity } from '../../../types/article-activity';
import { ArticleErrorCardViewModel } from '../render-as-html/render-article-error-card';
import { getCurationStatements } from '../../../shared-components/article-card/get-curation-statements';

export type Ports = ArticleCardPorts & {
  fetchArticle: FetchArticle,
};

const getArticleDetails = (ports: Ports) => fetchArticleDetails(
  getLatestArticleVersionDate(ports),
  ports.fetchArticle,
);

export const toCardViewModel = (
  ports: Ports,
) => (
  articleActivity: ArticleActivity,
): TE.TaskEither<ArticleErrorCardViewModel, ArticleCardViewModel> => pipe(
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
      curationStatements: getCurationStatements(articleActivity.articleId),
    }),
  ),
);
