import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type Tab = {
  label: string,
  uri: string,
};

type Tabs = (
  activeTabPanelContents: HtmlFragment,
  tabList: [Tab, Tab],
  isFirstTabActive: boolean,
) => HtmlFragment;

export const tabs: Tabs = (activeTabPanelContents, tabList) => toHtmlFragment(`
  <ul class="tab-list" role="tablist">
    <li class="tab tab--active" role="presentation">
      <span role="tab" id="active-tab" aria-selected="true">${tabList[0].label}</span>
    </li>
    <li class="tab" role="presentation">
      <a role="tab" href="${tabList[1].uri}">${tabList[1].label}</a>
    </li>
  </ul>
  <section role="tabpanel" aria-labelledby="active-tab">
    ${activeTabPanelContents}
  </section>
`);
