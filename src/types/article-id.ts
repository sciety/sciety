import * as Eq from 'fp-ts/Eq';
import * as S from 'fp-ts/string';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';

export const doiRegex = /^(?:doi:)?(10\.[0-9]{4,}(?:\.[1-9][0-9]*)*\/(?:[^%"#?\s])+)$/;

export class ArticleId {
  readonly value: string;

  constructor(input: string) {
    const [, doi] = doiRegex.exec(input) ?? [];

    if (!doi) {
      throw new Error(`'${input}' is not a possible DOI`);
    }

    this.value = doi;
  }
}

export const isArticleId = (value: unknown): value is ArticleId => value instanceof ArticleId;

export const fromString = (value: string): O.Option<ArticleId> => O.tryCatch(() => new ArticleId(value));

export const toString = (value: ArticleId): string => `doi:${value.value}`;

export const hasPrefix = (prefix: string) => (doi: ArticleId): boolean => doi.value.startsWith(`${prefix}/`);

export const eqArticleId: Eq.Eq<ArticleId> = pipe(
  S.Eq,
  Eq.contramap((articleId) => articleId.value),
);

export const articleIdCodec = new t.Type(
  'articleIdCodec',
  (u): u is ArticleId => u instanceof ArticleId,
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
