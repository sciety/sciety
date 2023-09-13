import { ConstructArticleCardViewModelDependencies } from '../../../shared-components/article-card';
import { FetchStaticFile, SearchForArticles } from '../../../shared-ports';
import { Queries } from '../../../read-models';
import { ConstructGroupLinkWithLogoDependencies } from '../../../shared-components/group-link';

export type Dependencies = Queries
& ConstructArticleCardViewModelDependencies
& ConstructGroupLinkWithLogoDependencies
& {
  fetchStaticFile: FetchStaticFile,
  searchForArticles: SearchForArticles,
};
