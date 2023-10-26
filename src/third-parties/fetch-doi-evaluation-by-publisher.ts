import { EvaluationFetcher } from './fetch-review';

export const fetchDoiEvaluationByPublisher = (
  evaluationFetcher: EvaluationFetcher,
): EvaluationFetcher => (key) => evaluationFetcher(key);
