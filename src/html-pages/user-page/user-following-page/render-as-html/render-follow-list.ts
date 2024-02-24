import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment.js';
import { renderListItems } from '../../../../shared-components/render-list-items.js';

export const renderFollowList = (list: ReadonlyArray<HtmlFragment>): HtmlFragment => toHtmlFragment(`
  <ol class="card-list" role="list">
    ${renderListItems(list)}
  </ol>
`);
