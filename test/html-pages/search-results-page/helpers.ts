import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { sanitise } from '../../../src/types/sanitised-html-fragment';
import { arbitraryString } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';
import { ArticleItem } from '../../../src/html-pages/search-results-page/construct-view-model/data-types';

export const arbitraryArticleSearchResult = (): ArticleItem => ({
  articleId: arbitraryDoi(),
  server: 'biorxiv' as const,
  title: pipe(arbitraryString(), toHtmlFragment, sanitise),
  authors: O.some([arbitraryString()]),
});
