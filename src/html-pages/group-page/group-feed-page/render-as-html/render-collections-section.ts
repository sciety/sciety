import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ListCardViewModel, renderListCard } from '../../../../shared-components/list-card';

export const renderCollectionsSection = (listCard: ListCardViewModel): HtmlFragment => toHtmlFragment(`
  <section class="group-page-collections">
    <h2>Collections</h2>
    <ol class="card-list" role="list">
        <li role="listitem">
          ${renderListCard(listCard)}
        </li>
    </ol>
  </section>
`);
