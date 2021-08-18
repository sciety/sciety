import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type Tab = {
  label: HtmlFragment,
  url: string,
};

type TabProps = {
  tabList: RNEA.ReadonlyNonEmptyArray<Tab>,
  activeTabIndex: number,
};

type Tabs = (tabProps: TabProps) => (activeTabPanelContents: HtmlFragment) => HtmlFragment;

const activeTab = (tab: Tab) => `<li class="tab tab--active" role="presentation">
    <span role="tab" id="active-tab" aria-selected="true">${tab.label}</span>
  </li>`;

const inactiveTab = (tab: Tab) => `<li class="tab" role="presentation">
    <a role="tab" href="${tab.url}">${tab.label}</a>
  </li>`;

const renderTabList = ({ tabList, activeTabIndex }: TabProps) => pipe(
  tabList,
  RNEA.mapWithIndex((i, tab) => (i === activeTabIndex ? activeTab(tab) : inactiveTab(tab))),
  (tabs) => tabs.join(''),
  (tabs) => `
    <ul class="tab-list" role="tablist">
      ${tabs}
    </ul>
  `,
  toHtmlFragment,
);

export const tabs: Tabs = (tabProps) => (activeTabPanelContents) => toHtmlFragment(`
  ${renderTabList(tabProps)}
  <section class="tab-panel" role="tabpanel" aria-labelledby="active-tab">
    ${activeTabPanelContents}
  </section>
`);
