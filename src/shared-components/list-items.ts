import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export default (items: Array<HtmlFragment>, itemClass = 'item'): HtmlFragment => (
  toHtmlFragment(
    items.map((item: HtmlFragment): string => `<li class="${itemClass}">${item}</li>\n`)
      .join(''),
  )
);
