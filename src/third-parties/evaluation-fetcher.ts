import { ExternalQueries } from './external-queries.js';

export type EvaluationFetcher = (key: string) => ReturnType<ExternalQueries['fetchEvaluation']>;
