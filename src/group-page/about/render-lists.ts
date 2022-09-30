import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { templateDate } from '../../shared-components/date';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type SlimlineCardViewModel = {
  articleCount: number,
  lastUpdated: Date,
  href: string,
  title: string,
};

const renderSlimlineCard = (viewModel: SlimlineCardViewModel) => `
<li class="slimline-card">
  <span><a href=${viewModel.href}>${viewModel.title}</a></span>
  <span>${viewModel.articleCount} articles</span>
  <span>Updated: ${templateDate(viewModel.lastUpdated)}</span>
</li>
`;

export type OurListsViewModel = {
  slimlineCards: ReadonlyArray<SlimlineCardViewModel>,
  viewAllListsUrl: O.Option<string>,
};

const renderViewAllListsButton = O.match(
  () => '',
  (url: string) => `<a href="${url}">View all lists</a>`,
);

export const renderLists = (ourListsViewModel: OurListsViewModel): HtmlFragment => {
  if (process.env.EXPERIMENT_ENABLED !== 'true') {
    return toHtmlFragment('');
  }
  return pipe(
    ourListsViewModel.slimlineCards,
    RA.map(renderSlimlineCard),
    (fragments) => fragments.join(''),
    (slimlineCards) => `
      <h2>Our lists</h2>
      <ul>${slimlineCards}</ul>
      ${renderViewAllListsButton(ourListsViewModel.viewAllListsUrl)}
    `,
    toHtmlFragment,
  );
};
