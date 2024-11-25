import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { renderListItems } from '../shared-components/list-items';

type SupplementaryInfo = (items: ReadonlyArray<HtmlFragment>, modifierClass?: string) => HtmlFragment;

export const supplementaryInfo: SupplementaryInfo = (items, modifierClass = '') => pipe(
  renderListItems(items, 'supplementary-list__item'),
  (listContent) => `
  <aside class="supplementary-info ${modifierClass}">
    <ul class="supplementary-list" role="list">
      ${listContent}
    </ul>
  </aside>
  `,
  toHtmlFragment,
);
