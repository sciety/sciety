import * as O from 'fp-ts/Option';
import { ArticleDetails } from '../../src/types/article-details';
import { arbitrarySanitisedHtmlFragment, arbitraryString } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';

export const arbitraryArticleDetails = (): ArticleDetails => ({
  abstract: O.some(arbitrarySanitisedHtmlFragment()),
  authors: O.some([arbitraryString()]),
  doi: arbitraryArticleId(),
  title: arbitrarySanitisedHtmlFragment(),
});
