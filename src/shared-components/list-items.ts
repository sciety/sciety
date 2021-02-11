import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const templateListItems = (items: RNEA.ReadonlyNonEmptyArray<HtmlFragment>, itemClass = 'item'): HtmlFragment => (
  toHtmlFragment(
    items.map((item: HtmlFragment): string => `<li class="${itemClass}">${item}</li>\n`)
      .join(''),
  )
);
