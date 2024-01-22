import * as O from 'fp-ts/Option';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitrarySanitisedHtmlFragment, arbitraryString } from '../helpers';
import { ArticleDetails } from '../../src/types/article-details';

export const arbitraryArticleDetails = (): ArticleDetails => ({
  abstract: O.some(arbitrarySanitisedHtmlFragment()),
  authors: O.some([arbitraryString()]),
  doi: arbitraryArticleId(),
  title: arbitrarySanitisedHtmlFragment(),
});
