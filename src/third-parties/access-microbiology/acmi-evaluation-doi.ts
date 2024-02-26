export type AcmiEvaluationDoi = string & { readonly AcmiEvaluationDoi: unique symbol };

export const fromValidatedString = (value: string): AcmiEvaluationDoi => value as AcmiEvaluationDoi;
