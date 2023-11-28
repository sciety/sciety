import { ConstructArticleCardViewModelDependencies } from '../../../shared-components/article-card';
import { SearchForArticles } from '../../../shared-ports';
import { Queries } from '../../../read-models';
import { ConstructGroupLinkDependencies } from '../../../shared-components/group-link';
import { ExternalQueries } from '../../../third-parties';

export type Dependencies = Queries
& ExternalQueries
& ConstructArticleCardViewModelDependencies
& ConstructGroupLinkDependencies
& {
  searchForArticles: SearchForArticles,
};
