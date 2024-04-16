import { URL } from 'url';
import * as D from 'fp-ts/Date';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { ArticleServer } from './article-server';
import { ExpressionDoi } from './expression-doi';

export type PaperExpression = {
  expressionType: 'preprint' | 'journal-article',
  expressionDoi: ExpressionDoi,
  publisherHtmlUrl: URL,
  publishedAt: Date,
  publishedTo: string,
  server: O.Option<ArticleServer>,
};

const byPublishedAtDateAscending: Ord.Ord<PaperExpression> = pipe(
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
  byPublishedAtDateAscending,
  byExpressionDoiAlphabetically,
  byPublisherHtmlUrlAlphabetically,
];
