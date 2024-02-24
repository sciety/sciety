import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { PaperExpression } from '../../src/types/paper-expression.js';
import { arbitraryUri, arbitraryDate, arbitraryWord } from '../helpers.js';
import { arbitraryExpressionDoi } from './expression-doi.helper.js';
import { arbitraryArticleServer } from './article-server.helper.js';

export const arbitraryPaperExpression = (): PaperExpression => ({
  expressionType: 'preprint',
  expressionDoi: arbitraryExpressionDoi(),
  publisherHtmlUrl: new URL(arbitraryUri()),
  publishedAt: arbitraryDate(),
  publishedTo: arbitraryWord(),
  server: O.some(arbitraryArticleServer()),
});
