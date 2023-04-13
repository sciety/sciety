import { GetEvaluationsByGroup, getEvaluationsByGroup } from './get-evaluations-by-group';
import { GetEvaluationsForDoi, getEvaluationsForDoi } from './get-evaluations-for-doi';
import { ReadModel } from './handle-event';

export type Queries = {
  getEvaluationsForDoi: GetEvaluationsForDoi,
  getEvaluationsByGroup: GetEvaluationsByGroup,
};

export const queries = (instance: ReadModel): Queries => ({
  getEvaluationsForDoi: getEvaluationsForDoi(instance),
  getEvaluationsByGroup: getEvaluationsByGroup(instance),
});
