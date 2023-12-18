import { Dependencies as TabsViewModelDependencies } from '../../common-components/tabs-view-model';
import { Queries } from '../../../../read-models';
import { ConstructArticleCardViewModelDependencies } from '../../../../shared-components/paper-activity-summary-card';

export type Dependencies = Queries & TabsViewModelDependencies & ConstructArticleCardViewModelDependencies;
