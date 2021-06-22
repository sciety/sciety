import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type Tab = {
  label: string,
  url: string,
};

type Tabs = (tabList: [Tab, Tab]) => (
  activeTabPanelContents: HtmlFragment,
  selectedTabIndex: 0 | 1,
) => HtmlFragment;

const activeTab = (tab: Tab) => `
  <li class="tab tab--active" role="presentation">
    <span role="tab" id="active-tab" aria-selected="true">${tab.label}</span>
  </li>
`;

const inactiveTab = (tab: Tab) => `
  <li class="tab" role="presentation">
    <a role="tab" href="${tab.url}">${tab.label}</a>
  </li>
`;

export const tabs: Tabs = (tabList) => (activeTabPanelContents, selectedTabIndex) => toHtmlFragment(`
  <ul class="tab-list" role="tablist">
    ${selectedTabIndex === 0 ? activeTab(tabList[0]) : inactiveTab(tabList[0])}
    ${selectedTabIndex === 0 ? inactiveTab(tabList[1]) : activeTab(tabList[1])}
  </ul>
  <section role="tabpanel" aria-labelledby="active-tab">
    ${activeTabPanelContents}
  </section>
`);
