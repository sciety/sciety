import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

export const renderListOfCards = (
  cards: HtmlFragment,
): HtmlFragment => toHtmlFragment(`<ol class="card-list" role="list">${cards}</ol>`);
