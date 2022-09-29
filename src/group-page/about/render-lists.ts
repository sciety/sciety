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

export const renderLists = (listViewModels: ReadonlyArray<ListCardViewModel>): HtmlFragment => {
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    return pipe(
      listViewModels,
      RA.map((viewModel) => `<li><span>${viewModel.title}</span><span>${viewModel.articleCount} articles</span>${renderLastUpdatedDate(viewModel.lastUpdated)}</li>`),
      (fragments) => fragments.join(''),
      (slimlineCards) => `<h2>Our lists</h2><ul>${slimlineCards}</ul>`,
      toHtmlFragment,
    );
  }

  return toHtmlFragment('');
};
