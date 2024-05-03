import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

type ItemClass = string | undefined;

const renderItemClassAttribute = (itemClass: ItemClass) => (itemClass !== undefined ? ` class="${itemClass}"` : '');

const renderItem = (itemClass: ItemClass) => (item: HtmlFragment) => `<li${renderItemClassAttribute(itemClass)} role="listitem">${item}</li>\n`;

export const renderListItems = (items: ReadonlyArray<HtmlFragment>, itemClass?: string): HtmlFragment => pipe(
  items,
  RA.map(renderItem(itemClass)),
  (listItems) => listItems.join(''),
  toHtmlFragment,
);
