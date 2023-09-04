import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const templateListItems = (items: ReadonlyArray<HtmlFragment>, itemClass?: string): HtmlFragment => (
  toHtmlFragment(
    items.map((item: HtmlFragment) => `<li${itemClass !== undefined ? ` class="${itemClass}` : ''} role="listitem">${item}</li>\n`)
      .join(''),
  )
);
