import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { populateArticleViewModel, Ports as PopulateArticleViewModelPorts } from '../../../shared-components/article-card/populate-article-view-model';
import { FetchArticle } from '../../../shared-ports/fetch-article';
import { ArticleCardViewModel, Ports as ArticleCardPorts } from '../../../shared-components/article-card';
import { ArticleActivity } from '../../../types/article-activity';
import { ArticleErrorCardViewModel } from '../render-as-html/render-article-error-card';

export type Ports = ArticleCardPorts & PopulateArticleViewModelPorts & {
  fetchArticle: FetchArticle,
};

export const toCardViewModel = (
  ports: Ports,
) => (
  articleActivity: ArticleActivity,
): TE.TaskEither<ArticleErrorCardViewModel, ArticleCardViewModel> => pipe(
  articleActivity.articleId,
  populateArticleViewModel(ports),
);
