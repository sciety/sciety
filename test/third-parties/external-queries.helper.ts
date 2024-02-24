import * as O from 'fp-ts/Option';
import { arbitraryArticleId } from '../types/article-id.helper.js';
import { arbitrarySanitisedHtmlFragment, arbitraryString } from '../helpers.js';
import { ArticleDetails } from '../../src/types/article-details.js';

export const arbitraryArticleDetails = (): ArticleDetails => ({
  abstract: O.some(arbitrarySanitisedHtmlFragment()),
  authors: O.some([arbitraryString()]),
  doi: arbitraryArticleId(),
  title: arbitrarySanitisedHtmlFragment(),
});
