import { EvaluationFetcher } from './fetch-review';

export const fetchDoiEvaluationByPublisher = (
  evaluationFetchers: Record<string, EvaluationFetcher>,
): EvaluationFetcher => (key) => evaluationFetchers.zenodo(key);
