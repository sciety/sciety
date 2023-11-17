import { ConstructArticleCardViewModelDependencies } from '../../../shared-components/article-card/index.js';
import { FetchStaticFile, SearchForArticles } from '../../../shared-ports/index.js';
import { Queries } from '../../../read-models/index.js';
import { ConstructGroupLinkDependencies } from '../../../shared-components/group-link/index.js';

export type Dependencies = Queries
& ConstructArticleCardViewModelDependencies
& ConstructGroupLinkDependencies
& {
  fetchStaticFile: FetchStaticFile,
  searchForArticles: SearchForArticles,
};
