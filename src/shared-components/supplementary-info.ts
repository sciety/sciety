import { pipe } from 'fp-ts/function';
import { templateListItems } from './list-items';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type SupplementaryInfo = (items: ReadonlyArray<HtmlFragment>, modifierClass?: string) => HtmlFragment;

export const supplementaryInfo: SupplementaryInfo = (items, modifierClass = '') => pipe(
  templateListItems(items, 'supplementary-list__item'),
  (listContent) => `
  <aside class="supplementary-info ${modifierClass}">
    <ul class="supplementary-list" role="list">
      ${listContent}
    </ul>
  </aside>
  `,
  toHtmlFragment,
);
