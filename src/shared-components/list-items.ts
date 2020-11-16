import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export default (items: Array<HtmlFragment>, itemClass = 'item'): HtmlFragment => (
  items.reduce((carry: HtmlFragment, item: HtmlFragment): HtmlFragment => toHtmlFragment(`${carry}<li class="${itemClass}">${item}</li>\n`), toHtmlFragment(''))
);
