import * as O from 'fp-ts/Option';
import * as D from 'fp-ts/Date';
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

export const byDateAscending: Ord.Ord<PaperExpression> = pipe(
  D.Ord,
  Ord.contramap((expression) => expression.publishedAt),
);
