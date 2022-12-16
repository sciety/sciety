import { getEvaluatedArticlesListIdForGroupFromHardcodedDataAndEvents } from './get-evaluated-articles-list-id-for-group-from-hardcoded-data-and-events';
import { ReadModel } from './handle-event';
import {
  GetEvaluatedArticlesListIdForGroup,
} from '../../shared-ports';

export type Queries = {
  getEvaluatedArticlesListIdForGroup: GetEvaluatedArticlesListIdForGroup,
};

export const queries = (instance: ReadModel): Queries => ({
  getEvaluatedArticlesListIdForGroup: getEvaluatedArticlesListIdForGroupFromHardcodedDataAndEvents(instance),
});
