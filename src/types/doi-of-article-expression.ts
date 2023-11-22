import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';

export class DoiOfArticleExpression {
  readonly value: string;

  constructor(input: string) {
    const doi = input.replace(/^doi:/, '');

    if (!doi) {
      throw new Error(`'${input}' is not a possible DOI`);
    }

    this.value = doi;
  }
}

export const fromString = (
  value: string,
): O.Option<DoiOfArticleExpression> => O.tryCatch(() => new DoiOfArticleExpression(value));

export const toString = (value: DoiOfArticleExpression): string => `doi:${value.value}`;

export const doiOfArticleExpressionCodec = new t.Type(
  'doiOfArticleExpressionCodec',
  (u): u is DoiOfArticleExpression => u instanceof DoiOfArticleExpression,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain(flow(
      fromString,
      O.fold(
        () => t.failure(u, c),
        t.success,
      ),
    )),
  ),
  (a) => toString(a),
);
