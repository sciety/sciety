import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderListItems } from '../../../../shared-components/render-list-items';

export const renderFollowList = (list: ReadonlyArray<HtmlFragment>): HtmlFragment => toHtmlFragment(`
  <ol class="card-list" role="list">
    ${renderListItems(list)}
  </ol>
`);
