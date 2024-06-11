import { Queries } from '../../../../read-models';
import { GetAllEvents } from '../../../../shared-ports/get-all-events';
import { ConstructPaperActivitySummaryCardViewModelDependencies } from '../../shared-components/paper-activity-summary-card';

export type Dependencies = Queries & ConstructPaperActivitySummaryCardViewModelDependencies & {
  getAllEvents: GetAllEvents,
};
