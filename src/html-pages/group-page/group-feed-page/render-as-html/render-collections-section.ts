import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderListCardWithImage } from '../../../../shared-components/list-card';
import { ListCardWithImageViewModel } from '../../../../shared-components/list-card/render-list-card-with-image';

export const renderCollectionsSection = (listCard: ListCardWithImageViewModel): HtmlFragment => toHtmlFragment(`
  <section class="group-page-collections">
    <h2>Collections</h2>
    <ol class="card-list" role="list">
        <li role="listitem">
          ${renderListCardWithImage(listCard)}
        </li>
    </ol>
  </section>
`);
