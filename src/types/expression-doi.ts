import * as E from 'fp-ts/Either';
import * as Eq from 'fp-ts/Eq';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import { flow, pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as t from 'io-ts';

export type ExpressionDoi = string & { readonly ExpressionDoi: unique symbol };

export const fromValidatedString = (value: string): ExpressionDoi => value.toLowerCase() as ExpressionDoi;

export const isDoi = (input: unknown): input is ExpressionDoi => typeof input === 'string';

const doiRegex = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;

export const isValidDoi = (value: string): boolean => doiRegex.test(value);

export const hasPrefix = (prefix: string) => (doi: ExpressionDoi): boolean => doi.startsWith(`${prefix}/`);

export const toDoiUrl = (expressionDoi: ExpressionDoi): string => `https://doi.org/${expressionDoi}`;

export const expressionDoiCodec = new t.Type<ExpressionDoi, string, unknown>(
  'expressionDoi',
  isDoi,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.map((value) => value.replace(/^doi:/, '')),
    E.flatMap(flow(
      O.fromPredicate((value) => doiRegex.test(value)),
      O.match(
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
    E.map((value) => value.replace(/^doi:/, '')),
    E.flatMap(flow(
      O.fromPredicate((value) => doiRegex.test(value)),
      O.map((value) => value.toLowerCase()),
      O.match(
        () => t.failure(u, c),
        (id) => t.success(id as ExpressionDoi),
      ),
    )),
  ),
  (a) => a.toString(),
);

export type CanonicalExpressionDoi = t.TypeOf<typeof canonicalExpressionDoiCodec>;

export const alphanumerical: Ord.Ord<ExpressionDoi> = S.Ord;

export const eqExpressionDoi: Eq.Eq<ExpressionDoi> = S.Eq;

export const isAppropriateDoi = (
  expressionDoi: ExpressionDoi,
) => (doiToBeChecked: ExpressionDoi): boolean => eqExpressionDoi.equals(doiToBeChecked, expressionDoi);
