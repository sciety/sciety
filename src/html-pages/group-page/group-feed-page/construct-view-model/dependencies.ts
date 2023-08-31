import { Dependencies as TabsViewModelDependencies } from '../../common-components/tabs-view-model';
import { Queries } from '../../../../read-models';
import { ConstructArticleCardViewModelDependencies } from '../../../../shared-components/article-card';

export type Dependencies = Queries & TabsViewModelDependencies & ConstructArticleCardViewModelDependencies;
