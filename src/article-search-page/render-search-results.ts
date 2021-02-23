import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import { constant, flow, pipe } from 'fp-ts/function';
import { ArticleSearchResult, RenderSearchResult } from './render-search-result';
import { templateListItems } from '../shared-components/list-items';
import { HtmlFragment } from '../types/html-fragment';

type SearchResults = {
  items: Array<Omit<ArticleSearchResult, '_tag'>>,
  total: number,
};

type RenderListIfNecessary = (articles: ReadonlyArray<HtmlFragment>) => string;

const renderListIfNecessary: RenderListIfNecessary = flow(
  RNEA.fromReadonlyArray,
  O.fold(
    constant(''),
    (articles) => `
      <ul class="search-results-list" role="list">
        ${templateListItems(articles, 'search-results-list__item')}
      </ul>
    `,
  ),
);

export const renderSearchResults = (
  renderSearchResult: RenderSearchResult,
) => (
  query: string,
) => (
  searchResults: SearchResults,
): T.Task<string> => (
  pipe(
    searchResults.items,
    T.traverseArray(flow(
      (item) => ({ ...item, _tag: 'Article' as const }),
      renderSearchResult,
    )),
    T.chain((items) => {
      if (query === 'peerj') {
        return pipe(
          {
            _tag: 'Group',
            link: '/groups/53ed5364-a016-11ea-bb37-0242ac130002',
            name: 'PeerJ',
          },
          renderSearchResult,
          T.map((renderedSearchResult) => RA.cons(renderedSearchResult)(items)),
        );
      }
      return T.of(items);
    }),
    T.map(flow(
      renderListIfNecessary,
      (searchResultsList) => `
        <p class="search-results__summary">Showing ${searchResults.items.length} of ${searchResults.total} results.</p>
        ${searchResultsList}
      `,
    )),
  )
);
