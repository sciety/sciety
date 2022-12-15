import { getEvaluatedArticlesListIdForGroupFromHardcodedDataAndEvents } from './get-evaluated-articles-list-id-for-group-from-hardcoded-data-and-events';
import { ReadModel } from './handle-event';
import {
  GetEvaluatedArticlesListIdForGroup,
} from '../../shared-ports';

// ts-unused-exports:disable-next-line
export type Queries = {
  getEvaluatedArticlesListIdByGroup: GetEvaluatedArticlesListIdForGroup,
};

// ts-unused-exports:disable-next-line
export const queries = (instance: ReadModel): Queries => ({
  getEvaluatedArticlesListIdByGroup: getEvaluatedArticlesListIdForGroupFromHardcodedDataAndEvents(instance),
});
