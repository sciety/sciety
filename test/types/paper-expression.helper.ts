import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { PaperExpression } from '../../src/types/paper-expression';
import { arbitraryUri, arbitraryDate, arbitraryWord } from '../helpers';
import { arbitraryExpressionDoi } from './expression-doi.helper';
import { arbitraryArticleServer } from './article-server.helper';

export const arbitraryPaperExpression = (): PaperExpression => ({
  expressionType: 'preprint',
  expressionDoi: arbitraryExpressionDoi(),
  publisherHtmlUrl: new URL(arbitraryUri()),
  publishedAt: arbitraryDate(),
  publishedTo: arbitraryWord(),
  server: O.some(arbitraryArticleServer()),
});
