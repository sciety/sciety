import { GetEvaluationsForDoi, getEvaluationsForDoi } from './get-evaluations-for-doi';
import { ReadModel } from './handle-event';

export type Queries = {
  getEvaluationsForDoi: GetEvaluationsForDoi,
};

export const queries = (instance: ReadModel): Queries => ({
  getEvaluationsForDoi: getEvaluationsForDoi(instance),
});
