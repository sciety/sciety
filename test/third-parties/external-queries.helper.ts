import * as O from 'fp-ts/Option';
import { ArticleDetails } from '../../src/types/article-details';
import { ArticleId } from '../../src/types/article-id';
import { arbitrarySanitisedHtmlFragment, arbitraryString } from '../helpers';
import { arbitraryExpressionDoi } from '../types/expression-doi.helper';

export const arbitraryArticleDetails = (): ArticleDetails => ({
  abstract: O.some(arbitrarySanitisedHtmlFragment()),
  authors: O.some([arbitraryString()]),
  doi: new ArticleId(arbitraryExpressionDoi()),
  title: arbitrarySanitisedHtmlFragment(),
});
