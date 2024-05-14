import * as O from 'fp-ts/Option';
import { arbitraryArticleServer } from './article-server.helper';
import { arbitraryExpressionDoi } from './expression-doi.helper';
import { PaperExpression } from '../../src/types/paper-expression';
import { arbitraryDate, arbitraryWord, arbitraryUrl } from '../helpers';

export const arbitraryPaperExpression = (): PaperExpression => ({
  expressionType: 'preprint',
  expressionDoi: arbitraryExpressionDoi(),
  publisherHtmlUrl: arbitraryUrl(),
  publishedAt: arbitraryDate(),
  publishedTo: arbitraryWord(),
  server: O.some(arbitraryArticleServer()),
});
