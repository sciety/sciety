import { ConstructArticleCardViewModelDependencies } from '../../../shared-components/paper-activity-summary-card';
import { GetAllEvents } from '../../../shared-ports';
import { Queries } from '../../../read-models';

export type Dependencies = Queries & ConstructArticleCardViewModelDependencies & {
  getAllEvents: GetAllEvents,
};
