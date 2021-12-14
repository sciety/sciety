import { htmlEscape } from 'escape-goat';
import { tabs } from '../shared-components/tabs';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type PageTabsViewModel = {
  query: string,
  availableArticleMatches: number,
  availableGroupMatches: number,
  category: string,
};

type PageTabs = (pageTabsViewModel: PageTabsViewModel) => (activeTabPanelContents: HtmlFragment) => HtmlFragment;

export const pageTabs: PageTabs = (pageTabsViewModel) => tabs({
  tabList: [
    {
      label: toHtmlFragment(`Articles (${pageTabsViewModel.availableArticleMatches}<span class="visually-hidden"> search results</span>)`),
      url: `/search?query=${htmlEscape(pageTabsViewModel.query)}&category=articles`,
    },
    {
      label: toHtmlFragment(`Groups (${pageTabsViewModel.availableGroupMatches}<span class="visually-hidden"> search results</span>)`),
      url: `/search?query=${htmlEscape(pageTabsViewModel.query)}&category=groups`,
    },
  ],
  activeTabIndex: pageTabsViewModel.category === 'groups' ? 1 : 0,
});
