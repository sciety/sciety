import { Dependencies as TabsViewModelDependencies } from '../../common-components/tabs-view-model.js';
import { Queries } from '../../../../read-models/index.js';
import { ConstructArticleCardViewModelDependencies } from '../../../../shared-components/article-card/index.js';

export type Dependencies = Queries & TabsViewModelDependencies & ConstructArticleCardViewModelDependencies;
