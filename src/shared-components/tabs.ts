import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const tabs = (activeTabPanelContents: HtmlFragment, inactiveTabTarget: string, tabLabel: string): HtmlFragment => toHtmlFragment(`
  <ul class="tab-list" role="tablist">
    <li class="tab tab--active" role="presentation">
      <span role="tab" id="active-tab" aria-selected="true">${tabLabel}</span>
    </li>
    <li class="tab" role="presentation">
      <a role="tab" href="${inactiveTabTarget}">Followed groups</a>
    </li>
  </ul>
  <section role="tabpanel" aria-labelledby="active-tab">
    ${activeTabPanelContents}
  </section>
`);
