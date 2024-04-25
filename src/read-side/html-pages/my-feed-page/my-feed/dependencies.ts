import { Queries } from '../../../../read-models';
import { GetAllEvents } from '../../../../shared-ports';
import { ConstructPaperActivitySummaryCardViewModelDependencies } from '../../shared-components/paper-activity-summary-card';

export type Dependencies = Queries & ConstructPaperActivitySummaryCardViewModelDependencies & {
  getAllEvents: GetAllEvents,
};
