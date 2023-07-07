import { Ports as PopulateArticleViewModelsSkippingFailuresPorts } from './populate-article-view-models-skipping-failures';
import { GetAllEvents } from '../../../shared-ports';
import { Queries } from '../../../shared-read-models';

export type Dependencies = PopulateArticleViewModelsSkippingFailuresPorts & {
  getAllEvents: GetAllEvents,
  getGroupsFollowedBy: Queries['getGroupsFollowedBy'],
};
