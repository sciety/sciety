import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const renderClassAttribute = (itemClass: string | undefined) => (itemClass !== undefined ? ` class="${itemClass}` : '');

export const templateListItems = (items: ReadonlyArray<HtmlFragment>, itemClass?: string): HtmlFragment => pipe(
  items,
  RA.map((item: HtmlFragment) => `<li${renderClassAttribute(itemClass)} role="listitem">${item}</li>\n`),
  (listItems) => listItems.join(''),
  toHtmlFragment,
);
