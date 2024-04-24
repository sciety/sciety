import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { templateDate } from '../../../../../shared-components/date';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import { ViewModel } from '../view-model';

const renderLists = (lists: ViewModel['ourLists']['lists']) => pipe(
  lists,
  RA.map((viewModel) => (`
    <tr>
      <td><a href="${viewModel.listHref}">${htmlEscape(viewModel.title)}</a></td>
      <td class="our-lists__article_count">${viewModel.articleCount}<span aria-hidden="true"> articles</span></td>
      <td><span aria-hidden="true" class="our-lists__updated_label">Updated </span>${templateDate(viewModel.updatedAt)}</td>
    </tr>
  `)),
  (listItems) => `
    <table>
      <thead class="visually-hidden">
        <th>List name</th>
        <th>Number of articles</th>
        <th>Updated on</th>
      </thead>
    ${listItems.join('')}
    </table>
  `,
);

const renderButton = O.match(
  () => '',
  (url: string) => `<p><a href="${url}">View all lists</a></p>`,
);

export const renderOurLists = (ourListsViewModel: ViewModel['ourLists']): HtmlFragment => toHtmlFragment(`
  <h2>Our lists</h2>
  ${renderLists(ourListsViewModel.lists)}
  ${renderButton(ourListsViewModel.allListsUrl)}
`);
