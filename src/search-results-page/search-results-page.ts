import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';

import { paramsCodec as searchResultsPageParams } from './perform-all-searches';
import { renderSearchResultsHeader, renderSearchResultsTitle } from './render-partials';
import { Ports, searchResults } from './search-results';
import { searchPage } from '../search-page';
import { PageAsPartials } from '../types/page-as-partials';

type SearchResultsPageAsPartials = (ports: Ports) => (params: unknown) => PageAsPartials;

export const searchResultsPageAsPartials: SearchResultsPageAsPartials = (ports) => (params) => pipe(
  params,
  searchResultsPageParams.decode,
  E.fold(
    () => searchPage,
    (decoded) => ({
      title: pipe(
        decoded.query,
        renderSearchResultsTitle,
        T.of,
      ),
      first: pipe(
        decoded,
        renderSearchResultsHeader,
        T.of,
      ),
      second: pipe(
        decoded,
        searchResults(ports)(20),
      ),
    }),
  ),
);
