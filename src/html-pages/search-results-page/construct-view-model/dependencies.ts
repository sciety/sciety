import { ConstructArticleCardViewModelPorts } from '../../../shared-components/article-card';
import { FetchStaticFile, SearchForArticles } from '../../../shared-ports';
import { Queries } from '../../../shared-read-models';

export type Dependencies = Queries & ConstructArticleCardViewModelPorts & {
  fetchStaticFile: FetchStaticFile,
  searchForArticles: SearchForArticles,
};
