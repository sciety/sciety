import { htmlEscape } from 'escape-goat';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderListItems } from '../../shared-components/list-items';
import { ViewModel } from '../view-model';

const renderList = (listContent: string) => `
  <ul role="list" class="listed-in-list">
    ${listContent}
  </ul>
`;

export const renderListedIn = (listedIn: ViewModel['listedIn']): HtmlFragment => pipe(
  listedIn,
  RA.map((item) => toHtmlFragment(`<a href="${item.listHref}">${htmlEscape(item.listName)}</a> (${htmlEscape(item.listOwnerName)})`)),
  RA.match(
    () => 'This article is not in any list yet, why not save it to one of your lists.',
    flow(
      renderListItems,
      renderList,
    ),
  ),
  (content) => `
      <section class="list-management__listed-in">
        <h2 class="article-actions-heading">Listed in</h2>
        ${content}
      </section>
    `,
  toHtmlFragment,
);
