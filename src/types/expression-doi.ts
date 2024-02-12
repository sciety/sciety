import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';

export type ExpressionDoi = string & { readonly ExpressionDoi: unique symbol };

export const fromValidatedString = (value: string): ExpressionDoi => value.toLowerCase() as ExpressionDoi;

export const isDoi = (input: unknown): input is ExpressionDoi => typeof input === 'string';

const doiRegex = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;

export const isValidDoi = (value: string): boolean => doiRegex.test(value);

export const expressionDoiCodec = new t.Type<ExpressionDoi, string, unknown>(
  'expressionDoi',
  isDoi,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain(flow(
      O.fromPredicate((value) => doiRegex.test(value)),
      O.fold(
        () => t.failure(u, c),
        (id) => t.success(id as ExpressionDoi),
      ),
    )),
  ),
  (a) => a.toString(),
);

export const canonicalExpressionDoiCodec = new t.Type<ExpressionDoi, string, unknown>(
  'canonicalExpressionDoiCodec',
  isDoi,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain(flow(
      O.fromPredicate((value) => doiRegex.test(value)),
      O.map((value) => value.toLowerCase()),
      O.fold(
        () => t.failure(u, c),
        (id) => t.success(id as ExpressionDoi),
      ),
    )),
  ),
  (a) => a.toString(),
);

export type CanonicalExpressionDoi = t.TypeOf<typeof canonicalExpressionDoiCodec>;
