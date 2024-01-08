import * as O from 'fp-ts/Option';
import { URL } from 'url';
import { ExpressionDoi } from './expression-doi';
import { ArticleServer } from './article-server';

export type PaperExpression = {
  expressionDoi: ExpressionDoi,
  publisherHtmlUrl: URL,
  publishedAt: Date,
  server: O.Option<ArticleServer>,
};
