import * as O from 'fp-ts/Option';
import { arbitraryArticleId } from '../types/article-id.helper';
import { ArticleDetails } from '../../src/third-parties/external-queries';
import { arbitrarySanitisedHtmlFragment, arbitraryString } from '../helpers';
import { arbitraryArticleServer } from '../types/article-server.helper';

export const arbitraryArticleDetails = (): ArticleDetails => ({
  abstract: arbitrarySanitisedHtmlFragment(),
  authors: O.some([arbitraryString()]),
  doi: arbitraryArticleId(),
  title: arbitrarySanitisedHtmlFragment(),
  server: arbitraryArticleServer(),
});
