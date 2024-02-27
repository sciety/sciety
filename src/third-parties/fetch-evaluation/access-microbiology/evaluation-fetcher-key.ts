export type EvaluationFetcherKey = string & { readonly EvaluationFetcherKey: unique symbol };

export const fromValidatedString = (value: string): EvaluationFetcherKey => value as EvaluationFetcherKey;
