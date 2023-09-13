import { ConstructArticleCardViewModelDependencies } from '../../../shared-components/article-card';
import { FetchStaticFile, SearchForArticles } from '../../../shared-ports';
import { Queries } from '../../../read-models';
import { ConstructGroupLinkDependencies } from '../../../shared-components/group-link';

export type Dependencies = Queries
& ConstructArticleCardViewModelDependencies
& ConstructGroupLinkDependencies
& {
  fetchStaticFile: FetchStaticFile,
  searchForArticles: SearchForArticles,
};
