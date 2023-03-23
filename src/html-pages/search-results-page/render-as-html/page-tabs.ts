import * as O from 'fp-ts/Option';
import { buildPageUrl } from './build-page-url';
import { renderTabs } from '../../../shared-components/tabs';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

export type PageTabsViewModel = {
  query: string,
  evaluatedOnly: boolean,
  availableArticleMatches: number,
  availableGroupMatches: number,
  category: string,
};

type PageTabs = (pageTabsViewModel: PageTabsViewModel) => (activeTabPanelContents: HtmlFragment) => HtmlFragment;

export const pageTabs: PageTabs = (pageTabsViewModel) => renderTabs({
  tabList: [
    {
      label: toHtmlFragment(`Articles (${pageTabsViewModel.availableArticleMatches}<span class="visually-hidden"> search results</span>)`),
      url: buildPageUrl({
        category: 'articles',
        query: pageTabsViewModel.query,
        evaluatedOnly: pageTabsViewModel.evaluatedOnly,
        cursor: O.none,
      }),
    },
    {
      label: toHtmlFragment(`Groups (${pageTabsViewModel.availableGroupMatches}<span class="visually-hidden"> search results</span>)`),
      url: buildPageUrl({
        category: 'groups',
        query: pageTabsViewModel.query,
        evaluatedOnly: pageTabsViewModel.evaluatedOnly,
        cursor: O.none,
      }),
    },
  ],
  activeTabIndex: pageTabsViewModel.category === 'groups' ? 1 : 0,
});
