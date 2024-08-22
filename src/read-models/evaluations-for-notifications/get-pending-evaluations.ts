import { PendingEvaluation, ReadModel } from './handle-event';

export const getPendingEvaluations = (readModel: ReadModel) => (): ReadonlyArray<PendingEvaluation> => readModel;
