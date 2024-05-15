import { ExternalQueries } from '../external-queries';

export type EvaluationDigestFetcher = (key: string) => ReturnType<ExternalQueries['fetchEvaluationDigest']>;
