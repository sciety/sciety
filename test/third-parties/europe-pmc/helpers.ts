import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ArticleItem } from '../../../src/search-results-page/data-types';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { sanitise } from '../../../src/types/sanitised-html-fragment';
import { arbitraryString } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';

export const arbitraryEuropePmcItem = (): ArticleItem => ({
  doi: arbitraryDoi(),
  server: 'biorxiv' as const,
  title: pipe(arbitraryString(), toHtmlFragment, sanitise),
  authors: O.some([arbitraryString()]),
});
