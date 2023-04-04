import { buildPageUrl } from './build-page-url';
import { renderTabs } from '../../../shared-components/tabs';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ViewModel } from '../view-model';

type PageTabs = (viewModel: ViewModel) => (activeTabPanelContents: HtmlFragment) => HtmlFragment;

export const applyTabControls: PageTabs = (viewModel) => renderTabs({
  tabList: [
    {
      label: toHtmlFragment(`Articles (${viewModel.availableArticleMatches}<span class="visually-hidden"> search results</span>)`),
      url: buildPageUrl({
        category: 'articles',
        query: viewModel.query,
        evaluatedOnly: viewModel.evaluatedOnly,
      }),
    },
    {
      label: toHtmlFragment(`Groups (${viewModel.availableGroupMatches}<span class="visually-hidden"> search results</span>)`),
      url: buildPageUrl({
        category: 'groups',
        query: viewModel.query,
        evaluatedOnly: viewModel.evaluatedOnly,
      }),
    },
  ],
  activeTabIndex: viewModel.category === 'groups' ? 1 : 0,
});
