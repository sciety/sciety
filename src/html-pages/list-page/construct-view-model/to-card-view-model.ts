import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { populateArticleViewModel, Ports as PopulateArticleViewModelPorts } from '../../../shared-components/article-card/populate-article-view-model';
import { FetchArticle } from '../../../shared-ports/fetch-article';
import { ArticleCardViewModel, Ports as ArticleCardPorts, getLatestArticleVersionDate } from '../../../shared-components/article-card';
import { fetchArticleDetails } from '../../../shared-components/article-card/fetch-article-details';
import { ArticleActivity } from '../../../types/article-activity';
import { ArticleErrorCardViewModel } from '../render-as-html/render-article-error-card';

export type Ports = ArticleCardPorts & PopulateArticleViewModelPorts & {
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
  TE.mapLeft((error) => ({
    ...articleActivity,
    href: `/articles/${articleActivity.articleId.value}`,
    error,
  })),
  TE.chain(populateArticleViewModel(ports)),
);
