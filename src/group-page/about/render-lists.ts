import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { templateDate } from '../../shared-components/date';
import { ListCardViewModel } from '../../shared-components/list-card/render-list-card';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

const renderLastUpdatedDate = O.fold(
  () => '',
  (date: Date) => `<span>Updated: ${templateDate(date)}</span>`,
);

const renderSlimlineCard = (viewModel: ListCardViewModel) => `
<li>
  <span>${viewModel.title}</span>
  <span>${viewModel.articleCount} articles</span>
  ${renderLastUpdatedDate(viewModel.lastUpdated)}
</li>
`;

const renderOurLists = (fragments: ReadonlyArray<string>) => pipe(
  fragments.join(''),
  (slimlineCards) => `<h2>Our lists</h2><ul>${slimlineCards}</ul>`,
);

export const renderLists = (listViewModels: ReadonlyArray<ListCardViewModel>): HtmlFragment => {
  if (process.env.EXPERIMENT_ENABLED !== 'true') {
    return toHtmlFragment('');
  }
  return pipe(
    listViewModels,
    RA.map(renderSlimlineCard),
    renderOurLists,
    toHtmlFragment,
  );
};
