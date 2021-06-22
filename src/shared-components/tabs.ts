import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type Tab = {
  label: string,
  url: string,
};

type Tabs = (tabList: [Tab, Tab]) => (
  activeTabPanelContents: HtmlFragment,
  isFirstTabActive: boolean,
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

export const tabs: Tabs = (tabList) => (activeTabPanelContents, isFirstTabActive) => toHtmlFragment(`
  <ul class="tab-list" role="tablist">
    ${isFirstTabActive ? activeTab(tabList[0]) : inactiveTab(tabList[0])}
    ${isFirstTabActive ? inactiveTab(tabList[1]) : activeTab(tabList[1])}
  </ul>
  <section role="tabpanel" aria-labelledby="active-tab">
    ${activeTabPanelContents}
  </section>
`);
