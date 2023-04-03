import { Doi } from '../types/doi';
import { RecordedEvaluation } from '../types/recorded-evaluation';

export type GetEvaluationsForDoi = (articleDoi: Doi) => ReadonlyArray<RecordedEvaluation>;
