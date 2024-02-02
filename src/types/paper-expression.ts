import * as O from 'fp-ts/Option';
import * as D from 'fp-ts/Date';
import * as S from 'fp-ts/string';
import * as Ord from 'fp-ts/Ord';
import { URL } from 'url';
import { pipe } from 'fp-ts/function';
import { ExpressionDoi } from './expression-doi';
import { ArticleServer } from './article-server';

export type PaperExpression = {
  expressionType: 'preprint' | 'journal-article',
  expressionDoi: ExpressionDoi,
  publisherHtmlUrl: URL,
  publishedAt: Date,
  server: O.Option<ArticleServer>,
};

const byDateAscending: Ord.Ord<PaperExpression> = pipe(
  D.Ord,
  Ord.contramap((expression) => expression.publishedAt),
);

const byExpressionDoiAlphabetically: Ord.Ord<PaperExpression> = pipe(
  S.Ord,
  Ord.contramap((expression) => expression.expressionDoi),
);

const byPublisherHtmlUrlAlphabetically: Ord.Ord<PaperExpression> = pipe(
  S.Ord,
  Ord.contramap((expression) => expression.publisherHtmlUrl.toString()),
);

export const publishedAtWithUnambiguousCriteria = [
  byDateAscending,
  byExpressionDoiAlphabetically,
  byPublisherHtmlUrlAlphabetically,
];
