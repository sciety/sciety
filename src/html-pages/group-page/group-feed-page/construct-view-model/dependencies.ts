import { Dependencies as TabsViewModelDependencies } from '../../common-components/tabs-view-model.js';
import { Queries } from '../../../../read-models/index.js';
import { ConstructPaperActivitySummaryCardViewModelDependencies } from '../../../../shared-components/paper-activity-summary-card/index.js';

export type Dependencies = Queries & TabsViewModelDependencies & ConstructPaperActivitySummaryCardViewModelDependencies;
