import { Doi } from '../../types/doi';
import { ReadModel, RecordedEvaluation } from './handle-event';

export type GetEvaluationsForDoi = (articleDoi: Doi) => ReadonlyArray<RecordedEvaluation>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getEvaluationsForDoi = (readModel: ReadModel): GetEvaluationsForDoi => (articleId) => [];
