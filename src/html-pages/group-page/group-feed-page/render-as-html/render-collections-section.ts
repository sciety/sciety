import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ListCardViewModel, renderListCardWithImage } from '../../../../shared-components/list-card';

export const renderCollectionsSection = (listCard: ListCardViewModel): HtmlFragment => toHtmlFragment(`
  <section class="group-page-collections">
    <h2>Collections</h2>
    <ol class="card-list" role="list">
        <li role="listitem">
          ${renderListCardWithImage(listCard)}
        </li>
    </ol>
  </section>
`);
