import { GetEvaluationsForDoi, getEvaluationsForDoi } from './get-evaluations-for-doi';
import { ReadModel } from './handle-event';

// ts-unused-exports:disable-next-line
export type Queries = {
  getEvaluationsForDoi: GetEvaluationsForDoi,
};

// ts-unused-exports:disable-next-line
export const queries = (instance: ReadModel): Queries => ({
  getEvaluationsForDoi: getEvaluationsForDoi(instance),
});
