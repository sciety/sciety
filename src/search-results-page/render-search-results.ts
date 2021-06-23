import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { constant, pipe } from 'fp-ts/function';
import { nextLink, SearchParameters } from './next-link';
import { GroupViewModel, renderGroupCard } from './render-group-card';
import { ArticleViewModel, renderArticleCard } from '../shared-components/article-card';
import { templateListItems } from '../shared-components/list-items';
import { tabs } from '../shared-components/tabs';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type ItemViewModel = ArticleViewModel | GroupViewModel;

const isArticleViewModel = (viewModel: ItemViewModel): viewModel is ArticleViewModel => 'doi' in viewModel;
// export type SearchResults = {
//   query: string,
//   category: string,
//   itemsToDisplay: ReadonlyArray<ItemViewModel>,
//   availableArticleMatches: number,
//   availableGroupMatches: number,
//   pageNumber: number,
//   nextCursor: O.Option<string>,
//   numberOfPages: number,
// };
export type SearchResults = SearchParameters & Tabs & {
  itemsToDisplay: ReadonlyArray<ItemViewModel>,
  pageNumber: number,
  numberOfPages: number,
};

type PageOfResults = {
  cardsToDisplay: ReadonlyArray<HtmlFragment>,
  pageNumber: number,
  numberOfPages: number,
  category: string,
};

const list = (page: PageOfResults) => pipe(
  page.cardsToDisplay,
  RNEA.fromReadonlyArray,
  O.fold(
    constant(''),
    (a) => `
      ${page.category === 'articles'
    ? `<h3 class="search-results__page_count">
            Showing page ${page.pageNumber} of ${page.numberOfPages}<span class="visually-hidden"> pages of search results</span>
          </h3>`
    : ''
}
      <ul class="search-results-list" role="list">
        ${templateListItems(a, 'search-results-list__item')}
      </ul>
    `,
  ),
  toHtmlFragment,
);

const renderSearchResult = (viewModel: ItemViewModel) => (
  isArticleViewModel(viewModel) ? renderArticleCard(viewModel) : renderGroupCard(viewModel)
);

const pagination = (searchResults: SearchResults) => (content: HtmlFragment) => toHtmlFragment(`
  ${content}
  ${nextLink({ ...searchResults, pageNumber: searchResults.pageNumber + 1 })}
`);

type Tabs = {
  query: string,
  availableArticleMatches: number,
  availableGroupMatches: number,
  category: string,
};

const pageTabs = (searchResults: SearchResults) => tabs({
  tabList: [
    {
      label: `Articles (${searchResults.availableArticleMatches}<span class="visually-hidden"> search results</span>)`,
      url: `/search?query=${htmlEscape(searchResults.query)}&category=articles`,
    },
    {
      label: `Groups (${searchResults.availableGroupMatches}<span class="visually-hidden"> search results</span>)`,
      url: `/search?query=${htmlEscape(searchResults.query)}&category=groups`,
    },
  ],
  activeTabIndex: searchResults.category === 'groups' ? 1 : 0,
});

type RenderSearchResults = (rs: SearchResults) => HtmlFragment;

export const renderSearchResults: RenderSearchResults = (searchResults) => pipe(
  {
    cardsToDisplay: pipe(
      searchResults.itemsToDisplay,
      RA.map(renderSearchResult),
    ),
    pageNumber: searchResults.pageNumber,
    numberOfPages: searchResults.numberOfPages,
    category: searchResults.category,
  },
  list,
  pagination(searchResults),
  pageTabs(searchResults),
  toHtmlFragment,
);
