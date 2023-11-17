import * as O from 'fp-ts/Option';
import { arbitraryArticleId } from '../types/article-id.helper.js';
import { ArticleDetails } from '../../src/third-parties/external-queries.js';
import { arbitrarySanitisedHtmlFragment, arbitraryString } from '../helpers.js';
import { arbitraryArticleServer } from '../types/article-server.helper.js';

export const arbitraryArticleDetails = (): ArticleDetails => ({
  abstract: arbitrarySanitisedHtmlFragment(),
  authors: O.some([arbitraryString()]),
  doi: arbitraryArticleId(),
  title: arbitrarySanitisedHtmlFragment(),
  server: arbitraryArticleServer(),
});
