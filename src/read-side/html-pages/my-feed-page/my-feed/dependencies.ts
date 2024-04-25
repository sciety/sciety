import { Queries } from '../../../../read-models';
import { ConstructPaperActivitySummaryCardViewModelDependencies } from '../../../../shared-components/paper-activity-summary-card';
import { GetAllEvents } from '../../../../shared-ports';

export type Dependencies = Queries & ConstructPaperActivitySummaryCardViewModelDependencies & {
  getAllEvents: GetAllEvents,
};
