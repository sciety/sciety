import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { renderOurLists } from './render-our-lists';
import { templateDate } from '../../shared-components/date';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

const renderLastUpdatedDate = O.fold(
  () => '',
  (date: Date) => `<span>Updated: ${templateDate(date)}</span>`,
);

type SlimlineCardViewModel = {
  articleCount: number,
  lastUpdated: O.Option<Date>,
  href: string,
  title: string,
};

const renderSlimlineCard = (viewModel: SlimlineCardViewModel) => `
<li class="slimline-card">
  <span>${viewModel.title}</span>
  <span>${viewModel.articleCount} articles</span>
  ${renderLastUpdatedDate(viewModel.lastUpdated)}
</li>
`;

export type OurListsViewModel = {
  slimlineCards: ReadonlyArray<SlimlineCardViewModel>,
};

export const renderLists = (ourListsViewModel: OurListsViewModel): HtmlFragment => {
  if (process.env.EXPERIMENT_ENABLED !== 'true') {
    return toHtmlFragment('');
  }
  return pipe(
    ourListsViewModel.slimlineCards,
    RA.map(renderSlimlineCard),
    renderOurLists,
  );
};
