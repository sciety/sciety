import { htmlEscape } from 'escape-goat';
import { SearchParameters } from './next-link';
import { ArticleViewModel } from '../shared-components/article-card';
import { GroupViewModel } from '../shared-components/group-card/render-group-card';
import { tabs } from '../shared-components/tabs';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type ItemViewModel = ArticleViewModel | GroupViewModel;

export type SearchResults = SearchParameters & Tabs & {
  itemsToDisplay: ReadonlyArray<ItemViewModel>,
  pageNumber: number,
  numberOfPages: number,
};

type Tabs = {
  query: string,
  availableArticleMatches: number,
  availableGroupMatches: number,
  category: string,
};

type PageTabs = (searchResults: SearchResults) => (activeTabPanelContents: HtmlFragment) => HtmlFragment;

export const pageTabs: PageTabs = (searchResults) => tabs({
  tabList: [
    {
      label: toHtmlFragment(`Articles (${searchResults.availableArticleMatches}<span class="visually-hidden"> search results</span>)`),
      url: `/search?query=${htmlEscape(searchResults.query)}&category=articles`,
    },
    {
      label: toHtmlFragment(`Groups (${searchResults.availableGroupMatches}<span class="visually-hidden"> search results</span>)`),
      url: `/search?query=${htmlEscape(searchResults.query)}&category=groups`,
    },
  ],
  activeTabIndex: searchResults.category === 'groups' ? 1 : 0,
});
