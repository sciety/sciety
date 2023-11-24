import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';

export class ArticleExpressionDoi {
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
): O.Option<ArticleExpressionDoi> => O.tryCatch(() => new ArticleExpressionDoi(value));

export const toString = (value: ArticleExpressionDoi): string => `doi:${value.value}`;

export const doiOfArticleExpressionCodec = new t.Type(
  'doiOfArticleExpressionCodec',
  (u): u is ArticleExpressionDoi => u instanceof ArticleExpressionDoi,
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
