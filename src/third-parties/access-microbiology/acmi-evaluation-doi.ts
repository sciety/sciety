import * as t from 'io-ts';

export type AcmiEvaluationDoi = string & { readonly AcmiEvaluationDoi: unique symbol };

export const fromValidatedString = (value: string): AcmiEvaluationDoi => value as AcmiEvaluationDoi;

export const acmiEvaluationDoiCodec = t.string;
