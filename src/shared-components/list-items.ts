import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const templateListItems = (items: ReadonlyArray<HtmlFragment>, itemClass = 'item'): HtmlFragment => (
  toHtmlFragment(
    items.map((item: HtmlFragment) => `<li class="${itemClass}" role="listitem">${item}</li>\n`)
      .join(''),
  )
);
