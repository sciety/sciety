import { URL } from 'url';
import { ExpressionDoi } from './expression-doi';

export type PaperExpression = {
  expressionDoi: ExpressionDoi,
  publisherHtmlUrl: URL,
  publishedAt: Date,
  version: number,
};
