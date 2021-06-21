import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type Tabs = (
  activeTabPanelContents: HtmlFragment,
  inactiveTabTarget: string,
  activeTabLabel: string,
  inactiveTabLabel: string
) => HtmlFragment;

export const tabs: Tabs = (activeTabPanelContents, inactiveTabTarget, activeTabLabel, inactiveTabLabel) => toHtmlFragment(`
  <ul class="tab-list" role="tablist">
    <li class="tab tab--active" role="presentation">
      <span role="tab" id="active-tab" aria-selected="true">${activeTabLabel}</span>
    </li>
    <li class="tab" role="presentation">
      <a role="tab" href="${inactiveTabTarget}">${inactiveTabLabel}</a>
    </li>
  </ul>
  <section role="tabpanel" aria-labelledby="active-tab">
    ${activeTabPanelContents}
  </section>
`);
