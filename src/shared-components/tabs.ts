import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type Tab = {
  label: HtmlFragment,
  url: string,
};

type Tabs = (tabProps: {
  tabList: [Tab, Tab],
  activeTabIndex: 0 | 1,
}) => (
  activeTabPanelContents: HtmlFragment,
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

export const tabs: Tabs = ({ tabList, activeTabIndex }) => (activeTabPanelContents) => toHtmlFragment(`
  <ul class="tab-list" role="tablist">
    ${activeTabIndex === 0 ? activeTab(tabList[0]) : inactiveTab(tabList[0])}
    ${activeTabIndex === 0 ? inactiveTab(tabList[1]) : activeTab(tabList[1])}
  </ul>
  <section class="tab-panel" role="tabpanel" aria-labelledby="active-tab">
    ${activeTabPanelContents}
  </section>
`);
