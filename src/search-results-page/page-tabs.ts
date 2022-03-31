import { htmlEscape } from 'escape-goat';
import { tabs } from '../shared-components/tabs';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type PageTabsViewModel = {
  query: string,
  evaluatedOnly: boolean,
  availableArticleMatches: number,
  availableGroupMatches: number,
  category: string,
};

type UrlParams = {
  query: string,
  category: string,
  evaluatedOnly: boolean,
};

type BuildUrl = (urlParams: UrlParams) => string;

const buildUrl: BuildUrl = ({ query, category, evaluatedOnly }) => `/search?query=${htmlEscape(query)}&category=${category}${evaluatedOnly ? '&evaluatedOnly=true' : ''}`;

type PageTabs = (pageTabsViewModel: PageTabsViewModel) => (activeTabPanelContents: HtmlFragment) => HtmlFragment;

export const pageTabs: PageTabs = (pageTabsViewModel) => tabs({
  tabList: [
    {
      label: toHtmlFragment(`Articles (${pageTabsViewModel.availableArticleMatches}<span class="visually-hidden"> search results</span>)`),
      url: buildUrl({
        category: 'articles',
        query: pageTabsViewModel.query,
        evaluatedOnly: pageTabsViewModel.evaluatedOnly,
      }),
    },
    {
      label: toHtmlFragment(`Groups (${pageTabsViewModel.availableGroupMatches}<span class="visually-hidden"> search results</span>)`),
      url: buildUrl({
        category: 'groups',
        query: pageTabsViewModel.query,
        evaluatedOnly: pageTabsViewModel.evaluatedOnly,
      }),
    },
  ],
  activeTabIndex: pageTabsViewModel.category === 'groups' ? 1 : 0,
});
