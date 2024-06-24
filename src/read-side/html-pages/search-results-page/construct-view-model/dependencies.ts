import { Queries } from '../../../../read-models';
import { ExternalQueries } from '../../../../third-parties';
import { ConstructArticleCardViewModelDependencies } from '../../shared-components/article-card';
import { ConstructGroupLinkDependencies } from '../../shared-components/group-link';

export type Dependencies = Queries
& ExternalQueries
& ConstructArticleCardViewModelDependencies
& ConstructGroupLinkDependencies;
