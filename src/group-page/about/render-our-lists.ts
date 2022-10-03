import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { templateDate } from '../../shared-components/date';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type ListViewModel = {
  articleCount: number,
  lastUpdated: Date,
  href: string,
  title: string,
};

const renderLists = (lists: ReadonlyArray<ListViewModel>) => pipe(
  lists,
  RA.map((viewModel) => (`
    <tr>
      <td><a href=${viewModel.href}>${viewModel.title}</a></td>
      <td class="our-lists__article_count">${viewModel.articleCount}<span aria-hidden="true"> articles</span></td>
      <td><span aria-hidden="true" class="our-lists__updated_label">Updated </span>${templateDate(viewModel.lastUpdated)}</td>
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

export type OurListsViewModel = {
  lists: ReadonlyArray<ListViewModel>,
  allListsUrl: O.Option<string>,
};

export const renderOurLists = (ourListsViewModel: OurListsViewModel): HtmlFragment => toHtmlFragment(`
  <h2>Our lists</h2>
  ${renderLists(ourListsViewModel.lists)}
  ${renderButton(ourListsViewModel.allListsUrl)}
`);
