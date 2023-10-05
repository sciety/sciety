import * as Eq from 'fp-ts/Eq';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';

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
