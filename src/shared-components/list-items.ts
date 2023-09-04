import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const renderClassAttribute = (itemClass: string | undefined) => (itemClass !== undefined ? ` class="${itemClass}` : '');

export const templateListItems = (items: ReadonlyArray<HtmlFragment>, itemClass?: string): HtmlFragment => (
  toHtmlFragment(
    items.map((item: HtmlFragment) => `<li${renderClassAttribute(itemClass)} role="listitem">${item}</li>\n`)
      .join(''),
  )
);
