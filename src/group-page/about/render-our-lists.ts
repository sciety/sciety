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

const renderRow = (viewModel: ListViewModel) => `
<li>
  <span><a href=${viewModel.href}>${viewModel.title}</a></span>
  <span>${viewModel.articleCount} articles</span>
  <span>Updated: ${templateDate(viewModel.lastUpdated)}</span>
</li>
`;

export type OurListsViewModel = {
  lists: ReadonlyArray<ListViewModel>,
  allListsUrl: O.Option<string>,
};

const renderButton = O.match(
  () => '',
  (url: string) => `<a href="${url}">View all lists</a>`,
);

const renderLists = (lists: ReadonlyArray<ListViewModel>) => pipe(
  lists,
  RA.map(renderRow),
  (fragments) => `<ul>${fragments.join('')}</ul>`,
);

export const renderOurLists = (ourListsViewModel: OurListsViewModel): HtmlFragment => {
  if (process.env.EXPERIMENT_ENABLED !== 'true') {
    return toHtmlFragment('');
  }
  return toHtmlFragment(`
    <h2>Our lists</h2>
    ${renderLists(ourListsViewModel.lists)}
    ${renderButton(ourListsViewModel.allListsUrl)}
  `);
};
