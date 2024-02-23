import * as t from 'io-ts';
import { flow, pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';

export type AcmiEvaluationDoi = string & { readonly AcmiEvaluationDoi: unique symbol };

export const fromValidatedString = (value: string): AcmiEvaluationDoi => value as AcmiEvaluationDoi;

const doiRegex = /^10.+\/.+$/i;

export const acmiEvaluationDoiCodec = new t.Type<AcmiEvaluationDoi, string, unknown>(
  'acmiEvaluationDoiCodec',
  (input): input is AcmiEvaluationDoi => false,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain(flow(
      O.fromPredicate((value) => doiRegex.test(value)),
      O.fold(
        () => t.failure(u, c),
        (value) => t.success(fromValidatedString(value)),
      ),
    )),
  ),
  (a) => a.toString(),
);
